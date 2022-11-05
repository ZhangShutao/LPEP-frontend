<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header class="header-box">
      <div>
        <img src="../../assets/seu.jpg" class="home-logo">
        <span>逻辑程序测试平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏-->
      <el-aside class="sidebar-box">
        <user-side-bar></user-side-bar>
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
import UserSideBar from './UserSideBar'
export default {
  name: 'UserHome',
  components: {
    UserSideBar
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

.header-box {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  height: 70px;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
  }

  span {
    margin-left: 15px;
  }
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

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
  overflow: visible;
  padding: 18px;
}

.menu-title {
  margin-left: 15px;
}

</style>
