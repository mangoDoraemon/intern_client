import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import  router from "vue-router";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 ,// request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()

    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)


// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get information such as headers or status
     * Please return  response => response
     */
    response => response,
    error => {
        if (error.response && error.response.status === 404) {
            router.push('/')
        }
        return Promise.reject(error.response)
    }
)

export default service
