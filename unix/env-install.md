# 环境安装

::: tip
在 Ubuntu 系统下，每次安装包之前，先执行`sudo apt update && sudo apt upgrade`
:::

## ZSH

```bash
# 1. 查看当前所有shell
cat /etc/shells
# 2. 默认是找不到zsh的，可以通过apt安装
sudo apt install zsh
# 3. 查看当前用户默认shell
echo $SHELL
# 4. 如果zsh不是当前用户默认shell，进行切换
chsh -s /bin/zsh
# 此时可能需要重启终端程序才能应用
```

重新启动后可能会弹出这个弹窗，因为没有默认的 zsh 配置文件

![image](https://felbry.github.io/picx-images-hosting/image.7i0b89uk7x.webp)

选择 2，初始化一个配置文件。完成后通过 vim 命令就能查看到这个配置文件内容了

![image](https://felbry.github.io/picx-images-hosting/image.3d4pw5ytfb.webp)

### 安装 oh-my-zsh

有条件的优先[官网方式](https://ohmyz.sh/#install)，没条件走国内镜像：`sh -c "$(wget -O- https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"`

![image](https://felbry.github.io/picx-images-hosting/image.4n7n2hjd9p.webp)

**安装插件 zsh-autosuggestions**

先下载到 oh-my-zsh 自定义插件目录中（可以通过`echo $ZSH_CUSTOM`确认下是否有这个变量）

执行`git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions`，再编辑`vim ~/.zshrc`，将插件名追加到 plugins 中，`plugins=(git zsh-autosuggestions)`，最后重载配置：`source ~/.zshrc`

### 常用的.zshrc 配置

别名和函数

```bash
# 快速查看git状态
alias gs='git status'

# g2r 为 git to remote 缩写，常用快速提交本地代码到远程
function g2r () {
  git add .
  if [ "$1" != "" ]
  then
    git commit -m "$1"
  else
    git commit -m update # default commit message is `update`
  fi # closing statement of if-else block
  git push origin HEAD
}
```

使用 NVM 自动切换 node 版本

```bash
# autoload是zsh的内置命令，用于延迟加载shell函数
# -U 表示自动加载的函数将在本地定义
# add-zsh-hook是zsh提供的函数，用于在特定事件（如目录更改）上注册钩子函数
# 所以该命令就是提前加载了本地zsh内置的add-zsh-hook函数
autoload -U add-zsh-hook

# 定义函数load-nvmrc
load-nvmrc() {
  # -f 检测文件是否存在且是一个普通文件
  # 如果有 执行nvm use
  if [ -f .nvmrc ]; then
    nvm use
  # 如果没有 .nvmrc 文件，自动切换为default版本
  else
    nvm use default
  fi
}

# preexec 在每个命令执行之前运行
# precmd 在每个命令执行之后、提示符显示之前运行
# zshexit 在 shell 退出时运行
# periodic 在设定的时间间隔内自动运行
# 添加 chpwd 钩子，在改变当前工作目录时(cd、pushd、popd)执行 load-nvmrc函数
add-zsh-hook chpwd load-nvmrc
# shell启动时（新建shell）也会立即执行一次函数，确保切换到正确的版本
load-nvmrc
```

## ffmepg

`sudo apt install ffmpeg`

[如何在 Ubuntu 上安装 FFmpeg：两种简单的方法](https://www.bytezonex.com/archives/100.html)

## Node.js(npm)

### nvm（推荐）

::: tip
安装 nvm 前，最好卸载本机所有相关的 Node.js 版本。（如果要给 WSL 安装，Windows 平台的 Node.js 版本也要先行卸载）
:::

参见[Install & Update Script](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)，一条命令完成安装：

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash`

（如果终端网络访问不通但是浏览器可以，那就先在浏览器端下载这个脚本，通过 bash 命令运行它）

::: details 可能遇到的一些错误

> [!CAUTION] 错误一
> 在`bash install-nvm.sh`时，报`error: RPC failed; curl 16 Error in the HTTP2 framing layer`

完整的报错如下：

```bash
root@felbry:/mnt/c/a# bash install-nvm.sh
=> Downloading nvm from git to '/root/.nvm'
=> Cloning into '/root/.nvm'...
error: RPC failed; curl 16 Error in the HTTP2 framing layer
fatal: expected flush after ref listing
Failed to clone nvm repo. Please report this!
```

这个错误出现在 WSL Ubuntu 22 版本，执行 nvm 的安装脚本时。重启终端或电脑重新执行就正常了。

> [!CAUTION] 错误二
> 当执行`nvm install <version>`时，报错“找不到该版本”。通过`nvm ls-remote`，查到的可用版本只有 iojs 的，没有 Node.js 的。

将环境变量`NVM_NODEJS_ORG_MIRROR`设置成淘宝源即可：`https://npmmirror.com/mirrors/node/`

查看当前值：`echo $NVM_NODEJS_ORG_MIRROR`

设置的几种方式：

- 运行时设置：`NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node nvm ls-remote`
- 临时设置（该终端打开的生命周期内）：`NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node nvm ls-remote`
- 永久设置：`vim ~/.zshrc`，`export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node`，`:wq`保存

> [!CAUTION] 错误三
> 安装完 node 后，执行`node -v`时，报`node: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.28' not found (required by node)`的错误

这个错误出现**Ubuntu 18.04 (Bionic Beaver)**，且 Node.js 的版本较高。

根据[Getting GLIBC_2.28 not found](https://stackoverflow.com/questions/72921215/getting-glibc-2-28-not-found)的说法，18 版本只包含 glibc 2.27，而高版本的 Node.js 需要 glibc 2.28。

因此要么在 Ubuntu 系统下安装高版本 glibc，要么升级 Ubuntu 系统。
:::

### 固定版本（不推荐）

[Download Node.js the way you want](https://nodejs.org/en/download/package-manager)，选择 Linux 平台，官方推荐了几种形式，其中就有 nvm。

## Nginx

Ubuntu 22 下安装：

`sudo apt install nginx`
