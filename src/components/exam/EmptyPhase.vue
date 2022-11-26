<template>
  <div>
  </div>
</template>

<script>
export default {
  name: 'EmptyPhase',
  created () {
    this.$alert('此阶段没有问题,进入下一阶段', '提示', {
      confirmButtonText: '确定',
      callback: this.gotoNextPhase
    })
  },
  methods: {
    async gotoNextPhase () {
      // 更新下一个阶段
      this.userInfo.phaseNumber = this.userInfo.phaseNumber + 1
      this.userInfo.questionNumber = 1
      sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      // 获取下一阶段实验类型
      const { data: res } = await this.$http.post('exper/getnextphasestatus', {
        userId: this.userInfo.userId,
        experId: this.userInfo.experId,
        phaseNumber: this.userInfo.phase
      })
      if (res.status === 206) {
        return this.$router.push('/exam/empty-phase')
      }
      if (res.data.isEnd === 1) {
        return this.$router.push('/exam/exam-end')
      }
      if (res.data.isProg === 0) {
        this.$router.push('/exam/questionnaire')
      } else {
        this.$router.push('/exam/programming')
      }
    }
  }
}

</script>

<style scoped>

</style>
