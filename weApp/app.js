//app.js
let {get} = require('./utils/http.js');
const { checkLoginState} = require('./utils/util.js');

const { getUserInfo } = require('./api/user.js');

App({
  onLaunch: function () {
    console.log('launch...')
    checkLoginState();
    this.getUserInfo();
  },
  // 全局方法或者变量，可在不同page中使用
  _: require('./utils/global.js'),
  userId() {
    return wx.getStorageSync("userId")
  },
  userInfo() {
    return wx.getStorageSync("userInfo")
  },
  getUserInfo() {
    // 尝试获取用户信息
    getUserInfo().then(res => {
      console.log('User:',res);
      const {_id} = res.data;
      // this.userId = _id;
      wx.setStorageSync('userId', _id);
      wx.setStorageSync('userInfo', res.data);
    }).catch(err => {
      console.log('get Userinfo Err:', err);
    })
  },
  globalData: {
    userInfo: null,
  },
  api: require('./api/index.js'), 
})