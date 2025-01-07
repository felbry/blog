# 创建/自定义接口

一个接口大致由 route -> controller -> service（可选）组成

当在后台创建一个**实体**时，假设实体叫`children`，会自动生成下列文件：

```bash
children
├── content-types
│   └── children
│       └── schema.json
├── controllers
│   └── children.js
├── routes
│   └── children.js
└── services
    └── children.js
```

这组文件提供了对实体基本的 5 个操作：`find`，`findOne`，`create`，`update`，`delete`，

接下来针对`routes`，`controllers`，`services`分别介绍如何自定义和扩展

## routes

`children/routes/children.js`的默认内容如下：

```javascript
const { createCoreRouter } = require('@strapi/strapi').factories

module.exports = createCoreRouter('api::children.children')
```

### 配置默认路由

向`createCoreRouter`传第二个`option`参数，[Configuring core routers](https://docs.strapi.io/dev-docs/backend-customization/routes#configuring-core-routers)

- prefix 路由前缀
- only 只加载指定的方法，如：`only: ['find']`
- except 排除指定的方法
- config 路由配置项，包括策略、中间件、公共可用性的配置。比如：`config: { find: { auth: false, policies: [] }, findOne: {} }`

### 完全自定义路由

`children/routes/`下可以存在 N 个 js 文件，同名的为默认路由（创建**实体**就能自动生成），还可以创建其它 js 文件自定义，自定义文件如下：

::: tip
js 文件名也有讲究，一般`01-`开头。这是因为 strapi 会**按字母表顺序**加载`routes/`文件夹下的所有 js 文件，为了保证自定义路由的优先级，建议数字开头
:::

```javascript
module.exports = {
  routes: [
    {
      method: '',
      path: '',
      handler: '<controller-filename>.<method>',
      config: {},
    },
  ],
}
```

## controllers

`children/controllers/children.js`的默认内容如下：

```javascript
const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::children.children')
```

### 增加/覆盖 controller 方法

```javascript
const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::children.children', ({ strapi }) => {
  async method1(ctx) {
    await this.validateQuery(ctx)
    const sanitizedQueryParams = await this.sanitizeQuery(ctx)
    const { results, pagination } = await strapi.service('api::children.children').find(sanitizedQueryParams)
    const sanitizedResults = await this.sanitizeOutput(results, ctx)
  },
  // 和默认controller同名的，会覆盖
  async create(ctx) {
    // 如果要覆盖默认的，建议通过super直接调用，再加额外的逻辑
    const { data, meta } = await super.find(ctx)
  }
})
```

也可以创建一个新的 js 文件，写自定义 controller，就和[完全自定义路由](#完全自定义路由)一样：

```javascript
module.exports = ({ strapi }) => ({
  async method1(ctx) {},
})
```

## services

`children/services/children.js`的默认内容如下：

```javascript
const { createCoreService } = require('@strapi/strapi').factories

module.exports = createCoreService('api::children.children')
```

### 增加/覆盖 services 方法

和 controller 如出一辙

## final

本例以开发微信小程序相关自定义接口为例，集合名就叫`miniprogram`。因此首先创建一个`src/api/miniprogram`文件夹。

::: code-group

```js [src/api/miniprogram/routes/miniprogram.js]
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/wx-login',
      handler: 'miniprogram.login',
      config: {
        auth: false,
      },
    },
  ],
}
```

```js [src/api/miniprogram/controllers/miniprogram.js]
// 这里可以直接返回一个对象字面量
// 但是更推荐返回一个函数，函数返回值是对象字面量。因为这样可以访问到strapi这个对象
module.exports = ({ strapi }) => ({
  async login(ctx) {
    ctx.body = 'hello world'
  },
})
```

:::

以上文件配置好，访问`http://localhost:1337/api/wx-login`即可看到 hello world。

## 完整的微信小程序登录

以上测试成功之后，将 route 的 method 改为 POST，更新 controller 的代码如下：

```javascript
const axios = require('axios')
const APP_ID = ''
const APP_SECRET = ''
module.exports = ({ strapi }) => ({
  async login(ctx) {
    const { code, userInfo } = ctx.request.body || {}
    if (!code) {
      return ctx.badRequest('缺少code')
    }
    const resData = await axios.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${code}&grant_type=authorization_code`
    )
    if (resData.status !== 200)
      return ctx.internalServerError('请求微信服务失败', {
        msg: resData.statusText,
      })
    const { errcode, errmsg, openid } = resData.data
    if (errcode) return ctx.internalServerError(errmsg, resData.data)
    let user = await strapi.documents('plugin::users-permissions.user').findFirst({
      filters: {
        openid: {
          $eq: openid,
        },
      },
    })
    if (!user) {
      user = await strapi.documents('plugin::users-permissions.user').create({
        // 通过admin面板，编辑User的Content Type，添加openid字段，右上角点击保存
        // 此时，生成src/extensions/users-permissions/content-types/user/schema.json
        // 由于是面向微信用户的程序，编辑json文件
        // 1. 将username、email字段的required设置成false（不能删除，删除默认就是true）
        // 2. 暂不需要邮箱确认，confirmed默认值改为true
        // 这样创建时我们就不需要填那么多无用字段了
        // 该方式仅限于直接调create方法，在管理后台创建用户依然会对username和email做校验
        data: {
          openid,
        },
        status: 'published',
      })
    }
    ctx.body = {
      token: strapi.service('plugin::users-permissions.jwt').issue({ id: user.id }),
      user: strapi.service('admin::user').sanitizeUser(user),
    }
  },
})
```
