import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import ProgramReading from '../components/ProgramReading'
import ExperimentManage from '../components/ExperimentManage'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    // redirect: '/welcome',
    children: [
      { path: '/experiment-manage', component: ExperimentManage },
      { path: '/program-reading', component: ProgramReading }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // if (to.path === '/login') return next()
  // const tokenStr = window.sessionStorage.getItem('token')
  // if (!tokenStr) return next('/login')
  next()
})

export default router
