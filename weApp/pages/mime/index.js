// pages/mime/index.js
const app = getApp();

const defaultUser = {

};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: wx.getStorageSync('userId'),
    userInfo: wx.getStorageSync('userInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  onShow: function () {
    
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
  // 打开页面
  openPage(e) {
    const page = e.currentTarget.dataset.page;
    wx.navigateTo({
      url: page,
      fail: function (e) {
        console.log(e)
      }
    })
  },
})