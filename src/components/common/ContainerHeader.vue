<template>
  <div class="container-header">
    <div class="title">{{title}}</div>
    <div class="sub-title">
      {{subTitle}}
      <template v-if="questionNumber > 0">
        — 题目{{questionNumber}}
      </template>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  name: 'ContainerHeader',
  props: {
    title: String,
    subTitle: String,
    questionNumber: Number
  }
}
</script>

<style scoped>
.container-header {
  margin-bottom: 5px;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.sub-title {
  font-size: 20px;
  margin-top: 10px;
  margin-left: 10px;
}
</style>
