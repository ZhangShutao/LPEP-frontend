<template>
  <div class="container-header">
    <span>{{title}}</span>
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  name: 'ContainerHeader',
  props: {
    title: String
  }
}
</script>

<style scoped>
.container-header {
  font-size: 20px;
  font-weight: bold;
  line-height: 20px;
  height: 30px;
  margin-bottom: 25px;
  /*width: 100%;*/
  /*background-color: #63a35c;*/

}
</style>
