const request = require('../utils/request.js');

module.exports = {
  getOrders: params => request('/api/orders', 'GET',params), 
  newOrder: params => request('/api/orders','POST',params),
  getOrder: id => request(`/api/orders/${id}/info`, 'GET')
}