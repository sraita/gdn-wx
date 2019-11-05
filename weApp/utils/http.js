const app = getApp();
const {Toast } = require('../utils/util.js');
const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

const BASE_URL = "http://localhost:3000";


function toLogin() {
  wx.clearStorageSync('loginToken');
  wx.clearStorageSync('refreshToken')
  wx.redirectTo({
    url:"login?redirect='/'"
  });
}

let requestTasks = []; // 刷新 token 前的请求队列
let isRefreshing = false; // 是否正在刷新 token

const request = function (url,method, params) {
  // 请求拦截器
  let token = wx.getStorageSync('loginToken');
  let header = {
    'content-type': 'application/json'
  };
  if (token) {
    header.Authorization = 'Bearer ' + token;
  }
  return new Promise((resolve, reject) => {
    const requestTask = wx.request({
      url: (url.startsWith('http://') || url.startsWith('https://')) ? url : (BASE_URL + url),
      data: params,
      header: header,
      method: method,
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('Success:', requestTask);
        let result = res.data;
        if (res.statusCode == 200) {
          resolve(result);
        } else {
          switch(res.statusCode) {
            case 401: // 用户未登录或 Token 已过期 
              let code = result.code;
              if (code == '40101') { // token 过期
                if (!isRefreshing) {
                  isRefreshing = true;
                  const refresh_token = wx.getStorageSync('refreshToken');
                  return request('/auth/refresh_token',METHOD.GET,{token: refresh_token}).then(res => {
                    const { token, refresh_token } = res.data;
                    wx.setStorage({
                      key: 'loginToken',
                      data: token,
                    });
                    wx.setStorage({
                      key: 'refreshToken',
                      data: refresh_token,
                    });
                    // 已经刷新了token，将所有队列中的请求进行重试
                    requestTasks.forEach(cb => cb())
                    requestTasks = [];
                  });
                } else {
                  // 正在刷新 token ，将返回一个未执行resolve的promise
                  return new Promise((resolve) => {
                    // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                    requestTasks.push(() => {
                      resolve(request(url,method,params));
                    });
                  })
                }
              } else if(code == '40103') { // 需要进行用户绑定
                wx.redirectTo({
                  url: '/pages/bindAccount',
                })
              } else { // 用户未登录
                return toLogin();
              }
              break;
            case 403: // 没有访问该接口的权限 
              Toast('网络请求受限', 'error');
              break;
            case 404:
              Toast('网络请求不存在', 'error');
              break;
            default:
              Toast(result.message, 'error');
              break;
          }
          reject({name:result.name, message: result.message});
        }
      },
      fail: function (res) {
        console.log('Filed:', res);
        switch(res) {

        }
        reject(res);
      },
    })
    console.log(requestTask);
  });
};

module.exports = {
  get: ((url, params) => request(url, METHOD.GET, params)),
  post: ((url, params) => request(url, METHOD.POST, params)),
  put: ((url, params) => request(url, METHOD.PUT, params)),
  delete: ((url, params) => request(url, METHOD.DELETE, params))
}