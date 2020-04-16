import request from '@/utils/request'

// 查询游戏模式列表
export function listMode(query) {
  return request({
    url: '/operate/mode/list',
    method: 'get',
    params: query
  })
}

// 查询游戏模式详细
export function getMode(id) {
  return request({
    url: '/operate/mode/' + id,
    method: 'get'
  })
}

// 新增游戏模式
export function addMode(data) {
  return request({
    url: '/operate/mode',
    method: 'post',
    data: data
  })
}

// 修改游戏模式
export function updateMode(data) {
  return request({
    url: '/operate/mode',
    method: 'put',
    data: data
  })
}

// 删除游戏模式
export function delMode(id) {
  return request({
    url: '/operate/mode/' + id,
    method: 'delete'
  })
}

// 导出游戏模式
export function exportMode(query) {
  return request({
    url: '/operate/mode/export',
    method: 'get',
    params: query
  })
}