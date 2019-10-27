var {RoleGroup} = require('../models/RoleGroup');
var {Role} = require('../models/Role');
var {Menu} = require('../models/Menu');
var {Element} = require('../models/Element');
var {Opt} = require('../models/Opt')

const mongoose = require('mongoose');
const _ = require('lodash');

// 转换ObjectId 数组 为 String 数组
function changeObjectIdsToString(arr) {
  arr = arr || [];
  let tmp = arr.map(id => {
    return mongoose.Types.ObjectId(id).toString()
  });
  return tmp;
}

const create = function (req, res, next) {
  const data = req.body;
  const role_group = new RoleGroup(data);
  if (data.org) {
    role_group.org = data.org;
  }
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
    const list = await RoleGroup.find({ org:null });
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

/**
 * 角色组功能权限授权
 *  */ 
const updateRoleGroupAuth = async function (req, res, next) {
  const _id = req.params._id;
  let {menus, elements, opts} = req.body;
  // 处理menus, elements, opts, 转化为ObjectId
  /** 使用事务
  const session = await mongoose.startSession({
    readPreference: { mode: 'primary' },
  }); 
  // Start a transaction
  await session.startTransaction({
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' },
  });
  
  // Operations inside the transaction
  try {
    const doc = await RoleGroup.updateOne({_id:req.params._id}, {
      $set: {
        menus,
        elements,
        opts
      }
    },{session});
    const subRoleGroup = await RoleGroup.updateMany({parent: doc._id},{
      $set: {
        menus,
        elements,
        opts
      }
    }, { session, multi: true});
    console.log(subRoleGroup)
    
    await session.commitTransaction();
    res.json({ status: 'success', data: doc });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    res.json({ status: 'error', name: err.name, message: err.message });

  } finally {
    await session.endSession();
  }
  */


  // 重新配置用户组下相关角色的权限
  async function resetRolePromission(group_id) {

    let role_menus = _.intersection(menus, changeObjectIdsToString(role.menus));
    let role_elements = _.intersection(elements, changeObjectIdsToString(role.elements));
    let role_opts = _.intersection(opts, changeObjectIdsToString(role.opts));

    // 1. 更新 默认角色权限
    await Role.updateMany({
      parent: group_id, 
      type:{$in:['default']}
    },{
      $set:{menus,elements, opts}
    });

    // 2. 更新 普通角色 权限 
    await Role.updateMany({
      parent: group_id,
      type: { $in: ['normal'] }
    }, {
      $set: {
        menus: role_menus,
        elements: role_elements,
        opts: role_opts
      }
    });
  }

  // 重新配置用户组和子用户组权限
  async function resetRoleGroupPromission(_id) {
    let roleGroup = await RoleGroup.findById(_id);

    let group_menus = _.intersection(menus, changeObjectIdsToString(roleGroup.menus));
    let group_elements = _.intersection(elements, changeObjectIdsToString(roleGroup.elements));
    let group_opts = _.intersection(opts, changeObjectIdsToString(roleGroup.opts));
    
    let setObj = {
      menus: group_menus,
      elements: group_elements,
      opts: group_opts
    };
    if (roleGroup.type.includes('default')) {
      setObj = {menus, elements, opts}
    }
    await RoleGroup.updateOne({ _id: _id }, {
      $set: setObj
    });
    await resetRolePromission(_id);

    let subRoleGroups = await RoleGroup.find({ parent: _id });
    if (subRoleGroups) {
      subRoleGroups.forEach(role_group => {
        resetRoleGroupPromission(role_group._id);
      })
    }
  }

  await resetRoleGroupPromission(_id);
  // 重新更正自身权限
  await RoleGroup.updateOne({_id: _id},{$set:{
    menus,
    elements,
    opts
  }});
  
  res.json({ status: 'success', message: '更新成功' });
}

const getPublicRoleGroups = async function (req, res, next) {
  const list = await RoleGroup.find({org: null});
  res.json({
    status: 'success',
    data:{
      list: list
    }
  });
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
  updateRoleGroupAuth,
  getPublicRoleGroups
}