<template>
  <div>
    欢迎， {{ username }}
  </div>
</template>

<script>
export default {
  name: 'AdminWelcome',
  data () {
    return {
      username: 'xxx管理员'
    }
  }
}
</script>

<style scoped>

</style>
