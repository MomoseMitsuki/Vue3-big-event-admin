import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://big-event-vue-api-t.itheima.net'
const instance = axios.create({
  baseURL,
  timeout: 10000,
})
instance.interceptors.request.use(
  (config) => {
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (err: unknown) => Promise.reject(err),
)
instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 0) {
      return res
    }
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err: { response: { status: number; data: { message: unknown } } }) => {
    // 处理 401 错误
    if (err.response.status === 401) {
      router.push('/login')
    }
    ElMessage.error(err.response.data.message || '服务异常')
    Promise.reject(err)
  },
)
export default instance
export { baseURL }
