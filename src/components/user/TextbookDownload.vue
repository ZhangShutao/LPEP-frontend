<template>
  <div class="container">
    <container-header title="自学培训教材下载"></container-header>
    <!--教材列表-->
    <el-table
      class="table-box"
      :data="tableData"
      size="small">
      <!--教材链接栏-->
      <el-table-column label="教材" prop="textbook">
        <template slot-scope="scope">
          <el-link type="primary" :href="textbookUrlPrefix + scope.row.id" target="_blank">{{scope.row.title}}（点击下载）</el-link>
        </template>
      </el-table-column>
      <!--上传时间栏-->
      <el-table-column label="上传时间" prop="lastUpdateTime">
      </el-table-column>
      <!--实验栏-->
      <el-table-column label="所属实验" prop="experName">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ContainerHeader from '../common/ContainerHeader'
import { baseUrl } from '../../vue.config'

export default {
  name: 'TextbookDownload',
  components: {
    ContainerHeader
  },
  data () {
    return {
      // 查询参数
      queryInfo: {
        userId: 0
      },
      tableData: [
      ],
      textbookUrlPrefix: baseUrl + 'train/files/'
    }
  },
  created () {
    this.getUserInfo()
    this.getTextbookList()
  },
  methods: {
    getUserInfo () {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.queryInfo.userId = userInfo.id
    },
    async getTextbookList () {
      console.log(this.queryInfo)
      const { data: res } = await this.$http.get('user/querypersonaltrainingmaterial', {
        params: this.queryInfo
      })
      this.tableData = res.data
      console.log(this.tableData)
    }
  }
}
</script>

<style scoped>
.table-box {
  width: 80%;
}
</style>
