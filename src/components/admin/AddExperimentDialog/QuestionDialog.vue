<template>
  <!--新建实验4-问题管理-->
  <el-dialog title="问题管理" :visible.sync="visible" width="60%">
    <el-button @click="generateAddExperimentTableData">生成数据</el-button>
    <el-table
      :data="addExperimentTableData"
      stripe
      border>
      <el-table-column label="序号" prop="id"></el-table-column>
      <el-table-column label="阶段" prop="phase"></el-table-column>
      <el-table-column label="阶段序号" prop="phaseIndex"></el-table-column>
      <el-table-column label="类型" prop="phaseType"></el-table-column>
      <el-table-column label="组别" prop="group"></el-table-column>
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
      <el-button type="primary" @click="handleNextDialog(-1)">上一步</el-button>
      <el-button type="primary" @click="handleNextDialog(1)">下一步</el-button>
      <el-button @click="handleNextDialog(0)">取 消</el-button>
    </div>
    <!--问卷类型题目-->
    <questionnaire-dialog :visible.sync="questionnaireVisible"
                          :questionList="currentUpdatedQuestions"
                          @delete-question="handleDeleteQuestion"
                          @add-option="handleAddOption"
                          @add-question="handleAddQuestion"
                          @finish-add-questions="handlerFinishAddQuestions"
                          @close-dialog="handleCloseQuestionnaireDialog">
    </questionnaire-dialog>
    <programming-dialog
                        :visible.sync="programmingVisible"
                        :questionList="currentUpdatedQuestions"
                        @delete-question="handleDeleteQuestion"
                        @add-sample="handleAddSample"
                        @add-question="handleAddQuestion"
                        @finish-add-questions="handlerFinishAddQuestions"
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
  methods: {
    // TODO 成新建实验表中的数据(仅限开发使用)
    generateAddExperimentTableData () {
      this.addExperimentForm.phases = [
        {
          phaseName: '阶段1',
          phaseType: '问卷'
        },
        {
          phaseName: '阶段2',
          phaseType: '编程'
        }
      ]
      this.addExperimentForm.groups = [
        {
          groupName: '组别1',
          solver: 'ASP求解器'
        },
        {
          groupName: '组别2',
          solver: '编程'
        }
      ]
      let count = 1
      this.addExperimentForm.phases.forEach((phase, index) => {
        this.addExperimentForm.groups.forEach((group) => {
          if (phase.phaseName !== '' && group.groupName !== '') {
            this.addExperimentTableData.push({
              id: count,
              phase: phase.phaseName,
              phaseIndex: index,
              phaseType: phase.phaseType,
              group: group.groupName,
              status: '未添加',
              // 数据由currentAddedQuestions添加
              questions: []
            })
            count++
          }
        })
      })
    },
    handleNextDialog (type) {
      this.$emit('next-dialog', type)
    },
    handleUpdateQuestion (index) {
      this.currentQuestionId = index
      this.currentUpdatedQuestions = this.addExperimentTableData[index].questions
      if (this.addExperimentTableData[index].phaseType === '问卷') {
        this.questionnaireVisible = true
      } else if (this.addExperimentTableData[index].phaseType === '编程') {
        this.programmingVisible = true
      }
    },
    handleDeleteQuestion (index) {
      this.currentUpdatedQuestions.splice(index, 1)
    },
    // 添加下一个问题
    handleAddQuestion () {
      this.currentUpdatedQuestions.push(
        {
          type: '',
          content: '',
          options: [],
          timeLimit: '',
          testSamples: [
            {
              inputs: [],
              outputs: [],
              runningTimeLimit: 0
            }
          ]
        }
      )
    },
    handleAddOption (index) {
      this.currentUpdatedQuestions[index].options.push('')
    },
    handleAddSample (index) {
      this.currentUpdatedQuestions[index].testSamples.push({
        inputs: [],
        outputs: [],
        runningTimeLimit: 0
      })
    },
    handlerFinishAddQuestions () {
      this.addExperimentTableData[this.currentQuestionId].questions = this.currentUpdatedQuestions
      if (this.currentUpdatedQuestions.length > 0) {
        this.addExperimentTableData[this.currentQuestionId].status = '已添加'
      }
    },
    handleCloseQuestionnaireDialog () {
      this.questionnaireVisible = false
    },
    handleCloseProgrammingDialog () {
      this.programmingVisible = false
    }

  }
}
</script>

<style scoped>

</style>
