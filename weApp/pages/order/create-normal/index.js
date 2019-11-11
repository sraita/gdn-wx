// pages/order/create-normal/index.js
const { formatDate, currencyFormater} = require('../../../utils/util.js');
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
      date: null,
      time: 'am',
      remark:''
    },
    isAggree: false,
    showDialog: false,
    langs:[
      {label:'英语',value:'en'},
      {label:'粤语',value: 'zh-Yue'}
    ],
    ampms: [
      {label:'上午', value:'am'},
      {label:'下午', value:'pm'},
      {label:'全天', value:'all'}
    ],
    displayDate: formatDate(new Date(), 'll'),
    displayTime: '上午',
    langDisplay:'',
    amount: currencyFormater(3050.7)
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
  onFieldChange: function (event) {
    const value = event.detail;
    const filed = event.target.id;
    let form = this.data.form;
    form[filed] = value;
    this.setData({
      form: form
    });
    console.log(form);
  },
  ampmPickerChange: function (event) {
    let datetime = event.detail.value;
    let [year, month, day, ampm] = event.detail.value;
    let form = this.data.form;
    form.date = new Date(year, month, day);
    form.time = this.data.ampms.filter(item => item.label == ampm)[0].value;
    this.setData({
      form: form,
      displayDate: formatDate(new Date(year, month, day), 'll'),
      displayTime: ampm
    });
  },
  bindPickerChange: function (event) {
    console.log(event);
    let form = this.data.form;
    let index = Number(event.detail.value);
    const { label, value } = this.data.langs[index];
    form.lang = value;
    this.setData({
      form: form,
      langDisplay: label
    });
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
  onSubmit: function (event) {
    console.log(event);
  }
})