var createError = require('http-errors');
const { construct, destruct } = require('@aximario/json-tree');

const { Team } = require('../models/Team');
const { User } = require('../models/user');
const { Role } = require('../models/Role');

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

  const total = await Team.countDocuments();
  // populate 进行表关联查询
  const list = await Team.find({}).populate('manager').limit(limit).skip(skip);
  res.json({
    status:'success',
    data: {
      total: total,
      list: list
    }
  })
}

const create = async function (req, res, next) {
  const {name,remark, manager_name, manager_password, manager_mobile} = req.body;
  const isExist = await Team.findOne({
    name: name
  })
  if (isExist) {
    return res.status(422).send({
      status: 'error',
      name: 'OrgIsExist',
      message: '该团队已存在'
    })
  }

  let manager = await User.findOne({ username: manager_mobile});
  if (!manager){
    manager = new User({
      username: manager_mobile,
      name: manager_name,
      mobile: manager_mobile,
      password: manager_password
    });
  }
  let role = await Role.findOne({code: 'team_manager'});

  let team = new Team({
    name,
    remark,
  });
  console.log(team)
  team.manager = manager;
  manager.team = team;
  role && manager.roles.push(role);

  manager.save();
  team.save();
  
  res.json({
    status: 'success',
    data: team
  });
}

const updateById = async function (req, res, next) {
  let result = await Team.findOneAndUpdate({ _id: req.params._id },{
    $set: req.body
  });
  res.json({
    status: 'success',
    data: result
  });
}

const removeById = async function (req, res, next) {
  let result = await Team.findOneAndRemove({_id: req.params._id});
  res.json({
    status: 'success',
    data: result
  });
}

// 添加成员
const addMember = async function (req, res, next) {
  let { mobile, name, email, departments, roles} = req.body;
  let isExist = await User.findOne({username: mobile});
  if (isExist) {
    return next(createError(409,'用户已存在！'))
  }
  let sources = await generateDepartmentSources(departments)

  let user = new User({
    username: mobile,
    name,
    mobile,
    email, 
    password: req.body.mobile.slice(-6), // 默认密码为手机号后6位
    departments,
    roles
  });

  
  user.org = req.params._id;
  user.departmentSources = sources; 
  console.log(user);

  user.save();
  res.json({
    status: 'success',
    data: user
  });
}

// 获取成员列表
const getMembers = async function (req, res, next) {
  let {_id, departmentId} = req.params;
  let selector = {org: _id};
  if (departmentId != '0') {
    selector['departmentSources'] = {$in:[departmentId]};
  }
  list = await User.find(selector).populate('departments').populate('roles');
  res.json({
    status: 'success',
    data:{
      list: list,
      total: list.length
    }
  });
}

module.exports = {
  getList,
  create,
  updateById,
  removeById,


  // 成员管理（员工管理）
  addMember,
  getMembers
}