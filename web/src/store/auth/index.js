const auth = {
  namespaced: true,
  state: {
    loginToken: '',
    loginTokenExpires: 0,
    refreshToken: '',
    refreshTokenExpires: 0
  },

  mutations: {
    UPDATE_LOGIN_TOKEN(state, token, tokenExpires) {
      const expires = tokenExpires ? tokenExpires : Date.now();
      state.loginToken = token;
      state.loginTokenExpires = expires

      sessionStorage.setItem('loginToken',token);
      sessionStorage.setItem('loginTokenExpires', expires);
    },
    UPDATE_REFRESH_TOKEN(state, token, tokenExpires) {
      const expires = tokenExpires ? tokenExpires : Date.now();
      state.refreshToken = token;
      state.refreshTokenExpires = expires;
      sessionStorage.setItem('refreshToken', token);
      sessionStorage.setItem('refreshTokenExpires', expires);
    },
    CLEAR_TOKEN(state) {
      state = {
        loginToken: '',
        loginTokenExpires: 0,
        refreshToken: '',
        refreshTokenExpires: 0
      };
    }
  },
  actions: {
    updateLoginToken({ commit },token, tokenExpires) {
      commit('UPDATE_LOGIN_TOKEN', token, tokenExpires)
    },
    updateRefreshToken({ commit }, token, tokenExpires) {
      commit('UPDATE_REFRESH_TOKEN', token, tokenExpires)
    },
    clearToken( {commit}) {
      commit('CLEAR_TOKEN')
    }
  },
  getters: {

  }
}
export default auth;