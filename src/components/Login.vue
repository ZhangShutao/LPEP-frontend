<template>
  <div class="login_container">
    <div class="login_box">
      <!--图标框-->
      <div class="avatar_box">
        <img src="../assets/seu.jpg">
      </div>
      <!--标题框-->
      <div class="login_title">
        <h2>LP测验平台</h2>
      </div>
      <!--登录表单区域-->
      <el-form ref="loginFormRef" :model="loginForm" label-width="0px" class="login_form">
        <!--输入区域-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!--按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">测试人员登录</el-button>
          <el-button type="success" @click="login">管理人员登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 登录表单的绑定对象
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      // 可以在登录之前实现预验证，这里没有进行验证

      // 向后台/login接口发起登录请求
      // const { data: res } = await this.$http.post('login', this.loginForm)
      // if (res.meta.status !== 200) return this.$message.error('登录失败！')
      // this.$message.success('登录成功')
      // window.sessionStorage.setItem('token', res.data.token)
      // window.sessionStorage.setItem('token', 'this is token')
      // 跳转到Home主页
      this.$router.push('/home')
    },
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  //border: 1px solid #eee;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -65%);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.login_title {
  margin-top: 50px;
  margin-left: 28px;
}

.login_form {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
