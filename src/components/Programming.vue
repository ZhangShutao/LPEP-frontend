<template>
  <!--程序编写页面-->
  <el-container class="container">
    <!--题干区域-->
    <el-aside width="400px" style="background-color: rgb(238, 241, 246)">题目区域</el-aside>
    <!--编程区域-->
    <el-main class="editor-box">代码编写区域</el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Programming'
}
</script>

<style scoped>
.question-box {
  height: 100%;
  background-color: #969896;
}

.editor-box {
  height: 100%;
  background-color: #969896;
}
</style>
