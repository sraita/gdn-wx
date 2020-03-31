// pages/team/approve/approve.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    imgList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const { id } = options;
    this.setData({
      id
    });
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
  // 选择审批人
  chooseApprove: function() {
    console.log('选择审批人')
    wx.redirectTo({
      url: '../../component/choose-member/choose-member?id='+this.data.id,
      success: function(res) {},
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {},
    })
  }
})