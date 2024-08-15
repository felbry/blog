# Nginx

## 安装

Ubuntu 22 下安装：

```bash
sudo apt update && sudo apt upgrade
sudo apt install nginx
```

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
