// translators

import request from '@/utils/request'

export function getTranslators(data = {}, params = {}) {
  return request({
    url: '/translators/list',
    method: 'post',
    data,
    params
  })
}

export function newTranslator(data = {}) {
  return request({
    url: '/translators',
    method: 'post',
    data
  })
}
