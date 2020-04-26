import request from '@/utils/request'

export function getTeams(params = {}) {
  return request({
    url: '/teams',
    method: 'get',
    params
  })
}


export function newTeam(data) {
  return request({
    url: '/teams',
    method: 'post',
    data
  })
}

export function updateTeam(id,data) {
  return request({
    url: `/teams/${id}`,
    method: 'post',
    data
  })
}

export function deleteTeam(id) {
  return request({
    url: `/teams/${id}`,
    method: 'delete'
  })
}