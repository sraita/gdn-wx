const user = {
  namespaced: true,
  state: {
    _id: '',
    username: '',
    avatar: ''
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