// 获取系统资源菜单
var express = require('express');
var Router = express.Router();

var MenuController = require('../controller/menu');

Router.route('/').get(MenuController.getList);

module.exports = Router;