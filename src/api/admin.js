import request from '@/utils/request'

export function listAuthUser(query) {
    return request({
        url: '/admin/fetchUserDataInfo',
        method: 'get',
        params: query
    })
}

export function getUserInfo(id) {
    return request({
        url: `/admin/getUserInfo/${id}`,
        method: 'get',
    })
}

export function delUserInfo(ids) {
    return request({
        url: `/admin/removeUserInfo/${ids}`,
        method: 'delete',
    })
}