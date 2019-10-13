const { User } = require('../models/user');
const { Custom } = require('../models/custom');

const create = async function (req, res, next) {
  try {
    // 1. 创建对应客户管理员
    const isExist = await Custom.findOne({name:req.body.name});
    if (isExist) {
      return res.status(422).send({
        message: '客户已存在，不能重复添加'
      });
    }
    let custom = Custom.create(req.body);
    return getList(req, res, next);
  } catch (e) {
    console.log(e)
    res.status(500).json({
      status: 'error',
      message: '客户添加失败'
    });
  }
}

const getById = function (req, res, next) {

}
const updateById = function (req, res, next ) {
  Custom.findByIdAndUpdate(req.params._id, {
    $set: req.body
  },(err, result) => {
    if (err) {
      res.status(500).json({
        status: 'error',
        message: '更新失败'
      });
    } else {
      return getList(req, res, next);
    }
  });
}

const removeById = function (req, res, next) {
  Custom.findByIdAndRemove(req.params._id, (err, result) => {
    if (err) {
      res.status(500).json({
        status: 'error',
        message: '删除'
      });
    } else {
      return getList(req, res, next);
    }
  });
}

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

  const total = await Custom.countDocuments();
  // populate 进行表关联查询
  const list = await Custom.find({}).limit(limit).skip(skip);
  res.json({
    message: 'ok',
    data: {
      total: total,
      list: list
    }
  })
}

module.exports = {
  create,
  getList,
  getById,
  updateById,
  removeById
}