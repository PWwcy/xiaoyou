import request from '@/utils/request'

// 查询设备商列表
export function listDeviceStore(query) {
  return request({
    url: '/deviceStore/list',
    method: 'get',
    params: query
  })
}

// 查询设备商详细
export function getDeviceStore(id) {
  return request({
    url: '/deviceStore/' + id,
    method: 'get'
  })
}

// 新增设备商
export function addDeviceStore(data) {
  return request({
    url: '/deviceStore',
    method: 'post',
    data: data
  })
}

// 修改设备商
export function updateDeviceStore(data) {
  return request({
    url: '/deviceStore',
    method: 'put',
    data: data
  })
}

// 删除设备商
export function delDeviceStore(id) {
  return request({
    url: '/deviceStore/' + id,
    method: 'delete'
  })
}

// 导出设备商
export function exportDeviceStore(query) {
  return request({
    url: '/deviceStore/export',
    method: 'get',
    params: query
  })
}
