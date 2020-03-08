// pages/login.js
var {Toast} = require('../../utils/util.js')
const { login, getUserInfo} = require('../../api/user.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false, // 页面是否可见
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
      const userInfo = {...e.detail.userInfo};
      let params = {
        avatar: userInfo.avatarUrl,
        city: userInfo.city,
        country: userInfo.country,
        nickName: userInfo.nickName,
        sex: userInfo.sex,
        province: userInfo.province
      }
      console.log(params);
      
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
      wx.showLoading({
        title: '正在登录',
      });
      const {code } = getCode();
      getCode().then(code => {
        login({code}).then(res => {
          console.log(res.data);
          const {token} = res.data;
          wx.setStorageSync('loginToken', token);
          
          // getUserInfo
          getUserInfo(token).then(res => {
            wx.setStorageSync('userId', res.data._id);
            wx.setStorageSync('userInfo', res.data);
            // 隐藏登录页面
            wx.navigateBack();
          })
        })
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