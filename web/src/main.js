// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import mixin from './mixin'
import VueCookies from 'vue-cookies'


import ElementUI from 'element-ui';
import './permission' // permission control
import 'element-ui/lib/theme-chalk/index.css';
import './assets/iconfont/iconfont.css';

import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

// 表单设计器
import FormMaking from 'form-making'
import 'form-making/dist/FormMaking.css'

import { post, get } from './utils/http'
import api from './api'

Vue.config.productionTip = false

Vue.mixin(mixin);

Vue.use(ElementUI);
Vue.use(VueCookies);
Vue.use(contentmenu);
Vue.use(FormMaking);

// 将axios添加到原型链上
Vue.prototype.$axios = axios
Vue.prototype.$post = post
Vue.prototype.$get = get

Vue.prototype.$api = api

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
