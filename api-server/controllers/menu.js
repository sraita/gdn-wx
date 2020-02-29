const { Menu } = require('../models/Menu');
const { resSuccess, resError } = require('../utils/response');

module.exports = {
  // 获取菜单列表
  index: async (req, res, next) => {
    const list = await Menu.find({});
    const total = await Menu.countDocuments();
    resSuccess(res,'', {
      list,
      total
    });
  },
  // 新增菜单
  newMenu: async (req, res, next) => {
    const newMenu = new Menu(req.body);
    const menu = await newMenu.save();
    resSuccess(res, '', menu);
  },
  // 更新菜单
  updateMenu: async (req, res, next) => {
    const menu = await Menu.findByIdAndUpdate(req.params._id, req.body);
    resSuccess(res, '', menu);
  },
  // 删除菜单
  deleteMenu: async (req, res, next) => {
    const menu = await Menu.findByIdAndRemove(req.params._id);
    resSuccess(res,'success',{});
  }
}