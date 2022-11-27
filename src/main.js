import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入mavonEditor样式表
import 'mavon-editor/dist/css/index.css'

import './assets/theme/blue-dark/index.css'
import axios from 'axios'
import { baseUrl } from './vue.config.js'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.interceptors.request.use(config => {
  NProgress.start()
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

axios.defaults.baseURL = baseUrl
axios.defaults.timeout = 5000
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
