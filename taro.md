# Taro

## 生命周期

[组合式API写生命周期](https://docs.taro.zone/docs/composition-api)方式如下：

```vue
<script setup>
import { useReady } from '@tarojs/taro'
useReady(() => {
  console.log('等同于页面的 onReady 生命周期钩子')
})
</script>
```

::: tip
只有页面组件才能触发页面生命周期钩子，如果子组件也需要，可以通过Taro内置的消息机制实现，[详见](https://docs.taro.zone/docs/vue-page#onready-)
:::
