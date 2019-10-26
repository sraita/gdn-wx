import Vue from 'vue'
import router from './router'
import NProgress from 'nprogress'
import { Message } from 'element-ui';
import {getToken} from './utils/auth';
import 'nprogress/nprogress.css'

var userApi = require('./api/user');


NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach((to, from, next) => {
  NProgress.start();
  const store = router.app.$options.store;
  const loginToken = getToken();

  // 判断路由是否存在
  if (to.name === undefined) {
    return next({
      path: '/404',
      query: { redirect: to.fullPath }
    });
  }
  // 如果用户已经登录
  if (loginToken) {
    // 判断当前用户是否已拉取完user_info信息
    if (store.state.user._id == '') {
      // 拉取用户信息
      store.dispatch('app/updateLoginMessage', '正在获取用户信息...');
      store.dispatch('user/getUserInfo').then(user => {
        console.log(user);
        store.dispatch('app/updateLoginMessage', '正在获取所需资源...');
        store.dispatch('app/getMenus').then(menuList => {
          try {
            // 动态加载路由
            
            // store.dispatch('app/updateMenuTree',menuTree);
            // 生成用户可访问的路由表
            // router.addRoutes(store.getters.addRoutes)
            // next({...to,replace: true});
          } catch (e) {
            console.log(e)
          }

        }).catch(err => {

        });
        next();
      }).catch(err => {
        Message({
          type: 'error',
          message: '用户信息获取失败'
        })
      });
    }
    next();
  } else {
    if (['login', 'Forbidden', 'Notfound'].includes(to.name)) {//如果是登录页面路径，就直接next()
      next();
    } else {//不然就跳转到登录；
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  }
});

router.afterEach(transition => {
  NProgress.done();
})