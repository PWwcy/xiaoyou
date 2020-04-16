import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi"
// 查询设备管理列表
export function listDevice(query) {
  return request({
    url: '/device/list',
    method: 'get',
    params: query
  })
}

// 查询设备管理详细
export function getDevice(id) {
  return request({
    url: '/device/' + praseStrEmpty(id),
    method: 'get'
  })
}

// 新增设备管理
export function addDevice(data) {
  return request({
    url: '/device',
    method: 'post',
    data: data
  })
}

// 修改设备管理
export function updateDevice(data) {
  return request({
    url: '/device',
    method: 'put',
    data: data
  })
}

// 删除设备管理
export function delDevice(id) {
  return request({
    url: '/device/' + id,
    method: 'delete'
  })
}

// 导出设备管理
export function exportDevice(query) {
  return request({
    url: '/device/export',
    method: 'get',
    params: query
  })
}
