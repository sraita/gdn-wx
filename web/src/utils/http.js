/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios'; import QS from 'qs';
import { Message } from 'element-ui';
import store from '../store/index'
import router from '../router';
import utils from './utils';

// 环境的切换
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = '/';
} else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = 'http://api.123dailu.com/';
}

// 请求超时时间
axios.defaults.timeout = 10000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 发送 Session
axios.defaults.withCredentials = true;


// 请求列表
const requestList = []
// 取消列表
const CancelToken = axios.CancelToken
let sources = {}
// 请求拦截器
axios.interceptors.request.use(
  config => {
    //将请求地址及参数作为一个完整的请求
    const request = JSON.stringify(config.url) + JSON.stringify(config.data)
    config.cancelToken = new CancelToken((cancel) => {
      sources[request] = cancel
    })

    // console.log('Token Expired:',utils.isTokenExpired());
    //1.判断请求是否已存在请求列表，避免重复请求，将当前请求添加进请求列表数组；
    if (requestList.includes(request)) {
      sources[request]('取消重复请求')
    } else {
      requestList.push(request)
      //2.请求开始，改变loading状态供加载动画使用
      // store.dispatch('changeGlobalState', { loading: true })
    }
    //3.从store中获取token并添加到请求头供后端作权限校验
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = sessionStorage.getItem('loginToken')
    token && (config.headers.Authorization = 'Bearer ' + token);
    return config;
  },
  error => {
    return Promise.error(error);
  })

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 1.将当前请求中请求列表中删除
    const request = JSON.stringify(response.config.url) + JSON.stringify(response.config.data)
    requestList.splice(requestList.findIndex(item => item === request), 1)
    // 2.当请求列表为空时，更改loading状态
    if (requestList.length === 0) {
      // store.dispatch('changeGlobalState', { loading: false })
    }
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况    
  error => {
    // 4.处理取消请求
    if (axios.isCancel(error)) {
      requestList.length = 0
      // store.dispatch('changeGlobalState', { loading: false })
      throw new axios.Cancel('cancel request')
    } else {
      if (error.response.status) {
        switch (error.response.status) {
          // case 400:
          //   error.message = '错误请求';
          //   break;
          // case 401:
          //   error.message = '未授权，请重新登录';
          //   break;
          // case 403:
          //   error.message = '拒绝访问';
          //   break;
          // case 404:
          //   error.message = '请求错误,未找到该资源';
          //   break;
          // case 405:
          //   error.message = '请求方法未允许';
          //   break;
          // case 408:
          //   error.message = '请求超时';
          //   break;
          // case 500:
          //   error.message = '服务器端出错';
          //   break;
          // case 501:
          //   error.message = '网络未实现';
          //   break;
          // case 502:
          //   error.message = '网络错误';
          //   break;
          // case 503:
          //   error.message = '服务不可用';
          //   break;
          // case 504:
          //   error.message = '网络超时';
          //   break;
          // case 505:
          //   error.message = 'http版本不支持该请求';
          //   break;
          // 401: 未登录                
          // 未登录则跳转登录页面，并携带当前页面的路径                
          // 在登录成功后返回当前页面，这一步需要在登录页操作。                
          case 401:
            router.replace({
              path: '/login',
              query: { redirect: router.currentRoute.fullPath }
            });
            break;
          // 403 token过期                
          // 登录过期对用户进行提示                
          // 清除本地token和清空vuex中token对象                
          // 跳转登录页面                
          case 403:
            Message({
              type: 'error',
              message: '登录过期，请重新登录',
              duration: 1000
            });
            // 清除token                    
            localStorage.removeItem('token');
            store.commit('loginSuccess', null);
            // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
            setTimeout(() => {
              router.replace({
                path: '/login',
                query: {
                  redirect: router.currentRoute.fullPath
                }
              });
            }, 1000);
            break;
          // 404请求不存在                
          case 404:
            Message({
              type: 'error',
              message: '网络请求不存在',
              duration: 1500
            });
            break;
          // 其他错误，直接抛出错误提示                
          default:
            Message({
              type: 'error',
              message: error.response.data.message,
              duration: 1500,
              forbidClick: true
            });
        }
      }
    }
    return Promise.reject(error.response);
  }
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params))
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}