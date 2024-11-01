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
# ...
```

## 生产环境

### prod.Dockerfile

```Dockerfile
...
```
