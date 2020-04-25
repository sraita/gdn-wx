
const { construct, destruct } = require('@aximario/json-tree');
const mongoose = require('mongoose');

const menuListData = require('../data/menus');

const { Menu } = require('../models/Menu');
const { Role } = require('../models/Role');
const { User } = require('../models/User');

generateMenus = (menus, parent = null) => {
  let res = [];
  menus.forEach(menu => {
    let _id = mongoose.Types.ObjectId();
    let tmp = {
      _id,
      parent,
      name: menu.name,
      title: menu.title,
      icon: menu.icon,
      path: menu.path,
      order: menu.order,
      component: menu.component
    }
    if (menu.children) {
      let children = generateMenus(menu.children, _id);
      res = res.concat(children);
    }
    res.push(tmp);
  });
  return res;
}

module.exports = {
  // 初始化系统菜单
  initMenus: async (req, res, next) => {
    // 初始化菜单
    let menuList = generateMenus(menuListData, null);
    let menus = await Menu.insertMany(menuList);
    console.log(menus);
    // 初始化内置角色
    let role = new Role({
      name: '超级管理员', // 角色名称
      code: 'SYS_SUPER_ADMIN',
      desc: '系统超级管理员【内置角色】',
      mutex: [], // 指定该角色不能与那些角色共存
      single: true,
      menus: menus,
    });
    await role.save();

    // 创建系统管理员
    let user = new User({
      username: 'sadmin',
      password: '123456', 
      nickname: '超级管理员',
      roles: [role._id]
    });
    await user.save();

    res.json({code: 0, data: {
      menus,
      role,
      user
    }});
  },
  initRoles: async (req, res, next) => {

  },
  // 初始化用户
  initUsers: async (req, res, next) => {

  }
}