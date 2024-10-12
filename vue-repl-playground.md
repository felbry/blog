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

通过使用规范，我们可以得出预览组件是利用了 vitepress 的[Markdown 扩展](https://vitepress.dev/zh/guide/markdown#advanced-configuration)实现的。

因此从 Element Plus 的 vitepress 配置文件入手：[element-plus/docs/.vitepress/config/index.mts](https://github.com/element-plus/element-plus/blob/dev/docs/.vitepress/config/index.mts)，看到配置了如下代码：

```js{1,3-5}
import { mdPlugin } from './plugins'
const config = {
  markdown: {
    config: (md) => mdPlugin(md),
  },
};
```

查看[element-plus/docs/.vitepress/config/plugins.ts](https://github.com/element-plus/element-plus/blob/dev/docs/.vitepress/config/plugins.ts)，找到 Demo 的相关代码：

```js
import mdContainer from 'markdown-it-container'
import createDemoContainer from '../plugins/demo'
export const mdPlugin = (md) => {
  md.use(mdContainer, 'demo', createDemoContainer(md))
}
```

:::info [markdown-it-container 介绍](https://www.npmjs.com/package/markdown-it-container)
为 markdown-it 的 markdown 解析器创建块级自定义容器的插件

使用方式 `md.use(require('markdown-it-container'), name [, options]);`

- name 容器名称，必填
- options

  - validate 可选，“打开标记”后验证尾部的函数，成功则为`true`

    比如 Element Plus 的`!!params.trim().match(/^demo\s*(.*)$/)`，`:::`就是打开标记，该验证函数就是验证是否符合：`:::demo`开头+零个或多个空格+零个或多个任意字符直至一行的结尾

  - render 可选，类比 Vue 的 render
  - marker 可选，分隔符，默认就是`:`

:::

通过以上代码，我们便知道怎么自定义容器。来看看 Element Plus 自定义的 Demo 容器：[element-plus/docs/.vitepress/plugins/demo.ts](https://github.com/element-plus/element-plus/blob/dev/docs/.vitepress/plugins/demo.ts)

重点分析`render`函数

```js
return {
  render(tokens, idx) {
    const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
    if (tokens[idx].nesting === 1 /* means the tag is opening */) {
      const description = m && m.length > 1 ? m[1] : ''
      const sourceFileToken = tokens[idx + 2]
      let source = ''
      const sourceFile = sourceFileToken.children?.[0].content ?? ''

      if (sourceFileToken.type === 'inline') {
        source = fs.readFileSync(path.resolve(docRoot, 'examples', `${sourceFile}.vue`), 'utf-8')
      }
      if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)

      return `<Demo source="${encodeURIComponent(
        md.render(`\`\`\` vue\n${source}\`\`\``)
      )}" path="${sourceFile}" raw-source="${encodeURIComponent(
        source
      )}" description="${encodeURIComponent(md.render(description))}">
  <template #source><ep-${sourceFile.replaceAll('/', '-')}/></template>`
    } else {
      return '</Demo>\n'
    }
  },
}
```

先搞清楚`tokens`和`idx`，整个 markdown 文件会被解析成`tokens`数组，而`idx`就是命中该插件的 token 索引。以[约定使用规范](#约定使用规范)中的内容做测试，在`render`中打印`tokens[idx]`时，会得到如下输出：

::: details 输出结果

```js
// idx 115
// tokens[idx]
Token {
  type: 'container_demo_open',
  tag: 'div',
  attrs: null,
  map: [ 111, 115 ],
  nesting: 1,
  level: 0,
  children: null,
  content: '',
  markup: ':::',
  info: 'demo Use `disabled` attribute to determine whether a button is disabled. It accepts a `Boolean` value.',
  meta: null,
  block: true,
  hidden: false
}

// idx 119
// tokens[idx]
Token {
  type: 'container_demo_close',
  tag: 'div',
  attrs: null,
  map: null,
  nesting: -1,
  level: 0,
  children: null,
  content: '',
  markup: ':::',
  info: '',
  meta: null,
  block: true,
  hidden: false
}
```

:::

可以看出，开始和结束标记会触发`render`函数，那其中的内容，便可以通过`idx + N`来得到，分别输出`tokens[idx + 1]`、`tokens[idx + 2]`、`tokens[idx + 3]`、

::: details 输出结果

```js
// tokens[idx + 1]
Token {
  type: 'paragraph_open',
  tag: 'p',
  nesting: 1,
  level: 1,
  children: null,
  content: '',
  markup: '',
  info: '',
}

// tokens[idx + 2]
Token {
  type: 'inline',
  tag: '',
  nesting: 0,
  level: 2,
  children: [
    Token {
      type: 'text',
      tag: '',
      nesting: 0,
      level: 0,
      children: null,
      content: 'button/disabled',
      markup: '',
      info: '',
    }
  ],
  content: 'button/disabled',
  markup: '',
  info: '',
}

// tokens[idx + 3]
Token {
  type: 'paragraph_close',
  tag: 'p',
  nesting: -1,
  level: 1,
  children: null,
  content: '',
  markup: '',
  info: '',
}
```

:::

可以看到很多信息，但是以目的为导向，我们只需要解析`tokens[idx + 2]`的数据即可。

回头再看 Element Plus 的代码，就比较清晰了。接着就是看下`<Demo></Demo>`组件了。文件路径为：[element-plus/docs/.vitepress/vitepress/components/vp-demo.vue](https://github.com/element-plus/element-plus/blob/dev/docs/.vitepress/vitepress/components/vp-demo.vue)

### 迁移改造 vp-demp.vue

- 安装 @vueuse/core、@element-plus
- 替换 locale 相关代码
- 去掉 useSourceCode 的引入，主要是通过 props.path 得出 github url，后续自己实现
- 去掉 usePlayground 的引入，主要是跳转 playground，后续自己实现
- 替换 CSS 变量，文件里有一些`--bg-color`、`--el-text-color-secondary`这类变量，可以替换成 vitepress 主题的变量，更适配主题（TODO）
- 将`render`函数中使用的`<ep-${sourceFile.replaceAll('/', '-')}/>`组件依次注入 markdown 文件

  一开始我考虑的是在 `<Demo></Demo>`组件中，通过`props.path`得到组件名，然后通过`import`引入，利用 `defineAsyncComponent` 和 `<component />`组件 实现异步加载。但是这种方式仅限于开发环境（即有本地服务器的情况下）。打包时由于是动态引入，`path`还没传入，相关组件均不会被打包，导致打包后 example 的示例均不能展示。

  那就只有参照 Element Plus 的方式，在构建前，将组件的引入语句追加进 markdown 了。参见[docs/.vitepress/config/vite.ts - MarkdownTransform](https://github.com/element-plus/element-plus/blob/ba59b5d20eb486d50bac06f71d5c2b809ec0d942/docs/.vitepress/config/vite.ts#L111)

## 测试

:::demo Use `disabled` attribute to determine whether a button is disabled. It accepts a `Boolean` value.

vue-repl-playground/test

:::
