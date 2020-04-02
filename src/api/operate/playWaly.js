import request from '@/utils/request'

// 查询玩法管理列表
export function listPlayWaly(query) {
  return request({
    url: '/operate/playWaly/list',
    method: 'get',
    params: query
  })
}

// 查询玩法管理详细
export function getPlayWaly(id) {
  return request({
    url: '/operate/playWaly/' + id,
    method: 'get'
  })
}

// 新增玩法管理
export function addPlayWaly(data) {
  return request({
    url: '/operate/playWaly',
    method: 'post',
    data: data
  })
}

// 修改玩法管理
export function updatePlayWaly(data) {
  return request({
    url: '/operate/playWaly',
    method: 'put',
    data: data
  })
}

// 删除玩法管理
export function delPlayWaly(id) {
  return request({
    url: '/operate/playWaly/' + id,
    method: 'delete'
  })
}

// 导出玩法管理
export function exportPlayWaly(query) {
  return request({
    url: '/operate/playWaly/export',
    method: 'get',
    params: query
  })
}
