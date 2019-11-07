var { get, post } = require('../../utils/http.js');
const loginWithUnionId = (params => post('/auth/login-with-unionid', params));

module.exports = {
  loginWithUnionId: loginWithUnionId,
  bindWeAppAccount: (params => post('/auth/bind-weapp-account',params)),
}