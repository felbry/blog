# 内容安全策略（CSP）

MDN 针对 CSP 的配置写的比较详细：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP#%E5%85%BC%E5%AE%B9%E6%80%A7%E5%A4%87%E6%B3%A8

目前遇到的一个场景：

http 的网站，通过 iframe 嵌套了 https 的网站，导致 https 网站请求接口失败，`failed to load response data:connection is closed, can not dispatch pending call to network.getresponseBody`。

解决方案就是在当前 http 网站添加 meta 头：`<meta http-equiv="Content-Security-Policy" content="frame-src 'self' https://example.com;">`
