# Nginx

## 安装

[环境安装 - Nginx](./env-install#nginx)

## 常用命令

```bash
# 查看状态（一般安装完成能自动启动）
systemctl status nginx
# 手动启动
systemctl start nginx
# 重启
systemctl restart nginx
# 测试配置文件是否正确（这个方法也能输出 配置文件的存储路径）
nginx -t
# 编辑配置文件
vim /etc/nginx/nginx.conf
```

## 配置文件解析

一般在 http 下配置，一个 server 就是一个服务（每个服务 listen 一个端口）。下边展示两个静态服务：

```nginx
{
  ...
	http {
  	...
  	server {
      listen       1110;
      index        index.html;
      root         /path/to/project-a;
    }

  	server {
      listen       1111;
      index        index.html;
      root         /path/to/project-b;
    }
  }
}
```

### 单页应用（如 Vue）

按照上述配置：假如向服务器请求 ip:1111，能够访问到 ip:1111/path/to/project-b/index.html。此时在页面点击按钮跳转到 ip:1111/login，可以访问登录页（单页应用的路由动态渲染页面）。紧接着刷新页面，就会向服务器请求 ip:1111/login，因为该静态服务下并没有 login 相关的静态文件，就会报 404 的错误。

按照[Vue Router History Mode - nginx 配置](https://router.vuejs.org/zh/guide/essentials/history-mode.html#nginx)，增加配置如下：

```nginx
server {
  listen       1111;
  index        index.html;
  root         /path/to/project-b;
  location / { # [!code ++]
    try_files $uri $uri/ /index.html; # [!code ++]
  } # [!code ++]
}
```

此时访问 ip:1111/login 找不到文件，就会尝试找 ip:1111/login/，这里找不到就访问根目录下的 /index.html 文件，当返回 index.html 文件之后，Vue Router 也在前端初始化完成，检测到页面 url 是 ip:1111/login 就会动态渲染登录页了。

### 根据域名转发到对应端口

先在域名解析处配置好 A 记录，将域名指向服务器 ip 地址。

随后 Nginx 监听 80 端口，根据域名转发至本地对应端口服务。

```nginx
server {
  listen 80;
  server_name www.example.com example.com;
  location / {
    proxy_pass http://localhost:3000;
  }
}
```

::: details 不推荐阿里云的“隐性 URL”
根据域名转发到服务器的对应端口可以从“域名解析”处配置实现，

![image](https://cdn.jsdmirror.com/gh/felbry/picx-images-hosting@master/image.64ds4lt9qo.webp)

如图所示：先配置一条 A 记录，访问`http://school.example.com`能解析到指定 ip；然后再配置一条隐性 URL，实现访问`http://imgs.example.com`实际转发为：`http://school.example.com:<端口号>`的效果。

这种效果能满足一些简单场景，但如图片这类静态服务，会导致 Content-Type 头出现问题，如图所示：

![image](https://cdn.jsdmirror.com/gh/felbry/picx-images-hosting@master/image.7w6qzi9evd.webp)

最终效果就是：

通过浏览器地址栏直接访问地址，会先看到访问配置的隐性 URL（响应头有问题），再访问实际的 URL（响应头没问题）

通过 js 访问地址，会连续两次访问隐性 URL（响应头有问题）

这可能是阿里云刻意的策略，很早之前验证的结果，后续再遇此类场景可通过动图表现下。
:::
