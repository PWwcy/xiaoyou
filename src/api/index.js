import request from '@/utils/request'

// 登录方法
export function homeData(data) {
  return request({
    url: '/index',
    method: 'post',
    data: data
  })
}
