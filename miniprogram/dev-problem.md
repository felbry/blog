# 开发遇到的问题

## skyline

可以通过[Skyline 更新日志](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/changelog.html)随时了解 skyline 的问题解决进度

### flex 相关问题

文档说默认元素的`display`为`flex`，但`flex-direction`默认是`column`

[基础库`3.6.6`/skyline`1.3.3`] 下还不支持`flex`的`gap`，需要通过`grid-view`实现。这个问题在 skyline[`1.4.1`](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/changelog.html#_1-4-1-2024-10-16)解决

### scroll-view 问题

`type`属性在文档中是可选，但横向滚动时必须指定（比如`type="custom"`），否则展示有问题

既然默认所有元素都是 flex，那为啥`scroll-view`的子元素高度撑不起它呢？这个问题在 skyline[`1.4.2`](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/changelog.html#_1-4-2-2024-11-19)解决，在此之前，都需要显式设置`scroll-view`的高度

### 页面 background-color: #fff 无效？

无论是全局样式、本页面样式，设置后看着都不像纯白色

但是设置其它颜色又都有效果，存疑，可能是视觉效果

## 通性

### tabbar 遮挡问题

参考[小程序 tabBar 层级 z-index 问题，自定义弹窗遮挡不住](https://developers.weixin.qq.com/community/develop/doc/000ee4ccd6cfa8a67da76bad251000)

按官方的话说，客户端原生的就是遮不住。(有人说在 webview 下设置 popup 根的`z-index`无限大可以，未尝试)

因此如果不是自定义 tabbar，可以通过`wx.hideTabBar`，`wx.showTabBar`来短暂隐藏

如果是自定义 tabbar，先在 tabbar 的`data`中定义`isVisible`，接着在 tabbar 的模板中通过`isVisible`来控制 tabbar 的`display`状态，最后在其它页面/组件中通过`this.getTabbar`获取实例来改变`isVisible`的值，以下是 skyline 下的示例代码：

```js
Component({
  methods: {
    openPopup() {
      this.getTabBar((tabBar) => {
        tabBar.setData({
          isVisible: false,
        })
      })
    },
    closePopup() {
      this.getTabBar((tabBar) => {
        tabBar.setData({
          isVisible: true,
        })
      })
    },
  },
})
```

### iOS 日期格式

`new Date('2021-7-7 14:59:32')`本地开发是个正常日期对象，iOS 真机是`NAN`

### js 文件间的 import 和 export

```bash
a
  ├── a1
  │   ├── a1.js
  │   ├── a1.wxml
  ├── a2
  │   ├── a2.js
  │   ├── a2.wxml
b
  ├── b1
  │   ├── b1.js
  │   ├── b1.wxml
```

`a1.js` 和 `a2.js` 是可以相互 `import` 和 `export` 的（按需引入），真机上也没问题

但 `b1.js` 如果 `import` 了 `a1.js` 或 `a2.js` 的，本地开发没问题，真机会报错
