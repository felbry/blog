function utoa(data) {
  return btoa(unescape(encodeURIComponent(data)))
}
const MAIN_FILE_NAME = 'App.vue'
const IMPORT_MAP_FILE_NAME = 'import-map.json'
export const usePlayground = (source) => {
  const code = decodeURIComponent(source)
  const originCode = {
    [MAIN_FILE_NAME]: code,
    // [IMPORT_MAP_FILE_NAME]: `{
    //   "imports": {
    //     "vue": "https://play.vuejs.org/vue.runtime.esm-browser.js",
    //     "vue/server-renderer": "https://play.vuejs.org/server-renderer.esm-browser.js",
    //     "dayjs": "https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"
    //   }
    // }`,
  }
  const link = `https://play.vuejs.org/#${utoa(JSON.stringify(originCode))}`
  return {
    link,
  }
}
