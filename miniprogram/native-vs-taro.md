# 原生 VS Taro

截止到 2024/11/26，Taro 官方 v3 文档对 skyline 并没有专项的说明文档

如果小程序想保持传统的 webview 渲染，Taro 可能是更好的选择（开发效率快） - 但 skyline 毕竟是大趋势，2024 以及 2025 起步的小程序最好只考虑 skyline，避免掺杂历史包袱

一旦涉及到 skyline，当前 Taro 就会存在一些问题：

- wxss 的 autoprefixer

  虽然生成了一些无效样式，但是不影响功能（应该可以通过配置去掉：[mini.postcss](https://docs.taro.zone/docs/config-detail#minipostcss)）

- `3.6.24`版本，`bind:eventname`格式报警告（[3.6.29](https://github.com/NervJS/taro/releases/tag/v3.6.29)显示新增了对 Skyline 组件的适配）

  以`scroll-view`为例：之前的事件都是`binddragstart`、`bindscrolltoupper`这样，但是 skyline 新增的一些方法加了冒号，如：`bind:scrollstart`

  在`3.6.24`，可以通过`<scroll-view @dragstart="func">`监听`binddragstart`事件，但是`bind:scrollstart`该如何写呢？是`<scroll-view @scrollstart="func">`还是`<scroll-view @:scrollstart="func">`还是`<scroll-view @bind:scrollstart="func">`？好像都没生效

  `3.6.29`是不是能解决？懒得去试了，因为直接试了下最新的`4.0.7`，初始化的项目连运行都运行不起来，折腾这干啥，直接用原生吧
