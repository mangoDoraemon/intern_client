import request from '@/utils/request'

export function redisData(key) {
  return request({
    url: `/auth/redis/data/${key}`,
    method: 'get',
  })
}


export function fetchDealInfo(query) {
  return request({
    url: '/common/getDealInfo',
    method: 'get',
    params: query
  })
}

export function fetchStudentByTeacherNumber(query) {
  return request({
    url: '/common/fetchStudentByTeacherNumber',
    method: 'get',
    params: query
  })
}