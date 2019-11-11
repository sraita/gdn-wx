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
module.exports = {
  Toast: Toast,
  formatDate: formatDate,
  currencyFormater: currencyFormater
}
