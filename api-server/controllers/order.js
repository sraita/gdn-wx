const { Order } = require('../models/Order');
const { resSuccess, resError } = require('../utils/response');

module.exports = {
  getOrders: async (req, res, next) => {

  },
  newOrder: async (req, res, next) => {
    const newOrder = new Order(req.body);
    const  order = await newOrder.save();
    resSuccess(res, '订单创建成功', order);
  },
  // 更新订单的某个字段, 对应 PATCH
  // op: 'replace', 'push', 'pull', 'remove'
  // path,
  // value
  updateOrder: async (req, res, next) => {
    const { op } = req.body; // 更新或删除？

    const order = await Order.findByIdAndUpdate(req.params._id, req.body);
    resSuccess(res, '订单信息已更新', order);
  },
  // 删除订单
  deleteOrder: async (req, res, next) => {
    const order = await Order.findByIdAndRemove(req.params._id);
    if (!order) {
      return resError(res, 'order_not_exist','订单不存在');
    }
    resSuccess(res, '订单已删除', {});
  },
  // 订单审批

  // 分配翻译人员
}