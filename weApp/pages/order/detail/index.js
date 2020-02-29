// pages/order/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [
      {
        text: '发送订单详情',
        desc: '描述信息'
      },
      {
        text: '翻译接单',
        desc: '描述信息'
      },
      {
        text: '匹配译员',
        desc: '描述信息'
      },
      {
        text: 'VP审批',
        desc: '描述信息'
      }
    ]
  },
  onShow: function () {

  },
  pageBack: function () {
    wx.navigateBack();
  },
})