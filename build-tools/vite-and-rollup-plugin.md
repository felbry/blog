# Vite 和 Rollup 插件开发

## 基础面 Rollup Plugin

[Rollup 插件开发](https://cn.rollupjs.org/plugin-development/)

插件是一个对象，具有**属性**、**构建钩子**和**输出生成钩子**中的一个或多个

```typescript
export default function myRollupPlugin() {
  return {
    // 属性
    name: 'my-rollup-plugin',
    // 构建钩子
    // 写法1
    buildStart(options: InputOptions) {},
    // code即文件内容，id为文件绝对路径
    // type TransformResult = string | null | Partial<SourceDescription></SourceDescription>
    transform(code: string, id: string): TransformResult {}

    // 写法2
    buildStart: {
      order: 'pre', // post null
      handler(options: InputOptions) {},
    },
  }
}
```

## 扩展 Vite Plugin

[Vite 插件 API](https://cn.vite.dev/guide/api-plugin.html)

在 Rollup 插件基础上，扩展**属性**和**钩子**

<!-- prettier-ignore-start -->
```typescript
export default function myVitePlugin() {
  return {
    name: 'my-vite-plugin',
    enforce: 'pre', // 或 post // [!code ++]
    apply: 'build', // 或 'serve' // [!code ++]

    configureServer(server) { // [!code ++]
      server.middlewares.use((req, res, next) => {}) // [!code ++]
    }, // [!code ++]
    ..., // [!code ++]
  }
}
```
<!-- prettier-ignore-end -->

## 包发布约定

Rollup 插件

- 带`rollup-plugin-`前缀
- `package.json`中包含`roll-plugin`和`vite-plugin`关键字

Vite 专属插件

- 带`vite-plugin-`前缀
- `package.json`中包含`vite-plugin`关键字
- 在插件文档增加一部分关于为什么本插件是一个 Vite 专属插件的详细说明（如，本插件使用了 Vite 特有的插件钩子）
- 如果插件只适用特定框架，带上框架前缀，如`vite-plugin-vue-`，`vite-plugin-react-`
