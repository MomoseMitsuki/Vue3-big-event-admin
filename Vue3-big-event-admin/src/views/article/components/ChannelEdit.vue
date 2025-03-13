<script setup lang="ts">
import { ref } from 'vue'
import { artEditChannelService, artAddChannelService } from '@/api/article'
import { ElMessage } from 'element-plus'
interface formModelType {
  id: number
  cate_name: string
  cate_alias: string
}
const formModel = ref<formModelType>({
  id: 0,
  cate_name: '',
  cate_alias: '',
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '分类名必须为1-10位的非空字符', trigger: 'blur' },
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类名必须为1-15位的字母或数字', trigger: 'blur' },
  ],
}
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('success')
}
const dialogVisible = ref(false)
const formRef = ref()
const open = (row: formModelType) => {
  dialogVisible.value = true
  formModel.value = { ...row }
}
defineExpose({ open })
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加'" width="30%">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      lable-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item lable="分类名称" prop="cate_name">
        <el-input placeholder="请输入分类名称" v-model="formModel.cate_name"></el-input>
      </el-form-item>
      <el-form-item lable="分类别名" prop="cate_alias">
        <el-input placeholder="请输入分类别名" v-model="formModel.cate_alias"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primaty" @click="onSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
