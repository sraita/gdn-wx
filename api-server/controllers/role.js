const { Role } = require('../models/Role');
const { Menu } = require('../models/Menu');
const { resSuccess, resError } = require('../utils/response');

const { construct, destruct } = require('@aximario/json-tree');

module.exports = {
  // 获取所有路由
  getRoutes: async (req, res, next) => {
    let list = await Menu.find({});
    let data = list.map(item => {

      let obj = Object.assign({},item);
      obj = {
        _id: item._id,
        name: item.name,
        parent: item.parent,
        component: item.component,
        path: item.url,
        meta: {
          title: item.title,
          icon: item.icon
        }
      }
      return obj;
    });

    console.log(data);

    const result = construct(data, {
      id: '_id',
      pid: 'parent',
      children: 'children'
    });

    console.log(result);

    resSuccess(res,'',result);

  },
  // 获取所有角色
  getRoles: async (req, res, next) => {
    const list = await Role.find({});
    const total = await Role.countDocuments();
    resSuccess(res, '', {
      list,
      total
    });
  },
  // 获取角色具有的路由
  getRoleRoutes: async (req, res, next) => {
    Role.findOne({ _id: req.params._id }).populate({
      path: 'menu'
    }).exec(function (err, data) {
      console.log(data);
      resSuccess(res, '', data);
      
    });
  },
  // 获取角色信息
  getRole: async (req, res, next) => {
    const role = await Role.findOne({ _id: req.params._id }).populate('menus').exec();
    resSuccess(res,'',role);
  },
  // 新增角色
  addRole: async (req, res, next) => {
    const newRole = new Role(req.body);
    const role = await newRole.save();
    resSuccess(res, '', role);
  },
  // 更新角色
  updateRole: async (req, res, next) => {
    const role = await Role.findByIdAndUpdate(req.params._id, req.body);
    resSuccess(res, '', role);
  },
  // 删除角色
  deleteRole: async (req, res, next) => {
    const role = await Role.findByIdAndRemove(req.params._id);
    resSuccess(res, 'success', {});
  }
}