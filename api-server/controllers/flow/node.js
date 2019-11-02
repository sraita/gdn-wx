const { FlowNode } = require('../../models/work-flow/FlowNode');
const { FlowTask } = require('../../models/work-flow/FlowTask');
const getList = async function (req, res, next) {
  const {flow} = req.query;
  console.log(req.query);
  let list = await FlowNode.find({flow:flow});
  res.send({
    status: 'success',
    data:{
      list: list
    }
  })
}

const create = async function (req, res, next) {
  const {
    flow, // 所属工作流Id
    node, // 上一节点Id
    name,
    type,
    condition
  } = req.body;

  let prevNode = await FlowNode.findOne({_id: node});
  let newNeode = new FlowNode({
    name,
    type,
    flow,
    condition
  });
  newNeode.next = prevNode.next;
  prevNode.next = newNeode;
  prevNode.save();
  newNeode.save();
  res.json({
    status:'success',
    data: newNeode
  })
}

const updateById = async function (req, res, next) {
  let setObj = {...req.body};
  delete setObj._id;
  let result = await FlowNode.findOneAndUpdate({_id: req.params._id},{
    $set:setObj
  });

  res.json({
    status: 'success',
    data: result
  })
}

const removeById = async function (req, res, next) {
  const {_id} = req.params;
  let node = await FlowNode.findOne({_id: _id});
  let prevNode = await FlowNode.findOne({next: _id});
  let nextNode = await FlowNode.findOne({_id: node.next});

  prevNode.next = nextNode._id;
  prevNode.save();
  await FlowTask.remove({node: _id});
  let result = await FlowNode.findOneAndRemove({ _id: req.params._id });

  res.json({
    status: 'success',
    data: result
  })
}
module.exports = {
  getList,
  create,
  updateById,
  removeById
}