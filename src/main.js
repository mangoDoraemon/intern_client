import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import VueQuillEditor from 'vue-quill-editor'
import mavonEditor from 'mavon-editor'

import 'mavon-editor/dist/css/index.css'
// require styles
import 'quill/dist/quill.core.css'

import 'quill/dist/quill.bubble.css'

import 'quill/dist/quill.snow.css'

import './assets/reset.scss'
import './assets/icons/iconfont.css'
import * as filters from './assets/js/filters.js'
import {download} from './utils/common.js';

Object.keys(filters).forEach(key => { //过滤器挂载在Vue上
  Vue.filter(key, filters[key])
})
Vue.prototype.download = download
Vue.use(VueQuillEditor)
Vue.use(mavonEditor)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
