import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ThemeSwitchPage from '../components/ThemeSwitchPage.vue'
// 导入用户列表组件
import UserList from '../views/UserList.vue'
// 导入New组件（请根据实际文件路径修改）
import New from '../views/New.vue'  // 假设New组件在views目录下

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/theme-switch',
      name: 'themeSwitch',
      component: ThemeSwitchPage
    },
    {
      path: '/new',  // 建议使用小写路径
      name: 'new',
      component: New,  // 现在New组件已正确导入
      meta: { hideHeader: true }  // 修复了语法错误（冒号后应有空格）
    },
    {
      path: '/users',
      name: 'users',
      component: UserList,
      meta: {
        title: '用户列表'
      }
    }
  ],
})

export default router

