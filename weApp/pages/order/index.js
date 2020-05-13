// pages/order/index.js
const orderApi = require('../../api/order.js');
const userApi = require('../../api/user.js');
const {_, userId} = getApp();
const app = getApp();
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
  onLoad(option) {
    this.fetchData();
  },
  onShow: function () {
    this.fetchData();
  },
  fetchData() {
    let pagination = this.data.pagination;
    userApi.getUserOrders(app.userId(),{}).then(res => {
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
    app.$router.push('orderDetail',{}, {id:event.currentTarget.dataset.id});
  }
})