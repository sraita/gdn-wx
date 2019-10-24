const app = {
  namespaced: true,
  state: {
    sidebar: {
      collapse: false,
      width: 240,
      miniWidth: 64
    }
  },

  mutations: {
    TOGGLE_SIDEBAR (state) {
      state.sidebar.collapse = !state.sidebar.collapse;
    } 
  },
  actions: {
    toggleSidebar({commit}) {
      commit('TOGGLE_SIDEBAR')
    }
  },
  getters: {

  }
}
export default app;