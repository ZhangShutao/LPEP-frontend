<template>
  <div class="container">
    <container-header title="实验列表"></container-header>
    <el-button type="info"  style="float: right" @click="addExperiment">新增实验</el-button>
    <div style="clear:both"></div>
    <!--实验列表-->
    <el-table
      class="table-box"
      :data="experimentTableData"
      stripe
      border>
      <!--表头属性(不含状态栏,操作栏)-->
      <el-table-column v-for="(item, index) in experimentTableItems" :key="index"
                       :prop="item.prop"
                       :label="item.label"
                       :width="item.width"
      >
      </el-table-column>
      <!--表头属性(状态栏)-->
      <el-table-column label="状态" prop="status"
                       :filters="[{ text: '未开始', value: '未开始' }, { text: '进行中', value: '进行中' }, { text: '已结束', value: '已结束' }]"
                       :filter-method="filterStatus">
      </el-table-column>
      <!--表头属性(操作栏)-->
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleStart(scope.$index, scope.row)"
            :disabled="scope.row.status !== '未开始'">开始
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleCancel(scope.$index, scope.row)"
            :disabled="scope.row.status !== '进行中'">取消
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleAnalysis(scope.$index, scope.row)"
            :disabled="scope.row.status !== '已结束'">分析
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页按钮-->
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
    <experiment-info-dialog :form="addExperimentForm" :visible="addExperimentDialogVisiable[0]"
                            @next-dialog="handleNextDialog"></experiment-info-dialog>
    <!--新建实验2-组别管理-->
    <group-dialog  :form="addExperimentForm" :visible="addExperimentDialogVisiable[1]"
                   :solvers="allSolverTypes"
                   @add-group="addGroup" @next-dialog="handleNextDialog"></group-dialog>
    <!--新建实验3-实验阶段管理-->
    <phase-dialog :form="addExperimentForm" :visible="addExperimentDialogVisiable[2]"
                  :phases="allPhaseTypes"
                  @add-phase="addPhase" @next-dialog="handleNextDialog"></phase-dialog>
    <!--新建实验4-问题管理-->
    <question-dialog :addExperimentForm="addExperimentForm" :visible="addExperimentDialogVisiable[3]"
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
      experimentTableItems: [
        {
          prop: 'id',
          label: '序号',
          width: 70
        },
        {
          prop: 'expName',
          label: '实验名',
          width: 200
        },
        {
          prop: 'startTime',
          label: '开始时间',
          width: 200
        }
      ],
      experimentTableData: [
        {
          id: '1',
          expName: 'ASP测试',
          startTime: '2023-01-01 14:00',
          status: '进行中',
          operation: '开始实验'
        },
        {
          id: '2',
          expName: 'LPMLN测试',
          startTime: '2023-01-01 14:00',
          status: '进行中',
          operation: '开始实验'
        },
        {
          id: '3',
          expName: 'LPMLN测试',
          startTime: '2023-01-01 14:00',
          status: '未开始',
          operation: '开始实验'
        },
        {
          id: '2',
          expName: 'LPMLN测试',
          startTime: '2023-01-01 14:00',
          status: '已结束',
          operation: '开始实验'
        }
      ],
      pageTotal: 100,
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      allSolverTypes: [],
      allPhaseTypes: [],
      // 初始新增实验表单
      addExperimentForm: {
        expName: '',
        startDate: '',
        startTime: '',
        workDirection: '',
        groups: [
          {
            groupName: '',
            solver: ''
          }
        ],
        phases: [
          {
            phaseName: '',
            phaseType: ''
          }
        ]
      },
      // // 新增实验数据表
      // addExperimentTableData: [],
      // 参试人员数据表
      participateTableData: [
        {
          id: 1,
          studentId: '11xxxx',
          name: '张三',
          group: 'ASP'
        }
      ],
      // addUserToExperimentForm: {
      //   studentId: '',
      //   name: '',
      //   group: ''
      // },
      // userAddForm: {
      //   studentId: '',
      //   name: '',
      //   group: '',
      //   type: ''
      // },
      fileList: [],
      // 当前显示对话框
      visiableDialogIndex: 0,
      addExperimentDialogVisiable: [
        false,
        false,
        false,
        false,
        false
      ]
    }
  },
  created () {
    // this.getAllSolverTypes()
    // this.getAllPhaseTypes()
  },
  methods: {
    handlePageChange () {
      // TODO
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
    addGroup () {
      this.addExperimentForm.groups.push(
        {
          groupName: '',
          solver: ''
        }
      )
    },
    addPhase () {
      this.addExperimentForm.phases.push(
        {
          phaseName: '',
          phaseType: ''
        }
      )
    },
    // handleUpdateQuestion (index, updatedQuestions) {
    //   this.$set(this.addExperimentTableData[index], 'questions', updatedQuestions)
    // },
    handleFinishAddQuestions () {
      this.validateForm(this.currentQuestionId, this.currentAddedQuestions.length, () => {
        const id = this.currentQuestionId
        if (id !== -1) {
          this.$set(this.addExperimentTableData[id], 'questions', this.currentAddedQuestions)
          if (this.currentAddedQuestions.length > 0) {
            this.addExperimentTableData[id].status = '已添加'
          }
        }
        // this.clearValidateForm(this.currentQuestionId, this.currentAddedQuestions.length)
      })
    },
    filterStatus (value, row) {
      return row.status === value
    },
    // 触发开始实验按钮
    handleStart (index, row) {
      // 二次确认
      this.$confirm('确定要开始吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('实验已开启')
        // TODO 开始流程
      })
        .catch(() => {})
    },
    // 触发取消实验按钮
    handleCancel (index, row) {
      // 二次确认
      this.$confirm('确定要取消吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('实验已取消')
        // TODO 取消流程
      })
        .catch(() => {})
    },
    // 触发分析实验按钮
    handleAnalysis (index, row) {
      // 二次确认
      this.$confirm('确定要分析吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('分析成功')
        // TODO 分析流程
      })
        .catch(() => {})
    },
    // 触发添加到实验按钮
    handleAddUserToExperiment (index, row) {
      this.addUserToExperimentFormVisible = true
      // TODO
    },
    // 创建实验
    handleCreateExperiment () {
      // TODO(后端请求)
    }
  }
}
</script>

<style scoped>
.table-box {
  margin-top: 10px;
}

</style>
