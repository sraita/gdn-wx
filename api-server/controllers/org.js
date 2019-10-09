const { Org } = require('../models/org');

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

const getTree = function (req, res, next) {
  Org.find({ _id: req.body.parent }).populate('children')

    .exec(function (err, orgs) {

      if (err) {

        console.log(err)

      }

      // res.send('test')

      res.json({
        status: 'ok',
        data: orgs
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