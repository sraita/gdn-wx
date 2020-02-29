import { asyncRoutes, constantRoutes } from '@/router'
import { getUserRoutes } from '@/api/user';

/* Layout */
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 */
function filterAsyncRoutes(routes) {
  try {
    const res = []
    routes.forEach(route => {
      let tmp = {
        name: route.name,
        path: route.url,
        component: route.component == 'Layout' ? Layout : () => import(`@/views/${route.component}`),
        meta: route.meta,
        redirect: route.redirect
      };
      if (route.children) {
        tmp.children = filterAsyncRoutes(route.children)
      }
      res.push(tmp);
    });
    return res;
  } catch (e) {
    console.log(e);
    return []
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, {_id,roles}) {
    return new Promise((resolve,reject)=> {
      getUserRoutes(_id).then(res => {
        let routes = res.data;
        let accessedRoutes = filterAsyncRoutes(routes, roles)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true });
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch (error => {
        reject(error);
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
