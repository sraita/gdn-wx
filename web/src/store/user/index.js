const user = {
  namespaced: true,
  state: {
    token: '',
    userInfo: {}
  },

  mutations: {
    UPDATE_TOKEN (state, token) {
      state.token = token;
    },
    UPDATE_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
    },
  },
  actions: {
    updateToken({commit},token) {
      commit('UPDATE_TOKEN', token)
    },
    updateUserInfo({ commit }, userInfo) {
      commit('UPDATE_USER_INFO', userInfo)
    },
  },
  getters: {

  }
}
export default user;