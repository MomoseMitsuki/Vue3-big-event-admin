<script setup lang="ts">
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artAddChannelService, artGetDetailService, artEditService } from '@/api/article'
import { baseURL } from '@/utils/request'
import { ElMessage } from 'element-plus'
import axios from 'axios'
interface ArticleItem {
  id?: number
  title?: string
  pub_date?: string
  state?: '已发布' | '草稿' | null
  cate_name?: string
}
interface FormModelType {
  title: string
  cate_id: string | number
  cover_img: File | string | Blob | MediaSource
  content: string
  state: string
  [key: string]: string | Blob | MediaSource | number
}
interface FormDataType {
  id: string
  title: string
  cate_id: string
  content: string
  cover_img: File
  state: '已发布' | '草稿'
}
const defaultForm = ref<FormModelType>({
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: '',
})
const imgUrl = ref('')
const onSelectFile = (uploadFile: { raw: Blob | MediaSource }) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}
const formModel = ref<FormModelType>({ ...defaultForm.value })
const visibleDrawer = ref(false)
const emit = defineEmits(['success'])
const onPublish = async (state: '已发布' | '草稿') => {
  formModel.value.state = state
  // 将普通对象 转换成 FormData 对象
  const fd = new FormData()
  for (const key in formModel.value) {
    fd.append(key, formModel.value[key] as string | Blob)
  }
  if (formModel.value.cate_id) {
    await artEditService(fd as unknown as FormDataType)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    await artAddChannelService(fd as unknown as { cate_name: string; cate_alias: string })
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    emit('success', 'add')
  }
}
const editorRef = ref()
const open = async (row: ArticleItem) => {
  visibleDrawer.value = true
  if (row.id) {
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    const file = await imageUrlToFileObject(imgUrl.value, formModel.value.cover_img as string)
    formModel.value.cover_img = file as File
  } else {
    formModel.value = { ...defaultForm.value }
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}
async function imageUrlToFileObject(imageUrl: string, filename: string) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const blob = new Blob([response.data], { type: response.headers['content-type'] })
    const file = new File([blob], filename, { type: response.headers['content-type'] })
    return file
  } catch (error) {
    console.error(error)
    return null
  }
}
defineExpose({ open })
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.cate_id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
