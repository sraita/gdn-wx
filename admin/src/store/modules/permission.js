import router, { asyncRoutes, constantRoutes } from '@/router'
import { getUserRoutes } from '@/api/user';

/* Layout */
import Layout from '@/layout'


/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 */
function filterAsyncRoutes(routes) {
  try {
    const res = []
    routes.forEach(route => {
      let tmp = {};
      if (route.parent === null && !route.children) {
        tmp = {
          path: route.path,
          component: Layout,
          meta: route.meta,
          redirect: route.path + 'index',
          children: [
            {
              name: route.name,
              path: 'index',
              component: () => import(`@/views/${route.component}`),
              meta: route.meta,
              redirect: route.redirect
            }
          ]
        }
      } else {
        tmp = {
          name: route.name,
          path: route.path,
          component: route.component == 'Layout' ? Layout : () => import(`@/views/${route.component}`),
          meta: route.meta,
          redirect: route.component == 'Layout' ? '' : ''
        };
        if (route.children) {
          tmp.children = filterAsyncRoutes(route.children)
        }
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
  generateRoutes({ commit }, {_id,role}) {
    return new Promise((resolve,reject)=> {
      getUserRoutes(_id).then(res => {
        let routes = res.data;
        let accessedRoutes = filterAsyncRoutes(routes, role)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true });
        console.log(accessedRoutes)
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
