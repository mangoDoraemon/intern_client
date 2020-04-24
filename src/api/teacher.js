import request from '@/utils/request'

export function listTeacher(query) {
  return request({
    url: '/auth/teacher/fetchTeacherInfoData',
    method: 'get',
    params: query
  })
}

export function addTeacher(data) {
  return request({
    url:'/auth/teacher/insertTeacherInfo',
    method:'post',
    data
  })
}

export function updateTeacher(data) {
  return request({
    url:'/auth/teacher/editTeacherInfo',
    method:'put',
    data
  })
}

export function delTeacherInfo(ids) {
    return request({
        url: `/auth/teacher/removeTeacherInfo/${ids}`,
        method: 'delete',
    })
}

export function getTeacherInfo(id) {
    return request({
        url: `/auth/teacher/getTeacherInfoById/${id}`,
        method: 'get',
    })
}