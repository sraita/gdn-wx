const { Org } = require('../models/org');
const { construct, destruct } = require('@aximario/json-tree');

const getList = async function (req, res, next) {
  let query = JSON.stringify(req.query);
  const { page = 1, limit = 10 } = JSON.parse(query, (k, v) => {
    // 自动处理数字格式
    if (k === 'limit' || k === 'page') {
      return parseInt(v);
    }
    return v;
  });
  const skip = (page - 1) * limit;
  console.log(query)

  const total = await Org.countDocuments();
  // populate 进行表关联查询
  const list = await Org.find({}).limit(limit).skip(skip);
  res.json({
    message: 'ok',
    data: {
      total: total,
      list: list
    }
  })
}

const getTree = async function (req, res, next) {

  const list = await Org.find({});
  // console.log(list)
  res.json({
    status: 'ok',
    data: construct([
      { id: 6, parent_id: 2, data: '这是其他数据' },
      { id: 7, parent_id: 3, data: '这是其他数据' },
      { id: 2, parent_id: 1, data: '这是其他数据' },
      { id: 4, parent_id: 2, data: '这是其他数据' },
      { id: 1, parent_id: 0, data: '这是其他数据' },
      { id: 9, parent_id: 5, data: '这是其他数据' },
      { id: 8, parent_id: 3, data: '这是其他数据' },
      { id: 3, parent_id: 1, data: '这是其他数据' },
      { id: 5, parent_id: 2, data: '这是其他数据' },
      { id: 10, parent_id: 6, data: '这是其他数据' }
    ], {
      id: 'id',
        pid: 'parent_id',
      children: 'kids'
    })
  })
}

const create = async function (req, res, next) {
  const isExist = await Org.findOne({
    code: req.body.code
  })
  if (isExist) {
    return res.status(422).send({
      status: 'error',
      name: 'OrgIsExist',
      message: '该组织机构已存在'
    })
  }

  const data = await Org.create(req.body)
  res.json({
    status: 'ok',
    data: data
  });
}

const getById = async function (req, res, next) {

}
const updateById = async function (req, res, next) {

}

const removeById = async function (req, res, next) {

}

module.exports = {
  getList,
  getTree,
  create,
  getById,
  updateById,
  removeById,
}