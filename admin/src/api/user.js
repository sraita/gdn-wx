import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'users/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/users/info',
    method: 'get',
    params: { token }
  })
}

export function getUserRoutes(id) {
  return request({
    url: `/users/${id}/routes`,
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}
