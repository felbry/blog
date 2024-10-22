# Docker 入门

## 常用命令

- `docker run <IMAGE_NAME>` 基于指定镜像创建运行一个容器
- `docker ps` 查看正在运行的容器。`-a` 包含停止的容器
- `docker stop <the-container-id>` 停止运行容器。`the-container-id`可以截取部分，保证唯一性即可。比如`a1f7a4bb3a27`简写为`a1f`
- `docker image ls` 查看本地（已下载/已构建）镜像。简写`docker images`
- `docker image history <IMAGE_NAME>` 查看该镜像每一 layer 信息
- `docker tag <DOCKER_USERNAME>/demo <DOCKER_USERNAME>/demo:1.0`
- `docker push <DOCKER_USERNAME>/demo:1.0`

## 架构和相关概念

采用 C/S 架构

![](https://docs.docker.com/get-started/images/docker-architecture.webp)

### 服务端 `dockerd`

Docker daemon，守护进程，一方面接收客户端的 API 请求，一方面管理 Docker 对象(images、containers、networks、volumes)

### 客户端 `docker`

`docker run`等命令都是由客户端发起的，客户端通过 API 调用服务端，由`dockerd`执行

客户端可以与多个服务端（守护进程）通信

### Docker Desktop

包含了`dockerd`、`docker`、Docker Compose、Docker Content Trust、Kubernetes...

### Docker Registries

负责存储 Docker 镜像。Docker Hub 类比 `npmjs.com`，同理 registry 也可以配置为私有的

### Docker Compose

用于运行管理多个容器。

虽然可以通过`docker run`启动多个容器，但是马上就会遇到网络管理、连接网络以及清理工作等许多麻烦的事。使用 Docker Compose 这种声明式工具，只需要定义`compose.yml`文件，在其中定义所有容器及其配置即可

### Docker Objects

images、containers、networks、volumes、plugins 都可以叫 Docker objects

### images 镜像

镜像是用来 创建 container 的**只读**模板（包含运行容器所需的文件、库和配置）

通常一个镜像会基于其它镜像，并进行一些自定义。比如可以构建一个基于`ubuntu`镜像，并安装`Apache web server`和其它`application`，再附带`application`运行所需的详细配置的镜像

创建一个镜像：创建一个 Dockerfile，定义创建并运行它所需的步骤。（每条指令都会创建一个 layer，更改并重建镜像时，也只会重建已更改的 layer）

::: info [两大原则](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/#explanation)

1. 镜像不可变。镜像一旦创建就无法修改，只能**创建一个新镜像**或**在其之上添加更改**

2. 每个镜像由 layers 组成。每个 layer 代表一组添加、删除或修改文件的文件系统更改

:::

[了解 layer](https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/)：

- 先通过一个示例，解释“每个 layer 代表一组添加、删除或修改文件的文件系统更改”：

  创建一个镜像从零开始考虑：假设当前是一个纯净的 ubuntu 系统，什么东西都没有，极端点想，该磁盘只有一个空空的根目录：`/`，要让程序代码运行，需要配置若干环境

  - 第 1 layer，先添加基本命令和包管理工具（比如 apt）
  - 第 2 layer，安装 Python 运行时和 pip
  - 第 3 layer，复制应用程序运行所需的必要文件（比如 requirements.txt）
  - 第 4 layer，通过 pip 安装应用程序的依赖
  - 第 5 layer，复制应用程序源码

  ![](https://docs.docker.com/get-started/docker-concepts/building-images/images/container_image_layers.webp)

  每组文件系统更改都抽象成 layer，便可以跨镜像复用。

  ![](https://docs.docker.com/get-started/docker-concepts/building-images/images/container_image_layer_reuse.webp)

  这样`Debian base`和`Python and pip`layer 就可以被多个镜像引用了，而不用构建多个

- 堆叠 layers

  1. 每个 layer 下载后，被提取到主机文件系统上对应的目录里
  2. 每从镜像运行一个新容器时，会创建一个独立的、全新的**联合文件系统(union filesystem)**。该镜像的每个 layer 就基于这个 union filesystem 逐个操作
  3. 容器启动时，使用`chroot`将其环境根目录设置为 union filesystem 的位置

  PS：文档中提到 当创建 union filesystem 时，除了镜像 layers，还会创建一个目录为正在运行的容器服务。允许容器进行文件系统更改，同时也能保证原始图像层保持不变。（这和我上边理解的好像有些差异，我理解的是这个目录等于 union filesystem，后续结合实践再看看）

- 追加 layer 实操

  先基于 ubuntu 镜像创建一个名为 base-container 的容器，`docker run --name=base-container -ti ubuntu`

  在容器中安装 Node.js `apt update && apt install -y nodejs` （文件更改发生在该容器的 union filesystem 中）

  将 base-container 容器 构建为新镜像 node-base `docker container commit -m "Add node" base-container node-base`

  [可选] 此时查看镜像 node-base 的历史，就会看到刚追加进的 layer

  再基于 node-base 镜像创建一个名为 app-container 的容器，`docker run --name=app-container -ti node-base`

  在容器中创建一个 app.js 文件 `echo 'console.log("Hello from an app")' > app.js`（文件更改发生在该容器的 union filesystem 中）

  将 app-container 容器构建为新镜像 sample-app `docker container commit -c "CMD node app.js" -m "Add app" app-container sample-app`

  [可选] 此时查看镜像 sample-app 的历史，就会看到刚追加进的 layer

[编写 Dockerfile](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/)

[指令参考](https://docs.docker.com/reference/dockerfile/)

- `FROM <IMAGE_NAME>` 指定基础镜像，必须位于第一行，后面可以跟一个可选的镜像标签
- `WORKDIR <PATH>` 设置工作目录。（我觉得可以理解为`cd`）
- `COPY <HOST_PATH> <IMAGE_PATH>` 复制文件或目录到镜像，支持相对路径和绝对路径。
- `RUN <COMMAND>` 运行一条命令
- `ENV <NAME> <VALUE>` 设置环境变量（适用于正在运行的容器）
- `EXPOSE <PORT>` 暴露端口，让外部可以访问
- `USER <USER-OR-UID>` 为后续指令设置用户
- `CMD ["<command>", "<arg1>"]` 设置基于此镜像的容器运行时自动执行的命令。示例：`CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]`

### containers 容器

容器是镜像的可运行实例

可以创建、启动/停止、移动或删除容器

可以将容器连接到一个或多个网络，为其附加存储

甚至可以根据容器当前状态创建一个新镜像

**隔离性**：容器与其它容器、操作系统都有相对较好的隔离。当然也可以手动控制容器的网络、存储、与主机关系的隔离程度

容器的配置选项取决于创建和启动它时对应的镜像，如果**删除容器，任何未存储在持久存储中的状态更改都会消失**

## 使用容器进行开发

克隆 Demo 工程：`git clone https://github.com/docker/getting-started-todo-app`

在工程目录下执行`docker compose watch`，访问 `http://localhost`

之后无论是修改前端还是后端代码，网站都是实时更新

::: info 总结
容器化环境提供了统一的开发环境，每个人无需安装 Node、MySQL 或其它依赖项。
:::

## 构建并推送第一个镜像

先在[Docker Hub](https://hub.docker.com/)创建一个仓库，仓库名为 getting-started-todo-app

在项目根目录先构建：`docker build -t <DOCKER_USERNAME>/getting-started-todo-app .`

然后运行`docker image ls`查看本地镜像是否构建成功

最后推送到远程：`docker push <DOCKER_USERNAME>/getting-started-todo-app`

## 问题

1. `Error response from daemon: Get "https://registry-1.docker.io/v2/"`

外网的 docker hub 访问不通，通过配置 daemon 代理访问。参考[daemon configuration file](https://docs.docker.com/reference/cli/dockerd/#daemon-configuration-file)、[http/https proxy](https://docs.docker.com/engine/daemon/proxy/#httphttps-proxy)

mac 版配置如图：（参考[请问大佬， MacOS 下如何设置 docker 使用本地代理？ - v2ex](https://s.v2ex.com/t/1056546#r_14982082)）

![image](https://felbry.github.io/picx-images-hosting/image.9rje8kv6hg.webp)

2. `ERROR [client internal] load metadata for docker.io/library/node:20`

在按照官网教程操作[使用容器进行开发](#使用容器进行开发)时，报了这个错误，完整情况如下：

```bash
-> % docker compose watch
[+] Building 31.2s (4/4) FINISHED                                         docker:desktop-linux
 => [backend internal] load build definition from Dockerfile                              0.0s
 => => transferring dockerfile: 3.30kB                                                    0.0s
 => [client internal] load build definition from Dockerfile                               0.0s
 => => transferring dockerfile: 3.30kB                                                    0.0s
 => ERROR [client internal] load metadata for docker.io/library/node:20                  31.1s
 => [backend auth] library/node:pull token for registry-1.docker.io                       0.0s
------
 > [client internal] load metadata for docker.io/library/node:20:
------
failed to solve: DeadlineExceeded: DeadlineExceeded: DeadlineExceeded: node:20: failed to resolve source metadata for docker.io/library/node:20: failed to authorize: DeadlineExceeded: failed to fetch oauth token: Post "https://auth.docker.io/token": dial tcp 108.160.172.204:443: i/o timeout
```

该问题尚未解决，后续学到更多知识再分析
