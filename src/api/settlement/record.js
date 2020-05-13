import request from '@/utils/request'

// 查询结算记录列表
export function listRecord(query) {
  return request({
    url: '/settlement/record/list',
    method: 'get',
    params: query
  })
}

// 查询结算记录详细
export function getRecord(id) {
  return request({
    url: '/settlement/record/' + id,
    method: 'get'
  })
}

// 新增结算记录
export function addRecord(data) {
  return request({
    url: '/settlement/record',
    method: 'post',
    data: data
  })
}

// 修改结算记录
export function updateRecord(data) {
  return request({
    url: '/settlement/record',
    method: 'put',
    data: data
  })
}

// 删除结算记录
export function delRecord(id) {
  return request({
    url: '/settlement/record/' + id,
    method: 'delete'
  })
}

// 导出结算记录
export function exportRecord(query) {
  return request({
    url: '/settlement/record/export',
    method: 'get',
    params: query
  })
}