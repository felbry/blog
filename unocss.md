# UnoCSS

## 初识：rules 和 [presets](https://unocss-cn.pages.dev/guide/presets)

`rules`可以加规则，既可以静态，也可以动态。

一条条加麻烦且不容易复用，可以`preset`形式分发，这里有官方的`preset`，也可以自己做`preset`文件。

- 不配置`presets`字段，应用“默认预设”，[默认预设等同于`@unocss/preset-wind`](https://unocss-cn.pages.dev/presets/uno)
- `presets`为空数组，禁用“默认预设”
- `presets`有值，应用指定的预设

```javascript
// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  rules: [
    ['m-1', { margin: '1px' }],
    [/^m-([\.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })]
  ],
  presets: [...]
})
```

## 快速设置

```javascript
// uno.config.js
import {
  // 变体组转换器：https://unocss-cn.pages.dev/transformers/variant-group
  transformerVariantGroup,
  // 指令：https://unocss-cn.pages.dev/transformers/directives
  transformerDirectives,
} from 'unocss'
export default defineConfig({
  transformers: [
    // <div class="hover:(bg-gray-400 font-medium) font-(light mono)"/> 转换为： <div class="hover:bg-gray-400 hover:font-medium font-light font-mono"/>
    transformerVariantGroup(),
    // .custom-div { @apply text-center my-0 font-medium; }
    transformerDirectives(),
  ],
})
```

## 提取 utilities（实用工具）

可以从构建管道（pipeline）、文件系统、内联纯文本多种渠道提取并生成 css。

1. pipeline：默认从`.jsx`, `.tsx`, `.vue`, `.md`, `.html`, `.svelte`, `.astro`这些文件中提取，并不包括`.js`，`.ts`。

要包含额外的文件，通过`content.pipeline.include`来配置：

```typescript
// uno.config.ts
export default defineConfig({
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        'src/**/*.{js,ts}',
      ],
      // exclude files
      // exclude: []
    },
  },
})
```

2. 文件系统：一些集成不能访问 pipeline，或与后端框架集成，可以考虑通过`content.filesystem`指定文件

```typescript
// uno.config.ts
export default defineConfig({
  content: {
    filesystem: ['src/**/*.php', 'public/*.html'],
  },
})
```

3. 内联纯文本：这个场景使用少，一般是本地项目文件扫不到的类名吧

```typescript
// uno.config.ts
export default defineConfig({
  content: {
    inline: [
      // plain text 比如一些动态生成的class，又不想以对象配置的形式整，直接全量追加到这生成？全部配置到safelist更方便吧
      // 如果适用的场景
      '<div class="p-4 text-red">Some text</div>',
      // async getter 再比如远程的一些富文本需要innerHTML插入，要生成对应样式的？
      async () => {
        const response = await fetch('https://example.com')
        return response.text()
      },
    ],
  },
})
```

### 注释

```typescript
// 要包含一个文件
// @unocss-include

// 要排除一个文件
// @unocss-ignore

// 要跳过一个部分
// @unocss-skip-start
// @unocss-skip-end
```

### 限制

#### safelist

```html
<div class="p-${size}"></div>
<!-- this won't work! -->
```

如果你知道所有 size 的值，比如 1 ～ 4，可以用 safelist 配置：`safelist: 'p-1 p-2 p-3 p-4'.split(' ')`（看来**safelist 就是包含所有类名的数组**），这将生成：

```css
.p-1 {
  padding: 0.25rem;
}
.p-2 {
  padding: 0.5rem;
}
.p-3 {
  padding: 0.75rem;
}
.p-4 {
  padding: 1rem;
}
```

#### 静态对象

```html
<div class="text-${color} border-${color}"></div>
<!-- this won't work! -->
```

```javascript
// Since they are static, UnoCSS will able to extract them on build time
const classes = {
  red: 'text-red border-red',
  green: 'text-green border-green',
  blue: 'text-blue border-blue',
}

// 然后这样使用
// <div class="${classes[color]}"></div>
// 我推测一旦检验到class里有一个完整的变量，就去找到它：classes，遍历所有属性值生成class
```

#### blocklist

有 safe 就有 block，可以配置 blocklist 阻止某些类生成

```javascript
// uno.config.ts
blocklist: ['p-1', /^p-[2-4]$/]
```

## 详解 config

上述介绍涉及了一些 config 项，这里是更全面的解读

熟悉全部的 config 配置项，有助于根据需求灵活调整

```typescript
// uno.config.ts
export default defineConfig({
  rules: [
    // 定义一系列rule生成CSS utilities，越靠后优先级越高
    ['m-1', { margin: '1px' }],
    [/^m-([\.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })],
  ],
  shortcuts:
    // 初级使用 组合多个CSS utilities
    {
      'btn-green': 'text-white bg-green-500 hover:bg-green-700',
    },
    // 高级使用 类似于rules 可以正则匹配+处理函数
    [
      // 仍可以使用一个对象
      {
        btn: 'py-2 px-4 font-semibold rounded-lg shadow-md',
      },
      [/^btn-(.*)$/, ([, c]) => `bg-${c}-400 text-${c}-100 py-2 px-4 rounded-lg`]
    ],
})
```
