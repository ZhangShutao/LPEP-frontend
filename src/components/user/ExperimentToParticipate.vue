<template>
  <div class="container">
    <container-header title="待参与实验"></container-header>
    <!--实验列表-->
    <el-table
      class="table-box"
      :data="tableData"
      stripe
      border
      size="small">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="实验名" prop="title" width="200"></el-table-column>
      <el-table-column label="开始时间" prop="startTime" width="200"></el-table-column>
      <el-table-column label="状态" prop="state" width="200" :formatter="changeStatus"></el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="participateExperiment(scope.$index, scope.row)">参加实验
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页按钮-->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="queryInfo.pageIndex"
        :page-size="queryInfo.pageSize"
        :total="pageTotal"
        @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import ContainerHeader from '../common/ContainerHeader'

export default {
  name: 'ExperimentToBeParticipatedIn',
  components: {
    ContainerHeader
  },
  data () {
    return {
      // 查询参数
      queryInfo: {
        userId: 0
        // pageIndex: 1,
        // pageSize: 10
      },
      pageTotal: 100,
      tableData: [
      ]
    }
  },
  created () {
    this.getUserInfo()
    this.getExperimentList()
  },
  methods: {
    getUserInfo () {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.queryInfo.userId = userInfo.id
    },
    async getExperimentList () {
      const { data: res } = await this.$http.get('user/experstopart', {
        params: this.queryInfo
      })
      this.tableData = res.data
    },
    handlePageChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getExperimentList()
    },
    // 状态转换
    changeStatus (row, column) {
      const value = row[column.property]
      if (value === 0) return '异常'
      else if (value === 1) return '正常'
      else return '实验中断'
    },
    // 用户参加实验
    participateExperiment (index, experiment) {
      // 跳转做题页面
      this.$router.push('/exam/questionnaire')
    }
  }
}
</script>

<style scoped>

.table-box {
  width: 80%
}
</style>
