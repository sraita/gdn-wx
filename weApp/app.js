//app.js
let {get} = require('./utils/http.js');

const { getUserInfo } = require('./api/user.js');

import Router from './router/index';

App({
  onLaunch: function () {
    console.log('launch...')
    this.$router = new Router();
    this.doLogin();

    console.log("%c Design By SRAITA %c sraita@139.com", 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;')
  },
  // 全局方法或者变量，可在不同page中使用
  _: require('./utils/global.js'),
  userId() {
    return wx.getStorageSync("userId")
  },
  userInfo() {
    return wx.getStorageSync("userInfo")
  },
  // 用户是否登录
  isLogin() {
    return this.userId();
  },
  teamId() {
    return wx.getStorageSync("teamId")
  },
  doLogin() {
    // 尝试获取用户信息
    getUserInfo().then(res => {
      console.log('User:',res);
      const {_id} = res.data;
      // this.userId = _id;
      wx.setStorageSync('userId', _id);
      wx.setStorageSync('userInfo', res.data);
    }).catch(err => {
      console.log('get Userinfo Err:', err);
      this.$router.push('login');
    })
  },
  api: require('./api/index.js'), 
  globalData:{
    
  }
})