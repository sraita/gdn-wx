var path = require('path'); //系统路径模块
var fs = require('fs'); //文件模块
var createError = require('http-errors');
const { SYSTEM_UNLOCK_PASS} = require('../config');

const { System } = require('../models/System');
const { Role } = require('../models/Role');
const { Menu } = require('../models/Menu');
const { User } = require('../models/user');



// 1. 初始化系统资源
const initSysResources = async function (req, res, next) {

  try {
    var filePath = path.join(__dirname, '../private/json/resources.json'); //文件路径，__dirname为当前运行js文件的目录
  
    //读取json文件
    const json = fs.readFileSync(filePath, 'utf-8');
    const menuList = JSON.parse(json);

    async function createMenu(data, parent) {
      const {name, icon, sort, routerName, routerPath, children} = data;
      console.log(data);
      let menu = new Menu({
        name:name,
        sort:sort,
        icon:icon,
        routerName:routerName,
        routerPath: routerPath
      });
      if (parent) {
        menu.parent = parent;
      }
      menu.save();
      if (children) {
        for (var i =0; i < children.length; i++) {
          createMenu(children[i], menu);
        }
      }
    }
  
    for (var i=0 ; i < menuList.length;i++) {
      createMenu(menuList[i],null);
    }
    
    res.send({status:'success', message: '系统资源初始化成功!'})
  } catch (err) {
    res.send({ status: 'error', name: err.name, message: err.message })
  }
}

// 2. 初始化系统角色组
const initSysRoles = async function (req, res, next) {
  let menus = await Menu.find();

  // 初始化默认角色 (超级管理员)
  let role = new Role({
    name: '超级管理员',
    code: 'SYSTEM_SUPER_ADMIN',
    remark: '系统超级管理',
    type: 'default',
    isSingle: true,
    menus,  
  });
  role.save();
  
  return res.json({status: 'success', message: '系统角色资源创建成功!'});
}

// 初始化系统管理员
const initSysAdmin = async function(req, res, next) {
  const {username,name ='超级管理员', password, system_name, system_remark} = req.body;
  let user = new User({
    username,
    password,
    name,
  });
  let role = await Role.findOne({ code: 'SYSTEM_SUPER_ADMIN'});
  user.roles.push(role);
  user.save();

  let system = new System({
    name: system_name,
    remark: system_remark,
    initialized: true
  });
  system.save();
  return res.json({status: 'success', data: user});
}

const checkSysInitState = async function (req, res, next) {
  let system = await System.findOne();
  let data = {initialized: false};
  if (system && system.initialized) {
    data = {initialized: true}
  }
  res.json({status: 'success', data: data})
}

// 验证系统初始化解锁密码
const verifySysPass = async function (req, res, next) {
  const {password} = req.body;
  if (password == SYSTEM_UNLOCK_PASS) {
    res.json({status: 'success', message:'解锁密码校验通过！'});
  } else {
    next(createError(422,'解锁密码未通过校验！'))
  }
}
module.exports = {
  initSysResources,
  initSysRoles,
  initSysAdmin,
  checkSysInitState,
  verifySysPass
}