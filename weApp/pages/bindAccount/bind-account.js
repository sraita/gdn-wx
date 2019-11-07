// pages/bindAccount/band-account.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    mobile: '',
    openId: wx.getStorageSync('openId'),
    validateMessage:{
      mobile: ''
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  onMobileChange(event) {
    // event.detail 为当前输入的值
    this.setData({
      mobile:event.detail
    });
  },
  onSubmit() {
    let _validateMessage = this.data.validateMessage;
    if (!this.data.mobile) {
      _validateMessage.mobile = '请输入手机号'
      this.setData({
        validateMessage: _validateMessage
      });
      return false;
    }
    app.api.auth.bindWeAppAccount({
      openId: this.data.openId,
      mobile: this.data.mobile
    }).then(res => {

    }).catch(err => {

    });
  }
})