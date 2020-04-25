const moment = require('moment');

const { Order } = require('../models/Order');
const { OrderProcess } = require('../models/OrderProcess');
const { resSuccess, resError } = require('../utils/response');


function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum);
      break;
    default:
      return 0;
      break;
  }
}

/**
 * 生成唯一订单号
 * YYYYMMDDHHmmss + (TYPE + MEETING_TYPE + TRANS_TYPE) + RANDOM(100)
 */
function build_order_no(type, meeting_type) {
  let tSN = type === 'normal' ? '6' : '9';
  let mSN = meeting_type === 'inquiry' ? '01' : '02';
  let minNum = 101,
      maxNum = 999;
  let sn = '';
  sn += tSN;
  sn += mSN;
  sn += moment().format('YYYYMMDDHHmmss');
  let r = randomNum(100, 999).toString();
  console.log(r);
  sn += r
  console.log(sn);
  return sn;
}
/**
 * 订单流程
 * 普通订单(电话会议): 提交订单(submit-order) --> 唐能翻译接单(order-taking) --> 匹配议员(match-translator) --> 确认服务信息(confirm-service) --> 唐能确认订单(confirm-order)
 * 普通订单(现场交传): 提交订单(submit-order) --> pv 审批(pv-approval) --> 唐能翻译接单(order-taking) --> 匹配议员(match-translator) --> 确认服务信息(confirm-service) --> 唐能确认订单(confirm-order)
 * 特殊订单: 提交订单(submit-order) --> 唐能翻译接单(order-taking) --> 唐能预估价格(predict-price) --> 匹配议员(match-translator) --> 确认服务信息(confirm-service) --> pv 审批(pv-approval) --> 唐能确认订单(confirm-order)
 */

module.exports = {
  // 新建订单
  newOrder: async (req, res, next) => {
    let obj = Object.assign(req.body,{
      sn: build_order_no(req.body.type)
    })
    let order = new Order(obj);
    await order.save();
    let ts = new Date();
    // 记录提交订单环节
    let order_process = new OrderProcess({
      order_id: order._id,
      status: 'success',
      code: 'submit-order',
      name: '提交订单',
      start_time: ts,
      end_time: ts,
    });
    await order_process.save();
    // 订单当前环节
    let process_name = '',
        process_code = '';
    
    if (order.type === 'normal' && order.meeting_type === 'onsite-meeting') { // 普通订单(现场交传)
      process_name = 'pv 审批';
      process_code = 'pv-approval';
    } else {
      process_name = '唐能翻译接单';
      process_code = 'order-taking';
    }
    let current_process = new OrderProcess({
      order_id: order._id,
      status: 'process',
      code: process_code,
      name: process_name,
      start_time: ts,
      end_time: null,
    });
    await current_process.save();
    let new_order = await Order.findByIdAndUpdate(order._id, {
      process_id: current_process._id,
      process_code: current_process.code,
      process_name: current_process.name
    },{new: true})
    console.log(current_process)
    res.json({code: 0, data: new_order}); 
  },
  // 唐能翻译接单
  takingOrder: async (req, res, next) => {
    let order = await Order.findById(req.params._id);
    let { isAccept, remark = '' } = req.body;  // 传入 isAccept 表示是否接单
    let ts = new Date(),
        current_process = null,
        new_order = null;

    if (order.process_code === 'order-taking') {
      if (isAccept) { // 接受订单
        // 1. 更新当前环节状态
        current_process = await OrderProcess.findByIdAndUpdate(order.process_id, {
          status: 'finish',
          finish_status: 'success',
          end_time: ts
        });
        // 2. 根据订单类型， 会议类型 生成订单下一环节信息
        let next_process = null,
            process_code = '';
        if (order.order_type === 'normal') { // 普通订单
          process_code = 'match-translator'
          next_process = new OrderProcess({
            order_id: order._id,
            status: 'process',
            finish_status: '',
            code: process_code,
            name: '匹配议员',
            start_time: ts,
            end_time: null,
          });
        } else { // 特殊订单
          process_code = 'predict-price';
          next_process = new OrderProcess({
            order_id: order._id,
            status: 'process',
            finish_status: '',
            code: process_code,
            name: '预估价格',
            start_time: ts,
            end_time: null,
          });
        }
        await next_process.save();
        // 3. 更新订单环节信息
        new_order = await Order.findByIdAndUpdate(req.params._id, {
          process_id: next_process._id,
          process_code: process_code,
          update_time: ts
        });
      } else { // 拒绝订单
        // 1. 更新当前环节状态
        current_process = await OrderProcess.findByIdAndUpdate(order.process_id,{
          status: 'finish',
          finish_status: 'fail',
          remark: remark,
          end_time: ts
        });
        // 2. 更新订单状态
        new_order = await Order.findByIdAndUpdate(req.params._id, {
          status: 'close',
          update_time: ts
        },{new: true});
      }

      res.json({code: 0, data: new_order});
    } else { // 订单没有处于等待唐能翻译接单环节
      res.status(400).json({
        code: -1,
        message: '当前订单无法进行接单操作，请检查订单状态'
      });
    }
  },
  // 匹配议员
  matchTranslator: async (req, res, next) => {
    let { translatorId } = req.body;

    let order = await Order.findById(req.params._id);
    let translator = await translator.findById(translatorId);
    if (!order) {
      return res.status(400),json({code: -1, message: '未找到订单'});
    }
    if (!translator) {
      return res.status(400),json({code: -1, message: '未找到指定议员,请重新选择'});
    }

    let ts = new Date(),
        next_process = null,
        process_code = '';

    let current_process = await OrderProcess.findByIdAndUpdate(order.process_id,{
      status: 'finish',
      finish_status: 'success',
      end_time: ts
    });

    // 生成下一环节
    process_code = 'confirm-service'
    next_process = new OrderProcess({
      order_id: order._id,
      status: 'process',
      finish_status: '',
      code: process_code,
      name: '确认服务信息',
      start_time: ts,
      end_time: null,
    });
    await next_process.save();
    // 更新订单当前环节
    new_order = await Order.findByIdAndUpdate(req.params._id, {
      process_id: next_process._id,
      process_code: process_code,
      update_time: ts
    },{new: true});
    res.json({code: 0, data: this.newOrder})
  },
  // 确认服务信息
  confirmService: async (req, res, next) => {
    const { isAccept, reason = '' } = req.body;
    let order = await Order.findById(req.params._id);
    if (!order) {
      return res.status(400), json({ code: -1, message: '未找到订单' });
    }

    let ts = new Date(),
        new_order = null,
        next_process = null,
        process_code = '',
        process_name = '';
    
    if (isAccept) { // 同意并确认服务
      // 1、生成下一环节信息
      if (order.type === 'normal') { // 普通订单
        process_code = 'confirm-order'
        process_name = '唐能确认订单'
      } else { // 特殊订单
        process_code = 'pv-approval'
        process_name = 'pv 审批'
        // 根据审批设置， 生成订单审批列表 & 发送待办通知(待审批)
        let approvalUsers = await TeamApprovalUser.find({team_id: order.team_id});
        let order_approval = null;
        if (approvalUsers.length === 0) {
          return res.status(400), json({ code: -1, message: '团队未进行审批配置, 无法确认订单，请联系团队管理员配置审批人员后重试！' });
        }
        for(let [i,v] of approvalUsers.entries()) {
          // 生成订单审批列表
          order_approval = new OrderApproval({
            order: order._id,
            status: 'wait',
            approver: v._id,
            comment: '',
            update_time: ts,
            approve_time: null
          });
          await order_approval.save();
          // 发送通知(站内信)，提醒进行审核
          let notify = new Notification({
            to: v._id,
            from: 'system',
            is_read: false,
            title: '订单等待审批 SN:'+order.sn,
            type: 'action', // action - 包含处理动作的通知, normal - 普通通知
            source_type: 'approval-order ', // approval-order - 订单审批, confirm-service - 确认服务信息
            source_id: order_id, // 对应的资源id
            create_time: ts,
            update_time: ts,
            extra: order
          });
        }

      }
      next_process = await new OrderProcess({
        order_id: order._id,
        status: 'process',
        finish_status: '',
        code: process_code,
        name: process_name,
        start_time: ts,
        end_time: null,
      });
      await next_process.save();
      // 2、更新订单环节
      new_order = await Order.findByIdAndUpdate(req.params._id, {
        process_id: next_process._id,
        process_code: process_code
      },{new: true});

    } else { // 不同意
      // 1、更新当前环节信息
      let current_process = await OrderProcess.findByIdAndUpdate(order.process_id, {
        status: 'finish',
        finish_status: 'fail',
        end_time: ts
      });
      // 2、更新订单状态
      new_order = await Order.findByIdAndUpdate(req.params._id, {
        status: 'close',
        close_reason: reason,
        update_time: ts
      });
    }

    res.json({code: 0, data: new_order});
  },
  // 唐能确认订单
  completeOrder: async (req, res, next) => {
    let order = await Order.findById(req.params._id);
    if (!order) {
      return res.status(400), json({ code: -1, message: '未找到订单' });
    }
    let ts = new Date();
    let current_process = await OrderProcess.findByIdAndUpdate(order.process_id, {
      status: 'finish',
      finish_status: 'success',
      end_time: ts
    });

    let new_order = await Order.findByIdAndUpdate(req.params._id, {
      status: 'done',
      confirm_time: ts,
      update_time: ts
    },{new: true});
    res.json({code: 0, data: new_order});
  },
  // 提交订单审批意见
  approvalOrder: async (req, res, next) => {
    let order = await Order.findById(req.params._id);
    if (!order) {
      return res.status(400), json({ code: -1, message: '未找到订单' });
    }

    const { approver, isAccept = false, comment = ''} = req.body;
    let ts = new Date();
    // 保存审批意见
    let new_approval = await OrderApproval.update({
      order: order._id, approver: approver
    },{
      $set:{
        status: isAccept ? 'pass': 'reject',
        comment: comment,
        approve_time: ts,
        update_time: ts
      }
    });

    // 判断是否全部审核通过
    let approvalStatus = 'pass'; 
    let new_order = null,
        current_process = null,
        next_process = null,
        process_code = '',
        process_name = '';

    // 
    let approvalList = await Order.find({order_id: req.params._id});
    for(let [i,v] of approvalList.entries()) {
      if (v.status == 'reject') {
        approvalStatus = 'reject';
        break;
      } 
      if (v.status == 'wait') {
        approvalStatus = 'wait';
        break;
      }
    } 


    if (approvalStatus === 'pass') { // 审批通过， 进入下一环节
      
      if (order.type === 'normal') { // 普通订单
        process_name = '唐能翻译接单';
        process_code = 'order-taking';
      } else { // 特殊订单
        process_name = '唐能确认订单';
        process_code = 'confirm-order';
      }
      // 更新订单当前环节状态
      current_process = await OrderProcess.findByIdAndUpdate(order.process_id, {
        status: 'finish',
        finish_status: 'success',
        end_time: ts
      });
      // 设置订单下一环节
      next_process =  new OrderProcess({
        order_id: order._id,
        status: 'process',
        finish_status: null,
        code: process_code,
        name: process_name,
        start_time: ts,
        end_time: null,
      });
      await next_process.save();
      // 更新订单环节信息
      new_order = await Order.findByIdAndUpdate(req.params._id, {
        process_id: next_process._id,
        process_code,
        process_name,
        update_time: ts,
      },{new: true});

    } else if (approvalStatus === 'fail') { // 审批回退
      // 更新订单当前环节状态
      let current_process = await OrderProcess.findByIdAndUpdate(order.process_id,{
        status: 'finish',
        finish_status: 'fail',
        end_time: ts
      });

      // 更新订单状态
      new_order = await Order.findByIdAndUpdate(req.params._id, {
        status: 'close', // 订单关闭
        update_time: ts
      },{new: true});
    }

    res.json({code: 0, data: new_order});

  },

  getOrders: async (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    let list = await Order.find({}).limit(limit)
    let total = await Order.countDocuments();
    res.json({code: 0, data: {
      list,
      total
    }})
  },
  // 获取订单信息
  info: async (req, res, next) => {
    let order = await Order.findById(req.params._id);
    res.json({code: 0, data: order});
  },
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
  // 获取订单环节信息
  orderProcess: async (req, res, next) => {
    let list = await OrderProcess.find({order_id: req.params._id});
    res.json({code: 0, data: list});
  }
  // 订单审批

  // 分配翻译人员
}