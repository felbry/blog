import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VpDemo from '../components/vp-demo.vue'
export default {
  extends: DefaultTheme,
  enhanceApp: ({ app }) => {
    app.use(ElementPlus)
    app.component('Demo', VpDemo)
  },
}
