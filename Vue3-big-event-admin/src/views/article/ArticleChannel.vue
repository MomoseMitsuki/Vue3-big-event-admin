<script setup lang="ts">
import { ref } from 'vue'
import { artGetChannelService, artDelChannelService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
interface ArticleChannelItem {
  id: number
  cate_name: string
  cate_alias: string
}
const channelList = ref<Array<ArticleChannelItem>>([])
const loading = ref(false)
const dialog = ref()
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()
const onEditChannel = (row: ArticleChannelItem) => {
  dialog.value.open(row)
}
const onDeleteChannel = async (row: ArticleChannelItem) => {
  await ElMessageBox.confirm('你确认要删除该分类么', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonClass: '取消',
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
const onAddChannel = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" lable="序号"></el-table-column>
      <el-table-column prop="cate_name" lable="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" lable="分类别名"></el-table-column>
      <el-table-column lable="操作" width="150">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            @click="onEditChannel(row)"
            circle
            plain
            type="primary"
          ></el-button>
          <el-button
            :icon="Delete"
            @click="onDeleteChannel(row)"
            circle
            plain
            type="danger"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </page-container>
</template>

<style lang="scss" scoped></style>
