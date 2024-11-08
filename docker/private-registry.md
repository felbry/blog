# Docker 配置私有仓库

::: tip
阿里云购买的 2 核 2GiB 的服务器，由于内存过小，构建比较大的镜像时机器就会卡死

可以通过在服务器配置私有仓库，本地打包再推送到私有仓库的形式

其实也可以本地打包镜像后，导出通过 rsync 等方式传到服务端，再由服务端的 docker daemon load 这个镜像文件。但这种方式没有推送 registry 快。如果镜像是 1g，每次都要推送 1g；而 registry 可以缓存 layer 提升后续的传输速度
:::

## 1. 安装启动 Docker Registry

略

## 2. 测试 registry 服务是否正常

访问`http://<ip>:<port>/v2/_catalog`，一般会得到如下响应：

```json
{
  "repositories": []
}
```

- `port`默认是`5000`
- 记得配置服务器的安全组开放该端口

## 3. 构建推送第一个镜像

构建 `docker build -t <ip>:<port>/<image-name>`，tag 的组成参见：[Docker 入门 - 给镜像打 Tag](./base#给镜像打-tag)

推送 `docker push <ip>:<port>/<image-name>`

此时访问`http://<ip>:<port>/v2/_catalog`，得到如下响应：

```json
{
  "repositories": ["<image-name>"]
}
```

::: tip

一开始推送，会报如下错误：

```bash
The push refers to repository [<ip>:<port>/<image-name>]
Get "https://<ip>:<port>/v2/": http: server gave HTTP response to HTTPS client
```

需要配置`daemon.json`，将私有仓库的地址追加进`insecure-registries`中（非 https 访问的可视为不安全的地址）

```json
"insecure-registries": [
  "<ip>:<port>"
]
```

:::

## 4. 服务端运行镜像

提前做两个步骤：

- 1panel - 容器 - 仓库，配置私有仓库地址（主要指定协议和用户名、密码，这样拉取时就不需要询问）
- 1panel - 容器 - 配置 - 私有仓库，它对应 `daemon.json` 中的 `insecure-registries`

任意位置创建`docker-compose.yaml`文件，`image`指定为`127.0.0.1:<port>/<image-name>`，然后执行`docker compose up`

## 5. 加入用户认证

按照[Deploy a registry server -> Native basic auth](https://distribution.github.io/distribution/about/deploying/#native-basic-auth)的前两条警示，要实现用户名和密码登录，必须先配置 TLS。因为不能以明文来传递这些数据

### 5.1 配置 TLS

根据[Deploy a registry server -> Get a certificate](https://distribution.github.io/distribution/about/deploying/#get-a-certificate)的描述，我们需要做两步：

1. 获得证书，即`.crt`文件和`.key`文件
2. 通过`docker run`运行容器，主要传递`REGISTRY_HTTP_TLS_CERTIFICATE`、`REGISTRY_HTTP_TLS_KEY`这俩变量

这里参考[使用 1panel 申请/续签 HTTPS 证书](../1panel/https)和[使用 1panel 创建 HTTPS 服务](../1panel/reverse-proxy)做一个 https 代理即可。没有必要从 registry 层面配置

### 5.2 配置用户名、密码

前置条件：当前处于 docker registry 的编排目录`/opt/1panel/apps/docker-registry/docker-registry`

![image](https://felbry.github.io/picx-images-hosting/image.5mntkyhexu.webp)

此时运行：

```bash
docker run \
  --entrypoint htpasswd \
  httpd:2 -Bbn testuser testpassword > auth/htpasswd
```

生成一个`auth`文件夹，其下有个`htpasswd`文件，文件中有一个：用户名：testuser、密码：testpassword 的账号

这里不用`docker run`运行，而是编排的形式。因此参考[Deploy your registry using a Compose file](https://distribution.github.io/distribution/about/deploying/#deploy-your-registry-using-a-compose-file)，对 registry 的 compose 文件增加如下内容：

```yaml
environment: # [!code ++]
  REGISTRY_AUTH: htpasswd # [!code ++]
  REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd # [!code ++]
  REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm # [!code ++]
volumes:
  - ./auth:/auth # [!code ++]
```

- 由于把`auth`目录创建在了和 compose 文件同级的目录下，所以 volume 的挂载路径就是`./auth`

重启 compose，此时访问`https://<domain-name>/v2/_catalog`就需要输入账号密码了

### 5.3 试试推送和拉取

直接运行`docker push <domain-name>/<image-name>`，会报`no basic auth credentials`的错误，此时只需要执行`docker login <domain-name>`，输入用户名、密码，即可登录成功。之后就能正常推送了

> 如果该 registry 服务是通过 openresty 或 nginx 代理的，推送的镜像某个 layer 过大会报：`413 Request Entity Too Large`的错误，此时需要在 openresty 或 nginx 的配置文件中增加一行：

```nginx
server {
  client_max_body_size 1024M; # [!code ++]
}
```

对于服务器内部想要拉取镜像，先通过`docker login 127.0.0.1:<port>`登录，或是直接在 1panel -> 容器 -> 仓库 来配置用户名、密码

### PS：不建议自签名证书方案

按照文档[Test an insecure registry - Use self-signed certificates](https://distribution.github.io/distribution/about/insecure/#use-self-signed-certificates)所述，你需要做：

1. 首先通过`openssl`生成一个自己的证书文件
2. 重新运行 registry，指向证书文件
3. 根据你的操作系统，配置 docker daemon 去信任该证书
4. [可选]使用身份认证时，某些 Docker 还要求信任操作系统级别的证书

与其这样麻烦，在有域名的前提下，不如申请证书走正规配置，能省去 3、4 以及后续步骤

## 附：[配置 registry](https://distribution.github.io/distribution/about/configuration/)

一种是部分配置，比如`REGISTRY_AUTH`、`REGISTRY_AUTH_HTPASSWD_PATH`

一种是全量覆盖配置

文档里都有详尽说明该如何配置

## 其它

也可以通过该方式实现镜像加速：https://www.wanpeng.life/2826.html
