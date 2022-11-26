<template>
  <div>
    <!--<el-row>-->
    <!--  <el-col span="12" style="background: #0a417a; height: 100%">123</el-col>-->
    <!--  <el-col span="12">-->
    <!--    <el-row>123</el-row>-->
    <!--    <el-row>123</el-row>-->
    <!--  </el-col>-->
    <!--</el-row>-->
    <el-container >
      <el-aside style="height: 100%">123
      </el-aside>
      <el-container>
        <el-main>123</el-main>
        <el-main>123</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'EndExam',
  data () {
    return {
      deadline2: Date.now() + 1000 * 5,
      content: '12'
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
