import request from '@/utils/request'

// 查询关于我们列表
export function listAbout(query) {
  return request({
    url: '/basicsSet/about/list',
    method: 'get',
    params: query
  })
}

// 查询关于我们详细
export function getAbout(id) {
  return request({
    url: '/basicsSet/about/' + id,
    method: 'get'
  })
}

// 新增关于我们
export function addAbout(data) {
  return request({
    url: '/basicsSet/about',
    method: 'post',
    data: data
  })
}

// 修改关于我们
export function updateAbout(data) {
  return request({
    url: '/basicsSet/about',
    method: 'put',
    data: data
  })
}

// 删除关于我们
export function delAbout(id) {
  return request({
    url: '/basicsSet/about/' + id,
    method: 'delete'
  })
}

// 导出关于我们
export function exportAbout(query) {
  return request({
    url: '/basicsSet/about/export',
    method: 'get',
    params: query
  })
}
