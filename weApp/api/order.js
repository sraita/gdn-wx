const request = require('../utils/request.js');

module.exports = {
  getOrders: params => request('/api/orders', 'GET',params), 
  newOrder: params => request('/api/orders','POST',params)
}