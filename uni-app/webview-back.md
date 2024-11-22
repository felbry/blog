# uni-app 使用 webview 自定义返回逻辑

纯 H5 应用，想做成原生 APP，可以通过 uni-app 的 webview 组件实现

首先在 uni-app 端新建一个页面：

::: code-group

```vue [pages/index/index.vue]
<template>
  <web-view :src="xxx"></web-view>
</template>
```

:::

如果 H5 想全屏展示（包含状态栏），参考[自定义导航栏使用注意](https://uniapp.dcloud.net.cn/collocation/pages.html#customnav)，配置过后 webview 的尺寸就是全屏了

此时在 H5 中点击跳转几个页面，当点击安卓的返回键或是侧滑返回时，**由于当前 uni-app 只有一个 index 页面**，没有其它页面可退，所以默认提示“再按一次退出应用”

::: info 问题：为什么返回行为并没有触发 webview 的 history back 呢？如何将“系统按键/侧滑 返回”映射到 webview 的 history back？
:::

要搞清楚它，先看[App 端 web-view 的扩展](https://uniapp.dcloud.net.cn/component/web-view.html#app%E7%AB%AFweb-view%E7%9A%84%E6%89%A9%E5%B1%95)这句话：

> 每个 vue 页面，其实都是一个 webview，而 vue 页面里的 web-view 组件，其实是 webview 里的一个子 webview。这个子 webview 被 append 到父 webview 上

也就是说，页面内的`<web-view :src="xxx"></web-view>`实则是子 web-view，当用户返回时，直接作用对象是父 web-view，子是感知不到的

而父 web-view 的默认返回行为是什么呢？我理解应该是根据[页面栈](https://uniapp.dcloud.net.cn/tutorial/page.html#%E9%A1%B5%E9%9D%A2%E6%A0%88)返回，直到返回到第一个页面，就会弹出提示：“再按一次退出应用”

::: info 问题：那如何将返回映射到子 web-view 呢？
:::

可以通过重写父 web-view 的默认返回行为：获取到子 web-view 对象，执行子 web-view 的返回动作。uni-app 提供了`onBackPress`声明周期函数来实现，详见[方案一：onBackPress（仅适用 Android）](#方案一-onbackpress-仅适用-android)

## 方案一：onBackPress

阅读[教程 - 页面 - onBackPress](https://uniapp.dcloud.net.cn/tutorial/page.html#onbackpress)、[uni-app 自定义返回逻辑教程](https://ask.dcloud.net.cn/article/35120)，提取到以下信息：

- `onBackPress` 函数如果返回`true`，代表阻止默认行为，完全由你掌控逻辑；但该函数不可使用 async，会导致无法阻止默认返回
- iOS 端**侧滑返回**不会触发`onBackPress`
- 以下三种场景会触发`onBackPress`：
  1. Android 实体返回键/侧滑（`event.from = 'backbutton'`）
  2. 顶部导航栏左边的返回按钮（安卓和 iOS 均可）（`event.from = 'backbutton'`）
  3. uni-app 的返回 API，即`uni.navigateBack()`（`event.from = 'navigateBack'`）
- 它是页面级生命周期函数，非组件级

了解后，按照上述思路实现：

::: code-group

```vue [pages/index/index.vue]
<template>
  <web-view :src="xxx"></web-view>
</template>
<script>
export default {
  onBackPress(evt) {
    const childWv = this.$scope.$getAppWebview().children()[0]
    childWv.canBack((evt) => {
      // true or false
      if (evt.canBack) {
        childWv.back()
      }
    })
    return true
  },
}
</script>
```

:::

- 参考[API->页面和路由->页面->$getAppWebview()](https://uniapp.dcloud.net.cn/api/window/window.html#getappwebview)、[例子 6 uni-app 可以在 vue 页面里写 web-view 组件，这个组件如何用 plus api 操作？](https://ask.dcloud.net.cn/article/35036)，`$getAppWebview()`就是当前页面 web-view（即上述的父 web-view），本例中只有一个子 web-view，通过`.children()[0]`获取
- 有了子 web-view 对象，利用[WebviewObject API](https://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject)实现返回，本例使用了`canBack()`和`back()`方法

## 方案二：plus.key.addEventListener('backbutton', () => {})

效果和方案一的`onBackPress`一致，参考[key->addEventListener](https://www.html5plus.org/doc/zh_cn/key.html#plus.key.addEventListener)的一句话：

> 应用中存在多个 Webview 窗口时，按照窗口的显示栈顺序从后往前查找，查找到添加按键事件监听器的窗口后停止（中断前面 Webview 窗口对按键事件的监听），并向窗口触发执行按键回调事件

可以得知：如果是在 H5 的子 web-view 中进行`plus.key.addEventListener('backbutton', () => {})`事件监听，那么就永远不会触发父 web-view 中的`onBackPress`了。即：方案一和方案二是互斥的

## 方案一和方案二小结

方案一在 uni-app 页面端实现，方案二则侧重在 H5 端实现，可以根据场景来决定使用哪种。两者都偏向安卓端，不可混用。

比如你的 H5 还可能定向到第三方系统，而这三方系统并没有引入`uni.webview.js`，此时可以采用方案一；如果自定义返回逻辑还可能访问 H5 的`router`等变量，那方案二也许更合适

## 关于 iOS

在 uni-app 端，有一个[app-plus->popGesture](https://uniapp.dcloud.net.cn/collocation/pages.html#app-plus)配置项，默认值是`close`，即启用侧滑返回。也就是说如果是 uni-app 页面之间的跳转，默认在 iOS 端就能侧滑返回

但目前没有检索到 uni-app 针对 iOS 侧滑返回的监听方法，因此自定义返回逻辑不是很方便

网上的一些思路：

- 通过其它生命周期函数监听滑动事件，判断是否符合侧滑特征
- 通过写原生 iOS 插件，将侧滑事件传递给 uni-app 页面

后期有需求再进一步研究
