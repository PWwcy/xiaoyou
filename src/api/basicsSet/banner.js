import request from '@/utils/request'

// 查询banner列表
export function listBanner(query) {
  return request({
    url: '/basicsSet/banner/list',
    method: 'get',
    params: query
  })
}

// 查询banner详细
export function getBanner(id) {
  return request({
    url: '/basicsSet/banner/' + id,
    method: 'get'
  })
}

// 新增banner
export function addBanner(data) {
  return request({
    url: '/basicsSet/banner',
    method: 'post',
    data: data
  })
}

// 修改banner
export function updateBanner(data) {
  return request({
    url: '/basicsSet/banner',
    method: 'put',
    data: data
  })
}

// 删除banner
export function delBanner(id) {
  return request({
    url: '/basicsSet/banner/' + id,
    method: 'delete'
  })
}

// 导出banner
export function exportBanner(query) {
  return request({
    url: '/basicsSet/banner/export',
    method: 'get',
    params: query
  })
}