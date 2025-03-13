import request from '@/utils/request'

export const artGetChannelService = () => {
  return request.get('/my/cate/list')
}

export const artAddChannelService = (data: { cate_name: string; cate_alias: string }) => {
  return request.post('/my/cate/add', data)
}

export const artEditChannelService = (data: {
  id: number
  cate_name: string
  cate_alias: string
}) => {
  return request.put('/my/cate/info', data)
}

export const artDelChannelService = (id: number) => {
  return request.delete('/my/cate/del', {
    params: { id },
  })
}

export const artGetListService = (params: {
  pagenum: number
  pagesize: number | string
  cate_id: number | string
  state: string
}) =>
  request.get('/my/article/list', {
    params,
  })

export const artPublishService = (data: FormData) => {
  request.post('/my/article/add', data)
}

export const artGetDetailService = (id: number) =>
  request.get('/my/article/info', {
    params: { id },
  })

export const artEditService = (data: {
  id: string
  title: string
  cate_id: string
  content: string
  cover_img: File
  state: '已发布' | '草稿'
}) => {
  return request.put('/my/article/info', data)
}

export const artDelService = (id: number) => request.delete('my/article/info', { params: { id } })
