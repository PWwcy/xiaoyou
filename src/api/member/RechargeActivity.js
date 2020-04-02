import request from '@/utils/request'

// 查询会员充值活动列表
export function listRechargeActivity(query) {
  return request({
    url: '/member/RechargeActivity/list',
    method: 'get',
    params: query
  })
}

// 查询会员充值活动详细
export function getRechargeActivity(id) {
  return request({
    url: '/member/RechargeActivity/' + id,
    method: 'get'
  })
}

// 新增会员充值活动
export function addRechargeActivity(data) {
  return request({
    url: '/member/RechargeActivity',
    method: 'post',
    data: data
  })
}

// 修改会员充值活动
export function updateRechargeActivity(data) {
  return request({
    url: '/member/RechargeActivity',
    method: 'put',
    data: data
  })
}

// 删除会员充值活动
export function delRechargeActivity(id) {
  return request({
    url: '/member/RechargeActivity/' + id,
    method: 'delete'
  })
}

// 导出会员充值活动
export function exportRechargeActivity(query) {
  return request({
    url: '/member/RechargeActivity/export',
    method: 'get',
    params: query
  })
}