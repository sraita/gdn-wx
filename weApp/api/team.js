const request = require('../utils/request.js');

module.exports = {
  getTeams: (params) => request('/api/teams','GET', params),
  getTeam: (id,params) => request(`/api/teams/${id}`,'GET',params),
  joinTeam: (id, params) => request(`/api/teams/${id}/join`, 'POST', params),
  newTeam: params => request('/api/teams','POST',params),
  updateTeam: (id,params) => request(`/api/teams/${id}`,'PUT',params),
  getQrImage: id => request(`/api/teams/${id}/qr-image`,'GET'),
  getMembers: (id, params) => request(`/api/teams/${id}/members`,'GET', params),

}