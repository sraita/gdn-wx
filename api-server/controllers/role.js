var { Role } = require('../models/Role');
var { RoleGroup } = require('../models/RoleGroup');
var { User } = require('../models/user');

const create = async function (req, res, next) {
  console.log(req.body)
  const role_group = await RoleGroup.findById(req.body.group);
  const role = new Role(req.body);
  role.group = role_group._id;
  console.log(role_group);
  role_group.roles.push(role);
  await role_group.save();
  await role.save();
  return res.json({ status: 'success', data: role });
}

const updateById = function (req, res, next) {
  Role.findByIdAndUpdate(req.params._id, req.body, (err, result) => {
    if (err) {
      res.json({ status: 'error', name: err.name, message: err.message })
    } else {
      res.json({ status: 'success', data: result });
    }
  });
}

const removeById = async function (req, res, next) {
  const role = await Role.findById(req.params._id);
  // 移除 User 中 role 的引用
  await User.updateMany({roles: {$in: [role._id]}},{$pull:{'roles': role._id}});
  const result = await Role.findByIdAndRemove(req.params._id);
  return res.json({status: 'success', data: result});
}

const getById = async function (req, res, next) {
  const role = await Role.findById(req.params._id)
    .populate('menus')
    .populate('elements')
    .populate('opts');
  res.json({
    status: 'success',
    data: role
  });
}

// 获取角色可分配的 Menu
const getRoleMenus = async function (req, res, next) {
  const role = await Role.findById(req.params._id).populate('menus');
  const role_group = await RoleGroup.findById(role.group).populate('menus');

  res.json({
    status: 'success',
    data: {
      list: role_group.menus
    }
  })
}

const getRoleElementsByMenuId = async function (req, res, next) {
  const role = await Role.findById(req.params._id);
  const role_group = await RoleGroup.findById(role.group).populate({
    path: 'elements',
    model: 'element',
    populate: {
      path: 'menu',
      model: 'menu'
    }
  });

  res.json({
    status: 'success',
    data: {
      list: role_group.elements
    }
  })
}
const getRoleOptsByMenuId = async function (req, res, next) {
  const role = await Role.findById(req.params._id);
  const role_group = await RoleGroup.findById(role.group).populate({
    path: 'opts',
    model: 'opt',
    populate: {
      path: 'menu',
      model: 'menu'
    }
  });

  res.json({
    status: 'success',
    data: {
      list: role_group.opts
    }
  })
}

// 角色功能权限授权
const updateRoleAuth = function (req, res, next) {
  console.log('=====')
  console.log(req.body.menus)
  Role.update({ _id: req.params._id }, {
    $set: {
      'menus': req.body.menus,
      'elements': req.body.elements,
      'opts': req.body.opts
    }
  }, function (err, doc) {
    if (err) {
      res.json({ status: 'error', name: err.name, message: err.message });
    } else {
      res.json({ status: 'success', data: doc });
    }
  })
}
module.exports = {
  create,
  updateById,
  removeById,
  getById,
  getRoleMenus,
  getRoleElementsByMenuId,
  getRoleOptsByMenuId,
  updateRoleAuth
}