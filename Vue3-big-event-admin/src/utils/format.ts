import { dayjs } from 'element-plus'
export const formatTime = (time: Date) => dayjs(time).format('YYYY年MM月DD日')
