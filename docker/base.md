# Docker 入门

## [编写 Dockerfile](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/)

[指令参考](https://docs.docker.com/reference/dockerfile/)

- `FROM <IMAGE_NAME>` 指定基础镜像，必须位于第一行，后面可以跟一个可选的镜像标签
- `WORKDIR <PATH>` 设置工作目录。（我觉得可以理解为`cd`）
- [`COPY <HOST_PATH> <IMAGE_PATH>` `COPY <src1> <src2> <src...> <dest>`](https://docs.docker.com/reference/dockerfile/#copy) 复制文件或目录到镜像，支持相对路径和绝对路径。
- `RUN <COMMAND>` 运行一条命令
- `ENV <NAME> <VALUE>` 设置环境变量（适用于正在运行的容器）
- `EXPOSE <PORT>` 暴露端口，让外部可以访问
- `USER <USER-OR-UID>` 为后续指令设置用户
- `CMD ["<command>", "<arg1>"]` 设置基于此镜像的容器运行时自动执行的命令。示例：`CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]`

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

## 构建镜像

### 给镜像打 Tag

完整的 tag 格式是：`[HOST[:PORT_NUMBER]/]PATH[:TAG]`

`HOST`和`PORT_NUMBER`表示 register 地址，可以省略，默认是`docker.io`

`PATH`由`[NAMESPACE/]REPOSITORY`组成，通常`NAMESPACE`就是自己 Docker 的用户名或组织名，如果不指定，默认是`library`(Docker 官方镜像命名空间)

`TAG`随便自定义，默认是`latest`

示例：

- `nginx` 等于`docker.io/library/nginx:latest`
- `docker/welcome-to-docker` 等于`docker.io/docker/welcome-to-docker:latest`
- `ghcr.io/dockersamples/visualizer:pr-311` 这是一个完整 tag，每个部分都包含

构建期间打 tag：`docker build -t my-username/my-image .`，**使用`-t`或`--tag`**

构建后添加额外 tag：`docker image tag my-username/my-image another-username/another-image:v1`，**使用`docker image tag ..`**

### 构建缓存

要想合理利用缓存，要知道哪些情况会让缓存失效：

- `RUN`指令的任何更改
- `COPY`或`ADD`指令对应文件的任何更改（无论是内容还是权限更改）
- 一层失效，后续（可能是依赖？）层也失效

以以下 Dockerfile 为例

```Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
EXPOSE 3000
CMD ["node", "./src/index.js"]
```

根据以上指令，只要每次源文件更改，`yarn install`都会重新执行，浪费时间

更新后的 Dockerfile

```Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
```

先复制依赖文件，执行依赖安装，再进行所有源文件拷贝。只要`package.json`和`yarn.lock`没变化，就不会重复依赖安装

从构建日志中，通过`CACHED`关键字可以了解到哪些步骤缓存了

```bash
# 初次构建
=> [1/5] FROM docker.io/library/node:21-alpine                                                    0.0s
=> CACHED [2/5] WORKDIR /app                                                                      0.0s
=> [3/5] COPY package.json yarn.lock ./                                                           0.2s
=> [4/5] RUN yarn install --production                                                           14.0s
=> [5/5] COPY . .

# 二次构建（使用缓存）
=> [1/5] FROM docker.io/library/node:21-alpine                                                    0.0s
=> CACHED [2/5] WORKDIR /app                                                                      0.0s
=> CACHED [3/5] COPY package.json yarn.lock ./                                                    0.0s
=> CACHED [4/5] RUN yarn install --production                                                     0.0s
=> [5/5] COPY . .
```

### 构建并推送第一个镜像

先在[Docker Hub](https://hub.docker.com/)创建一个仓库，仓库名为 getting-started-todo-app

在项目根目录先构建：`docker build -t <DOCKER_USERNAME>/getting-started-todo-app .`

然后运行`docker image ls`查看本地镜像是否构建成功

最后推送到远程：`docker push <DOCKER_USERNAME>/getting-started-todo-app`

### 多阶段构建

如果不指定`--target`，Docker 默认构建最后一个阶段（即下面示例的`final`）为输出镜像

因此可以在之前的阶段做构建，最后阶段仅包含运行时所需文件

```Dockerfile
FROM eclipse-temurin:21.0.2_13-jdk-jammy AS builder
WORKDIR /opt/app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
COPY ./src ./src
RUN ./mvnw clean install

FROM eclipse-temurin:21.0.2_13-jre-jammy AS final
WORKDIR /opt/app
EXPOSE 8080
COPY --from=builder /opt/app/target/*.jar /opt/app/*.jar
ENTRYPOINT ["java", "-jar", "/opt/app/*.jar"]
```

要点：

1. `AS` 给阶段命名，方便后续引用
2. `COPY --from=builder` 从 builder 阶段拷贝文件

## 运行容器

### 发布和公开端口

容器运行时，通过`docker run -d -p HOST_PORT:CONTAINER_PORT nginx`将主机端口与容器端口做映射

比如`docker run -d -p 8080:80 nginx`，那访问主机`http://localhost:8080`就会转发到容器的`80`端口上

如果主机的 8080 此时被占用 或 随便哪个主机端口都行，可以省略`HOST_PORT:`，即：`docker run -p 80 nginx`

此时运行`docker ps`，就能看到实际映射的主机端口为`54772`

```bash
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS          PORTS                    NAMES
a527355c9c53   nginx         "/docker-entrypoint.â¦"   4 seconds ago    Up 3 seconds    0.0.0.0:54772->80/tcp    romantic_williamson
```

Dockerfile 中的`EXPOSE`指定应用程序运行将使用的（容器）端口。可以通过`-P`或`--publish-all`将所有指定(公开)端口发布到随机(临时)端口上。比如先`docker run -P nginx`，然后`docker ps`看看发布到了哪个端口上

### 覆盖容器默认值

通过`docker run`传参的形式覆盖默认值

- 覆盖网络端口

  `docker run -d -p HOST_PORT:CONTAINER_PORT postgres`

- 设置环境变量

  `docker run -e foo=bar postgres env`，在容器内设置一个 foo 的环境变量，其值为 bar

  如果变量多，可以用`.env`文件，`docker run --env-file .env postgres env`

- 限制容器消耗资源

  使用`--memory`和`--cpus`，`docker run -e POSTGRES_PASSWORD=secret --memory="512m" --cpus="0.5" postgres`

通过`compose.yaml`覆盖默认值

- CMD 或 ENTRYPOINT

```yaml
services:
  postgres:
    image: postgres
    entrypoint: ['docker-entrypoint.sh', 'postgres']
    command: ['-h', 'localhost', '-p', '5432']
```

### 控制网络

默认情况，所有容器运行时会自动连接到一个桥接网络，它允许同一主机上的容器相互通信，同时也与外界和其它主机隔离

如果想某个容器与该主机上的其它容器网络隔离，可以自定义网络

先创建个网络：`docker network create mynetwork`，查看所有网络：`docker network ls`，

连接自定义网络：`docker run -d -e POSTGRES_PASSWORD=secret -p 5434:5432 --network mynetwork postgres`

查看是否连接成功：`docker network inspect`

默认网桥与自定义网络主要区别在**DNS 解析方式**：连接到默认网桥所有容器只能通过 IP 地址通信（除非用`--link`，但这个选项过时了）；自定义网络上的容器通过名称或别名解析。只有附加到自定义网络上的容器才能相互通信

### 持久化容器数据 volume

`docker run -d -p 80:80 -v log-data:/logs docker/welcome-to-docker`

容器写入`/logs`的内容会持久存储在`log-data`（如果不存在，会自动创建）这个 volume 里

删除容器，并使用该 volume 启动新容器，文件仍可用

可将同一 volume 附加到多个容器以在它们之间共享文件（日志聚合、数据管道或其它事件驱动等场景）

### 与容器共享本地文件

主机与容器之间保存和共享文件有两种形式，一是 volume，二是 bind mounts

如果想**持久存储**容器内生成或修改的数据（即使容器停止或删除），选择 volume。最典型的就是数据库

如果想主机和容器之间**实时文件访问**，选择 bind mounts。比如配置文件，实时构建产物（热更新）

与`-v`相比，`--mount`提供更高级功能和粒度控制

`docker run --mount type=bind,source=/HOST/PATH,target=/CONTAINER/PATH,readonly nginx`

`docker run --mount type=volume,src=/HOST/PATH,target=/CONTAINER/PATH nginx`

`docker run -v HOST-DIRECTORY:/CONTAINER-DIRECTORY:rw nginx`，`:rw`是读写，`:ro`是只读，可以与`-v`和`--mount`一起使用

仅与容器共享需要的目录。文件共享会带来开销，因为主机上文件的任何更改都需要通知 Linux VM。共享太多文件可能会导致 CPU 负载过高和文件系统性能下降

对于缓存目录或数据库等非代码项，使用 data volume，性能会好得多

## 问题

1. `Error response from daemon: Get "https://registry-1.docker.io/v2/"`

外网的 docker hub 访问不通，通过配置 daemon 代理访问。

- 方式 1：（推荐）

  ![image](https://felbry.github.io/picx-images-hosting/image.3yeg55fyks.webp)

- 方式 2：参考[daemon configuration file](https://docs.docker.com/reference/cli/dockerd/#daemon-configuration-file)、[http/https proxy](https://docs.docker.com/engine/daemon/proxy/#httphttps-proxy)

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

相关 issue：

- [Docker Desktop proxy not being recognized when doing a build. #1979](https://github.com/docker/buildx/issues/1979)
- [add system proxy config support for cli requests](https://github.com/docker/buildx/pull/1487)

大概意思是 build 过程会在 CLI 中直接访问`*.docker.io`的资源，如果仅仅是 daemon 设置了代理，而终端没有设置代理，就请求不通

临时解决方法就是在终端中设置 HTTP_PROXY 和 HTTPS_PROXY(不区分大小写)，设置完后再 build
