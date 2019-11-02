const { FlowCategory } = require('../models/work-flow/FlowCategory');
const { Flow } = require('../models/work-flow/Flow');
const { FlowNode } = require('../models/work-flow/FlowNode');

// 工作流模型分类信息维护
// 新建分类
const createCategory = async function (req, res, next) {
  const {name} = req.body;
  let category = new FlowCategory({name});
  category.save();
  res.json({
    status: 'success',
    data: category
  });
}

// 更新分类
const updateCategory = async function (req, res, next) {
  const { name } = req.body;
  let category = await FlowCategory.findByIdAndUpdate(req.params._id, {name});
  res.json({
    status: 'success',
    data: category
  });
}

// 删除分类
const removeCategory = async function (req, res, next) {
  await Flow.updateMany({category: req.params._id},{$set: {category: null}});
  let result = await FlowCategory.findByIdAndRemove(req.params._id);
  res.json({
    status: 'success',
    data: result
  });
}

// 获取分类列表
const getCategories = async function (req, res, next) {
  let list = await FlowCategory.find();
  res.json({
    status: 'success',
    data: {
      list
    }
  });
}

// 新建工作流程定义
const create = async function (req, res, next) {
  let flow = new Flow(req.body);
  // 初始化Start 环节 和 End 环节
  let start = new FlowNode({
    name: 'Start',
    type: 'start',
    flow: flow,
  });
  let end = new FlowNode({
    name: 'End',
    type: 'end',
    flow: flow,
    next: null
  });
  start.next = end;
  
  start.save();
  end.save();
  flow.save();
  res.json({
    status: 'success',
    data: flow
  });
}
// 更新工作流
const updateById = async function (req, res, next) {
  let result = await Flow.findByIdAndUpdate(req.params._id, req.body);
  res.json({
    status: 'success',
    data: result
  });
}
// 删除工作流
const removeById = async function (req, res, next) {
  let result = await Flow.findByIdAndRemove(req.params._id);
  res.json({
    status: 'success',
    data: result
  });
}
// 获取工作流模型列表
const getList = async function (req, res, next) {
  let list = await Flow.find().populate('category');
  res.json({
    status: 'success',
    data: {
      list
    }
  });
}


module.exports = {
  // 模型分类
  createCategory,
  updateCategory,
  removeCategory,
  getCategories,

  // 模型管理
  create,
  updateById,
  removeById,
  getList
};
