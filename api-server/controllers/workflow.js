const { WorkFlowCategory } = require('../models/work-flow/WorkFlowCategory');
const { WorkFlow } = require('../models/work-flow/WorkFlow');


// 工作流模型分类信息维护
// 新建分类
const createCategory = async function (req, res, next) {
  const {name} = req.body;
  let category = new WorkFlowCategory({name});
  category.save();
  res.json({
    status: 'success',
    data: category
  });
}

// 更新分类
const updateCategory = async function (req, res, next) {
  const { name } = req.body;
  let category = await WorkFlowCategory.findByIdAndUpdate(req.params._id, {name});
  res.json({
    status: 'success',
    data: category
  });
}

// 删除分类
const removeCategory = async function (req, res, next) {
  await WorkFlow.updateMany({category: req.params._id},{$set: {category: null}});
  let result = await WorkFlowCategory.findByIdAndRemove(req.params._id);
  res.json({
    status: 'success',
    data: result
  });
}

// 获取分类列表
const getCategories = async function (req, res, next) {
  let list = await WorkFlowCategory.find();
  res.json({
    status: 'success',
    data: {
      list
    }
  });
}

// 新建工作流模型
const create = async function (req, res, next) {
  let doc = new WorkFlow(req.body);
  doc.save();
  res.json({
    status: 'success',
    data: doc
  });
}
// 更新工作流模型
const updateById = async function (req, res, next) {
  let result = await WorkFlow.findByIdAndUpdate(req.params._id, req.body);
  res.json({
    status: 'success',
    data: result
  });
}
// 删除工作流模型
const removeById = async function (req, res, next) {
  let result = await WorkFlow.findByIdAndRemove(req.params._id);
  res.json({
    status: 'success',
    data: result
  });
}
// 获取工作流模型列表
const getList = async function (req, res, next) {
  let list = await WorkFlow.find().populate('category');
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
