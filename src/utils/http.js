// axios

import axios from "axios"

const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})

http.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

http.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})

export { http }