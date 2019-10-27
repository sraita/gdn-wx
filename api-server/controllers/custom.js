const { User } = require('../models/user');
const { Org } = require('../models/org');
const { Custom } = require('../models/custom');
const { RoleGroup } = require('../models/RoleGroup');
const { Role} = require('../models/Role');

const create = async function (req, res, next) {
  const {
    name, // 机构名称
    remark, // 机构备注信息
    role_group_id, // 所选 public RoleGroup Id
    manager_account, // 机构管理员登录账号
    manager_name, // 管理员姓名
    manager_mobile, // 管理员手机号
    manager_password = '123456', // 机构管理员登录密码，默认值:123456
    contact_name, // 联系人姓名
    contact_mobile, // 联系人电话
    contact_address, // 联系地址
  } = req.body;
  try {
    const isExist = await Org.findOne({name:name});
    if (isExist) {
      return res.status(422).send({
        message: '客户已存在，不能重复添加'
      });
    }
    const accountIsExist = await User.findOne({username: manager_account});
    if (accountIsExist) {
      return res.status(422).json({
        status: 'error',
        message: '账号已被使用'
      });
    }
    // 1. 创建组织机构
    let org = new Org({
      name,
      remark,
      contact:{
        name: contact_name,
        mobile: contact_mobile,
        address: contact_address
      }
    });
    // 2. 创建主管理员
    let manager = new User({
      name: manager_name,
      username: manager_account,
      password: manager_password,
      mobile: manager_mobile
    });
    // 3. 初始化默认角色组
    let publicRoleGroup = await RoleGroup.findOne({_id: role_group_id});
    let roleGroup = new RoleGroup({
      name:'默认',
      type: ['default','private'],
      parent: publicRoleGroup._id,
      menus: publicRoleGroup.menus,
      elements: publicRoleGroup.elements,
      opts: publicRoleGroup.opts
    });

    // 4. 初始化默认角色（管理员）
    let role = new Role({
      name: '管理员',
      type: 'default',
      menus: publicRoleGroup.menus,
      elements: publicRoleGroup.elements,
      opts: publicRoleGroup.opts,
      isSingle: true, // 主管理员不能与其他角色共存
    });

    // 5. 建立关联关系
    // 5.1 建立主管理员与组织的关联关系
    org.managers.push(manager); 
    manager.org = org; 
    // 5.2 建立默认角色组与默认角色与组织的关联关系
    role.group = roleGroup;
    roleGroup.org = org;
    // 5.3 给主管理员分配角色
    owner.roles.push(role);

    // 6. 保存（提交）
    org.save();
    owner.save();
    roleGroup.save();
    role.save();

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