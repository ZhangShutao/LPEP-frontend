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

import axios from 'axios'
axios.defaults.baseURL = 'http://10.201.182.166:8080/lpep/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
