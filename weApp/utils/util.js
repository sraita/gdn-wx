const moment = require('lib/moment.min.js');
const CurrencyFormatter = require('lib/currencyFormatter.min.js');
moment.locale('en', {
  longDateFormat: {
    'l': 'YYYY-MM-DD',
    'L': 'YYYY-MM-DD HH:mm:ss',
    'll': "YYYY年MM月DD日",
    'LL': "YYYY年MM月DD日 HH:mm:ss"
  }
});

const Toast = function (message, type) {
  console.log('/images/icon/' + type.png)
  return wx.showToast({
    title: message,
    image: `/images/icon/${type}.png`,
    duration: 3000,
    mask: true,
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}

const formatDate = function (date,locale = 'L') {
  return moment(date).format(locale);
}

const currencyFormater = function (value) {
  return CurrencyFormatter.format(value, { 
    currency: 'CNY',
    locale: 'zh_Hans'
  });
}
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param { Object } source
 * @returns { Object }
*/
const deepClone =  function (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
module.exports = {
  Toast: Toast,
  formatDate: formatDate,
  currencyFormater: currencyFormater,
  // 检查用户是否登录
  isLogin: () => {
    return wx.getStorageSync('loginToken');
  },
  checkLoginState: () => {
    const token = wx.getStorageSync('loginToken');
    if (!token) {
      wx.navigateTo({
        url: '../pages/login/login',
      });
    }
  },
  deepClone
}
