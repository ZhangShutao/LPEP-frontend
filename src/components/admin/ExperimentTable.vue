<template>
  <div class="container">
    <container-header title="实验列表"></container-header>
    <el-button type="warning"  style="float: right" @click="addExperiment">新增实验</el-button>
    <div style="clear:both"></div>
    <!--实验列表-->
    <el-table
      class="table-box"
      :data="experimentTableData"
      stripe
      border>
      <el-table-column type="index" width="70"></el-table-column>
      <el-table-column label="实验名" prop="title" width="200"></el-table-column>
      <el-table-column label="开始时间" prop="startTime" width="200"></el-table-column>
      <el-table-column label="状态" prop="state"
                       :formatter="changeStatus"
                       :filters="[{ text: '未开始', value:  0}, { text: '已结束', value: 1 }, { text: '进行中', value: 2 }]"
                       :filter-method="filterStatus">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleStart(scope.row.experId)"
            :disabled="scope.row.state !== 0">开始
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleCancel(scope.row.experId)"
            :disabled="scope.row.state !== 2">结束
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleAnalysis(scope.row.experId)"
            :disabled="scope.row.state !== 1">分析
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="query.pageIndex"
        :page-size="query.pageSize"
        :total="pageTotal"
        @current-change="handlePageChange">
      </el-pagination>
    </div>
    <!--新建实验1-基本信息-->
    <experiment-info-dialog :form="addExperimentForm"
                            :reset-form="resetForm"
                            :visible="addExperimentDialogVisiable[0]"
                            @next-dialog="handleNextDialog"></experiment-info-dialog>
    <!--新建实验2-组别管理-->
    <group-dialog  :form="addExperimentForm"
                   :reset-form="resetForm"
                   :visible="addExperimentDialogVisiable[1]"
                   @next-dialog="handleNextDialog"></group-dialog>
    <!--新建实验3-实验阶段管理-->
    <phase-dialog :form="addExperimentForm"
                  :reset-form="resetForm"
                  :visible="addExperimentDialogVisiable[2]"
                  @create-experiment="handleCreateExperiment"
                  @next-dialog="handleNextDialog"></phase-dialog>
    <!--新建实验4-问题管理-->
    <question-dialog :addExperimentForm="addExperimentForm"
                     :visible="addExperimentDialogVisiable[3]"
                     @next-dialog="handleNextDialog"></question-dialog>
    <!--新建实验7-参试人员管理-->
    <user-dialog :form="addExperimentForm"
                 :visible="addExperimentDialogVisiable[4]"
                 @next-dialog="handleNextDialog"></user-dialog>
  </div>
</template>

<script>
import ContainerHeader from '../common/ContainerHeader'
import ExperimentInfoDialog from './AddExperimentDialog/ExperimentInfoDialog'
import GroupDialog from './AddExperimentDialog/GroupDialog'
import PhaseDialog from './AddExperimentDialog/PhaseDialog'
import QuestionDialog from './AddExperimentDialog/QuestionDialog'
import UserDialog from './AddExperimentDialog/UserDialog'
export default {
  name: 'ExperimentTable',
  components: {
    ContainerHeader,
    ExperimentInfoDialog,
    GroupDialog,
    PhaseDialog,
    QuestionDialog,
    UserDialog
  },
  data () {
    return {
      experimentTableData: [],
      pageTotal: 0,
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      // 初始新增实验表单
      addExperimentForm: {
        creatorId: '',
        experName: '',
        startTime: '',
        workspace: '',
        groupInfoList: [
          {
            groupName: '',
            groupId: ''
          }
        ],
        phaseInfoList: [
          {
            number: 1,
            phaseName: '',
            phaseType: ''
          }
        ]
      },
      // 当前显示对话框
      visiableDialogIndex: 0,
      addExperimentDialogVisiable: [
        false,
        false,
        false,
        false,
        false
      ],
      resetForm: false
    }
  },
  created () {
    this.getAdminInfo()
    this.getExperimentList()
  },
  methods: {
    getAdminInfo () {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.addExperimentForm.creatorId = userInfo.id
    },
    async getExperimentList () {
      const { data: res } = await this.$http.get('admin/listallexper', {
        params: this.query
      })
      this.pageTotal = res.data.recordCount
      this.experimentTableData = res.data.experInfoList
    },
    handlePageChange (newPage) {
      this.query.pageIndex = newPage
      this.getExperimentList()
    },
    // 状态转换
    changeStatus (row, column) {
      const value = row[column.property]
      if (value === 0) return '未开始'
      else if (value === 1) return '已结束'
      else return '进行中'
    },
    filterStatus (value, row) {
      return row.state === value
    },
    // 触发开始实验按钮
    handleStart (experId) {
      this.$confirm('确定要开始实验吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get('admin/startexper', {
          params: { experId: experId }
        })
        if (res.status === 200) {
          this.$message.success('实验已开启')
        } else {
          this.$message.error('实验开启失败,' + res.msg)
        }
      }).finally(() => {
        this.getExperimentList()
      })
    },
    // 触发取消实验按钮
    handleCancel (experId) {
      this.$confirm('确定要结束实验吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get('admin/endexper', {
          params: { experId: experId }
        })
        if (res.status === 200) {
          this.$message.success('实验已结束')
        } else {
          this.$message.error('实验结束失败' + res.msg)
        }
      }).finally(() => {
        this.getExperimentList()
      })
    },
    // 触发分析实验按钮
    handleAnalysis (experId) {
    },
    // 控制对话框弹出
    handleNextDialog (type) {
      this.$set(this.addExperimentDialogVisiable, this.visiableDialogIndex, false)
      if (type !== 0) {
        const nextIndex = this.visiableDialogIndex + type
        if (nextIndex < this.addExperimentDialogVisiable.length && nextIndex >= 0) {
          this.$set(this.addExperimentDialogVisiable, nextIndex, true)
          this.visiableDialogIndex = nextIndex
        }
      }
    },
    // 开启新增实验处理流程
    addExperiment () {
      this.visiableDialogIndex = 0
      this.$set(this.addExperimentDialogVisiable, 0, true)
    },
    // 创建实验
    async handleCreateExperiment () {
      const { data: res } = await this.$http.post('admin/createexper', this.addExperimentForm)
      if (res.status !== 201) {
        return this.$message.error('实验创建失败,' + res.msg)
      }
      this.$message.success('实验创建成功')
      // 更新表单参数
      this.addExperimentForm.experId = res.data.experId
      this.addExperimentForm.status = res.data.status
      res.data.groups.forEach((item, index) => {
        if (this.addExperimentForm.groupInfoList[index].groupName === item.groupName) {
          this.addExperimentForm.groupInfoList[index].groupId = item.groupId
        }
      })
      this.getExperimentList()
      this.handleNextDialog(1)
    }
  }
}
</script>

<style scoped>
.table-box {
  margin-top: 10px;
}

</style>
