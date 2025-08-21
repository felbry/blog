# 使用 1panel 申请/续签 HTTPS 证书

## 1. 创建 acme 账户

输入一个自己的邮箱

![](https://img.wangj.top/image.4g4ic0rpk8.webp)

## 2. 创建 DNS 账户

![](https://img.wangj.top/image.54xrw67rer.webp)

## 3. 申请证书

填好子域名，acme 和 DNS 账户都选好，就可以点击申请了

::: tip
默认勾选了“自动续签”功能
:::

![](https://img.wangj.top/image.5j47n1d8la.webp)

## 4. [可选]下载/保存证书

在 1panel - 证书面板，点“更多-下载”的话，会得到`fullchain.pem`（证书）和`privkey.pem`（私钥）两个文件

TODO 补充 pem 和 cert、key 的关系，如何相互转换

## 参考链接

- [使用 acme.sh 申请证书](https://zou8944.com/%E4%BD%BF%E7%94%A8%20acme.sh%20%E7%94%B3%E8%AF%B7%E8%AF%81%E4%B9%A6/)
