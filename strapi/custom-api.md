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

## 完整的微信小程序登录

以上测试成功之后，将 route 的 method 改为 POST，更新 controller 的代码如下：

```javascript
const axios = require("axios");
const APP_ID = "";
const APP_SECRET = "";
function makeRandomPassword(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
module.exports = ({ strapi }) => ({
  async login(ctx) {
    const { code, userInfo } = ctx.request.body || {};
    if (!code) {
      return ctx.badRequest("缺少code");
    }
    const resData = await axios.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${code}&grant_type=authorization_code`
    );
    if (resData.status !== 200)
      return ctx.internalServerError("请求微信服务失败", {
        msg: resData.statusText,
      });
    const { errcode, errmsg, openid } = resData.data;
    if (errcode) return ctx.internalServerError(errmsg, resData.data);
    let user = await strapi
      .documents("plugin::users-permissions.user")
      .findFirst({
        filters: {
          openid: {
            $eq: openid,
          },
        },
      });
    if (!user) {
      const randomPass = makeRandomPassword(10);
      const hashPass = await strapi
        .service("admin::auth")
        .hashPassword(randomPass);
      user = await strapi.documents("plugin::users-permissions.user").create({
        // 通过admin面板，编辑User的Content Type，添加openid字段，右上角点击保存
        // 此时，生成src/extensions/users-permissions/content-types/user/schema.json
        // 编辑json文件，将非必要字段设置成非必填（因此这里创建时我们就不需要填那么多无用字段了）
        data: {
          password: hashPass,
          openid,
          confirmed: true,
          blocked: false,
        },
        status: "published",
      });
    }
    ctx.body = {
      token: strapi
        .service("plugin::users-permissions.jwt")
        .issue({ id: user.id }),
      user: strapi.service("admin::user").sanitizeUser(user),
    };
  },
});
```
