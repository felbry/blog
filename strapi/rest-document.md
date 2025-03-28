# REST/Document 操作

## 默认查询是否有分页？

比如：实体的`get`请求、`document`的`findMany`

### REST

**默认是分页的**

`get`请求返回一个`{ data: [], meta: { pagination: { page, pageCount, pageSize, total } } }`结构的列表数据。默认`page`为`1`，`pageSize`为`25`

### Document

**默认是不分页的**

`findMany`默认返回一个`[]`结构的（全部）列表数据，如果要分页，有以下几种情况：

::: tip
`start`和`limit`都是顶级属性，~~pagination~~是 REST 接口层面使用的
:::

- 只传`start`：返回从`start`值开始的（全部）数据，返回数据结构为`[]`
- `start`和`limit`结合：传统的分页，返回数据结构为`[]`

## 查关系字段

比如要查一本书，它的分类是 IT

```javascript
...
filters: {
  category: {
    documentId: {
      $eq: IT_CATEGORY_ID,
    },
  },
}
...
```

虽然`category`是个关系字段，仍然可以像查普通字段一样操作，比如不用`id`查而是`name`：

```javascript
...
filters: {
  category: {
    name: {
      $eq: IT_CATEGORY_NAME,
    },
  },
}
...
```
