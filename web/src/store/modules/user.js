import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken} from '@/utils/auth'
import authAPI from '../../api/auth';

const state = {
  token: getToken(),
  _id: '',
  username: '',
  name: '',
  avatar: '',
  introduction: '',
  orgId: '',
  orgName: '',
  departments: [],
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, _id) => {
    state._id = _id
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ORG_ID: (state, orgId) => {
    state.orgId = orgId
  },
  SET_ORG_NAME: (state, orgName) => {
    state.orgName = orgName
  },
  SET_DEPARTMENTS: (state, departments) => {
    state.departments = departments
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
}

const actions = {
  // user login
  loginByUserName({ commit, dispatch }, userInfo) {
    let params = {
      username: userInfo.username.trim(),
      password: userInfo.password
    }
    return new Promise((resolve, reject) => {
      authAPI.doLogin(params).then(res => {
        const { token, refresh_token } = res.data;
        commit('SET_TOKEN', token);
        setToken(token);
        setRefreshToken(refresh_token);
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  },
  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      authAPI.getUserInfo().then(res => {
        const user = res.data;
        const {_id, username, name, avatar} = user;

        const org = user.org;
        const roles = user.roles.map(role => {
          return {
            _id: role._id,
            name: role.name
          }
        });
        const departments = user.departments.map(item => {
          return {
            _id: item._id,
            name: item.name
          }
        });
        commit('SET_ID',_id);
        commit('SET_USERNAME', username);
        commit('SET_NAME', name);
        commit('SET_AVATAR', avatar);
        commit('SET_ROLES', roles);
        commit('SET_ORG_ID', org._id);
        commit('SET_ORG_NAME',org.name);
        commit('SET_DEPARTMENTS', departments);
        resolve(user);
      }).catch(err => {
        reject(err);
      })
    })
  },
  // user logout
  logout({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ID', '');
      commit('SET_USERNAME', '');
      commit('SET_NAME', '');
      commit('SET_AVATAR', '');
      commit('SET_ROLES', []);
      commit('SET_ORG_ID', '');
      commit('SET_ORG_NAME', '');
      commit('SET_DEPARTMENTS', []);

      removeToken();
      removeRefreshToken();

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
