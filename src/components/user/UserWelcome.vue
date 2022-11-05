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
      username: 'xxx'
    }
  }
}
</script>

<style scoped>

</style>
