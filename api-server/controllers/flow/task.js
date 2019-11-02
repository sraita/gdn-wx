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

module.exports = {
  create,
  getTasksByNodeId
}