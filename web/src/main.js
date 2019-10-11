// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueCookies from 'vue-cookies'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import { post, get } from './utils/http'

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueCookies)

// 将axios添加到原型链上
Vue.prototype.$axios = axios
Vue.prototype.$post = post
Vue.prototype.$get = get

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
