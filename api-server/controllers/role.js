var { Role } = require('../models/Role');
var { User } = require('../models/user');

const create = async function (req, res, next) {
  const role = new Role(req.body);
  await role.save();
  return res.json({ status: 'success', data: role });
}

const updateById = function (req, res, next) {
  let setObj = {...req.body};
  delete setObj._id;
  
  Role.findByIdAndUpdate(req.params._id, setObj, (err, result) => {
    if (err) {
      res.json({ status: 'error', name: err.name, message: err.message })
    } else {
      res.json({ status: 'success', data: result });
    }
  });
}

const removeById = async function (req, res, next) {
  const result = await Role.findByIdAndRemove(req.params._id);
  return res.json({status: 'success', data: result});
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

const getRoles = async function (req, res, next) {
  const list = await Role.find({});
  return res.send({
    status: 'success',
    data: {
      list,
    }
  });
}
module.exports = {
  create,
  updateById,
  removeById,
  getRoles,
  updateRoleAuth
}