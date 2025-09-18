# 用户权限

## 接口权限问题

1. 一张表某个字段是 Media，但只有这张表的`find`接口权限，`find`时`populate`了 Media 字段，也是可以成功的

推测：`'plugin::upload.content-api': ['destroy', 'find', 'findOne', 'upload']`相关权限只针对该接口调用，不在其它接口层面嵌套验证（这块权限应该不是控制后台媒体库的，因为 h5-admin 会频繁用到文件上传的接口(`upload`)）

## 表设计分析及如何初始化

> 基于 strapi 版本 5.23.0 分析

strapi 的角色/权限分两套，分别是**后台 Web 管理用户**和**系统用户**

![后台Web管理用户](https://img.wangj.top/image.1ovric5545.webp)

![系统用户](https://img.wangj.top/image.7axhw77b3e.webp)

这两类角色/权限在数据库中分别有自己的表，各自维护各自的。如果做一个系统，大概率是要从 系统用户 层面去管理角色/权限的，因此本文主要是分析 系统用户 层面的角色/权限设计，以及如何通过代码初始化固定的一些角色以及对应的权限（这样就不需要后台手动创建、勾选以及后续新增接口的再次勾选）

### “系统用户”的角色/权限设计

![](https://img.wangj.top/image.8hgt6398xt.webp)

我初始化了一个项目，建立了角色 1 和角色 2，观察上图的权限表：

- 红框是项目初始化自带的权限
- 绿框和蓝框是我在管理后台给两个角色勾选的权限

  重点在`api::series.series.create`，两个角色都勾选了它，但是创建了两条。由此可知：strapi 通过**固定字符串**来标识权限，当一个角色需要该权限时，先新建一条权限，再将这条权限关联到角色上，**而不是复用之前创建的权限**。

最终得到初始角色/权限的代码：

```javascript
const ROLE_MAP = [
  {
    name: '超级管理员',
    type: 'superadmin',
    description: '超级管理员角色',
    permissions: {
      'api::order.order': ['find', 'findOne', 'update'],
      'api::series.series': ['find', 'findOne', 'create', 'update'],
      'api::package.package': ['find', 'findOne', 'create', 'update'],
      'api::portfolio.portfolio': ['find', 'findOne', 'create', 'update', 'delete'],
    },
  },
  {
    name: '普通客户',
    type: 'customer',
    description: '普通客户角色',
    permissions: {
      'api::order.order': ['find', 'findOne'],
      'api::series.series': ['find', 'findOne'],
      'api::package.package': ['find', 'findOne'],
    },
  },
]
// 创建角色并分配权限
for (const roleConfig of ROLE_MAP) {
  // 检查角色是否已存在
  const findedSimpleRole = await strapi.documents('plugin::users-permissions.role').findFirst({
    filters: {
      type: roleConfig.type,
    },
  })
  // 要么已存在，要么新创建，最终拿到documentId
  const roleDocId = findedSimpleRole
    ? findedSimpleRole.documentId
    : (
        await strapi.documents('plugin::users-permissions.role').create({
          data: {
            name: roleConfig.name,
            type: roleConfig.type,
            description: roleConfig.description,
          },
        })
      ).documentId
  const findedEndRole = await strapi.documents('plugin::users-permissions.role').findOne({
    documentId: roleDocId,
    populate: {
      permissions: true,
    },
  })
  const permissionDocIds = []
  for (const [controller, actions] of Object.entries(roleConfig.permissions)) {
    for (const action of actions) {
      // 找到对应的权限
      const permission = findedEndRole.permissions.find(
        (p) =>
          // p格式
          // {
          //   "id": 1,
          //   "documentId": "bnlfd7fvb7bkk1i8svxdoclj",
          //   "action": "api::global.global.find",
          //   "createdAt": "2025-01-07T06:26:15.179Z",
          //   "updatedAt": "2025-01-07T06:26:15.179Z",
          //   "publishedAt": "2025-01-07T06:26:15.179Z",
          //   "locale": null
          //
          p.action === `${controller}.${action}`
      )
      if (permission) {
        permissionDocIds.push(permission.documentId)
      } else {
        permissionDocIds.push(
          (
            await strapi.documents('plugin::users-permissions.permission').create({
              data: {
                action: `${controller}.${action}`,
              },
            })
          ).documentId
        )
      }
    }
  }
  await strapi.documents('plugin::users-permissions.role').update({
    documentId: roleDocId,
    data: {
      permissions: permissionDocIds,
    },
  })
}
```
