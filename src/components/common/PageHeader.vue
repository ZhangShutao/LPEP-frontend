<template>
  <div class="header-box">
    <div>
      <img src="../../assets/seu.jpg" class="home-logo">
      <span>逻辑程序测试平台</span>
    </div>
    <el-button type="info">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'PageHeader'
}
</script>

<style lang="less" scoped>
.header-box {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  height: 60px;
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

.home-logo {
  height: 100%;
  width: 60px;
  border-radius: 50%;
}

</style>
