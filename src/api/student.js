import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `/auth/getUserInfo/${token}`,
    method: 'get',
  })
}

export function createUser(data) {
  return request({
    url:'/auth/register',
    method:'post',
    data
  })
}


export function getUserList(query) {
  return request({
    url: '/auth/user/v1/list',
    method: 'get',
    params: query
  })
}

export function fetchMineInfo(socialId) {
  return request({
    url:'/auth/fetchMineInfo/'+socialId,
    method:'get'
  })
}

export function updateMineInfo(data) {
  return request({
    url:'/auth/updateMineInfo',
    method:'put',
    data
  })
}

export function updateModifyPsd(data) {
  return request({
    url:'/auth/modifyPsd',
    method:'put',
    data
  })
}