const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  orgId: state => state.user.orgId,
  orgName: state => state.user.orgName,
  roles: (state) => {
    return state.user.roles.map(item => item.name);
  },
  // permission_routes: state => state.permission.routes,
}
export default getters