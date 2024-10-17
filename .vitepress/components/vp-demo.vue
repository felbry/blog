<script setup>
import { computed, ref, toRef } from 'vue'
import { useClipboard, useToggle } from '@vueuse/core'
import { usePlayground } from '../composables/use-playground.js'
import SourceCode from './vp-source-code.vue'

const props = defineProps({
  source: String,
  path: String,
  rawSource: String,
  isShowRawSourcePermanently: {
    type: Boolean,
  },
  isHiddenOps: {
    type: Boolean,
  },
})

const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.rawSource),
  read: false,
})
const isCopied = ref(false)
const copyCode = async () => {
  if (!isSupported) return
  try {
    await copy()
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 1500)
  } catch (e) {
    console.error(e.message)
  }
}

const [sourceVisible, toggleSourceVisible] = useToggle()

const onPlaygroundClick = () => {
  const { link } = usePlayground(props.rawSource)
  window.open(link)
}
</script>

<template>
  <div class="example">
    <div class="example-showcase">
      <slot name="source" />
    </div>
    <hr style="margin: 0" />
    <div
      class="op-btns"
      v-if="!isHiddenOps"
    >
      <div
        tooltip="编辑器中编辑"
        position="bottom"
        @click="onPlaygroundClick"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon"
        >
          <path
            stroke="none"
            d="M0 0h24v24H0z"
            fill="none"
          />
          <path d="M9 3l6 0" />
          <path d="M10 9l4 0" />
          <path d="M10 3v6l-4 11a.7 .7 0 0 0 .5 1h11a.7 .7 0 0 0 .5 -1l-4 -11v-6" />
        </svg>
      </div>
      <div
        :tooltip="isCopied ? '复制成功' : '复制代码'"
        position="bottom"
      >
        <svg
          v-if="isCopied"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="green"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon"
        >
          <path
            stroke="none"
            d="M0 0h24v24H0z"
            fill="none"
          />
          <path d="M5 12l5 5l10 -10" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon"
          @click="copyCode"
        >
          <path
            stroke="none"
            d="M0 0h24v24H0z"
            fill="none"
          />
          <path
            d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"
          />
          <path
            d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"
          />
        </svg>
      </div>
      <div
        v-if="!isShowRawSourcePermanently"
        :tooltip="sourceVisible ? '隐藏代码' : '查看代码'"
        position="bottom"
        @click="toggleSourceVisible()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon"
        >
          <path
            stroke="none"
            d="M0 0h24v24H0z"
            fill="none"
          />
          <path d="M7 8l-4 4l4 4" />
          <path d="M17 8l4 4l-4 4" />
          <path d="M14 4l-4 16" />
        </svg>
      </div>
    </div>

    <SourceCode
      :visible="isShowRawSourcePermanently || sourceVisible"
      :source="source"
    />

    <div
      v-if="!isShowRawSourcePermanently"
      v-show="sourceVisible"
      class="example-float-control"
      @click="toggleSourceVisible(false)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-caret-up"
      >
        <path
          stroke="none"
          d="M0 0h24v24H0z"
          fill="none"
        />
        <path d="M18 14l-6 -6l-6 6h12" />
      </svg>
      <span>隐藏代码</span>
    </div>
  </div>
</template>

<style scoped lang="less">
.example {
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;

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
    gap: 12px;
    height: 2.5rem;
    color: var(--vp-c-text-2);

    .icon:hover {
      color: var(--vp-c-text-1);
      stroke-width: 2;
      cursor: pointer;
    }
  }

  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--vp-c-divider);
    height: 44px;
    box-sizing: border-box;
    background-color: var(--vp-c-bg);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--vp-c-text-2);
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
      color: var(--vp-c-indigo-1);
    }
  }
}

// tooltip
[tooltip] {
  position: relative;
  display: inline-block;
}
[tooltip]::before {
  content: '';
  position: absolute;
  border-width: 4px 6px 0 6px;
  border-style: solid;
  border-color: transparent;
  border-top-color: var(--vp-c-neutral);
  z-index: 99;
  opacity: 0;
}
[tooltip]::after {
  content: attr(tooltip);
  position: absolute;
  background: var(--vp-c-neutral);
  text-align: center;
  color: var(--vp-c-neutral-inverse);
  border-radius: 5px;
  padding: 4px 2px;
  min-width: 80px;
  pointer-events: none;
  z-index: 99;
  opacity: 0;
}
[tooltip]:hover::after,
[tooltip]:hover::before {
  opacity: 1;
}
[tooltip][position='bottom']::before {
  top: 100%;
  left: 50%;
  margin-top: 1px;
  transform: translatex(-50%) rotate(180deg);
}
[tooltip][position='bottom']::after {
  top: 100%;
  left: 50%;
  margin-top: 5px;
  transform: translatex(-50%);
}
</style>
