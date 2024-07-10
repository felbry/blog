# 抛错

## REST 响应错误数据结构

```javascript
{
  "data": null,
  "error": {
    "status": "", // HTTP 状态码
    "name": "", // Strapi 错误名称 ('ApplicationError' or 'ValidationError')
    "message": "", // 错误信息
    "details": {
      // 错误详情对象
    }
  }
}
```

## 抛错的几种场景

### 控制器和中间件

在控制器和中间件中，可以直接通过`ctx`调用[http-errors function](https://github.com/jshttp/http-errors#list-of-all-constructors)，方法名采用小驼峰式写法。

```javascript
// 参数1对应 message
// 参数2对应 details
ctx.badRequest("name is missing", { foo: "bar" });
```

### 服务和模型生命周期

一旦在比控制器或中间件更深的层工作，可以通过`throw Error()`的形式抛错

strapi 提供了一批错误类，通过`const { errors } = require('@strapi/utils')`引入，具体有哪些和如何传参，参考下方：

```javascript
const { errors } = require("@strapi/utils");
const {
  ApplicationError,
  PaginationError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  NotImplementedError,
  PayloadTooLargeError,
  PolicyError,
} = errors;

throw new ApplicationError("Something went wrong", { foo: "bar" });
throw new PaginationError("Exceeded maximum pageSize limit");
throw new NotFoundError("These are not the droids you are looking for");
throw new ForbiddenError("Ah ah ah, you didn't say the magic word");
throw new UnauthorizedError("You shall not pass!");
throw new NotImplementedError("This isn't implemented", {
  feature: "test",
  implemented: false,
});
throw new PayloadTooLargeError("Uh oh, the file too big!");

// PolicyError推荐用在策略里，且details中以policy声明策略名称
throw new PolicyError("Something went wrong", { policy: "my-policy-name" });
```

### 总结

能访问到`ctx`的，直接调用**http-errors function**，常用的如：`badRequest`

剩下的，除了策略内部使用`PolicyError`，其它简单粗暴用`ApplicationError`。
