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

::: code-group

```html [pull.wxml]
<image
  class="banner absolute w-full"
  src="https://images.pexels.com/photos/2912996/pexels-photo-2912996.jpeg?auto=compress&cs=tinysrgb&w=800"
  fade-in
></image>
<view class="sv flex-1">
  <!-- 该手势组件代理scroll-view内部的手势 -->
  <vertical-drag-gesture-handler
    native-view="scroll-view"
    worklet:ongesture="onVerticalDrag"
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
    onVerticalDrag(evt) {
      'worklet'
      if (evt.state === GestureStateEnum.ACTIVE) {
        offset.value += evt.deltaX
      }
    },
  },
})
```

:::

skyline 下，`scroll-view`的[`bounces`](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html#%E9%80%9A%E7%94%A8%E5%B1%9E%E6%80%A7)效果在`Android`和`iOS`均生效，即：向下拉动，顶部会跟随展示背景色，松手回弹。那一开始将`image`设置成`absolute`，然后在`worklet:ongesture`中改变`image`的`height`，即可实现下拉，上下部分同步下移。但是：回弹时，`scroll-view`的回弹动画和时间不得而知，所以两者的回弹效果始终是对不齐的。
