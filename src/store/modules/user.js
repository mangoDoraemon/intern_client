import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import {redisData} from "../../api/common";

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  email: '',
  introduction: '',
  roles: [],
  socialId:'',
  roleId:0,
  id:'',
  roleName:'',
  redis: [],
  teacherNumber:'',
  companyNumber:'',
  studentNumber:'',
  yesOrNo:'',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar.substring(10,23)
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_SOCIAL_ID: (state, socialId) => {
    state.socialId = socialId
  },
  SET_ROLE_ID:(state,roleId) =>{
    state.roleId=roleId
  },
  SET_ID:(state,id)=>{
    state.id=id
  },
  SET_ROLE_NAME:(state,roleName)=>{
    state.roleName=roleName
  },
  SET_TEACHER_NUMBER:(state,teacherNumber)=>{
    state.teacherNumber=teacherNumber
  },
  SET_COMPANY_NUMBER:(state,companyNumber)=>{
    state.companyNumber=companyNumber
  },
  SET_STUDENT_NUMBER:(state,studentNumber)=>{
    state.studentNumber=studentNumber
  },
  SET_YES_OR_NO:(state,yesOrNo)=>{
    state.yesOrNo=yesOrNo
  },
  $_setRedis: (state, data) => {
    const {key, value} = data;
    state.redis[key] = value
  },

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const socialIds = userInfo.socialId.trim()
    const passwords=userInfo.password
    return new Promise((resolve, reject) => {
      login({ socialId: socialIds, password: passwords}).then(response => {
        commit('SET_TOKEN', response.data.token)
        setToken(response.data.token)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },


  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        let model  = response.data.userInfos
        if (!model) {
          reject('Verification failed, please Login again.')
        }
        const { roles, name, avatar, introduction, email,socialId,roleId,id,roleName,teacherNumber,companyNumber,studentNumber,yesOrNo } = model
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_EMAIL', email)
        commit('SET_SOCIAL_ID', socialId)
        commit('SET_ROLE_ID', roleId)
        commit('SET_ID', id)
        commit('SET_ROLE_NAME',roleName)
        commit('SET_TEACHER_NUMBER',teacherNumber)
        commit('SET_COMPANY_NUMBER',companyNumber)
        commit('SET_STUDENT_NUMBER',studentNumber)
        commit('SET_YES_OR_NO',yesOrNo)
        resolve(model)

      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  fetchRedis(key) {
    return new Promise((resolve, reject) => {
        redisData(key).then(response => {
          debugger
          const {data} = response;
          resolve(data)
        }).catch(error => {
          reject(error)
        })

    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
