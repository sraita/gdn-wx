const app = {
  namespaced: true,
  state: {
    isSidebarOpen: true
  },

  mutations: {
    TOGGLE_SIDEBAR (state) {
      state.isSidebarOpen = !state.isSidebarOpen;
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