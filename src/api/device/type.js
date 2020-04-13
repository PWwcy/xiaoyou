import request from '@/utils/request'

// 查询设备类型列表
export function listType(query) {
  return request({
    url: '/device/type/list',
    method: 'get',
    params: query
  })
}

// 查询设备类型详细
export function getType(id) {
  return request({
    url: '/device/type/' + id,
    method: 'get'
  })
}

// 新增设备类型
export function addType(data) {
  return request({
    url: '/device/type',
    method: 'post',
    data: data
  })
}

// 修改设备类型
export function updateType(data) {
  return request({
    url: '/device/type',
    method: 'put',
    data: data
  })
}

// 删除设备类型
export function delType(id) {
  return request({
    url: '/device/type/' + id,
    method: 'delete'
  })
}

// 导出设备类型
export function exportType(query) {
  return request({
    url: '/device/type/export',
    method: 'get',
    params: query
  })
}