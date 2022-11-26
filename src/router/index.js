import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import UserHome from '../components/user/UserHome'
import UserWelcome from '../components/user/UserWelcome'
import UserInfo from '../components/user/UserInfo'
import ExperimentToBeParticipatedIn from '../components/user/ExperimentToParticipate'
import TextbookDownload from '../components/user/TextbookDownload'
import AdminHome from '../components/admin/AdminHome'
import AdminWelcome from '../components/admin/AdminWelcome'
import AdminInfo from '../components/admin/AdminInfo'
import ExperimentTable from '../components/admin/ExperimentTable'
import ParticipantsTable from '../components/admin/participate/ParticipantsTable'
import TextbookManagement from '../components/admin/textbook/TextbookManagement'
import Questionaire from '../components/exam/Questionnaire'
import Programming from '../components/exam/Programming'
import TimeCount from '../components/common/TimeCount'
import Exam from '../components/exam/Exam'
import EndExam from '../components/exam/EndExam'

Vue.use(VueRouter)

const routes = [
  // 登录页面路由
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  // 用户页面路由
  {
    path: '/user',
    component: UserHome,
    redirect: '/user/welcome',
    children: [
      { path: 'welcome', component: UserWelcome },
      { path: 'info', component: UserInfo },
      { path: 'experiment-to-do', component: ExperimentToBeParticipatedIn },
      { path: 'textbook-download', component: TextbookDownload }
    ]
  },
  // 管理员页面路由
  {
    path: '/admin',
    component: AdminHome,
    redirect: '/admin/welcome',
    children: [
      { path: 'welcome', component: AdminWelcome },
      { path: 'info', component: AdminInfo },
      { path: 'experiments-table', component: ExperimentTable },
      { path: 'textbook-management', component: TextbookManagement },
      { path: 'participants-table', component: ParticipantsTable }
    ]
  },
  // 测试阶段路由
  {
    path: '/exam',
    component: Exam,
    children: [
      // 程序阅读路由
      { path: 'questionnaire', component: Questionaire },
      { path: 'programming', component: Programming },
      { path: 'timer', component: TimeCount },
      { path: 'exam-end', component: EndExam }
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
