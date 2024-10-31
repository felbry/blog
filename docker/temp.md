# Docker 草稿

## [Docker Compose file 参考](https://docs.docker.com/reference/compose-file/)

```yaml
# build
services:
  backend: # 容器1
    # 方式一：相对路径，以下值会在该compose文件所在目录下寻找Dockerfile
    build: .
    # 方式二：相对路径+具体文件名
    build:
      context: .
      dockerfile: dev.Dockerfile

# image
services:
  backend:
    # 如果指定image字段，构建完会自动推送到registry（暂未涉及） https://docs.docker.com/reference/compose-file/build/#publishing-built-images
    # 如果有image，没有build，那就是从registry拉取
    image: <DOCKER_USERNAME>/demo
    build: .
```
