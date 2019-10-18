/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios'; import QS from 'qs';
import { Message } from 'element-ui';

import store from '../store/index'
import router from '../router';
import utils from './utils';


// 创建一个axios实例
const instance = axios.create({
  timeout: 10000,
})

// 环境的切换
if (process.env.NODE_ENV == 'development') {
  instance.defaults.baseURL = '/';
} else if (process.env.NODE_ENV == 'debug') {
  instance.defaults.baseURL = '';
} else if (process.env.NODE_ENV == 'production') {
  instance.defaults.baseURL = 'http://api.123dailu.com/';
}

// post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 发送 Session
instance.defaults.withCredentials = true;

let requests = []; // 刷新 token 前的请求队列
let isRefreshing = false; // 是否正在刷新 token

function refreshToken() {
  // instance是当前http.js中已创建的axios实例
  const token = utils.getRefreshToken();
  return instance.get('/auth/refresh_token', {params:{token}}).then(res => res.data);
}

function toLogin () {
  store.dispatch('auth/updateTokens', '', '');
  router.replace({
    path: "/login",
    query: { redirect: router.currentRoute.fullPath }
  });
}

// 请求拦截器
instance.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('loginToken')
    token && (config.headers.Authorization = 'Bearer ' + token);
    return config;
  },
  error => {
    return Promise.error(error);
  })

// 响应拦截器
instance.interceptors.response.use(
  response => {
    if (response.data.status === 'success') {
      return Promise.resolve(response);
    } else {
      Message({
        type: 'error',
        message: response.data.message,
        duration: 1000
      })
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况    
  error => {
    const config = error.config;
    
    if (error.response.status) {
      switch (error.response.status) {
        // 没有访问该接口的权限              
        case 403:
          Message({
            type: 'error',
            message: '无权访问',
            duration: 1000
          })
          break;
        // 用户未登录 或 token已过期               
        case 401:
          let code = error.response.data.code;
          // code: '40101', token 过期需要刷新 token
          if (code == '40101') {
            if(!isRefreshing) {
              isRefreshing = true;
              return refreshToken().then(res => {
                const {token, refresh_token} = res.data;
                localStorage.setItem('loginToken',token);
                localStorage.setItem('refreshToken', refresh_token);
                // 已经刷新了token，将所有队列中的请求进行重试
                config.headers['Authorization'] = 'Bearer ' + token
                config.baseURL = ''
                requests.forEach(cb => cb(token))
                requests = []
                return instance(config)
              }).catch(err => { // token 刷新失败
                toLogin();
                return null;
              }).finally(()=> {
                isRefreshing = false;
              });
            } else {
              // 正在刷新 token ，将返回一个未执行resolve的promise
              return new Promise((resolve) => {
                // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                requests.push((token) => {
                  config.headers.Authorization = 'Bearer ' + token
                  resolve(instance(config))
                })
              })
            }
          } else {
            toLogin();
          }
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
            duration: 1500
          });
      }
    }
    return Promise.reject(error.response.data);
  }
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    instance.get(url, {
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
    instance.post(url, QS.stringify(params))
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}