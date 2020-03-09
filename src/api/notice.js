import request from '@/utils/request'

export function fetchInfoAll(query) {
  return request({
    url: '/auth/notice/fetchNoticeInfoDataAll',
    method: 'get',
    params: query
  })
}

export function addNotice(data) {
  return request({
    url:'/auth/notice/insertNoticeInfo',
    method:'post',
    data
  })
}

export function listNotice(query) {
  return request({
    url: '/auth/notice/fetchNoticeInfoData',
    method: 'get',
    params: query
  })
}

export function delNotice(ids) {
    return request({
        url: `/auth/notice/removeNoticeInfo/${ids}`,
        method: 'delete',
    })
}