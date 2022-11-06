<template>
  <!--用户基本信息组件-->
  <div class="container">
    <container-header title="用户信息"></container-header>
    <el-descriptions class="description-box" :column="1" :size="size" border>
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
  name: 'UserInfo',
  components: {
    ContainerHeader
  },
  data () {
    return {
      items: [
        {
          key: '账号',
          val: '220xxxxx',
          icon: ''
        },
        {
          key: '姓名',
          val: 'xxxx',
          icon: ''
        },
        {
          key: '创建时间',
          val: 'xxxx',
          icon: ''
        }
      ]
    }
  }
}
</script>

<style scoped>
.description-box {
  width: 500px;
}
</style>
