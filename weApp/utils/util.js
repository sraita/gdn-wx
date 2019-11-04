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

module.exports = {
  Toast: Toast
}
