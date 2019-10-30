// 流程表单管理
const {FlowForm} = require('../../models/work-flow/FlowForm');

const create = async function (req, res, next) {
  const { name, flowId} = req.body;
  console.log(req.body)
  let doc = new FlowForm({
    name,
    flow: flowId
  });
  doc.save();
  res.json({
    status: 'success',
    data: doc
  });
}

const updateById = async function (req, res, next) {
  const { name } = req.body;
  let result = await FlowForm.updateOne({ _id: req.params._id }, {
    $set: {
      name
    }
  });
  res.json({
    status: 'success',
    data: result
  });
}

const design = async function (req, res, next) {
  const {config, list} = req.body;
  let result = await FlowForm.updateOne({_id: req.params._id},{
    $set:{
      config,
      list
    }
  });
  res.json({
    status: 'success',
    data: result
  });
}

const removeById = async function (req, res, next) {
  let result = await FlowForm.findByIdAndRemove(req.params._id);
  res.json({
    status: 'success',
    data: result
  });
}

const getList = async function (req,res, next) {
  let list = await FlowForm.find({flow: req.params._id});
  res.json({
    status: 'success',
    data: {
      list: list
    }
  });
}
module.exports = {
  create,
  updateById,
  design,
  removeById,
  getList
}


