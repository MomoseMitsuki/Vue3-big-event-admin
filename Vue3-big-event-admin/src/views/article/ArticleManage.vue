<script setup lang="ts">
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from '@/components/ChannelSelect.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from '@/components/ArticleEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
interface ArticleItem {
  id: number
  title: string
  pub_date: string
  state: '已发布' | '草稿' | null
  cate_name: string
}
interface QueryType {
  pagenum: number
  pagesize: number | string
  cate_id: number | string
  state: string
}
const loading = ref(false)
const articleList = ref<Array<ArticleItem>>([])
const articleEditRef = ref()
const onAddArticle = () => {
  articleEditRef.value.open()
}
const onEditArticle = (row: ArticleItem) => {
  articleEditRef.value.open(row)
}
const onDeleteArticle = async (row: ArticleItem) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
  await artDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getArticleList()
}
const onSizeChange = (size: number) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
const onCurrentChange = (page: number) => {
  params.value.pagenum = page
  getArticleList()
}
const params = ref<QueryType>({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: '',
})
const total = ref(0)
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
// 搜索逻辑
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
// 重置逻辑 => 将筛选条件，重新检索
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}
getArticleList()
const onSuccess = (type: string) => {
  if (type === 'add') {
    const lastPage = Math.ceil((total.value + 1) / (params.value.pagesize as number))
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <el-form inline>
      <el-form-item label="文章分类:">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态:">
        <el-select v-model:cid="params.state" style="width: 150px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper,total,sizes,prev,pager,next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    >
    </el-pagination>
    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </page-container>
</template>

<style lang="scss" scoped></style>
