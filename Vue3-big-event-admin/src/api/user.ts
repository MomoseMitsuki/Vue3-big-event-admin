import request from '@/utils/request'
import type { MaybeRef } from 'vue'
import { toValue } from 'vue'
interface UserUpdateInfo {
  username: string
  nickname: string
  email: string
  id: number | null
}
interface UserRegisterItem {
  username: string
  password: string
  repassword?: string
}
export const userLoginOrRegisterService = (userRef: MaybeRef<UserRegisterItem>) => {
  if (toValue(userRef).repassword) return request.post('/api/reg', toValue(userRef))
  return request.post('/api/login', toValue(userRef))
}

export const userGetInfoService = () => {
  return request.get('/my/userinfo')
}
export const userUpdateInfoService = ({ id, nickname, email }: UserUpdateInfo) =>
  request.put('/my/userinfo', { id, nickname, email })
export const userUploadAvatarService = (avatar: File) =>
  request.patch('/my/update/avatar', { avatar })
export const userUpdatePassService = ({
  old_pwd,
  new_pwd,
  re_pwd,
}: {
  old_pwd: string
  new_pwd: string
  re_pwd: string
}) => request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
