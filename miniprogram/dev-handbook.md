# 微信小程序开发手册

## 原生起步

### UnoCSS

按照[教程](https://github.com/MellowCo/unocss-wechat/blob/main/readme.zh-CN.md)快速配置

::: tip
有时需要在某个页面下创建`components`文件夹存放页面组件，教程的 glob pattern 匹配不到该文件夹下的 wxml 文件，需要更改下：`unocss pages/**/{*.wxml,components/*.wxml} -c unocss.config.js --watch -o unocss.wxss`
:::

生成全新的 unocss.wxss 文件比较简单，但原生小程序没有编译过程，导致 wxml 写的 class 是什么就是什么，比如 `class="bg-[red]"`，unocss 生成的类名为`.bg-_lfl_red_lfr_`，而 wxml 中的类名没有变化，自然就匹配不上了

因此要解决这个问题，**方案一**就是按教程中的配置`transformer`，去改变 wxml 中的类名。它的弊端也很明显，把原来可读性高的类名改成编译后的了，增加了维护成本

**方案二**就是在 wxml 中写类名时，尽量考虑可读性高的替代方案：

- 用`hex`替代`#`；用`_`替代`:`、`/`

  `bg-#81ecec/50`替代为`bg-hex-81ecec_50`

- 针对`hover:`和`active:`，设置`separators`分隔符（教程中使用的是`__`）

  因此`hover:bg-red-500`替代为`hover__bg-red-500`

### 基础颜色设置

`app.json`中的`backgroundColor`设置的是页面下拉显示的背景色而不是页面背景色

要设置页面背景色，在全局 wxss 文件中以`page`选择器设置

### 页面路径配置和跳转

**配置**

在`app.json`中配置`pages`和`tabBar.list`字段时，路径为相对路径，比如下边两种形式都是合法的：

```json
{
  "pages": ["pages/index/index", "home/home"]
}
```

可以理解为相对`app.json`的位置有`pages`和`home`文件夹，`pages`下还有`index`文件夹，其下有个`index`文件；同理`home`文件夹下有个`home`文件（可以理解为：无论是页面还是组件，引用时都要具体到其 js/json 文件，省略后缀）

**跳转**

无论是`switchTab`还是`navigateTo`这类导航，`url`可以是相对的也可以是绝对的

建议统一为绝对路径，以上述为例，假如你要跳转`index`页面，`wx.switchTab({ url: 'pages/index/index' })`是错误的，因为没有`/`开头代表的是相对路径

### 开发页面

页面/组件统一用 Component 构建，页面生命周期函数放在`methods`中 [^1]

此时页面 json 文件要包含`usingComponents`定义，可以为`{}` [^2]（如果不定义这个字段，会使得页面的 this 对象的原型稍有差异 [^3]）

`Component`的`properties`可用来接收页面传参，如`/pages/index/index?paramA=123&paramB=xyz`，`paramA`和`paramB`可通过`properties`获取到 [^2]

[页面生命周期](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page-life-cycle.html)：`onLoad` -> `onShow` -> `onReady`，之后可能触发`onHide`、`onUnload`

### [开发组件](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html)

起步仨文件，`json`中声明`{ "component": true }`，并且样式隔离设置成“页面影响组件，组件不影响页面”：`{ "styleIsolation": "apply-shared" }` [^4]

::: code-group

```js [comp.js]
Component({
  data: {
    msg: 'hello',
  },

  // 组件生命周期 - 一共6个 - 也可以写在顶层兼容低版本，但不推荐
  lifetimes: {
    created() {}, // 在组件实例刚刚被创建时执行，注意此时不能调用 setData
    attached() {}, // 在组件实例进入页面节点树时执行
    ready() {}, // 在组件布局完成后执行
    moved() {}, // 在组件实例被移动到节点树另一个位置时执行
    detached() {}, // 在组件实例被从页面节点树移除时执行
    error(err) {}, // 每当组件方法抛出错误时执行
  },

  // 组件所在页面生命周期 - 一共4个
  // 自定义tabbar组件并不会触发页面的生命周期
  pageLifetimes: {
    show() {}, // 组件所在的页面被展示时执行
    hide() {}, // 组件所在的页面被隐藏时执行
    resize(sizeObj) {}, // 组件所在的页面尺寸变化时执行
    routeDone() {}, // 组件所在页面路由动画完成时执行
  }

  // 纯数据字段，就是不加监听器，可以通过this.setData修改，但感觉没必要，可以直接this.data.xxx = xxx
  options: {
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
  },
  data: {
    _a: 'xxx',
  },
})
```

```json [comp.json]
{
  "component": true,
  "styleIsolation": "apply-shared"
}
```

```html [comp.wxml]
<view class="bg-red-100"> {{ msg }}, world </view>
```

:::

### [WXML 语法](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/)

```html
<!-- boolean -->
<view checked="{{ false }}"></view>
<view checked></view>
<!-- 绑定事件 -->
<view bindtap="onTap"></view>
<!-- for -->
<!-- 默认就是index、item，显式指定一般用于嵌套 -->
<view
  wx:for="{{ array }}"
  wx:key="index"
  wx:for-index="index"
  wx:for-item="item"
>
  {{ index }}: {{ item.message }}
</view>
```

### [npm 支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

官方的文档说的有些复杂，一些实际场景操作起来很快

- 安装某个组件库

  `npm i xxx -S --production`，然后工具 -> 构建 npm，即可在项目根目录下生成一个`miniprogram_npm`的文件夹，其下是`dependencies`的包

  比如安装了`tdesign-miniprogram`，构建完之后使用`button`组件，就可以写为（不用加`miniprogram_npm`）：

  ```json
  {
    "usingComponents": {
      "t-button": "tdesign-miniprogram/button/button"
    }
  }
  ```

### 使用插件

大部分插件都需要在 后台（左下角头像） -> 账号设置 -> 第三方设置 的插件管理中先搜索、申请、添加

但是像“腾讯位置服务地图选点”这个，就搜不到

可以通过**微信服务市场**直接添加，https://fuwu.weixin.qq.com/service/detail/000c2a50a58c206b3d1957a2d5b015

同理，其它插件也可以通过此形式试试

- 腾讯的地图选点插件的坑

  腾讯的地图选点插件需要腾讯地图的 key，核心功能依赖[地点搜索](https://lbs.qq.com/faq/serverFaq/webServiceSpaceSearch)，个人开发者实际额度[每日 PV200](https://lbs.qq.com/dev/console/quotaImprove)，查一下就没了，不把个人开发者当人。而[高德免费额度](https://lbs.amap.com/upgrade#price)更是调整到了 100，个人开发者 g 了

  ![image](https://felbry.github.io/picx-images-hosting/image.9rjfz7j0dg.webp)

## 组件

### scroll-view

`type="custom" height="固定值"`，这俩直接设置，避免各种问题。（如果`scroll-x`时不设置`type="custom"`显示就会有问题；在低版本 skyline 中不设置`height`，内部元素无法撑开）

skyline 下，`scroll-view`就是 flex 容器。`scroll-x`就是`flex-direction: row`，`scroll-y`就是`flex-direction: col`。其下的直接子元素自动填充其**交叉轴**高度。

```html
<scroll-view
  scroll-x
  type="custom"
  class="h-100"
>
  <view class="w-50 bg-red-200"></view>
  <view class="w-50 bg-green-200"></view>
</scroll-view>
```

![image](https://felbry.github.io/picx-images-hosting/image.lvrsqhhtd.webp)

```html
<scroll-view
  scroll-y
  type="custom"
  class="h-200"
>
  <view class="h-50 bg-red-200"></view>
  <view class="h-50 bg-green-200"></view>
</scroll-view>
```

![image](https://felbry.github.io/picx-images-hosting/image.4g4jbp73ho.webp)

如果需要设置`gap`，参见[skyline 下的 flex 相关问题](./skyline-problem#flex-相关问题)

## 全屏页面顶部数据获取

通过[页面配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html)设置`navigationStyle`为`custom`

![image](https://felbry.github.io/picx-images-hosting/image.73tz83aaq3.webp)

- 黄色：状态栏高度
- 绿色：胶囊距离顶部高度
- 蓝色：胶囊高度
- 灰色：导航栏高度

状态栏高度（黄色）可以通过`wx.getWindowInfo().statusBarHeight`获取（[API -> 基础 -> wx.getWindowInfo](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getWindowInfo.html)）

胶囊高度（蓝色）和距离顶部高度（绿色）可以通过`wx.getMenuButtonBoundingClientRect()`的`height`和`top`获取（[API -> 界面 -> wx.getMenuButtonBoundingClientRect](https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html)）

最终得出：导航栏高度（灰色）= (绿色 - 黄色) \* 2 + 蓝色

```javascript
const { statusBarHeight } = wx.getWindowInfo()
const { top, height } = wx.getMenuButtonBoundingClientRect()
const navBarHeight = (top - statusBarHeight) * 2 + height
```

### 应用

在`Taro`中，直接注册到全局

::: code-group

```js [app.js]
import Taro from '@tarojs/taro'
import { setGlobalDataPlugin } from '@tarojs/taro'
const app = createApp({ ... })
const { statusBarHeight } = Taro.getWindowInfo()
const { top, height } = Taro.getMenuButtonBoundingClientRect()
app.use(setGlobalDataPlugin, {
  statusBarHeight,
  navBarHeight: (top - statusBarHeight) * 2 + height,
})
```

```vue [page.vue]
<script setup>
import Taro from '@tarojs/taro'
const { statusBarHeight, navBarHeight } = Taro.getApp()
</script>
```

:::

## 参考链接

[^1]: [指南 -> 小程序框架 -> 注册页面 -> #使用 Component 构造器构造页面](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html)
[^2]: [指南 -> 自定义组件 -> Component 构造器 -> #使用 Component 构造器构造页面](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)
[^3]: [指南 -> 自定义组件 -> 介绍 -> #注意事项](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/)
[^4]: [指南 -> 自定义组件 -> 组件模板和样式 -> #组件样式隔离](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB)
