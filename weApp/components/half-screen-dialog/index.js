// components/half-screen-dialog/index.js
let countDownInterval = null;
const clearCountDown = function () {
  console.log('cl:',countDownInterval)
  if (countDownInterval) {
    clearInterval(countDownInterval);
    countDownInterval = null;
  }
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isTrue:{
      type:Boolean,
      value: false
    },
    title: String,
    subTitle: String,
    actions:{
      type: Array,
      value:[]
    },
    showCancel: Boolean,
    confirmText: String,
    countDown: Boolean,
    count:{
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    times: 0,
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setData({
        times: this.properties.count
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  observers: {
    'isTrue': function (isTrue) {
      clearCountDown();
      if (isTrue && this.data.countDown) {
        let times = this.data.count;
        let that = this;
        countDownInterval = setInterval(function () {
          if (times > 0) {
            times--;
            that.setData({
              times: times
            })
          } else {
            clearCountDown();
          }
        }, 1000);
      } else {
        this.setData({
          times: this.data.count
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    closeDialog: function (event) {
      this.setData({
        isTrue: false
      });
    },
    onSubmit: function (event) {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      this.triggerEvent('submit', myEventDetail, {})
      this.closeDialog();
    },
    onCancel: function (event) {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      this.triggerEvent('cancel', myEventDetail, {})
      this.closeDialog();
    }
  }
})
