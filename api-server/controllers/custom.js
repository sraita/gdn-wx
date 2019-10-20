const { User } = require('../models/user');
const { Org } = require('../models/org');
const { Custom } = require('../models/custom');
const { RoleGroup } = require('../models/RoleGroup');
const { Role} = require('../models/Role');

const create = async function (req, res, next) {
  try {
    const isExist = await Custom.findOne({name:req.body.name});
    if (isExist) {
      return res.status(422).send({
        message: '客户已存在，不能重复添加'
      });
    }
    const accountIsExist = await User.findOne({username: req.body.account});
    if (accountIsExist) {
      return res.status(422).json({
        status: 'error',
        message: '账号已被使用'
      });
    }
    // 1. 创建对应客户管理员
    let owner = new User({
      username: req.body.account,
      password: req.body.password,
      name: req.body.ownerName,
      mobile: req.body.ownerMobile
    });
    // 2. 建立对应的组织机构
    let org = new Org({
      name: req.body.name,
      parent: null,
      type: 'company',
      status: 1,
    });
    // 3. 设置机构默认管理员
    org.owner = owner._id;
    owner.orgs = [org._id];
    owner.rootOrg = org._id;
    
    // 4. 生成机构默认可分配权限表
    let role_group = await RoleGroup.findById(req.body.roleGroupId);
  
    org.defaultRoleGroup = role_group;
    owner.roles = role_group.roles;

    owner.save();
    org.save();
    return res.json({
      status: 'success',
      data: org
    });
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
  Org.findByIdAndUpdate(req.params._id, {
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
  Org.findByIdAndRemove(req.params._id, (err, result) => {
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

  // populate 进行表关联查询
  const list = await Org.find({parent: null}).limit(limit).skip(skip).populate('owner').populate('defaultRoleGroup');
  res.json({
    status: 'success',
    data: {
      total: list.length,
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