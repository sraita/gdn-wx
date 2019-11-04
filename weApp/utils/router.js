const { Toast } = require('../utils/util.js');

let WHITE_LIST = ['login'];

// 页面加载之前判断用户是否登录
const beforeLaunch = function (pageName) {
  if (!WHITE_LIST.includes(pageName)) {
    const token = wx.getStorageSync('loginToken');
    const userId = wx.getStorageSync('userId');
    if (token) {
      // 判断是否获取到用户信息
      if (userId) {
        return true;
      } else {
        // 尝试拉取用户信息
        try {
          console.log(111);
        } catch (err) {
          Toast('登录过期','error')
          wx.redirectTo({ url:'/pages/login'});
          return false;
        }
      }
    } else {
      Toast('请先登录', 'error')
      return wx.redirectTo({ url: '/pages/login' });
    }
  }
}

module.exports = {
  beforeLaunch: beforeLaunch
}