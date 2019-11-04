
let WHITE_LIST = ['login'];

function identityFilter(pageObj) {
  if (pageObj.onShow) {
    let _onShow = pageObj.onShow;
    pageObj.onShow = function () {
      //改动点
      let p = new Promise((resolve, reject) => {
        const token = wx.getStorageSync('loginToken');
        const userId = wx.getStorageSync('userId');
        if (token) {
          if (userId) {
            resolve();
          } else {
            try {
            // 拉取用户信息
            } catch (err) {
              reject(err);
            }
          }
        } else {
          reject();
        }
      })
      p.then(() => {
        //获取页面实例，防止this劫持
        let currentInstance = getPageInstance();
        _onShow.call(currentInstance);
        console.log('pass')
      }).catch(err => {
        console.log('reject')
        //跳转到登录页
        wx.redirectTo({
          url: "/pages/login"
        });
      });
    }
  }
  return pageObj;
}
function getPageInstance() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

exports.identityFilter = identityFilter;