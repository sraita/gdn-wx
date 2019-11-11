// custom-tab-bar/index.js
Component({
  data: {
    active: 0,
    color: "#7A7E83",
    activeColor: "#727cf5",
    list: [
      {
        pagePath: '/pages/index/index',
        text: "首页",
        icon: 'wap-home-o',
        iconActive: 'wap-home'
      },
      {
        pagePath: '/pages/order/index',
        text: "订单",
        icon: 'orders-o',
        iconActive: 'column'
      },
      {
        pagePath: '/pages/mime/index',
        text: "我的",
        icon: 'manager-o',
        iconActive: 'manager'
      }
    ]
  },
  //事件处理函数
  methods: {
    attached() {
    },
    onTabbarChange: function (event) {
      const index = event.detail
      const data = this.data.list[index]
      const url = data.pagePath
      wx.switchTab({ 
        url,
        fail: function (err) {
          console.log(err);
        }
      });
    },
    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(item => item.pagePath === `/${page.route}`)
      });
    }
  }
})