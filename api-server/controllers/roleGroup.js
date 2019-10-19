var {RoleGroup} = require('../models/RoleGroup');
var {Role} = require('../models/Role');
var {Menu} = require('../models/Menu');
var {Element} = require('../models/Element');
var {Opt} = require('../models/Opt')

const create = function (req, res, next) {
  const role_group = new RoleGroup(req.body);
  role_group.org = req.body.org;
  role_group.save(function (err, doc) {
    if (err) {
      return res.json({status: 'error', name: err.name, message: err.message});
    } else {
      return res.json({status: 'success', data: doc});
    }
  });
}

const updateById = function (req, res, next) {
  RoleGroup.findByIdAndUpdate(req.params._id, req.body, (err, result) => {
    if (err) {
      res.json({ status: 'error', name: err.name, message: err.message })
    } else {
      res.json({ status: 'success', data: result });
    }
  });
}

const removeById = async function (req, res, next) {
  const role_group = await RoleGroup.findById(req.params._id);
  if (role_group.roles && role_group.roles.length > 0) {
    return res.json({status:'error', message: '只能删除空的角色组'})
  }
  const result = await RoleGroup.findByIdAndRemove(req.params._id);
  return res.json({ status: 'success', data: result });
}

const getList = async function (req, res, next) {
  const list = await RoleGroup.find();
  res.json({
    status: 'success',
    data: {
      total: list.total,
      list: list
    }
  })
};

const getRoleTree = async function (req, res, next) {
  try {
    const list = await RoleGroup.find({ type: 'public' }).populate('roles');
    return res.json({
      status: 'success',
      data: {
        total: list.length,
        list: list
      }
    });
  } catch (err) {
    console.log(err)
    return res.json({ status: 'error', name: err.name, message: err.message });
  }
}

const getRoleGroupMenus = async function (req, res, next) {
  const role_group = await RoleGroup.findById(req.params._id).populate('menus');
  let list = [];
  if (role_group.parent) {
    list = await RoleGroup.findById(role_group.parent).populate('menus').menus;
  } else {
    list = await Menu.find({});
  }

  res.json({
    status: 'success',
    data: {
      list: list
    }
  })
}

const getById = async function (req, res, next) {
  const role_group = await RoleGroup.findById(req.params._id)
    .populate('menus')
    .populate('elements')
    .populate('opts');
  res.json({
    status: 'success',
    data: role_group
  })
}

const getRoleGroupElementsByMenuId = async function (req, res, next) {
  const role_group = await RoleGroup.findById(req.params._id);
  let list = [];
  if (role_group.parent) {
    list = await RoleGroup.findById(req.params._id).populate({
      path: 'elements',
      model: 'element',
      populate: {
        path: 'menu',
        model: 'menu'
      }
    }).elements;
  } else {
    list = await Element.find({menu: req.params.menuId});
  }

  res.json({
    status: 'success',
    data: {
      list: list
    }
  })
}
const getRoleGroupOptsByMenuId = async function (req, res, next) {
  const role_group = await RoleGroup.findById(req.params._id);
  let list = [];
  if (role_group.parent) {
    list = await RoleGroup.findById(req.params._id).populate({
      path: 'opts',
      model: 'opt',
      populate: {
        path: 'menu',
        model: 'menu'
      }
    }).opts;
  } else {
    list = await Opt.find({ menu: req.params.menuId});
  }

  res.json({
    status: 'success',
    data: {
      list: list
    }
  })
}

// 角色组功能权限授权
const updateRoleGroupAuth = function (req, res, next) {
  console.log('=====')
  console.log(req.body.menus)
  RoleGroup.update({_id:req.params._id}, {
    $set: {
      'menus': req.body.menus,
      'elements': req.body.elements,
      'opts': req.body.opts
    }
  },function (err, doc) {
    if (err) {
      res.json({status: 'error', name: err.name, message: err.message});
    } else {
      res.json({status: 'success', data: doc});
    }
  })
}

module.exports = {
  create,
  updateById,
  removeById,
  getById,
  getList,
  getRoleTree,
  getRoleGroupMenus,
  getRoleGroupElementsByMenuId,
  getRoleGroupOptsByMenuId,
  updateRoleGroupAuth
}