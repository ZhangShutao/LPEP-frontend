<template>
  <!--管理员基本信息组件-->
  <div class="container">
    <container-header title="管理员信息"></container-header>
    <el-descriptions class="description-box" :column="1" border>
      <el-descriptions-item v-for="(item, index) in items" :key = index>
        <template slot="label">
          <i :class="item.icon"></i>
          {{ item.key }}
        </template>
        {{ item.val }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import ContainerHeader from '../common/ContainerHeader'
export default {
  name: 'AdminInfo',
  components: {
    ContainerHeader
  },
  data () {
    return {
      account: '',
      username: '',
      createdTime: ''
    }
  },
  computed: {
    items () {
      return [
        {
          key: '账号',
          val: this.account,
          icon: ''
        },
        {
          key: '姓名',
          val: this.username,
          icon: ''
        },
        {
          key: '创建时间',
          val: this.createdTime,
          icon: ''
        }
      ]
    }
  },
  created () {
    this.getAdminInfo()
  },
  methods: {
    async getAdminInfo () {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      const { data: res } = await this.$http.get('user/getpersonalinfo', {
        params: { id: userInfo.id }
      })
      if (res === null) {
        return this.$message.error('用户信息查询出错！')
      }
      this.account = res.data.username
      this.username = res.data.realname
      this.createdTime = res.data.createTime
    }
  }
}
</script>

<style scoped>
.description-box {
  width: 500px;
}
</style>
