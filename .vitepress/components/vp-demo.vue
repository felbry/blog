<script setup lang="ts">
import { computed, getCurrentInstance, ref, toRef, defineAsyncComponent } from 'vue'
import { useClipboard, useToggle } from '@vueuse/core'
import { CaretTop } from '@element-plus/icons-vue'
import SourceCode from './vp-source-code.vue'

const props = defineProps<{
  source: string
  path: string
  rawSource: string
  description: string
}>()

const currentComp = computed(() => {
  const fullPath = `../examples/${props.path}.vue`
  return defineAsyncComponent(() => import(fullPath))
})

const vm = getCurrentInstance()!

const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.rawSource),
  read: false,
})

const [sourceVisible, toggleSourceVisible] = useToggle()

const sourceCodeRef = ref<HTMLButtonElement>()

const decodedDescription = computed(() => decodeURIComponent(props.description))

const onPlaygroundClick = () => {
  const { $message } = vm.appContext.config.globalProperties
  $message.success('playground待实现')
}

const onSourceVisibleKeydown = (e: KeyboardEvent) => {
  if (['Enter', 'Space'].includes(e.code)) {
    e.preventDefault()
    toggleSourceVisible(false)
    sourceCodeRef.value?.focus()
  }
}

const copyCode = async () => {
  const { $message } = vm.appContext.config.globalProperties
  if (!isSupported) {
    $message.error('复制出错')
  }
  try {
    await copy()
    $message.success('复制成功')
  } catch (e: any) {
    $message.error(e.message)
  }
}
</script>

<template>
  <!-- danger here DO NOT USE INLINE SCRIPT TAG -->
  <div
    text="sm"
    m="y-4"
    v-html="decodedDescription"
  />

  <div class="example">
    <div class="example-showcase">
      <component :is="currentComp" />
    </div>
    <hr style="margin: 0" />
    <div class="op-btns">
      <ElTooltip
        content="编辑器中编辑"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
        <ElIcon
          :size="16"
          tabindex="0"
          role="link"
          class="op-btn"
          @click="onPlaygroundClick"
          @keydown.prevent.enter="onPlaygroundClick"
          @keydown.prevent.space="onPlaygroundClick"
        >
          <!-- <i-ri-flask-line /> -->222
        </ElIcon>
      </ElTooltip>
      <ElTooltip
        content="Github中编辑"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
        <ElIcon
          :size="16"
          class="op-btn github"
          style="color: var(--text-color-light)"
        >
          <a
            href="https://www.baidu.com"
            rel="noreferrer noopener"
            target="_blank"
          >
            <!-- <i-ri-github-line /> -->
            333
          </a>
        </ElIcon>
      </ElTooltip>
      <ElTooltip
        content="复制代码"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
        <ElIcon
          :size="16"
          class="op-btn"
          tabindex="0"
          role="button"
          @click="copyCode"
          @keydown.prevent.enter="copyCode"
          @keydown.prevent.space="copyCode"
        >
          <!-- <i-ri-file-copy-line /> -->111
        </ElIcon>
      </ElTooltip>
      <ElTooltip
        :content="sourceVisible ? '隐藏代码' : '查看代码'"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
        <button
          ref="sourceCodeRef"
          class="reset-btn el-icon op-btn"
          @click="toggleSourceVisible()"
        >
          <ElIcon :size="16">
            <!-- <i-ri-code-line /> -->
            444
          </ElIcon>
        </button>
      </ElTooltip>
    </div>

    <ElCollapseTransition>
      <SourceCode
        :visible="sourceVisible"
        :source="source"
      />
    </ElCollapseTransition>

    <Transition name="el-fade-in-linear">
      <div
        v-show="sourceVisible"
        class="example-float-control"
        tabindex="0"
        role="button"
        @click="toggleSourceVisible(false)"
        @keydown="onSourceVisibleKeydown"
      >
        <ElIcon :size="16">
          <CaretTop />
        </ElIcon>
        <span>隐藏代码</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="less">
.example {
  border: 1px solid var(--vp-c-border);
  border-radius: var(--el-border-radius-base);

  .example-showcase {
    padding: 1.5rem;
    margin: 0.5px;
    background-color: var(--vp-c-bg);
  }

  .op-btns {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;

    .el-icon {
      &:hover {
        color: var(--vp-c-text-1);
      }
    }

    .op-btn {
      margin: 0 0.5rem;
      cursor: pointer;
      color: var(--vp-c-text-2);
      transition: 0.2s;

      &.github a {
        transition: 0.2s;
        color: var(--vp-c-text-2);

        &:hover {
          color: var(--vp-c-text-1);
        }
      }
    }
  }

  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border-color);
    height: 44px;
    box-sizing: border-box;
    background-color: var(--bg-color, #fff);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    span {
      font-size: 14px;
      margin-left: 10px;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
