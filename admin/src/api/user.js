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

/**
 * 用户列表
 */
export function getUsers() {
  return request({
    url: `/users`,
    method: 'get',
  })
}

/**
 * 添加用户
 * @param {*} data 
 */
export function addUser(data) {
  return request({
    url: '/users/add',
    method: 'post',
    data
  })
}

/**
 * 更新用户
 * @param {*} id 
 * @param {*} data 
 */
export function updateUser(id,data) {
  return request({
    url: `/users/${id}/update`,
    method: 'post',
    data
  })
}


