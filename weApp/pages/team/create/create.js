// pages/team/create/create.js
var { Toast } = require('../../../utils/util.js')
const { newTeam, updateTeam} = require('../../../api/team.js');

const defaultTeam = {
  name: '', // 团队名称
  logo: '',
  introduction: '', // 介绍
  owner: null, // 所有者
  contact: null, // 联系人信息
  reviewers: [], // 审核人员
  createAt: null,
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    team: Object.assign({},defaultTeam)
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

  keyInput: function (e) {
    const field = e.currentTarget.dataset.field;
    let team = Object.assign({},this.data.team);
    team[field] = e.detail.value;
    this.setData({
      team: team
    });
  }, 
  submit: function(e) {
    wx.showLoading({
      title: '处理中',
    });
    newTeam(this.data.team).then(res => {
      console.log(res);
      Toast('创建成功', 'success');
      
    }).catch(err => {
      Toast('团队创建失败!', 'error');
    }).finally(() => {
      wx.hideLoading();
    })
  }
})