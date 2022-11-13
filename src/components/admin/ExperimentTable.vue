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
            disabled="scope.row.status !== '已结束'">分析
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
    <!--新建实验-基本信息-->
    <el-dialog title="基本信息" :visible.sync="addExperimentDialogVisiable[0]" width="35%">
      <el-form :model="addExperimentForm" label-width="80px" >
        <el-form-item label="实验名">
          <el-input v-model="addExperimentForm.expName"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="addExperimentForm.startDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <el-time-picker
            v-model="addExperimentForm.startTime"
            :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
            placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="工作目录">
          <el-input v-model="addExperimentForm.workDirection"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleNextDialog(0, true)">下一步</el-button>
        <el-button @click="handleNextDialog(0, false)">取 消</el-button>
      </div>
    </el-dialog>
    <!--新建实验-组别管理-->
    <el-dialog title="组别管理" :visible.sync="addExperimentDialogVisiable[1]" width="35%" >
      <el-form :model="addExperimentForm" label-width="80px" >
        <div v-for="(item, index) in addExperimentForm.groups" :key="index">
          <div style="font-weight: bold">组别{{index+1}}<br/></div>
          <el-form-item label="组别名">
            <el-input v-model="item.groupName"></el-input>
          </el-form-item>
          <el-form-item label="求解器">
            <el-select v-model="item.solver">
              <el-option v-for="(item, index) in allSolverTypes" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div class="function-box">
        <el-button type="primary" @click="addGroup" size="small" plain>添加组别</el-button>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handlePreviousDialog(1)">上一步</el-button>
        <el-button type="primary" @click="handleNextDialog(1, true)">下一步</el-button>
        <el-button @click="handleNextDialog(1, false)">取 消</el-button>
      </div>
    </el-dialog>
    <!--新建实验-实验阶段管理-->
    <el-dialog title="实验阶段管理" :visible.sync="addExperimentDialogVisiable[2]" width="40%">
      <el-form :model="addExperimentForm" label-width="80px" >
        <div v-for="(item, index) in addExperimentForm.phases" :key="index">
          <div style="font-weight: bold">阶段{{index+1}}<br/></div>
          <el-form-item label="阶段名">
            <el-input v-model="item.phaseName"></el-input>
          </el-form-item>
          <el-form-item label="阶段类型">
            <el-select v-model="item.phaseType">
              <el-option v-for="(item, index) in allPhaseTypes" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <!--添加选项按钮-->
      <div class="function-box">
        <el-button type="primary" @click="addPhase" size="small" plain>添加阶段</el-button>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handlePreviousDialog(2)">上一步</el-button>
        <el-button type="primary" @click="handleNextDialog(2, true)">下一步</el-button>
        <el-button @click="handleNextDialog(2, false)">取 消</el-button>
      </div>
    </el-dialog>
    <!--新建实验-问题管理-->
    <el-dialog title="问题管理" :visible.sync="addExperimentDialogVisiable[3]" width="50%">
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-if="scope.row.status !== '已添加'" >添加</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.status === '已添加'" >修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="primary" @click="handleNextDialog(3, true)">下一步</el-button>
        <el-button @click="handleNextDialog(3, false)">取 消</el-button>
      </div>
    </el-dialog>
    <!--新建实验-问题录入(选择题+问答题)-->
    <el-dialog title="问题录入" :visible.sync="addExperimentDialogVisiable[4]" width="80%">
      <!--每个问题对应一个表单-->
      <el-form :model="addExperimentForm" label-width="80px"
              v-for="(currentAddedQuestion, index) in addExperimentForm.addedQuestions" :key="index">
        <div>
          问题{{index+1}}
        </div>
        <el-form-item label="问题类型">
          <el-radio v-model="currentAddedQuestion.type" label="选择题">选择题</el-radio>
          <el-radio v-model="currentAddedQuestion.type" label="问答题">问答题</el-radio>
        </el-form-item>
        <!--问题描述,采用markdown编辑器-->
        <el-form-item label="问题描述">
          <mavon-editor v-model="content" style="min-height: 300px"/>
        </el-form-item>
        <!--选择题选项-->
        <div v-if="currentAddedQuestion.type === '选择题'">
          <el-form-item :label="'选项' + String.fromCharCode('A'.charCodeAt()+ index)"
                        v-for="(item, index) in currentAddedQuestion.options" :key="index">
            <el-input v-model="currentAddedQuestion.options[index]" style="width: 400px"></el-input>
          </el-form-item>
          <!--添加选项按钮-->
          <el-button type="primary" @click="addOption(currentAddedQuestion)" size="small" plain>添加选项</el-button>
        </div>
        <el-divider></el-divider>
      </el-form>
      <div class="function-box">
        <el-button type="primary" @click="addQuestion" size="small">添加问题</el-button>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handleNextDialog(4, true)">下一步</el-button>
        <el-button @click="handleNextDialog(4, false)">取 消</el-button>
      </div>
    </el-dialog>
    <!--新建实验-问题录入（编程题）-->
    <el-dialog title="问题录入" :visible.sync="addExperimentDialogVisiable[5]" width="80%">
      <!--每个问题对应一个表单-->
      <el-form label-width="80px"
               v-for="(currentAddedQuestion, index) in addedQuestions" :key="index">
        <div>
          问题{{index+1}}
        </div>
        <!--问题描述,采用markdown编辑器-->
        <el-form-item label="问题描述">
          <mavon-editor v-model="content" style="min-height: 300px"/>
        </el-form-item>
        <!--用时上限-->
        <el-form-item label="用时上限">
          <el-input style="width: 200px"></el-input>分钟
        </el-form-item>
        测试数据
        <div v-for="(item, index) in currentAddedQuestion.testSamples" :key="index" class="input-output-upload">
          数据{{index+1}}
          <el-form-item label="输入">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
              :limit="3"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-exceed="handleExceed"
              :file-list="currentAddedQuestion.testSamples.inputs">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="输出">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
              :limit="3"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-exceed="handleExceed"
              :file-list="currentAddedQuestion.testSamples.outputs">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="运行时间上限" label-width="120px">
            <el-input style="width: 200px" placeholder="默认为5"></el-input>秒
          </el-form-item>
        </div>
        <!--添加选项按钮-->
        <div class="function-box">
          <el-button type="primary" @click="addTestSample(currentAddedQuestion)" size="small" plain>添加数据</el-button>
        </div>
        <el-divider></el-divider>
      </el-form>
      <div class="function-box">
        <el-button type="primary" @click="addQuestion" size="small">添加问题</el-button>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handleNextDialog(5, true)">下一步</el-button>
        <el-button @click="handleNextDialog(5, false)">取 消</el-button>
      </div>
    </el-dialog>
    <!--新建实验-参试人员管理-->
    <el-dialog title="参试人员管理" :visible.sync="addExperimentDialogVisiable[6]" width="50%">
      <div class="function-box">
        <el-button type="info" @click="addExperiment">添加用户到实验</el-button>
        <el-button type="info" @click="addExperiment">新增用户</el-button>
      </div>
      <el-table
        class="table-box"
        :data="participateTableData"
        stripe
        border>
        <el-table-column label="序号" prop="id"></el-table-column>
        <el-table-column label="学号/工号" prop="studentId"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="组别" prop="group"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" v-if="scope.row.status !== '已添加'" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="primary" @click="addExperimentDialog5Visiable = true">创建实验</el-button>
        <el-button @click="addExperimentDialog1Visiable = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--新建实验-添加用户到实验-->
    <el-dialog title="实验阶段管理" :visible.sync="addExperimentDialogVisiable[7]" width="30%">
      <el-form :model="addUserToExperimentForm" label-width="80px" >
        <el-form-item label="学号/工号">
          <el-input v-model="addUserToExperimentForm.studentId" @blur="queryAddedUserName"></el-input>
        </el-form-item>
        <!--需要根据输入的学号查询姓名-->
        <el-form-item label="姓名">
          <el-input v-model="addUserToExperimentForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="组别">
          <el-select v-model="addUserToExperimentForm.group">
            <el-option v-for="(item, index) in addExperimentForm.groups" :key="index" :label="item.groupName" :value="item.groupName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="addExperimentDialog1Visiable = false">添 加</el-button>
        <el-button @click="addExperimentDialog1Visiable = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--新建实验-新增用户-->
    <el-dialog title="添用户" :visible.sync="addExperimentDialogVisiable[8]" width="30%">
      <el-form :model="userAddForm" label-width="80px" >
        <el-form-item label="学号/工号">
          <el-input v-model="userAddForm.studentId"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userAddForm.name"></el-input>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-radio v-model="userAddForm.type" label="admin">管理员</el-radio>
          <el-radio v-model="userAddForm.type" label="user">普通用户</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userAddFormVisible = false">添 加</el-button>
        <el-button @click="userAddFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ContainerHeader from '../common/ContainerHeader'
export default {
  name: 'ExperimentTable',
  components: {
    ContainerHeader
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
      // 新增实验表单
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
      currentGroup: '',
      currentPhase: '',
      addedQuestions: [
        {
          type: '',
          content: '',
          options: [
          ],
          testSamples: [
            {
              inputs: [],
              outputs: [],
              runningTimeLimit: 0
            }
          ]
        }
      ],
      // 新增实验数据表
      addExperimentTableData: [],
      // 参试人员数据表
      participateTableData: [
        {
          id: 1,
          studentId: '11xxxx',
          name: '张三',
          group: 'ASP'
        }
      ],
      addUserToExperimentForm: {
        studentId: '',
        name: '',
        group: ''
      },
      userAddForm: {
        studentId: '',
        name: '',
        group: '',
        type: ''
      },
      fileList: [],
      addExperimentDialogVisiable2: [false],
      // 对话框控制列表
      addExperimentDialogVisiable: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ]
    }
  },
  created () {
    this.getAllSolverTypes()
    this.getallPhaseTypes()
  },
  methods: {
    // 控制对话框弹出顺序
    handleNextDialog (index, isToNext) {
      this.$set(this.addExperimentDialogVisiable, index, false)
      if (isToNext && index + 1 !== this.addExperimentDialogVisiable.length) this.$set(this.addExperimentDialogVisiable, index + 1, true)
    },
    handlePreviousDialog (index) {
      this.$set(this.addExperimentDialogVisiable, index, false)
      if (index - 1 >= 0) this.$set(this.addExperimentDialogVisiable, index - 1, true)
    },
    // 开启新增实验处理流程
    addExperiment () {
      this.$set(this.addExperimentDialogVisiable, 0, true)
    },
    // 获取所有求解器
    getAllSolverTypes () {
      // TODO(后端请求)
      this.allSolverTypes = ['ASP求解器', 'LPLMN求解器']
    },
    getallPhaseTypes () {
      // TODO(后端请求)
      this.allPhaseTypes = ['问卷', '编程']
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
        this.addExperimentForm.groups.forEach((group, index2) => {
          if (phase.phaseName !== '' && group.groupName !== '') {
            this.addExperimentTableData.push({
              id: count,
              phase: phase.phaseName,
              phaseIndex: index,
              phaseType: phase.phaseType,
              group: group.groupName,
              status: '未添加'
            })
            count++
          }
        })
      })
    },
    // 增加问卷类型问题
    addQuestion () {
      this.addedQuestions.push(
        {
          type: '',
          content: '',
          options: [
          ],
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
    // 增加选择题选项
    addOption (question) {
      question.options.push('')
    },
    // 增加编程题测试数据
    addTestSample (question) {
      question.testSamples.push({
        inputs: [],
        outputs: [],
        runningTimeLimit: 0
      })
    },
    // 移除上传文件
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    // 预览上传文件
    handlePreview (file) {
      console.log(file)
    },
    // 上传文件超过限定数量
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    filterStatus (value, row) {
      return row.status === value
    },
    // 根据新增学号查询用户姓名并回填表单
    queryAddedUserName () {
      this.participateAddForm.name = ''
      const id = this.participateAddForm.studentId
      console.log(id)
      const name = '张三'
      this.participateAddForm.name = name
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
    }
  }
}
</script>

<style scoped>
.table-box {
  margin-top: 10px;
}
.function-box {
  text-align: right;
}
.input-output-upload {
  padding: 10px;
  display: flex;
  line-height: 40px;
  /*justify-content: space-between;*/
}
</style>
