import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        { path: '/article/manage', component: () => import('@/views/article/ArticleManage.vue') },
        { path: '/article/channel', component: () => import('@/views/article/ArticleChannel.vue') },
        { path: '/user/profile', component: () => import('@/views/user/UserProfile.vue') },
        { path: '/user/avatar', component: () => import('@/views/user/UserAvatar.vue') },
        { path: '/user/password', component: () => import('@/views/user/UserPassword.vue') },
      ],
    },
  ],
})
// 登录访问拦截
// 1. undefined / true 直接放行
// 2. false 拦回from的地址页面
// 3. 具体路径 或 路径对象 拦截到对应的地址
//  '/login' {name:'login'}
router.beforeEach((to) => {
  // 如果没有 token ,且访问的是非登录页,拦截到登录
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
  return true
})

export default router
