const jwt = require('jsonwebtoken');

var { User } = require('../models/user');
const { Role } = require('../models/Role');
const {SECRET} = require('../config');


const createUser = async function (req, res) {
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


const getUserById = async function (req, res) {
  console.log(req.params)
  const data = await User.findById(req.params._id).populate('org').populate('roles').populate('department');
  res.json({
    status: 'success',
    data:data
  });
}

const updateUserById = async function (req, res) {
  
}

const deleteUserById = async function (req, res) {
  
}
const getUserList = async function (req, res) {
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

// 获取用户菜单列表
const getMenus = async function (req, res, next) {
  const _id = req.body._id;
  console.log(req.body)

  let user = await User.findOne(_id);
  console.log(user)
  let roles = await Role.find({_id:{$in: user.roles}}).populate('menus');
  res.json({
    status: 'success',
    data:{
      list: roles.menus
    }
  });
}

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserList,
  getMenus
};
