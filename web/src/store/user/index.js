const user = {
  namespaced: true,
  state: {
    _id: '',
    username: '',
    avatar: '',
    name: '',
    orgId: '',
    departments: [],
    roles:[]
  },

  mutations: {
    UPDATE_USER_ID (state, _id) {
      state._id = _id;
      localStorage.setItem('userId',_id)
    },
    UPDATE_USER_INFO(state, user) {
      state._id = user._id;
      state.username = user.username;
      state.avatar = user.avatar ? user.avatar : 'static/images/default-avatar.png';
      state.name = user.name;
      state.orgId = user.org._id;
      state.orgName = user.org.name;
      state.roles = user.roles.map(role => {
        return {
          _id:role._id,
          name: role.name
        }
      })
    },
  },
  actions: {
    updateUserId({commit},_id) {
      commit('UPDATE_USER_ID', _id)
    },
    updateUserInfo({ commit }, user) {
      commit('UPDATE_USER_INFO', user)
    },
  },
  getters: {

  }
}
export default user;