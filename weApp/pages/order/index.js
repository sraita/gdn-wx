// pages/order/index.js
const { getUserOrders} = require('../../api/order.js');
const {_, userId} = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
    }
  },
  onLoad() {
  },
  onShow: function () {
    this.getTabBar().init();
    this.fetchData();
  },
  fetchData() {
    let pagination = this.data.pagination;
    getUserOrders(userId,{}).then(res => {
      const {list,total} = res.data;
      pagination.total = total;
      this.setData({
        list,
        pagination
      })
    })
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