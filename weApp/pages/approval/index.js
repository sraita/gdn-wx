const app = getApp();
const orderApi = require('../../api/order');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: null,
    order: {

    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query) {
    console.log(app.$router)
    this.setData({
      _id: query.id
    });
    this.fetchData();
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