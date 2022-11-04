<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header class="header-box">
      <div>
        <img src="../assets/seu.jpg" class="home-logo">
        <span>逻辑程序测试平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <!--菜单栏折叠按钮-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse=isCollapsed
          :collapse-transition="false"
          router>
          <!--一级菜单-->
          <el-menu-item v-for="item in menulist" :key="item.index" :index="item.index">
            <template>
              <i :class=item.icon></i>
              <span class="menu-title">{{ item.title }}</span>
            </template>
          </el-menu-item>
        </el-menu>
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
export default {
  name: 'Home',
  data () {
    return {
      // 菜单栏是否折叠
      isCollapsed: false,
      // 左侧菜单数据(可以恩据需要转换为一级菜单和二级菜单结合的形式)
      menulist: [
        {
          index: 'program-reading',
          title: '程序阅读',
          icon: 'el-icon-folder-add'
        },
        {
          index: 'upload',
          title: '程序编写',
          icon: 'el-icon-folder-add'
        },
        {
          index: 'upload',
          title: '问卷调查',
          icon: 'el-icon-folder-add'
        },
        {
          index: 'experiment-manage',
          title: '实验管理',
          icon: 'el-icon-folder-add'
        }
      ]
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 点击按钮，切换菜单的折叠展开
    toggleCollapse () {
      this.isCollapsed = !this.isCollapsed
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

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
