<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <page-header></page-header>
    </el-header>
    <el-container>
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
import PageHeader from '../common/PageHeader'
export default {
  name: 'Exam',
  components: {
    PageHeader
  },
  data () {
    return {
    }
  },
  methods: {
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

.content-box {
  left: 50px;
  padding-top: 0;
}
</style>
