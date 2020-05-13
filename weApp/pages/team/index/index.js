// pages/team/index/index.js
const { getTeam } = require('../../../api/team.js');

const mapp = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: wx.getStorageSync('userId'),
    id: '',
    team: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const {id } = options;
    this.setData({
      id
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
    getTeam(mapp.teamId()).then(res => {
      console.log(res);
      const team = Object.assign({},res.data);
      this.setData({
        team
      });
    })
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
  },
  userIsOwner() {
    return this.data.team.owner === this.data.userId
  }
})