import request from '@/utils/request'

// 查询游戏时长列表
export function listDuration(query) {
  return request({
    url: '/operate/duration/list',
    method: 'get',
    params: query
  })
}

// 查询游戏时长详细
export function getDuration(id) {
  return request({
    url: '/operate/duration/' + id,
    method: 'get'
  })
}

// 新增游戏时长
export function addDuration(data) {
  return request({
    url: '/operate/duration',
    method: 'post',
    data: data
  })
}

// 修改游戏时长
export function updateDuration(data) {
  return request({
    url: '/operate/duration',
    method: 'put',
    data: data
  })
}

// 删除游戏时长
export function delDuration(id) {
  return request({
    url: '/operate/duration/' + id,
    method: 'delete'
  })
}

// 导出游戏时长
export function exportDuration(query) {
  return request({
    url: '/operate/duration/export',
    method: 'get',
    params: query
  })
}
