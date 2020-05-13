// pages/order/detail/index.js
const app = getApp();
const orderApi = require('../../../api/order');



Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: null,
    order:{

    },
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
  onLoad(query) {
    console.log(app.$router)
    this.setData({
      _id: query.id
    });
    this.fetchData();
  },
  onShow: function () {

  },
  pageBack: function () {
    wx.navigateBack();
  },
  fetchData() {
    orderApi.getOrder(this.data._id).then(res => {
      console.log(res);
      this.setData({
        order: res.data
      });
    }).catch(err => {
      console.log(err);
    });
  },
  copyText(e) {
    let text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  } 
})