// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onShow: function () {
    this.getTabBar().init();
  },
  clickItem: function (event) {
    console.log(event)
    wx.navigateTo({
      url: './detail/index?id=x',
      fail: function(e) {
        console.log(e)
      }
    })
  }
})