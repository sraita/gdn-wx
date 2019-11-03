import router from './router'
import store from './store'
import NProgress from 'nprogress'
import { Message } from 'element-ui';
import 'nprogress/nprogress.css'

import {getToken} from './utils/auth';
import getPageTitle from '@/utils/get-page-title'


NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'Forbidden', 'Notfound', 'systemInitialize','customRegister'];
router.beforeEach( async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  const loginToken = getToken();
  if (loginToken) {
    if (to.name === 'login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断用户信息是否获取
      const userId = store.getters.userId;
      if (userId) {
        next()
      } else {
        try {
          // 拉取用户信息
          store.dispatch('app/updateLoginMessage', '正在获取用户信息...');
          const { roles } = await store.dispatch('user/getUserInfo');
          // 获取菜单列表
          store.dispatch('app/updateLoginMessage', '正在获取所需资源...');
          const menuList = await store.dispatch('app/getMenus');
          // 动态加载路由
          store.dispatch('app/updateLoginMessage', '生成可访问路由表...');
          const accessRoutes = await store.dispatch('app/generateRoutes', { roles, menuList });
          // dynamically add accessible routes
          store.dispatch('app/updateLoginMessage', '正在创建路由信息...');
          router.addRoutes(accessRoutes)
          store.dispatch('app/updateLoginMessage', '');
          store.dispatch('app/updateLoginStatus', false);
          next({ ...to, replace: true })
        } catch (err) {
          console.log(err);
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message({
            type: 'error',
            message: '登录失败'
          });
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.name) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
});

router.afterEach(transition => {
  NProgress.done();
})