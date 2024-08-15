# SSH

## 重置系统，本地连不上

重置系统了（把 centos 换 ubuntu 了），再连服务器就报错了：

```bash
-> % ssh <username>@<ip>
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ED25519 key sent by the remote host is
SHA256:xxxxxx.
Please contact your system administrator.
Add correct host key in /Users/<username>/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /Users/<username>/.ssh/known_hosts:9
```

通过`vim /Users/<username>/.ssh/known_hosts`，将文件中涉及到 ip 的行全部删除掉（快捷键`dd`），保存。

重新`ssh <username>@<ip>`，输入 yes，即可完成连接。
