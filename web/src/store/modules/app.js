import { construct, destruct } from '@aximario/json-tree';

import authAPI from '@/api/modules/auth';
import userAPI from '@/api/modules/user';
import { dynamicRoutes, constantRoutes } from '@/router'


function filterDynamicRoutes(routes, routeNames) {
  const res = [];
  
  routes.forEach(route => {
    const tmp = {...route};
    if (routeNames.includes(tmp.name)) {
      if (tmp.children) {
        tmp.children = filterDynamicRoutes(tmp.children, routeNames)
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  sidebar: {
    collapse: false,
    width: 240,
    miniWidth: 64
  },
  menuTree: [], // 菜单树
  isLogin: false,
  loginMessage: '',
  addRoutes:[],
  routes:[]
}

const mutations = {
  TOGGLE_SIDEBAR(state) {
    state.sidebar.collapse = !state.sidebar.collapse;
  },
  SET_MENU_TREE(state, menuTree) {
    state.menuTree = menuTree;
  },
  SET_LOGIN_MESSAGE(state, message) {
    state.loginMessage = message;
  },
  SET_LOGIN_STATUS(state, status) {
    state.isLogin = status;
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  toggleSidebar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  updateLoginMessage({ commit }, message) {
    commit('SET_LOGIN_MESSAGE', message);
  },
  updateLoginStatus({ commit }, status) {
    commit('SET_LOGIN_STATUS', status);
  },
  getMenus({ commit }) {
    return new Promise((resolve, reject) => {
      userAPI.getMenus().then(res => {
        let menuList = res.data.list;
        // 动态加载路由
        let menuTree = construct(menuList, {
          id: '_id',
          pid: 'parent',
          children: 'children'
        });
        commit('SET_MENU_TREE', menuTree);

        resolve(menuList);
      }).catch(err => {
        reject(err);
      })
    });
  },
  // 创建路由
  generateRoutes({commit}, {roles,menuList}) {
    return new Promise((resolve, reject) => {
      const routeNames = menuList.map(menu => menu.routerName);
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = dynamicRoutes || []
      } else {
        accessedRoutes = filterDynamicRoutes(dynamicRoutes, routeNames);
      }
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
