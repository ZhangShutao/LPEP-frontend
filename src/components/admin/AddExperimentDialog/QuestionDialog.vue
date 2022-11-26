<template>
  <!--新建实验4-问题管理-->
  <el-dialog title="问题管理" :visible.sync="visible" width="60%"
             :show-close="false"
             :before-close="beforeClose">
    <el-table
      :data="addExperimentTableData"
      stripe
      border>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="阶段" prop="phase"></el-table-column>
      <el-table-column label="阶段序号" prop="phaseIndex"></el-table-column>
      <el-table-column label="类型" prop="phaseType"></el-table-column>
      <el-table-column label="组别" prop="groupName"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="scope.row.status !== '已添加'"
                     @click="handleUpdateQuestion(scope.$index)">添加</el-button>
          <el-button size="mini" type="success" v-if="scope.row.status === '已添加'"
                     @click="handleUpdateQuestion(scope.$index)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="primary" @click="handleNextDialog(1)">下一步</el-button>
      <el-button @click="handleNextDialog(0)">取 消</el-button>
    </div>
    <!--问卷类型题目-->
    <questionnaire-dialog :visible.sync="questionnaireVisible"
                          :questionList="currentUpdatedQuestions"
                          @finish-add-questions="handlerFinishAddQuestionnaireQuestions"
                          @close-dialog="handleCloseQuestionnaireDialog">
    </questionnaire-dialog>
    <!--编程类型题目-->
    <programming-dialog :visible.sync="programmingVisible"
                        :questionList="currentUpdatedQuestions"
                        :experimentId="currentExperId"
                        :groupId="currentGroupId"
                        @finish-add-questions="handlerFinishAddProgrammingQuestions"
                        @close-dialog="handleCloseProgrammingDialog">
    </programming-dialog>
  </el-dialog>
</template>

<script>
import QuestionnaireDialog from './QuestionnaireDialog'
import ProgrammingDialog from './ProgrammingDialog'
export default {
  name: 'QuestionDialog',
  components: {
    QuestionnaireDialog,
    ProgrammingDialog
  },
  data () {
    return {
      questionnaireVisible: false,
      programmingVisible: false,
      currentGroupId: '',
      currentExperId: '',
      currentQuestionId: -1,
      currentUpdatedQuestions: [],
      // 新增实验数据表
      addExperimentTableData: []
    }
  },
  props: {
    addExperimentForm: {},
    visible: {
      type: Boolean
    }
  },
  watch: {
    visible: {
      handler () {
        this.generateAddExperimentTableData()
      }
    }
  },
  methods: {
    beforeClose () {
      this.$emit('update:visible', false)
    },
    generateAddExperimentTableData () {
      this.addExperimentTableData = []
      this.addExperimentForm.phaseInfoList.forEach((phase, index) => {
        this.addExperimentForm.groupInfoList.forEach((group) => {
          if (phase.phaseName !== '' && group.groupName !== '') {
            this.addExperimentTableData.push({
              phase: phase.phaseName,
              phaseIndex: phase.number,
              phaseType: phase.phaseType === 0 ? '问卷' : '编程',
              groupName: group.groupName,
              groupId: group.groupId,
              status: '未添加',
              // 数据由currentAddedQuestions添加
              questions: []
            })
          }
        })
      })
    },
    handleNextDialog (type) {
      this.$emit('next-dialog', type)
    },
    handleUpdateQuestion (index) {
      this.currentQuestionId = index
      this.currentExperId = this.addExperimentForm.experId
      this.currentGroupId = this.addExperimentTableData[index].groupId
      this.currentUpdatedQuestions = this.addExperimentTableData[index].questions
      if (this.addExperimentTableData[index].phaseType === '问卷') {
        this.questionnaireVisible = true
      } else if (this.addExperimentTableData[index].phaseType === '编程') {
        this.programmingVisible = true
      }
    },
    async handlerFinishAddQuestionnaireQuestions () {
      const { data: res } = await this.$http.post('admin/addnonprogquestion', {
        experId: this.addExperimentForm.experId,
        groupId: this.addExperimentTableData[this.currentQuestionId].groupId,
        phaseNumber: this.addExperimentTableData[this.currentQuestionId].phaseIndex,
        addNonProgQuestionInfoList: this.currentUpdatedQuestions
      })
      if (res.status !== 201) {
        return this.$message.error('问题添加失败，' + res.msg)
      }
      this.$message.success('问题添加成功')
      this.addExperimentTableData[this.currentQuestionId].questions = this.currentUpdatedQuestions
      if (this.currentUpdatedQuestions.length > 0) {
        this.addExperimentTableData[this.currentQuestionId].status = '已添加'
      }
      this.handleCloseQuestionnaireDialog()
    },
    handleCloseQuestionnaireDialog () {
      this.questionnaireVisible = false
    },
    async handlerFinishAddProgrammingQuestions () {
      const { data: res } = await this.$http.post('admin/addprogquestion', {
        experId: this.addExperimentForm.experId,
        groupId: this.addExperimentTableData[this.currentQuestionId].groupId,
        phaseNumber: this.addExperimentTableData[this.currentQuestionId].phaseIndex,
        addProgQuestionInfoList: this.currentUpdatedQuestions
      })
      if (res.status !== 201) {
        return this.$message.error('问题添加失败')
      }
      this.$message.success('问题添加成功')
      this.addExperimentTableData[this.currentQuestionId].questions = this.currentUpdatedQuestions
      if (this.currentUpdatedQuestions.length > 0) {
        this.addExperimentTableData[this.currentQuestionId].status = '已添加'
      }
      this.handleCloseProgrammingDialog()
    },
    handleCloseProgrammingDialog () {
      this.programmingVisible = false
    }
  }
}
</script>

<style scoped>

</style>
