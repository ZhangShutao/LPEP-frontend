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
          <el-link type="primary" :href="scope.row.textbook">xxx教材(点击下载)</el-link>
        </template>
      </el-table-column>
      <!--上传时间栏-->
      <el-table-column label="上传时间" prop="uploadTime">
      </el-table-column>
      <!--实验栏-->
      <el-table-column label="所属实验" prop="experiment">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ContainerHeader from '../common/ContainerHeader'

export default {
  name: 'TextbookDownload',
  components: {
    ContainerHeader
  },
  data () {
    return {
      tableData: [
        {
          textbook: '教材下载链接',
          uploadTime: '2023-01-01 14:00',
          experiment: 'ASP实验'
        },
        {
          textbook: '教材下载链接',
          uploadTime: '2023-01-01 14:00',
          experiment: 'LPMLN测试'
        }
      ]
    }
  }
}
</script>

<style scoped>
.table-box {
  width: 80%;
}
</style>
