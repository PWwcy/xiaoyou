import request from '@/utils/request'

// 查询使用协议列表
export function listProtocal(query) {
  return request({
    url: '/basicsSet/protocal/list',
    method: 'get',
    params: query
  })
}

// 查询使用协议详细
export function getProtocal(id) {
  return request({
    url: '/basicsSet/protocal/' + id,
    method: 'get'
  })
}

// 新增使用协议
export function addProtocal(data) {
  return request({
    url: '/basicsSet/protocal',
    method: 'post',
    data: data
  })
}

// 修改使用协议
export function updateProtocal(data) {
  return request({
    url: '/basicsSet/protocal',
    method: 'put',
    data: data
  })
}

// 删除使用协议
export function delProtocal(id) {
  return request({
    url: '/basicsSet/protocal/' + id,
    method: 'delete'
  })
}

// 导出使用协议
export function exportProtocal(query) {
  return request({
    url: '/basicsSet/protocal/export',
    method: 'get',
    params: query
  })
}