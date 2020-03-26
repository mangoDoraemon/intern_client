import request from '@/utils/request'

export function addDataInfo(data) {
    return request({
        url:'/internShip/addDataInfo',
        method:'post',
        data
    })
}

export function listDataInfo(query) {
    return request({
        url: '/internShip/fetchDataInfo',
        method: 'get',
        params: query
    })
}

export function getDataInfoById(id) {
    return request({
        url: `/internShip/getDataInfoById/${id}`,
        method: 'get',
    })
}

export function updateDataInfo(data) {
    return request({
        url:'/internShip/updateDataInfo',
        method:'put',
        data
    })
}

export function updateDataInfoById(id,updateType) {
    return request({
        url: `/internShip/updateDataInfoById/${id}/${updateType}`,
        method: 'get',
    })
}

export function getDataInfoByIdAndNumber(studentNumber) {
    return request({
        url: `/internShip/getDataInfoByIdAndNumber/${studentNumber}`,
        method: 'get',
    })
}