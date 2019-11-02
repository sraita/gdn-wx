const {FlowTask} = require('../../models/work-flow/FlowTask');

const create = async function (req, res, next) {
  let task = await new FlowTask(req.body);

  task.save();
  res.json({
    status:'success',
    data: task
  });
}

const getTasksByNodeId = async function (req, res, next) {
  let {flow, node} = req.query;
  console.log(req.query)
  let list = await FlowTask.find({flow: flow, node: node});
  res.json({
    status: 'success',
    data: {
      list: list,
    }
  });
}

const updateById = async function (req, res, next) {
  let setObj = { ...req.body };
  delete setObj._id;
  let result = await FlowTask.findOneAndUpdate({ _id: req.params._id }, {
    $set: setObj
  });

  res.json({
    status: 'success',
    data: result
  })
}

const removeById = async function (req, res, next) {
  let result = await FlowTask.findOneAndRemove({ _id: req.params._id });

  res.json({
    status: 'success',
    data: result
  })
}

module.exports = {
  create,
  updateById,
  removeById,
  getTasksByNodeId
}