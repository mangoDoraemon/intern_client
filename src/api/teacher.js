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