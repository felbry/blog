# Worklet 动画

微信小程序是双线程的，分为 UI 线程和 JS 线程，两者独立运行，不会相互阻塞

既然相互独立，那沟通就会有延迟，以以下代码为例：

::: code-group

```html [simple-animation.wxml]
<view
  class="wrapper"
  bindtap="onChangeOpacity"
  style="opacity: {{ opacity }}"
></view>
```

```js [simple-animation.js]
Component({
  data: {
    opacity: 1,
  },
  methods: {
    onChangeOpacity() {
      this.setData({
        opacity: this.data.opacity ? 0 : 1,
      })
    },
  },
})
```

```css [simple-animation.wxss]
.wrapper {
  width: 200px;
  height: 200px;
  background: red;
  transition: opacity 1.5s;
}
```

:::

通过点击背景让其颜色由浅至深、由深至浅。执行顺序为：

[UI 线程] tap 事件，通知

-> [JS 线程] 执行 onChangeOpacity 回调；检测到`opacity`变化，通知

-> [UI]线程 绘制（应用动画）

**上述场景这种方式并没什么不妥，不过一旦涉及到手势交互、频发触发等场景；这种双向沟通机制就会存在延迟、不确定性**

**因此，就需要一种可以运行在 UI 线程的逻辑，这样就不需要 UI 和 JS 两个线程之间反复横跳了**

**worklet 就应运而生，它不仅可以在 UI 线程运行，也可以在 JS 线程运行**

## 核心概念

- `const { shared } = wx.worklet`

  `shared`定义 UI 和 JS 线程的共享变量，可以类比`vue3`的`ref`，访问也是通过`.value`

  （定义的变量假如不是`shared`类型，`worklet`函数如果有访问它，会在一开始序列化后生成在 UI 线程的拷贝，后续 JS 线程对它的更新都不会同步至 UI 线程）

- [`applyAnimatedStyle(selector, updater[, userConfig, callback])`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html#applyAnimatedStyle-%E5%8F%82%E6%95%B0%E5%AE%9A%E4%B9%89)

  通过页面/组件实例访问，该函数通过`selector`选中对应元素，`updater`(`worklet`函数)返回一个`styleObject`，这个`styleObject`中的`value`与`sharedValue`绑定。当`sharedValue`变化时，触发`updater`执行，元素就有动画了

::: code-group

```html [worklet-animation.wxml]
<pan-gesture-handler worklet:ongesture="onPan">
  <view class="circle"></view>
</pan-gesture-handler>
```

```js [worklet-animation.js]
const { shared } = wx.worklet
const offset = shared(0)
const GestureStateEnum {
  // 手势未识别
  POSSIBLE: 0,
  // 手势已识别
  BEGIN: 1,
  // 连续手势活跃状态
  ACTIVE: 2,
  // 手势终止
  END: 3,
  // 手势取消
  CANCELLED: 4,
}
Component({
  lifetimes: {
    ready() {
      this.applyAnimatedStyle('.circle', () => {
        'worklet'
        return {
          transform: `translateX(${offset.value}px)`,
        }
      })
    },
  },
  methods: {
    onPan(evt) {
      'worklet'
      if (evt.state === GestureStateEnum.ACTIVE) {
        offset.value += evt.deltaX
      }
    },
  },
})
```

:::

- 动画函数：`const { timing, Easing, spring, decay } = wx.worklet`

  动画函数都是第一个参数接收目标值`toValue`，后续参数（可选的）接收配置。**返回值赋值给`sharedValue`**，由此便完成了动画的闭环

  [`timing`](https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.timing.html)：基于时间的动画，动画曲线由[`Easing`](https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html)值决定

  [`spring`](https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.spring.html)：基于物理的动画

  [`decay`](https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.decay.html)：基于滚动衰减的动画

## 案例

### 案例一

实现：

- 上部分：image + 下部分：scroll-view 布局
- 下拉时，图片和 scroll-view 同步下移（可以有个最大下移距离），松手回弹
- 上滑时，scroll-view 容器先上移至与系统状态栏对齐，再进行内部的滚动

#### 步骤 1：实现下拉回弹

::: details 初步实现

::: code-group

```html [pull.wxml]
<image
  class="banner absolute w-full"
  src="https://images.pexels.com/photos/2912996/pexels-photo-2912996.jpeg?auto=compress&cs=tinysrgb&w=800"
  fade-in
></image>
<view class="flex-1">
  <!-- 该手势组件先通过native-view="scroll-view"代理该标签，再通过onShouldAcceptGesture和onShouldAcceptGesture的逻辑来控制scroll-view层上的手势是否有效，控制内部滚动 -->
  <vertical-drag-gesture-handler
    native-view="scroll-view"
    worklet:ongesture="onDragScrollView"
    should-response-on-move="onShouldResponseOnMove"
    should-accept-gesture="onShouldAcceptGesture"
  >
    <scroll-view
      class="h-full"
      scroll-y
    >
      ...
    </scroll-view>
  </vertical-drag-gesture-handler>
</view>
```

```js [pull.js]
const { shared, timing } = wx.worklet
const imageHeight = shared(0)
const GestureStateEnum {
  // 手势未识别
  POSSIBLE: 0,
  // 手势已识别
  BEGIN: 1,
  // 连续手势活跃状态
  ACTIVE: 2,
  // 手势终止
  END: 3,
  // 手势取消
  CANCELLED: 4,
}
Component({
  data: {
    initImageHeight: 474,
  },
  lifetimes: {
    ready() {
      imageHeight.value = this.data.initImageHeight
      this.applyAnimatedStyle('.banner', () => {
        'worklet'
        return {
          height: `${imageHeight.value}rpx`,
        }
      })
    },
  },
  methods: {
    onDragScrollView(evt) {
      'worklet'
      if (evt.state === GestureStateEnum.ACTIVE) {
        if (evt.deltaY > 0) {
          // 下拉，图片高度增加，scroll-view的bounces下拉效果
          imageHeight.value += evt.deltaY
        } else {
          // 上滑
        }
      } else if ([GestureStateEnum.END, GestureStateEnum.CANCELLED].includes(evt.state)) {
        // 手势结束，重置状态
        imageHeight.value = timing(this.data.initImageHeight)
      }
    },
    onShouldResponseOnMove() {
      'worklet'
      return true
    },
    onShouldAcceptGesture() {
      'worklet'
      return true
    },
  },
})
```

:::

skyline 下，`scroll-view`的[`bounces`](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html#%E9%80%9A%E7%94%A8%E5%B1%9E%E6%80%A7)效果在`Android`和`iOS`均生效，即：向下拉动，顶部会跟随展示背景色，松手回弹。那一开始将`image`设置成`absolute`，然后在`worklet:ongesture`中改变`image`的`height`，即可实现下拉，上下部分同步下移。但是：回弹时，`scroll-view`的回弹动画和时间不得而知，所以两者的回弹效果始终是对不齐的

**因此，需要关闭`bounces`效果，下半部分也通过动画以实现上下运动均同步，以下是改进后的代码：**

<!-- prettier-ignore-start -->

::: details 改进实现

::: code-group

```html [pull-improve.wxml]
<image
  class="banner absolute w-full"
  src="https://images.pexels.com/photos/2912996/pexels-photo-2912996.jpeg?auto=compress&cs=tinysrgb&w=800"
  fade-in
></image>
<view class="sv flex-1"> <!-- [!code ++] -->
  <!-- 该手势组件先通过native-view="scroll-view"代理该标签，再通过onShouldAcceptGesture和onShouldAcceptGesture的逻辑来控制scroll-view层上的手势是否有效，控制内部滚动 -->
  <vertical-drag-gesture-handler
    native-view="scroll-view"
    worklet:ongesture="onDragScrollView"
    should-response-on-move="onShouldResponseOnMove"
    should-accept-gesture="onShouldAcceptGesture"
  >
    <scroll-view
      class="h-full"
      scroll-y
      bounces="{{ false }}"> <!-- [!code ++] -->
      ...
    </scroll-view>
  </vertical-drag-gesture-handler>
</view>
```

```js [pull-improve.js]
const { shared, timing } = wx.worklet
const imageHeight = shared(0)
const scrollViewTranslateY = shared(0) // [!code ++]
const GestureStateEnum {
  // 手势未识别
  POSSIBLE: 0,
  // 手势已识别
  BEGIN: 1,
  // 连续手势活跃状态
  ACTIVE: 2,
  // 手势终止
  END: 3,
  // 手势取消
  CANCELLED: 4,
}
Component({
  data: {
    initImageHeight: 474,
  },
  lifetimes: {
    ready() {
      scrollViewTranslateY.value = imageHeight.value = this.data.initImageHeight // [!code ++]
      this.applyAnimatedStyle('.banner', () => {
        'worklet'
        return {
          height: `${imageHeight.value}rpx`,
        }
      })
      this.applyAnimatedStyle('.sv', () => { // [!code ++]
        'worklet' // [!code ++]
        return { // [!code ++]
          transform: `translateY(${scrollViewTranslateY.value}rpx)`, // [!code ++]
        } // [!code ++]
      }) // [!code ++]
    },
  },
  methods: {
    onDragScrollView(evt) {
      'worklet'
      if (evt.state === GestureStateEnum.ACTIVE) {
        if (evt.deltaY > 0) {
          // 下拉，图片高度增加，scroll-view向下平移
          imageHeight.value += evt.deltaY
          scrollViewTranslateY.value += evt.deltaY // [!code ++]
        } else {
          // 上滑
        }
      } else if ([GestureStateEnum.END, GestureStateEnum.CANCELLED].includes(evt.state)) {
        // 手势结束，重置状态
        scrollViewTranslateY.value = imageHeight.value = timing(this.data.initImageHeight) // [!code ++]
      }
    },
    onShouldResponseOnMove() {
      'worklet'
      return true
    },
    onShouldAcceptGesture() {
      'worklet'
      return true
    },
  },
})
```

:::
<!-- prettier-ignore-end -->

#### 步骤 2：上滑时，容器先上移，再内部滚动

如果手势向上滑动时，`scroll-view`是向上平移还是内部滚动呢？该怎么写逻辑呢？

前面部分已经知道，`vertical-drag-gesture-handler`手势组件的`should-accept-gesture`和`should-response-on-move`回调可以控制当前手势有没有效，如果返回`true`就是有效，返回`false`就是无效

向不向上平移还是内部滚动其实都依赖一个关键点，就是：**`scroll-view`的`tranlateY`当前是 在起始位置 还是 到达了顶部位置**

已知：`translateY`起始位置是`initImageHeight`，我们定义一个顶部位置为`topDestination`

因此要控制`scroll-view`能不能滚动，可以在`should-response-on-move`中返回：`evt.deltaY < 0 && scrollViewTranslateY.value === topDestination`

此时问题就来了：如果`should-response-on-move`这么判定，初始时，`scrollViewTranslateY.value`为`initImageHeight`，向上滑动时，判定为`false`，永远也触发不了`worklet:ongesture`的回调，那谁来改变`scrollViewTranslateY.value`值到`topDestination`呢？

**答案：[手势协商](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/gesture.html#%E7%A4%BA%E4%BE%8B%E5%9B%9B%EF%BC%9A%E6%89%8B%E5%8A%BF%E5%8D%8F%E5%95%86)**，通过两个`vertical-drag-gesture-handler`组件，外围控制纵向拖动，内侧控制内部滚动。再用`simultaneous-handlers`声明两个手势可同时触发

::: code-group

```html [final.wxml]
<image
  class="banner absolute w-full"
  src="https://images.pexels.com/photos/2912996/pexels-photo-2912996.jpeg?auto=compress&cs=tinysrgb&w=800"
  fade-in
></image>
<view class="sv flex-1">
  <!-- 该手势组件控制向上拖动 -->
  <vertical-drag-gesture-handler
    worklet:ongesture="onDragScrollViewOuter"
    tag="outer"
    simultaneous-handlers="{{['inner']}}"
  >
    <!-- 该手势组件先通过native-view="scroll-view"代理该标签，再通过onShouldAcceptGesture和onShouldAcceptGesture的逻辑来控制scroll-view层上的手势是否有效，控制内部滚动 -->
    <vertical-drag-gesture-handler
      tag="inner"
      native-view="scroll-view"
      worklet:ongesture="onDragScrollViewInner"
      should-accept-gesture="onShouldAcceptGestureInner"
      simultaneous-handlers="{{['outer']}}"
    >
      <scroll-view
        class="h-full"
        scroll-y
        bounces="{{ false }}"
      >
        <!-- [!code ++] -->
        ...
      </scroll-view>
    </vertical-drag-gesture-handler>
  </vertical-drag-gesture-handler>
</view>
```

```js [final.js]
const { shared, timing } = wx.worklet
const imageHeight = shared(0)
const scrollViewTranslateY = shared(0)
const GestureStateEnum {
  // 手势未识别
  POSSIBLE: 0,
  // 手势已识别
  BEGIN: 1,
  // 连续手势活跃状态
  ACTIVE: 2,
  // 手势终止
  END: 3,
  // 手势取消
  CANCELLED: 4,
}
Component({
  data: {
    initImageHeight: 474,
  },
  lifetimes: {
    ready() {
      scrollViewTranslateY.value = imageHeight.value = this.data.initImageHeight // [!code ++]
      this.applyAnimatedStyle('.banner', () => {
        'worklet'
        return {
          height: `${imageHeight.value}rpx`,
        }
      })
      this.applyAnimatedStyle('.sv', () => { // [!code ++]
        'worklet' // [!code ++]
        return { // [!code ++]
          transform: `translateY(${scrollViewTranslateY.value}rpx)`, // [!code ++]
        } // [!code ++]
      }) // [!code ++]
    },
  },
  methods: {
    onDragScrollView(evt) {
      'worklet'
      if (evt.state === GestureStateEnum.ACTIVE) {
        if (evt.deltaY > 0) {
          // 下拉，图片高度增加，scroll-view向下平移
          imageHeight.value += evt.deltaY
          scrollViewTranslateY.value += evt.deltaY // [!code ++]
        } else {
          // 上滑
        }
      } else if ([GestureStateEnum.END, GestureStateEnum.CANCELLED].includes(evt.state)) {
        // 手势结束，重置状态
        scrollViewTranslateY.value = imageHeight.value = timing(this.data.initImageHeight) // [!code ++]
      }
    },
    onShouldAcceptGestureInner() {
      'worklet'
      return true
    },
  },
})
```

:::
