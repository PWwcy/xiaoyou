import request from '@/utils/request'

// 查询商品兑换列表
export function listCommodity(query) {
  return request({
    url: '/exchange/commodity/list',
    method: 'get',
    params: query
  })
}

// 查询商品兑换详细
export function getCommodity(id) {
  return request({
    url: '/exchange/commodity/' + id,
    method: 'get'
  })
}

// 新增商品兑换
export function addCommodity(data) {
  return request({
    url: '/exchange/commodity',
    method: 'post',
    data: data
  })
}

// 修改商品兑换
export function updateCommodity(data) {
  return request({
    url: '/exchange/commodity',
    method: 'put',
    data: data
  })
}

// 删除商品兑换
export function delCommodity(id) {
  return request({
    url: '/exchange/commodity/' + id,
    method: 'delete'
  })
}

// 导出商品兑换
export function exportCommodity(query) {
  return request({
    url: '/exchange/commodity/export',
    method: 'get',
    params: query
  })
}