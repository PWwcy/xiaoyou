import request from '@/utils/request'

// 登录方法
export function homeData(data) {
  return request({
    url: '/system/user/homeStatistics',
    method: 'get',
    params: data
  })
}
