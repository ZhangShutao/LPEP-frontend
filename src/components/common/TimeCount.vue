<template>
  <span class="timeCount-container">{{ this.minute }} 分 {{ this.second }} 秒</span>
</template>

<script>
export default {
  name: 'TimeCount',
  data () {
    return {
      endTime: 0,
      hour: 0,
      minute: 0,
      second: 0,
      interval: null
    }
  },
  props: {
    // 倒计时时间
    longTime: {
      type: Number,
      default: 30
    },
    // 弹出框标题
    messageTitle: {
      type: String,
      default: ''
    },
    // 弹出框内容
    messageText: {
      type: String,
      default: ''
    }
  },
  mounted () {
    // 结束时间
    this.endTime = Date.parse(new Date()) + this.longTime * 1000
    // 开始倒计时
    this.countdown()
  },
  beforeDestroy () {
    // 提前结束则销毁倒计时
    clearTimeout(this.interval)
  },
  methods: {
    countdown () {
      // 计算运行时间
      const end = this.endTime
      const now = Date.parse(new Date())
      const msec = end - now
      // 计算剩余时间
      this.second = (msec / 1000) % 60
      this.minute = parseInt((msec / 1000 / 60) % 60)
      this.hour = parseInt(msec / 1000 / 60 / 60)

      // console.log(this.hour, this.minute, this.second)
      const that = this
      // 结束则弹框
      if (msec === 0) {
        this.$alert(this.messageTitle, this.messageText, {
          confirmButtonText: '确认'
        })
        // 向父组件传值
        this.$emit('count-end')
        // 通知父组件
      } else {
        // 进入下一秒倒计时
        this.interval = setTimeout(that.countdown, 1000)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.timeCount-container {
  color: red;
  text-align: center;
}
</style>
