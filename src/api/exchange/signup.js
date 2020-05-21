import request from '@/utils/request'

// 查询活动兑换列表
export function listSignup(query) {
  return request({
    url: '/exchange/signup/list',
    method: 'get',
    params: query
  })
}

// 查询活动兑换详细
export function getSignup(id) {
  return request({
    url: '/exchange/signup/' + id,
    method: 'get'
  })
}

// 新增活动兑换
export function addSignup(data) {
  return request({
    url: '/exchange/signup',
    method: 'post',
    data: data
  })
}

// 修改活动兑换
export function updateSignup(data) {
  return request({
    url: '/exchange/signup',
    method: 'put',
    data: data
  })
}

// 删除活动兑换
export function delSignup(id) {
  return request({
    url: '/exchange/signup/' + id,
    method: 'delete'
  })
}

// 导出活动兑换
export function exportSignup(query) {
  return request({
    url: '/exchange/signup/export',
    method: 'get',
    params: query
  })
}