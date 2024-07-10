# 自定义接口

一个接口大致由 route -> controller -> service（可选）组成，自定义 route、controller、service 可以参照创建实体时自动生成的文件结构来。

本例以开发微信小程序相关自定义接口为例，集合名就叫`miniprogram`。因此首先创建一个`src/api/miniprogram`文件夹。

::: code-group

```js [src/api/miniprogram/routes/miniprogram.js]
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/wx-login",
      handler: "miniprogram.login",
      config: {
        auth: false,
      },
    },
  ],
};
```

```js [src/api/miniprogram/controllers/miniprogram.js]
// 这里可以直接返回一个对象字面量
// 但是更推荐返回一个函数，函数返回值是对象字面量。因为这样可以访问到strapi这个对象
module.exports = ({ strapi }) => ({
  async login(ctx) {
    ctx.body = "hello world";
  },
});
```

:::

以上文件配置好，访问`http://localhost:1337/api/wx-login`即可看到 hello world。
