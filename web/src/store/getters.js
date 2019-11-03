const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user._id,
  orgId: state => state.user.orgId,
  orgName: state => state.user.orgName,
  roles: (state) => {
    return state.user.roles.map(item => item.name);
  },
  // permission_routes: state => state.permission.routes,
  loginMessage: state => state.app.loginMessage,
  isLogin: state => state.app.isLogin,
}
export default getters