const request = require('../utils/request.js');

module.exports = {
  getOrders: params => request('/api/orders', 'GET',params), 
  newOrder: params => request('/api/orders','POST',params),
  getUserOrders: (id,params) => request(`/api/user/${id}/orders`,'GET', params)
}