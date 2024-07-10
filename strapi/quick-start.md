# 快速开始

::: tip
当前阶段是版本 5 的 rc 阶段，后续版本 5 正式发布后，这个`@label`会变
:::

`npx create-strapi@rc strapi5`

![image](https://felbry.github.io/picx-images-hosting/image.39l2arvpo5.webp)

全部选择完，安装完依赖，`cd strapi5`，运行`npm run develop`，即可看后台管理页面，此时就可以“创建表结构”和“添加数据”（可能会提供注册管理员的界面）

- 不需要使用 Strapi Cloud，所以 Skip
- 数据库要提前通过命令行创建好，以及不启用 SSL connection，否则连接数据库时就会报错
