import DefaultTheme from 'vitepress/theme'
import VpDemo from '../components/vp-demo.vue'
import './custom.css'
export default {
  extends: DefaultTheme,
  enhanceApp: ({ app }) => {
    app.component('Demo', VpDemo)
  },
}
