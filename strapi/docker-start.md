# Docker 一个工程

## 初始工程目录

`npx create-strapi@latest`，根据提示操作，每个选项语义都很明确

## 开发环境

::: tip
下列文件中的高亮行，就是和生产环境的主要差异
:::

### dev.Dockerfile

```Dockerfile{16}
# 第一步 安装精简版node环境，因为是精简版环境，所以需要apk安装其它依赖，否则会报“错误一”
FROM node:20-alpine3.19
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git

# 第二步 安装node依赖
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm install
ENV PATH=/app/node_modules/.bin:$PATH

# 第三步 复制源代码，构建运行
COPY . .
RUN npm run build
EXPOSE 1337
CMD ["npm", "run", "develop"]
```

::: details 错误一

```bash
# > [strapi 5/7] RUN npm install:
# 23.13 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
# 23.18 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
# 75.06 npm error code 1
# 75.06 npm error path /app/node_modules/sharp
# 75.06 npm error command failed
# 75.06 npm error command sh -c (node install/libvips && node install/dll-copy && prebuild-install) || (node install/can-compile && node-gyp rebuild && node install/dll-copy)
# 75.06 npm error sharp: Downloading https://github.com/lovell/sharp-libvips/releases/download/v8.14.5/libvips-8.14.5-linux-x64.tar.br
# 75.06 npm error sharp: Please see https://sharp.pixelplumbing.com/install for required dependencies
# 75.06 npm error sharp: Installation error: aborted
```

:::

### dev.docker-compose.yaml

```yaml{3-5,19-22}
services:
  strapi:
    image: proj-name
    build:
      dockerfile: dev.Dockerfile
    restart: unless-stopped
    env_file: .env
    environment:
      DATABASE_CLIENT: ${DATABASE_CLIENT}
      DATABASE_HOST: strapiDB
      DATABASE_PORT: ${DATABASE_PORT}
      DATABASE_NAME: ${DATABASE_NAME}
      DATABASE_USERNAME: ${DATABASE_USERNAME}
      DATABASE_PASSWORD: ${DATABASE_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
      APP_KEYS: ${APP_KEYS}
    volumes:
      - ./config:/app/config
      - ./src:/app/src
      - ./package.json:/app/package.json
      - ./.env:/app/.env
      - strapi-object:/app/public/uploads
    ports:
      - '1337:1337'
    networks:
      - strapi
    depends_on:
      - strapiDB

  strapiDB:
    restart: unless-stopped
    env_file: .env
    image: mysql:8.4.3
    environment:
      MYSQL_USER: ${DATABASE_USERNAME}
      MYSQL_ROOT_PASSWORD: ${DATABASE_PASSWORD}
      MYSQL_PASSWORD: ${DATABASE_PASSWORD}
      MYSQL_DATABASE: ${DATABASE_NAME}
    volumes:
      - strapi-data:/var/lib/mysql
    ports:
      - '3306:3306'
    networks:
      - strapi

volumes:
  strapi-object:
  strapi-data:

networks:
  strapi:
    name: Strapi
    driver: bridge
```

## 生产环境

### prod.Dockerfile

将`npm run develop`变为`npm run start`

```Dockerfile
CMD ["npm", "run", "develop"] # [!code --]
CMD ["npm", "run", "start"] # [!code ++]
```

参考[Docker 配置私有仓库 - 构建推送第一个镜像](../docker/private-registry#_3-构建推送第一个镜像)，将镜像构建并发布到服务器的私有仓库

### prod.docker-compose.yaml

在服务器端新建文件夹（项目名），新增`docker-compose.yaml`和`.env`文件

`.env`就是将本地内容原样 copy

`docker-compose.yaml`一个是修改`image`（加上 registry 地址）、去掉`build`；一个是去掉部分`volumes`，因为生产不需要双向映射

```yaml
image: proj-name # [!code --]
image: localhost:<port>/proj-name # [!code ++]

build: # [!code --]
  dockerfile: dev.Dockerfile # [!code --]

- ./config:/app/config # [!code --]
- ./src:/app/src # [!code --]
- ./package.json:/app/package.json # [!code --]
- ./.env:/app/.env # [!code --]
```

最后执行：`docker compose up`即可
