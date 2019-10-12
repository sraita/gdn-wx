import store from '../store';
export default {
  // 检查 TOKEN 是否过期
  isTokenExpired: function () {
    let expiredTime = new Date(store.state.auth.token_expired_at).getTime() / 1000
    /*获取本地时间*/
    let nowTime = new Date().getTime() / 1000
    /*获取校验时间差*/
    let diffTime = JSON.parse(sessionStorage.diffTime)
    /*校验本地时间*/
    nowTime -= diffTime
    /*如果 < 10分钟，则说明即将过期*/
    return (expiredTime - nowTime) < 10 * 60
  },
  // 检查 REFRESH_TOEKN 是否过期
  isRefreshTokenExpired: function () {

  },
  // 获取登录token
  getLoginToken: function () {
    let token = sessionStorage.getItem('loginToken');
  },
  // 刷新 loginToken
  refreshLoginToken: function () {

  }

}