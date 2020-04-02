import request from '@/utils/request'

// 查询会员卡列表
export function listMembercard(query) {

  return request({
    url: '/basicsSet/membercard/list',
    method: 'get',
    params: query
  })
}

// 查询会员卡详细
export function getMembercard(id) {
  return request({
    url: '/basicsSet/membercard/' + id,
    method: 'get'
  })
}

// 新增会员卡
export function addMembercard(data) {
  return request({
    url: '/basicsSet/membercard',
    method: 'post',
    data: data
  })
}

// 修改会员卡
export function updateMembercard(data) {
  return request({
    url: '/basicsSet/membercard',
    method: 'put',
    data: data
  })
}

// 删除会员卡
export function delMembercard(id) {
  return request({
    url: '/basicsSet/membercard/' + id,
    method: 'delete'
  })
}

// 导出会员卡
export function exportMembercard(query) {
  return request({
    url: '/basicsSet/membercard/export',
    method: 'get',
    params: query
  })
}
