import request from '@/utils/request'

export function getMenus(data) {
  return request({
    url: '/menus',
    method: 'get',
    data
  })
}

export function addMenu(data) {
  return request({
    url: '/menus',
    method: 'post',
    data
  })
}

export function updateMenu(id,data) {
  return request({
    url: `/menus/${id}`,
    method: 'put',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: `/menus/${id}`,
    method: 'delete'
  })
}
