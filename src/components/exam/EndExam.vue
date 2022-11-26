<template>
  <div>
    测验结束，感谢您的参与
    <mavon-editor v-model="content" font-size=""
                  :subfield="false"
                  defaultOpen="preview"
                  :toolbarsFlag="false"
                  :editable="false"
                  :scrollStyle="true">

    </mavon-editor>
    <div>
      <el-statistic :value="deadline2"  time-indices title="商品降价" @finish="hilarity">
        <template slot="suffix">
          抢购即将开始
        </template>
      </el-statistic>
    </div>>
  </div>
</template>

<script>
export default {
  name: 'EndExam',
  data () {
    return {
      deadline2: Date.now() + 1000 * 5,
      content: '12'
    }
  },
  methods: {
    hilarity () {
      this.$notify({
        title: '提示',
        message: '时间已到，你可知寸金难买寸光阴？',
        duration: 0
      })
    }
  }
}
</script>

<style scoped>

</style>
