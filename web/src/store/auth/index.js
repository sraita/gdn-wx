const auth = {
  namespaced: true,
  state: {
    loginToken: '',
    refreshToken: '',
  },

  mutations: {
    UPDATE_LOGIN_TOKEN(state, token) {
      state.loginToken = token;
      localStorage.setItem('loginToken',token);
    },
    UPDATE_REFRESH_TOKEN(state, token) {
      state.refreshToken = token;
      localStorage.setItem('refreshToken', token);
    }
  },
  actions: {
    updateTokens({ commit }, {token = '', refresh_token = ''}) {
      commit('UPDATE_LOGIN_TOKEN', token);
      commit('UPDATE_REFRESH_TOKEN', refresh_token)
    },
    
  },
  getters: {

  }
}
export default auth;