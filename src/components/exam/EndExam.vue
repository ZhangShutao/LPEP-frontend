<template>
  <el-result icon="success" title="测验结束,感谢参与" subTitle="">
  </el-result>
</template>

<script>
export default {
  name: 'EndExam',
  data () {
    return {
      list: [1, 2, 3]
    }
  },
  methods: {
    test () {
      this.$alert('本题答案已通过,即将开始下一题', '测试通过', {
        confirmButtonText: '确认',
        callback: () => { console.log(12345) }
      })
    }
  }
}
</script>

<style scoped>

</style>
