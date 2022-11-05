import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import UserHome from '../components/user/UserHome'
import UserWelcome from '../components/user/UserWelcome'
import UserInfo from '../components/user/UserInfo'
import ExperimentToBeParticipatedIn from '../components/user/ExperimentToParticipate'
import TextbookDownload from '../components/user/TextbookDownload'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/user',
    component: UserHome,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: UserWelcome },
      { path: 'info', component: UserInfo },
      { path: 'experiment-to-do', component: ExperimentToBeParticipatedIn },
      { path: 'textbook-download', component: TextbookDownload }
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
