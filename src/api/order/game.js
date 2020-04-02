import request from '@/utils/request'

// 查询游戏订单列表
export function listGame(query) {
  return request({
    url: '/order/game/list',
    method: 'get',
    params: query
  })
}

// 查询游戏订单详细
export function getGame(id) {
  return request({
    url: '/order/game/' + id,
    method: 'get'
  })
}

// 新增游戏订单
export function addGame(data) {
  return request({
    url: '/order/game',
    method: 'post',
    data: data
  })
}

// 修改游戏订单
export function updateGame(data) {
  return request({
    url: '/order/game',
    method: 'put',
    data: data
  })
}

// 删除游戏订单
export function delGame(id) {
  return request({
    url: '/order/game/' + id,
    method: 'delete'
  })
}

// 导出游戏订单
export function exportGame(query) {
  return request({
    url: '/order/game/export',
    method: 'get',
    params: query
  })
}