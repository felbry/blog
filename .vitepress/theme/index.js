import DefaultTheme from 'vitepress/theme'
import VpDemo from '../components/vp-demo.vue'
export default {
  extends: DefaultTheme,
  enhanceApp: ({ app }) => {
    app.component('Demo', VpDemo)
  },
}
