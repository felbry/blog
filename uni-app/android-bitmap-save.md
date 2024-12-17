# uni-app 安卓下的 bitmap save 失败问题

## 抛错

H5 项目里有一段保存图片到相册的逻辑：

```js:line-numbers {19}
function saveImg(fileName, base64, quality = 50) {
  const bitmap = new window.plus.nativeObj.Bitmap()
  bitmap.loadBase64Data(
    base64,
    () => {
      bitmap.save(
        '_doc/' + fileName + '.jpg',
        { overwrite: true, quality: quality },
        (i) => {
          window.plus.gallery.save(
            i.target,
            () => {
              this.$toast(`${fileName}已保存到相册`)
            },
            (e) => {
              if (e.code === -3310 || e.code === 8) {
                this.$toast('您已禁止访问相册,请设置开启权限')
              } else {
                this.$toast(`${fileName}保存失败`)
              }
            }
          )
        },
        (e) => {
          console.log('bitmap.save error -> ' + JSON.stringify(e))
        }
      )
    },
    (e) => {
      console.log('loadBase64Data error -> ' + JSON.stringify(e))
    }
  )
}
```

我们构建的最新 APP，会触发上述第 19 行的报错，其中`e`为`{ code: 12, message: 'UNKOWN ERROR3' }`

## 问题追踪回溯

前提：我们有个“本地插件”

APP 云打包一直没有设置默认 CPU 类型，按[CPU 默认值](https://uniapp.dcloud.net.cn/tutorial/app-android-abifilters.html#default)来看，早期是`armeabi-v7a`，最新 HBuildeX 是`arm64-v8a`

在早期打包（也就是`armeabi-v7a`时），APP 一切正常

突然有个节点，有个别比较新的机型反馈打开 APP 闪退，怀疑是新版打包 CPU 类型变成了`arm64-v8a`，而“本地插件”不兼容；于是联系安卓研发同事提供新版本的“本地插件”，显式设置了 CPU 类型为`['armeabi-v7a', 'arm64-v8a']`

通过上述操作，确实解决了个别新机型闪退问题，“本地插件”运行也一切正常。但是很奇怪的就是会造成`bitmap.save`保存失败的问题。插件还会影响这个吗？

最终解决方案就是将 CPU 类型显式设置成`armeabi-v7a`，同时“本地插件”也回退到之前的版本，这样在个别新机型上应该也不会出现闪退问题了

后续如果还有新机型兼容问题，可能需要拉着安卓同事在提供新版插件的同时也要保证`bitmap.save`的正常才行

## 其它排查方向（错误）

从[Android 端权限适配 -> 相册权限](https://doc.dcloud.net.cn/uni-app-x/native/permission/android_permission_adapter.html#%E7%9B%B8%E5%86%8C%E6%9D%83%E9%99%90)了解到：安卓平台 33 开始，细化了相册权限。原来的`READ_EXTERNAL_STORAGE`被废弃，新增了更细化的权限（如果 uni-app 使用了相册相关 API，打包时会自动添加对应权限，但我们是在 H5 使用的，打包时自然检测不到）。而[app 平台 uni-app 项目云端打包环境](https://uniapp.dcloud.net.cn/tutorial/app-env.html#app%E5%B9%B3%E5%8F%B0-uni-app-%E9%A1%B9%E7%9B%AE%E4%BA%91%E7%AB%AF%E6%89%93%E5%8C%85%E7%8E%AF%E5%A2%83)最低已经是 33，更新版本的 HBuilderX 已经是 34、35 了，**如果没有显式配置这些新增的权限，自然是不会有的**

通过上面的阅读，推断是 APP 打包时没有包含**最新版的相册访问权限**。实际真机调试发现，问题不是出在`plus.gallery.save`，而是出在`bitmap.save`，虽然触发了`bitmap.save`的 success 回调且传参看起来都没有问题，但是这一步并没有将文件存储到本地
