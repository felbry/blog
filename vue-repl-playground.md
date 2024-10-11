# 使用@vue/repl 定制 Playground

![image](https://felbry.github.io/picx-images-hosting/image.6bh22961ab.webp)

主流的组件库都有这样的预览功能，比如上图所示的[Element Plus - Button](https://element-plus.org/zh-CN/component/button.html#%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95)。在预览之外，还有代码展示，Playground 交互演练场等功能。

Element Plus 的交互已经做的足够好，但从我个人写博客角度来看，还有以下诉求：

- 源码可以通过配置决定是否常驻展示（因为示例代码要考虑 SEO）
- playground 要在当前页面全屏打开，而不是另一个独立外链增加加载时间成本
- playground 的环境最好是预集成好的，比如通过 CDN 加载一些需要的库
- ...

以上个性化需求都需要针对性开发，因此可以参照 Element Plus 和@vue/repl 的代码，实现一个功能更加丰富的预览组件。

## 约定使用规范

在实现预览组件前，先要约定如何使用。

这里我们参照[element-plus/docs/en-US/component/button.md](https://github.com/element-plus/element-plus/blob/dev/docs/en-US/component/button.md?plain=1)的格式，其中预览组件的核心代码如下：

```markdown
:::demo Use `disabled` attribute to determine whether a button is disabled. It accepts a `Boolean` value.

button/disabled

:::
```

通过`:::demo`开头，`:::`结尾。中间包裹一个示例代码文件的相对路径，`:::demo`之后也可以补充一些描述。

## 实现思路

通过使用规范，我们可以得出预览组件是通过 vitepress 的[Markdown 扩展](https://vitepress.dev/zh/guide/markdown#advanced-configuration)实现的。

我们先定位到 Element Plus 的 vitepress 配置文件：[]()

https://github.com/element-plus/element-plus/blob/dev/docs/.vitepress/config/index.mts

https://github.com/element-plus/element-plus/blob/dev/docs/.vitepress/config/plugins.ts

https://github.com/element-plus/element-plus/blob/dev/docs/.vitepress/plugins/demo.ts
