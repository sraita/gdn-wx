// pages/order/create-normal/index.js
const { formatDate, currencyFormater } = require('../../../utils/util.js');
const { newOrder } = require('../../../api/order');
const { deepClone } = require('../../../utils/util.js');
import WxValidate from '../../../utils/WxValidate';
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
    years: [],
    months: [],
    days: [],
    value: [8, 1, 1],//默认滚动的索引值
    ampms: [],

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

    isAgree: false,
    formData: {
      name: '',
      mobile: '',

      analysor: '',
      subject: '',
      address: ''
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
    showDialog: false,
    // 会议时间
    datetime: [new Date(), 'am'],
    
    ampms: [
      { label: '上午', value: 'am' },
      { label: '下午', value: 'pm' },
      { label: '全天', value: 'day' }
    ],
    ampmIndex: 0,
    datetime: [new Date(), 'am'],
    displayDatetime: [formatDate(new Date(), 'll'), '上午'],
    amount: currencyFormater(3050.7)
  },
  onLoad() {
    this.initValidate();
    this.initDatetime();
  },
  onShow: function () {
  },
  pageBack: function () {
    wx.navigateBack({

    });
  },
  initValidate() {
    this.wxValidate = new WxValidate({
      name: { required: true },
      mobile: {
        required: true,
        tel: true
      },
      analysor: { required: true },
      subject: { required: true },
      address: { required: true },
      // datetime: {required: true},
      transType: { required: true },
      projectType: { required: true },
    }, {
      name: { required: '请输入联系人姓名' },
      mobile: {
        required: '请输入联系电话',
        tel: '请输入11位的手机号码'
      },
      analysor: { required: '请输入分析师姓名' },
      subject: { required: '请输入会议主题' },
      address: { required: '请输入会议地点' },
      // datetime: { required: '请选择会议时间'},
      transType: { required: '请选择翻译类型' },
      projectType: { required: '请选择项目类型' },
    });
  },
  initDatetime() {
    this.setData({
      datetime: [new Date(), 'am'],
      displayDatetime: [formatDate(new Date(), 'll'), '上午']
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

    var langs = this.data.langs;
    this.setData({
      langIndex: e.detail.value
    })
  },
  bindTypeChange(e) {
    console.log('type Change 事件, value:', e.detail.value);

    var types = this.data.types;
    this.setData({
      typeIndex: e.detail.value
    })
  },
  bindDateTap(e) {
    console.log(e)
    this.setData({
      showDateDialog: true
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
  onTranstypeChange(event) {
    this.setData({
      langIndex: event.detail.value
    })
  },
  onProjectChange(event) {
    this.setData({
      typeIndex: event.detail.value
    })
  },
  onCheckBoxChange: function (event) {
    console.log(event.detail);
    if (this.data.isAgree) {
      this.setData({
        isAgree: false
      })
    } else {
      this.setData({
        showDialog: true
      });
    }
  },
  onDialogSubmit: function (event) {
    this.setData({
      showDialog: false,
      isAgree: true
    });
  },
  formSubmit: function (event) {
    const params = event.detail.value;
    const { isAgree, datetime } = this.data;
    if (!this.wxValidate.checkForm(params)) { // 联系人表单校验未通过
      const validateErr = this.wxValidate.errorList[0];
      return _.toast(validateErr.msg);
    };
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
  },
  
  bindDateChangeStart(e) {
    // valIndex 是获取到的年月日在各自集合中的下标
    const valIndex = e.mp.detail.value
    // console.log(JSON.stringify(e.mp.detail.value))
    let year = this.years[valIndex[0]]
    let month = this.months[valIndex[1]]
    let day = this.days[valIndex[2]]
    // 滚动时再动态 通过年和月获取 这个月下对应有多少天
    this.getMonth(year, month, day)
  },
  submitForm() {
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
        wx.showToast({
          title: '校验通过'
        })
      }
    })
  }
})