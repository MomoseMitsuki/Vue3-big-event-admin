<script setup lang="ts">
import { artGetChannelService } from '@/api/article'
import { ref } from 'vue'
defineProps({
  cid: {
    type: [Number, String],
  },
  width: {
    type: String,
  },
})
interface ArticleItem {
  id: number
  title: string
  pub_date: string
  state: '已发布' | '草稿' | null
  cate_name: string
}
const emit = defineEmits(['update:cid'])
const channelList = ref<Array<ArticleItem>>([])
const getChannelList = async () => {
  const res = await artGetChannelService()
  channelList.value = res.data.data as Array<ArticleItem>
}
getChannelList()
</script>

<template>
  <el-select :style="{ width }" :modelValue="cid" @update:modelValue="emit('update:cid', $event)"
    ><el-option
      v-for="channel in channelList"
      :label="channel.cate_name"
      :value="channel.id"
      :key="channel.id"
    ></el-option>
  </el-select>
</template>
