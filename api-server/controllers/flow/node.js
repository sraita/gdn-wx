const { FlowNode } = require('../../models/work-flow/FlowNode');
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
    flowId, // 所属工作流Id
    nodeId, // 上一节点Id
    name,
    type,
    condition
  } = req.body;

  let prevNode = await FlowNode.findOne({_id: nodeId});
  let node = new FlowNode({
    name,
    type,
    flow: flowId,
    condition
  });
  node.next = prevNode.next;
  prevNode.next = node;
  prevNode.save();
  node.save();
  res.json({
    status:'success',
    data: node
  })
}

module.exports = {
  getList,
  create,
  
}