<template>
  <div>
    欢迎， 管理员{{ username }}
  </div>
</template>

<script>
export default {
  name: 'AdminWelcome',
  data () {
    return {
      username: ''
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.username = userInfo.username
    }
  }
}
</script>

<style scoped>

</style>
