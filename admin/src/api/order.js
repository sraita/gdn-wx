import request from '@/utils/request'

export function getOrders(data = {},params = {}) {
  return request({
    url: '/orders/list',
    method: 'post',
    data,
    params
  })
}

export function getOrderInfo(id) {
  return request({
    url: `/orders/${id}/info`,
    method: 'get'
  })
}

/**
 * 接受订单
 * @param {*} id 
 * @param {*} data 
 */
export function acceptOrder(id,data) {
  return request({
    url: `/orders/${id}/accept`,
    method: 'post',
    data
  })
}
/**
 * 匹配议员
 * @param {*} id 
 * @param {*} data 
 */
export function matchTranslator(id,data) {
  return request({
    url: `/orders/${id}/match-trans`,
    method: 'post',
    data
  })
}