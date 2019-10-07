// 系统菜单资源表
var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MenuSchema = new Schema({
  name: String,
  icon: String,
  path: String,
  parent: String,
  state: Number,
});
const Menu = mongoose.model('menu', MenuSchema);

module.exports = { Menu };