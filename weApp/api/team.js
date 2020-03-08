const request = require('../utils/request.js');

module.exports = {
  getTeam: (id,params) => request(`/api/teams/${id}`,'GET',params),
  newTeam: params => request('/api/teams','POST',params),
  updateTeam: (id,params) => request(`/api/teams/${id}`,'PUT',params)
}