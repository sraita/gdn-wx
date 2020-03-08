// pages/team/index/index.js
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

  },
  pageBack: function () {
    wx.navigateBack();
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
  }
})