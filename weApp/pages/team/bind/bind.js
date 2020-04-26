// pages/team/bind/bind.js
const {getTeams, joinTeam} = require('../../../api/team.js');
const { _, userId } = getApp();

const codeValidate = (rule, value, param, models) => {
  console.log(rule, value, param, models)
  if (/^[0-9]{4}$/.test(value)) {
    return '';
  } else {
    return '请输入4位数字确认码'
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    submiting: false,
    teams:[],
    teamIndex: 0,

    showTopTips: false,
    error:'',
    formData: {
      team: '',
      code: ''
    },
    rules: [
      {
        name: 'team',
        rules: { required: true, message: '请选择团队' },
      }, {
        name: 'code',
        rules: { validator: codeValidate}
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.setData({
      loading: true
    });
    getTeams({ disable_code: false }).then(res => {
      const { list } = res.data;
      this.setData({
        loading: false,
        teams: list,
        ['formData.team']: list.length === 0 ? '' : list[0]._id
      })
    }).catch(err => {
      this.setData({
        loading: false
      });
    })
  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  bindTeamChange(e) {
    console.log('lang Change 事件, value:', e.detail.value);
    const { field } = e.currentTarget.dataset
    const index = e.detail.value;
    this.setData({
      teamIndex: index,
      [`formData.${field}`]: this.data.teams[index]._id
    })
  },
  submitForm() {
    console.log(this)
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        _.showLoading('正在提交', true);
        this.setData({
          submiting: true
        })
        const {team, code} = this.data.formData;
        joinTeam(team, {
          code,
          userId: userId()
        }).then(res => {
          this.setData({
            submiting: false
          })
          _.toast(res.message, 'success');
        }).catch(err => {
          this.setData({
            submiting: false
          })
          _.toast(err.message, 'error');
        })
      }
    })
  }
})