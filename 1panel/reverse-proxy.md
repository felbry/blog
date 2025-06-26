# 使用 1panel 创建 HTTPS 服务

::: info 前提

1. 已安装 OpenResty
2. 服务器安全组已开放 80 和 443 端口
3. 域名解析已添加 A 记录，**对应域名**指向该服务器 ip

:::

## 1. 创建网站

通过“反向代理”功能，将“域名”指向要代理的“本地服务”

![image](https://cdn.jsdmirror.com/gh/felbry/picx-images-hosting@master/image.7egsfq7b7o.webp)

## 2. 在网站设置中配置 https 证书

![image](https://cdn.jsdmirror.com/gh/felbry/picx-images-hosting@master/image.86tnxgs7mr.webp)

## 3. 验证

此时访问`https://<domain-name>`即导向第 1 步配置的代理地址
