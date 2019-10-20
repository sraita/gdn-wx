const { Org } = require('../models/org');
const { RoleGroup } = require('../models/RoleGroup');
const { Role } = require('../models/Role');
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

const createRoleGroup = async function (req, res, next) {
  let role_group = new RoleGroup(req.body);
  role_group.org = req.params._id;
  role_group.type = ['private'];
  
  role_group.save();
  res.json({
    status: 'success',
    data: role_group
  });
}

const getRoleGroups = async function (req, res , next) {
  let list = await RoleGroup.find({org: req.params._id}).populate('roles');
  res.json({
    status: 'success',
    data: {
      list,
    }
  });
};

// 新增角色(机构)
const createRole = async function (req, res, next) {
  let role = new Role(req.body);
  role.org = req.params._id;
  
  let role_group = await RoleGroup.findById(req.body.group);
  role_group.roles.push(role);
  role.save();
  role_group.save();
  res.json({
    status: 'success',
    data: role
  });
}
// 获取机构下所有的角色列表
const getRoles = async function (req, res, next) {
  let list = await Role.find({org: req.params._id});
  res.json({
    status: 'success',
    data: {
      list
    }
  })
}
// 获取机构角色组可授权的菜单列表
const getRoleGroupMenuList = async function (req, res, next) {
  let defaultRoleGroup = await RoleGroup.findOne({ org: req.params._id, type: { $in: ['default'] } }).populate('menus');
  res.json({
    status: 'success',
    data:{
      list: defaultRoleGroup.menus
    }
  });
};

// 获取某个菜单下课授权的页面元素
const getElementsByMenuId = async function (req, res, next) {

}

const getOptsByMenuId = async function (req, res, next) {
  
}


module.exports = {
  getList,
  getTree,
  create,
  getById,
  updateById,
  removeById,

  // 角色组管理
  createRoleGroup,
  getRoleGroups,
  // 角色管理
  createRole,
  getRoles,
  getRoleGroupMenuList, // 获取角色组可授权的菜单列表
}