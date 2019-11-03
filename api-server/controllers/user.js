const jwt = require('jsonwebtoken');

var { User } = require('../models/user');
const { Role } = require('../models/Role');
const {SECRET} = require('../config');


const create = async function (req, res) {
  console.log(req.body);
  const isUserHas = await User.findOne({
    username: req.body.username
  })
  if (isUserHas) {
    return res.status(422).send({
      message: '用户名重复'
    })
  }

  const user = await User.create(req.body)
  res.send(user);
}

const getById = async function (req, res) {
  console.log(req.params)
  const data = await User.findById(req.params._id).populate('org').populate('roles').populate('department');
  res.json({
    status: 'success',
    data:data
  });
}

const updateById = async function (req, res) {
  const _id = req.params._id;
  let setObj = {...req.body};
  let result = await User.findOneAndUpdate({_id: _id},{
    $set: setObj
  });
  res.json({
    status: 'success',
    data: result
  });
}

const removeById = async function (req, res) {
  
}
const getUsers = async function (req, res) {
  let query = JSON.stringify(req.query);
  const { page = 1, limit = 10 } = JSON.parse(query, (k, v)=>{
    // 自动处理数字格式
    if (k === 'limit' || k === 'page') {
      return parseInt(v);
    }
    return v;
  });
  const skip = (page - 1) * limit;
  console.log(query)

  const total = await User.countDocuments();
  const list = await User.find({}).limit(limit).skip(skip).populate("departments").populate("roles").populate('org');
  res.json({
    status: 'success',
    data:{
      total: total,
      list: list
    }
  })
};

// 修改密码 - 管理员
const changePass = async function (req, res, next) {
  const {password } = req.body;
  let result = await User.findOneAndUpdate({_id: req.params._id},{
    $set: {password:password}
  });
  res.json({
    status: 'success',
    data: result
  })
}

module.exports = {
  create,
  getById,
  updateById,
  removeById,
  getUsers,
  changePass
};
