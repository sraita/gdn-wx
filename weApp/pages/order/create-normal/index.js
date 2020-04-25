// pages/order/create-normal/index.js
const { formatDate, currencyFormater } = require('../../../utils/util.js');
const { newOrder } = require('../../../api/order');
const { deepClone } = require('../../../utils/util.js');
const { _, userId } = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    showDateDialog: false,
    dateDialogButtons:[
      {
        type: 'primary',
        className: '',
        text: '确定',
        value: 1
      }
    ],

    // 翻译类型
    langs: [
      { label: '英语', value: 'en' },
      { label: '粤语', value: 'zh_Yue' }
    ],
    langIndex: 0,

    // 项目类型
    types: [
      { label: 'Onside Meeting', value: 'meeting' },
      { label: 'Inquiry', value: 'inquiry' }
    ],
    typeIndex: 0,

    showDialog: false,
    // 会议时间
    displayDate: '',
    displayTime: '',
    ampms: [
      { label: '上午', value: 'am' },
      { label: '下午', value: 'pm' },
      { label: '全天', value: 'day' }
    ],
    ampmIndex: 0,
    amount: currencyFormater(4550),
    isAgree: false,
    countDown:5,
    countDownInterval: null,
    formData: {
      name: '',
      mobile: '',

      analysor: '',
      subject: '',
      address: '',

      date:'2020-08-11',
      transType: 'en',
      projectType: 'meeting',
      amount: 4550
    },
    rules: [{
      name: 'name',
      rules: { required: true, message: '请输入联系人姓名' },
    }, {
      name: 'mobile',
      rules: [{ required: true, message: '请输入联系电话' }, { mobile: true, message: '请输入正确的联系电话' }],
    }, {
      name: 'analysor',
      rules: { required: true, message: '请输入分析师名字' },
    }, {
      name: 'subject',
      rules: { required: true, message: '请输入会议主题' },
    }, {
      name: 'address',
      rules: { required: true, message: '请输入会议地点' },
    }],
  },
  onLoad() {
    this.initDatetime();
  },
  onShow: function () {
  },
  pageBack: function () {
    wx.navigateBack();
  },

  initDatetime() {
    const date = new Date()
    const nowYear = date.getFullYear()
    const nowMonth = date.getMonth()
    const nowDay = date.getDate()

    this.setData({
      ['formData.date']: [nowYear, nowMonth, nowDay],
      ['formData.time']: this.data.ampms[0].value,
      displayDate: formatDate(date, 'll'),
      displayTime: this.data.ampms[0].label
    });
  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  bindLangChange(e) {
    console.log('lang Change 事件, value:', e.detail.value);
    const { field } = e.currentTarget.dataset
    const index = e.detail.value;
    this.setData({
      langIndex: index,
      [`formData.${field}`]: this.data.langs[index].value
    })
  },
  bindTypeChange(e) {
    console.log('type Change 事件, value:', e.detail.value);
    const { field } = e.currentTarget.dataset
    const index = e.detail.value;
    this.setData({
      typeIndex: index,
      [`formData.${field}`]: this.data.types[index].value
    })
  },
  bindDateTap(e) {
    this.setData({
      showDateDialog: true
    })
  },
  bindDateChange(event) {
    let value = event.detail.value;
    const [year, month, day] = value;
    this.setData({
      [`formData.date`]: [year,month,day],
      displayDate: formatDate(new Date(year, month, day), 'll')
    })
  },
  bindTimeChange(event) {
    let index = event.detail.value[0];
    let amount = 4550
    if (this.data.ampms[index].value == 'day') {
      amount = 6500;
    }
    this.setData({
      ampmIndex: index,
      displayTime: this.data.ampms[index].label,
      [`formData.time`]: this.data.ampms[index].value,
      amount: currencyFormater(amount),
      [`formData.amount`]: amount,
    })
  },
  ampmPickerChange: function (event) {
    let [year, month, day, ampm] = event.detail.value;
    const date = new Date(year, month, day);
    const time = this.data.ampms.filter(item => item.label == ampm)[0].value;
    let amount = 4550;
    if (time == 'day') {
      amount = 6500
    }
    this.setData({
      amount: currencyFormater(amount),
      datetime: [date, time],
      displayDatetime: [formatDate(new Date(year, month, day), 'll'), ampm],
    });
  },
  onCheckBoxChange: function (event) {
    let _this = this;
    if (this.data.countDownInterval) {
      clearInterval(this.data.countDownInterval);
    }
    if (this.data.isAgree) {
      this.setData({
        isAgree: false
      })
    } else {
      let countDown = 5
      let interval = setInterval(() => {
        if (countDown > 0) {
          countDown--;
          _this.setData({
            countDown
          })
        } else {
          clearInterval(interval)
        }
      },1000);
      this.setData({
        countDown: 5,
        countDownInterval: interval,
        showDialog: true,
      });
    }
  },
  onDialogSubmit: function (event) {
    this.setData({
      showDialog: false,
      isAgree: true
    });
  },

  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      console.log(this.data.formData)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        wx.showToast({
          title: '校验通过'
        })
        if (!isAgree) {
          return _.alert('请阅读并同意《唐能翻译合约条款》', '提示', '我知道了');
        }
        let orderParams = {
          creator: userId,
          type: 'normal',
          contact: {
            name: params.name,
            mobile: params.mobile
          },
          meeting: {
            subject: params.subject,
            analysor: params.analysor,
            transType: params.transType,
            projectType: params.projectType,
            address: params.address,
            date: datetime[0],
            time: datetime[1]
          }
        };

        _.showLoading('正在提交', true);
        newOrder(orderParams).then(res => {
          const { _id } = res.data;
          _.toast(res.message, 'success');
        }).catch(err => {
          _.hideLoading();
          _.toast(res.message, 'error');
        })
        
      }
    })
  }
})