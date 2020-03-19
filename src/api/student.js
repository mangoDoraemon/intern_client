import request from '@/utils/request'

export function listStudent(query) {
  return request({
    url: '/auth/student/fetchStudentInfoData',
    method: 'get',
    params: query
  })
}

export function addStudent(data) {
  return request({
    url:'/auth/student/addStudentInfo',
    method:'post',
    data
  })
}

export function delStudentInfo(ids) {
  return request({
    url: `/auth/student/removeStudentInfo/${ids}`,
    method: 'delete',
  })
}

export function getStudentInfo(id) {
  return request({
    url: `/auth/student/getStudentInfoById/${id}`,
    method: 'get',
  })
}

export function updateStudentInfo(data) {
  return request({
    url:'/auth/student/updateStudentInfo',
    method:'put',
    data
  })
}

export function listStudentInfoAll(query) {
  return request({
    url: '/auth/student/fetchStudentInfoAll',
    method: 'get',
    params: query
  })
}

export function updateStudentState(id,teacherNumber) {
  return request({
    url: `/auth/student/updateStudentState/${id}/${teacherNumber}`,
    method: 'get',
  })
}

export function removeStudentState(id) {
  return request({
    url: `/auth/student/removeStudentState/${id}`,
    method: 'get',
  })
}

export function getStudentInfoByNumber(id) {
  return request({
    url: `/auth/student/getStudentInfoByNumber/${id}`,
    method: 'get',
  })
}