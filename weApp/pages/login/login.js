// pages/login.js
var {Toast} = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(getApp().api)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserInfo: function (e){
    if (e.detail.userInfo) {
      console.log(e.detail.userInfo)
      let getCode = () => {
        return new Promise((resolve, reject) => {
          wx.login({
            success(res) {
              if (res.code) {
                resolve(res.code);
              } else {
                resolve(res.errMsg);
              }
            },
            fail(res) {
              resolve(res.errMsg);
            }
          });
        });
      }
      let getUnionId = function(code) {
        return new Promise((resolve, reject) => {
          wx.getUserInfo({
            success(res) {  
              res.code = code;
              resolve(res);
            },
            fail(res) {
              reject(res.errMsg);
            }
          })
        });
      }
      wx.showLoading({
        title: '正在登录',
      });
      getCode().then(code => {
        return getUnionId(code)
      }).then(data => {
        let { code, userInfo, signature, encryptedData, iv } = data;
        let params = {
          encryptedData,
          iv,
          code
        };
        app.api.auth.loginWithUnionId(params).then(res => {
          console.log(res);
          const { token, refresh_token, expire_in,userId, user} = res.data;
          wx.setStorageSync('loginToken', token);
          wx.setStorageSync('refreshToken', refresh_token);
          wx.setStorageSync('userId', userId);
          wx.setStorageSync('user', user);
          wx.switchTab({
            url: '../../pages/index/index',
            fail: function (res) { console.log(res) }
          })

        }).catch(err => {
          console.log(err);
          Toast('登录失败!', 'error');
        });
      }).catch(err => {
        Toast('登录失败!', 'error');
        console.log('登录失败:',err);
      }).finally(() => {
        wx.hideLoading();
      });
      
    } else {
      // 用户拒绝授权时的处理
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!',
        showCancel: false,
        confirmText: '返回授权'
      });
    }
  }
})