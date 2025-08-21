# 快速设置

## 简体中文展示

[Admin panel customization options](https://docs.strapi.io/dev-docs/admin-panel-customization/options)

将`/src/admin/app.examples.js`改为`/src/admin/app.js`，在`/src/admin/app.js`中`config.locales`打开`"zh-Hans"`

刷新页面，就能在`http://localhost:1337/admin/me`中更改界面语言了

## 媒体库设置

`http://localhost:1337/admin/settings/media-library`

默认响应式图片是开启的，一般关闭避免生成一堆图片增加存储压力（即使关闭了，在上传图片时也会生成一个缩略图版本）。但是：像做相册展示这类场景，缩略图不够清晰，原图又太大，所以该选项还是有必要开启的。

## 关闭草稿功能

大部分场景是不需要草稿功能的，开启后会增加`documents API`使用复杂度，后台管理也增加了用户的心智成本

在后台界面 - 表名 - 编辑 - 高级设置中，关闭“草稿和发布”，也可以在`content-types/<table-name>/schema.json`中将`options.draftAndPublish`的值置为`false`

## 插件 - Swagger API 文档

只需要`npm install @strapi/plugin-documentation`安装到 dependencies（而不是 devDependencies），strapi 就能自动检测依赖，就可以访问`http://localhost:1337/documentation`查看文档了

[Automatic plugins discovery](https://docs.strapi.io/dev-docs/plugins/using-plugins#automatic-plugins-discovery)

::: warning
2024/11/11：无法自动生成自定义接口的 Swagger 文档（即 `api/<api-name>/routes.js`这类没有默认路由且没有 content-type 的）
:::
