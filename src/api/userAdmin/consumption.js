import request from '@/utils/request'

// 查询消费记录列表
export function listConsumption(query) {
  return request({
    url: '/user/consumption/list',
    method: 'get',
    params: query
  })
}

// 查询消费记录详细
export function getConsumption(id) {
  return request({
    url: '/user/consumption/' + id,
    method: 'get'
  })
}

// 新增消费记录
export function addConsumption(data) {
  return request({
    url: '/user/consumption',
    method: 'post',
    data: data
  })
}

// 修改消费记录
export function updateConsumption(data) {
  return request({
    url: '/user/consumption',
    method: 'put',
    data: data
  })
}

// 删除消费记录
export function delConsumption(id) {
  return request({
    url: '/user/consumption/' + id,
    method: 'delete'
  })
}

// 导出消费记录
export function exportConsumption(query) {
  return request({
    url: '/user/consumption/export',
    method: 'get',
    params: query
  })
}