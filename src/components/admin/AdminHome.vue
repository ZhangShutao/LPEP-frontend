<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <page-header></page-header>
    </el-header>
    <el-container>
      <!--侧边栏-->
      <el-aside class="sidebar-box">
        <admin-side-bar></admin-side-bar>
      </el-aside>

      <!--页面主体区域-->
      <el-main class="content-box">
        <router-view></router-view>
      </el-main>
    </el-container>
    <!--底边栏-->
    <el-footer height="30px">
      &copy;东南大学 知识科学与工程实验室
    </el-footer>
  </el-container>
</template>

<script>
import AdminSideBar from './AdminSideBar'
import PageHeader from '../common/PageHeader'
export default {
  name: 'UserHome',
  components: {
    AdminSideBar,
    PageHeader
  },
  data () {
    return {
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-footer {
  background-color: #d7dce7;
  color: black;
  display:flex;
  align-items: center;
  justify-content: center;
}

.home-logo {
  height: 100%;
  width: 60px;
  border-radius: 50%;
}

.menu-title {
  margin-left: 15px;
}

</style>
