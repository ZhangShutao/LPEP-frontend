<template>
  <div>
    欢迎， {{ username }}
  </div>
</template>

<script>
export default {
  name: 'UserWelcome',
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
