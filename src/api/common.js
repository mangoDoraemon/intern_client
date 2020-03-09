import request from '@/utils/request'

export function redisData(key) {
  return request({
    url: `/auth/redis/data/${key}`,
    method: 'get',
  })
}