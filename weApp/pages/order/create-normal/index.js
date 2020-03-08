// pages/order/create-normal/index.js
const { formatDate, currencyFormater} = require('../../../utils/util.js');
const { newOrder } = require('../../../api/order');
const { deepClone } = require('../../../utils/util.js');
import WxValidate from '../../../utils/WxValidate';
const { _ } = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      name:'',
      mobile:'',
      analysor: '',
      subject: '',
      address:'',
      lang: '',
      datetime: [new Date(), 'am'],
      remark:'',
      transType: 'en',
      transTypeLabel: '英语',
      projectType: 'meeting',
      projectTypeLabel: 'Onside Meeting',
    },
    isAggree: false,
    showDialog: false,
    // 会议时间
    datetime: [new Date(), 'am'],
    // 翻译类型
    langs:[
      {label:'英语',value:'en'},
      {label:'粤语',value: 'zh_Yue'}
    ],
    langIndex: 0,
    // 项目类型
    types: [
      { label: 'Onside Meeting', value:'meeting'},
      { label: 'Inquiry', value: 'inquiry'}
    ],
    typeIndex: 0,
    ampms: [
      {label:'上午', value:'am'},
      {label:'下午', value:'pm'},
      { label: '全天', value:'day'}
    ],
    datetime: [new Date(),'am'],
    displayDatetime: [formatDate(new Date(), 'll'),'上午'],
    amount: currencyFormater(3050.7)
  },
  onLoad() {
    this.initValidate();
    this.initDatetime();
  },
  onShow: function () {
    let form = this.data.form;
    form.date = new Date();
    this.setData({
      form: form
    });
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
      transType: {required: true},
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
      transType: { required: '请选择翻译类型'},
      projectType: { required: '请选择项目类型'},
    });
  },
  initDatetime() {
    this.setData({
      datetime: [new Date(), 'am'],
      displayDatetime: [formatDate(new Date(), 'll'), '上午']
    });
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
    if (this.data.isAggree) {
      this.setData({
        isAggree: false
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
      isAggree: true
    });
  },
  formSubmit: function (event) {
    const params = event.detail.value;
    const { isAggree, datetime} = this.data;
    if (!this.wxValidate.checkForm(params)) { // 联系人表单校验未通过
      const validateErr = this.wxValidate.errorList[0];
      return _.toast(validateErr.msg);
    };
    if (!isAggree) {
      return _.alert('请阅读并同意《唐能翻译合约条款》', '提示', '我知道了');
    }

    let orderParams = {
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

    _.showLoading('正在提交',true);
    newOrder(orderParams).then(res => {
      const {_id} = res.data;
      _.toast(res.message,'success');
    }).catch(err => {
      _.hideLoading();
      _.toast(res.message, 'error');
    })
  }
})