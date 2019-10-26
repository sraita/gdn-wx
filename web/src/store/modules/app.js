import { construct, destruct } from '@aximario/json-tree';

import authAPI from '@/api/auth';
import userAPI from '@/api/user';

const state = {
  sidebar: {
    collapse: false,
    width: 240,
    miniWidth: 64
  },
  menuTree: [], // 菜单树
  isLogin: false,
  loginMessage: ''
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
  SET_LOGIN_STATUS(state, starus) {
    state.isLogin = status;
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

        resolve(res.data.list);
      }).catch(err => {
        reject(err);
      })
    });
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
