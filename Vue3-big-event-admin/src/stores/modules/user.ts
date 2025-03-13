import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { userGetInfoService } from '@/api/user'
interface UserInfo {
  email: string
  id: number | null
  nickname: string
  user_pic: string
  username: string
}
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const setToken = (newToken: string): void => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    const user: Ref<UserInfo> = ref({
      email: '',
      id: null,
      nickname: '',
      user_pic: '',
      username: '',
    })
    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data.data
    }
    const setUser = (obj: UserInfo) => {
      user.value = obj
    }

    const removeUser = () => {
      user.value = { email: '', id: null, nickname: '', user_pic: '', username: '' }
    }
    return { token, setToken, removeToken, user, getUser, setUser, removeUser }
  },
  {
    persist: true,
  },
)
