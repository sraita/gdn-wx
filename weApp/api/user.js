var { get, post } = require('../utils/http.js');
const request = require('../utils/request.js');

const loginWithUnionId = (params => post('/auth/login-with-unionid', params));

module.exports = {
  login: (params => post('/api/user/wx-login', params)),
  getInfo: (token => get('/api/user/info', token)),
  getUserOrders: (id,params) => request(`/api/users/${id}/orders`,'get', params)
}