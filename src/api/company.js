import request from '@/utils/request'

export function listCompany(query) {
  return request({
    url: '/company/listCompany',
    method: 'get',
    params: query
  })
}

export function addCompany(data) {
  return request({
    url:'/company/addCompany',
    method:'post',
    data
  })
}

export function delCompanyInfo(ids) {
  return request({
    url: `/company/removeCompany/${ids}`,
    method: 'delete',
  })
}

export function getCompany(id) {
  return request({
    url: `/company/getCompany/${id}`,
    method: 'get',
  })
}

export function updateCompany(data) {
  return request({
    url:'/company/updateCompany',
    method:'put',
    data
  })
}