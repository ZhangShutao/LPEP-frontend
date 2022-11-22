<template>
  <div>
    测验结束，感谢您的参与
    <el-checkbox-group v-model="checkList">
      <el-checkbox label="复选框 A">
        <el-input></el-input>
      </el-checkbox>
      <el-checkbox label="复选框 A">
        <el-input></el-input>
      </el-checkbox>
      <el-checkbox label="复选框 A">
        <el-input></el-input>
      </el-checkbox>
      <el-checkbox label="复选框 B"></el-checkbox>
      <el-checkbox label="复选框 C"></el-checkbox>
      <el-checkbox label="禁用" disabled></el-checkbox>
      <el-checkbox label="选中且禁用" disabled></el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'EndExam',
  data () {
    return {
      checkList: ['选中且禁用', '复选框 A']
    }
  }
}
</script>

<style scoped>

</style>
