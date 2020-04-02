import request from '@/utils/request'

// 查询商品订单列表
export function listCommodity(query) {
  return request({
    url: '/order/commodity/list',
    method: 'get',
    params: query
  })
}

// 查询商品订单详细
export function getCommodity(id) {
  return request({
    url: '/order/commodity/' + id,
    method: 'get'
  })
}

// 新增商品订单
export function addCommodity(data) {
  return request({
    url: '/order/commodity',
    method: 'post',
    data: data
  })
}

// 修改商品订单
export function updateCommodity(data) {
  return request({
    url: '/order/commodity',
    method: 'put',
    data: data
  })
}

// 删除商品订单
export function delCommodity(id) {
  return request({
    url: '/order/commodity/' + id,
    method: 'delete'
  })
}

// 导出商品订单
export function exportCommodity(query) {
  return request({
    url: '/order/commodity/export',
    method: 'get',
    params: query
  })
}