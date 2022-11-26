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
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            :disabled="scope.row.state === 0"
            @click="participateExperiment(scope.row)">参加实验
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
      userInfo: {},
      queryInfo: {
        userId: 0,
        pageIndex: 1,
        pageSize: 10
      },
      pageTotal: 0,
      tableData: []
    }
  },
  created () {
    this.getUserInfo()
    this.getExperimentList()
  },
  methods: {
    getUserInfo () {
      this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.queryInfo.userId = this.userInfo.id
    },

    async getExperimentList () {
      const { data: res } = await this.$http.get('user/experstopart', {
        params: { userId: this.queryInfo.userId }
      })
      if (res.status !== 200) {
        return this.$message.error('获取实验信息错误')
      }
      this.tableData = res.data
      this.pageTotal = res.data.recordCount
    },

    handlePageChange (newPage) {
      this.queryInfo.pageIndex = newPage
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
    async participateExperiment (experiment) {
      this.$confirm('确定要参与实验吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        // 更新阶段信息
        this.userInfo.phaseNumber = experiment.state === 2 ? experiment.currentPhaseNumber : 1
        this.userInfo.questionNumber = experiment.state === 2 ? experiment.currentQuestionNumber : 1
        // 获取实验类型
        const { data: res } = await this.$http.post('exper/getnextphasestatus', {
          userId: this.queryInfo.userId,
          experId: experiment.experId,
          phaseNumber: this.userInfo.phaseNumber
        })
        const isProg = res.data.isProg
        this.userInfo.experId = experiment.experId
        this.userInfo.experName = experiment.title
        sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        // 跳转做题页面
        if (isProg === 0) {
          this.$router.push('/exam/questionnaire')
        } else {
          this.$router.push('/exam/programming')
        }
      })
    }
  }
}
</script>

<style scoped>

.table-box {
  width: 80%
}
</style>
