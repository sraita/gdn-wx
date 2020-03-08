//app.js
let {get} = require('./utils/http.js');
const { checkLoginState} = require('./utils/util.js');

App({
  onLaunch: function () {
    console.log('launch...')
    checkLoginState();
  },
  // 全局方法或者变量，可在不同page中使用
  _: require('./utils/global.js'),
  userId: "5db5bc565515122cea2e938d",
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
  },
  api: require('./api/index.js'), 
})