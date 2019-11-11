// components/nav-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    leftText: String,
    rightText: String,
    leftArrow: Boolean,
    fixed: {
      type: Boolean,
      value: true,
    },
    transparent: Boolean, // 透明背景
    theme: {
      type: String,
      value: 'dark'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickLeft:function(event) {

      // detail对象，提供给事件监听函数
      var myEventDetail = {
        id: event.currentTarget.dataset.id
      }
      // 触发事件的选项
      var myEventOption = {}
      // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
      this.triggerEvent('click-left', myEventDetail, myEventOption)
    },
    onClickRight: function (event) {

      // detail对象，提供给事件监听函数
      var myEventDetail = {
        id: event.currentTarget.dataset.id
      }
      // 触发事件的选项
      var myEventOption = {}
      // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
      this.triggerEvent('click-right', myEventDetail, myEventOption)
    }
  }
})
