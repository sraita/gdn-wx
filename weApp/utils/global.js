// 全局辅助工具方法， 将会直接 挂载到 APP._

module.exports = {
  toast: (message, type = 'text', options) => {
    if (typeof options !== 'object') {
      options = {
        duration: 3000,
        mask: true
      };
    }
    let params = {
      title: message,
      duration: options.duration,
      mask: options.mask,
      icon: 'none'
    };

    if (type !== 'text') {
      params.image = `/images/icon/${type}.png`
    }
    return new Promise((resolve, reject) => {
      wx.showToast({
        ...params,
        success: function (res) {
          resolve();
        },
        fail: function (res) {
          reject(res);
        },
      });
    });
  },
  hideToast: () => {
    wx.hideToast();
  },
  alert: (message, title = '提示', confirmText = '确定') => {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title,
        content: message,
        showCancel: false,
        confirmText: confirmText,
        // confirmColor: '',
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        }
      })
    });
  },
  confirm: (message, title = '提示', options) => {
    if (typeof options !== 'object') {
      options = {}
    }
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title,
        content: message,
        showCancel: true,
        cancelText: options.cancelText ? options.cancelText : '取消',
        // cancelColor: '',
        confirmText: options.confirmText ? options.confirmText : '确定',
        // confirmColor: '',
        success: function (res) {
          if (res.confirm) {
            resolve();
          } else {
            reject();
          }
        },
        fail: function (res) {
          reject(res);
        },
      })
    });
  },
  actionSheeet: (itemList) => {
    return new Promise((resolve, reject) => {
      wx.showActionSheet({
        itemList,
        success(res) {
          resolve(res.tapIndex);
        },
        fail(res) {
          reject(res.errMsg)
        }
      });
    });
  },
  showLoading: (message, mask = false) => {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: message,
        mask,
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        }
      });
    });
  },
  hideLoading: () => {
    return new Promise((resolve, reject) => {
      wx.hideLoading({
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        }
      })
    });
  },
  getTeamInfo:() => {

  },
  getTeamId:() => {
    
  }
}