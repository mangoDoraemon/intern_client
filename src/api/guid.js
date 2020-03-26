import request from '@/utils/request'

//create
export function createData(data) {
    return request({
        url:'/guid/createData',
        method:'post',
        data
    })
}

//list
export function fetchDataInfo(query) {
    return request({
        url: '/guid/fetchDataInfo',
        method: 'get',
        params: query
    })
}

//get
export function getDataInfoById(id) {
    return request({
        url: `/guid/getDataInfoById/${id}`,
        method: 'get',
    })
}

//update
export function updateDataInfo(data) {
    return request({
        url:'/guid/updateDataInfo',
        method:'put',
        data
    })
}

export function removeDataInfo(ids) {
    return request({
        url: `/guid/removeDataInfo/${ids}`,
        method: 'delete',
    })
}