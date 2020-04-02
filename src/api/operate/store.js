import request from '@/utils/request'

// 查询商家列表
export function listStore(query) {
  return request({
    url: '/operate/store/list',
    method: 'get',
    params: query
  })
}

// 查询商家详细
export function getStore(id) {
  return request({
    url: '/operate/store/' + id,
    method: 'get'
  })
}

// 新增商家
export function addStore(data) {
  return request({
    url: '/operate/store',
    method: 'post',
    data: data
  })
}

// 修改商家
export function updateStore(data) {
  return request({
    url: '/operate/store',
    method: 'put',
    data: data
  })
}

// 删除商家
export function delStore(id) {
  return request({
    url: '/operate/store/' + id,
    method: 'delete'
  })
}

// 导出商家
export function exportStore(query) {
  return request({
    url: '/operate/store/export',
    method: 'get',
    params: query
  })
}
