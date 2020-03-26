import request from '@/utils/request'

export function createReport(data) {
    return request({
        url:'/report/createReport',
        method:'post',
        data
    })
}

export function listReportInfo(query) {
    return request({
        url: '/report/fetchReportInfo',
        method: 'get',
        params: query
    })
}

export function getReportInfoById(id) {
    return request({
        url: `/report/getReportInfoById/${id}`,
        method: 'get',
    })
}

export function updateReportInfo(data) {
    return request({
        url:'/report/updateReportInfo',
        method:'put',
        data
    })
}

export function removeReportInfo(ids) {
    return request({
        url: `/report/removeReportInfo/${ids}`,
        method: 'delete',
    })
}

export function updateInfoById(id,changeType,dismissReason) {
    return request({
        url: `/report/updateInfoById/${id}/${changeType}/${dismissReason}`,
        method: 'get',
    })
}

// 导出
export function exportReport(query) {
    return request({
        url: '/report/exportReport',
        method: 'get',
        params: query
    })
}