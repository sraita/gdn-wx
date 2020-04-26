// 菜单资源

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'menu'},
  title: String, // 菜单名称
  type: {
    type: String,
    enum: ['menu','toc']
  },
  hidden: { // 是否隐藏(不在菜单中显示)
    type: Boolean,
    default: false
  },
  is_disable: { // 是否禁用
    type: Boolean,
    default: false
  },
  order: Number,
  level: Number,
  icon: String, 
  path: String, // 菜单路径
  name: String, // 组件名称
  component: String, // 页面组件路径
  redirect: String, // 重定向
});

// 设置索引
schema.index({ username: 1 });


schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Menu = mongoose.model('menu', schema);

module.exports = { Menu };