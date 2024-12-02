# skyline 下的问题

可以通过[Skyline 更新日志](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/changelog.html)随时了解 skyline 的问题解决进度

## flex 相关问题

文档说默认元素的`display`为`flex`，但`flex-direction`默认是`column`

[基础库`3.6.6`/skyline`1.3.3`] 下还不支持`flex`的`gap`，需要通过`grid-view`实现。这个问题在 skyline[`1.4.1`](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/changelog.html#_1-4-1-2024-10-16)解决

## scroll-view 问题

`type`属性在文档中是可选，但横向滚动时必须指定（比如`type="custom"`），否则展示有问题

既然默认所有元素都是 flex，那为啥`scroll-view`的子元素高度撑不起它呢？这个问题在 skyline[`1.4.2`](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/changelog.html#_1-4-2-2024-11-19)解决，在此之前，都需要显式设置`scroll-view`的高度

## 页面 background-color: #fff 无效？

无论是全局样式、本页面样式，设置后看着都不像纯白色

但是设置其它颜色又都有效果，存疑，可能是视觉效果
