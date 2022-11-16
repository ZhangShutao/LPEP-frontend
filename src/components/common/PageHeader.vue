<template>
  <div class="header-box">
    <div>
      <img src="../../assets/seu.jpg" class="home-logo" alt="">
      <span>逻辑程序测试平台</span>
    </div>
    <el-button type="info" @click="signOut">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  methods: {
    signOut () {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  padding-right: 10px;
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
