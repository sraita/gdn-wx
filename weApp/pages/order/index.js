// pages/order/index.js
const { getUserOrders} = require('../../api/order.js');
const {_, userId} = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {title:'全部', code: 'all'},
      { title: '进行中'}, 
      {title:'已取消'}
    ],
    activeTab: 0,
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
    this.fetchData();
  },
  fetchData() {
    let pagination = this.data.pagination;
    getUserOrders(userId(),{}).then(res => {
      const {list,total} = res.data;
      pagination.total = total;
      this.setData({
        list,
        pagination
      })
    })
  },
  onTabCLick(e) {
    const index = e.detail.index
    this.setData({ activeTab: index })
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({ activeTab: index })
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