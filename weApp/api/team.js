const request = require('../utils/request.js');

module.exports = {
  newTeam: params => request('/api/teams','POST',params),
  updateTeam: (id,params) => request(`/api/teams/${id}`,'PUT',params)
}