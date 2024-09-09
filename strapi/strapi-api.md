# strapi.xxx

```javascript
strapi.contentType("api::test.test");
strapi.contentType("plugin::users-permissions.user");

strapi.controller("api::api-name.controller-name");
strapi.controller("plugin::plugin-name.controller-name");

// 列出所有可用服务
// npx strapi services:list
// access an API service
strapi.service("api::apiName.serviceName").FunctionName();
// access a plugin service
strapi.service("plugin::pluginName.serviceName").FunctionName();
// 以上等同于
strapi.plugin("pluginName").service("serviceName").FunctionName();

// documents api
strapi.documents("plugin::users-permissions.user").findOne();
// query api
strapi.db.query("plugin::my-plugin.my-plugin-content-type").findMany();
```

## 已知的内置 service 方法

未找到整体的文档，只能翻 node_modules 中或 github 上的源码，或是 console 打印出来

```javascript
// admin::auth
// 将密码hash化
console.log(strapi.service("admin::auth"));
strapi.service("admin::auth").hashPassword(pass);

// admin::user
// 序列化？
strapi.service("admin::user").sanitizeUser(newUser);

// plugin::users-permissions.jwt
// 签发token
strapi.service("plugin::users-permissions.jwt").issue({ id: newUser.id });
```