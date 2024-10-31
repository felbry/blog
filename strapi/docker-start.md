# Docker 一个工程

## 初始工程目录

`npx create-strapi@latest`，根据提示操作，每个选项语义都很明确

## 开发环境

### dev.Dockerfile

```Dockerfile
FROM node:20

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
ENV PATH=/app/node_modules/.bin:$PATH

COPY . .
EXPOSE 1337
CMD ["npm", "run", "develop"]
```

- 安装 node 和依赖
- 复制项目工程
- 定义启动命令和端口

### dev.docker-compose.yaml

```yaml
services:
  strapi:
    # 每次启动，基于最新源码构建镜像
    build:
      context: .
      dockerfile: dev.Dockerfile
    restart: unless-stopped
    # 从.env文件提取环境变量
    # 理论上strapi代码应该有从文件获取变量的逻辑，这里不清楚为什么要显式定义一下，要结合代码分析，反正定义下也无妨，就按文档来
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
    # 由于是开发环境，源码变更要同步到容器文件系统
    # 同理，在系统中上传图片到uploads文件夹也要从容器同步到主机文件系统
    volumes:
      - ./config:/app/config
      - ./src:/app/src
      - ./package.json:/package.json
      - ./.env:/app/.env
      - ./public/uploads:/app/public/uploads
    ports:
      - '1337:1337'
    networks:
      - strapi
    depends_on:
      - strapiDB

  strapiDB:
    restart: unless-stopped
    image: mysql:8.0
    command: --default-authentication-plugin=mysql_native_password
    # 这里传的环境变量应该是mysql镜像要求的
    env_file: .env
    environment:
      MYSQL_USER: ${DATABASE_USERNAME}
      MYSQL_ROOT_PASSWORD: ${DATABASE_PASSWORD}
      MYSQL_PASSWORD: ${DATABASE_PASSWORD}
      MYSQL_DATABASE: ${DATABASE_NAME}
    # 数据库存储volume
    volumes:
      - strapi-data:/var/lib/mysql
    ports:
      - '3306:3306'
    networks:
      - strapi

volumes:
  strapi-data:

networks:
  strapi:
    name: Strapi
    driver: bridge
```

## 生产环境

### prod.Dockerfile

```Dockerfile
FROM node:20

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
ENV PATH=/app/node_modules/.bin:$PATH

COPY . .
RUN npm run build
EXPOSE 1337
CMD ["npm", "run", "start"]
```

相比开发阶段，也就多了一条`npm run build`，另外就是启动命令不一样。由于程序运行依然需要依赖 node_modules，所以无需两个阶段
