<template>
  <div class="container">
    <container-header title="参试人员列表"></container-header>
    <div class="function-box">
      <el-button
        type="info"
        @click="userAddFormVisible = true"
      >添加参试人员</el-button>
    </div>
    <!--实验列表-->
    <el-table
      class="table-box"
      :data="participantsTableData"
      stripe
      border>
      <!--表头属性(不含状态栏,操作栏)-->
      <el-table-column v-for="(item, index) in participantsTableItems" :key="index"
                       :prop="item.prop"
                       :label="item.label"
                       :width="item.width"
      >
      </el-table-column>
      <!--表头属性(操作栏)-->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleModify(scope.$index, scope.row)">修改
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleAddUserToExperiment(scope.$index, scope.row)">添加到实验
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

    <!--用户添加对话框-->
    <el-dialog title="添加用户" :visible.sync="userAddFormVisible" width="30%">
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

    <!--添加用户到实验对话框-->
    <el-dialog title="添加用户到实验" :visible.sync="addUserToExperimentFormVisible" width="70%">
      <!--实验列表-->
      <el-table
        :data="experimentTableData"
        stripe
        border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="序号" prop="id"></el-table-column>
        <el-table-column label="实验名" prop="expName"></el-table-column>
        <el-table-column label="开始时间" prop="startTime"></el-table-column>
        <el-table-column label="添加到组" prop="group">
          <template slot-scope="scope">
            <el-select v-model="scope.row.groupToParticipate" placeholder="请选择所属组别">
              <el-option v-for="(item, index) in scope.row.groupList" :key="index"
                         :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <!--底部功能区-->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUserToExperimentFormVisible = false">添 加</el-button>
        <el-button @click="addUserToExperimentFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ContainerHeader from '../common/ContainerHeader'
export default {
  name: 'ParticipantsTable',
  components: {
    ContainerHeader
  },
  data () {
    return {
      userAddFormVisible: false,
      userAddForm: {
        studentId: '',
        name: '',
        isAdmin: false
      },
      addUserToExperimentFormVisible: false,
      addUserToExperimentForm: {
      },
      // 参试人员列表项
      participantsTableItems: [
        {
          prop: 'id',
          label: '序号',
          width: 70
        },
        {
          prop: 'name',
          label: '姓名',
          width: 100
        },
        {
          prop: 'studentId',
          label: '学号',
          width: 100
        },
        {
          prop: 'participatedExperiment',
          label: '参与实验',
          width: 200
        },
        {
          prop: 'participatedGroup',
          label: '所属组别',
          width: 150
        },
        {
          prop: 'createdTime',
          label: '添加时间',
          width: 200
        }
      ],
      // 参试人员列表数据
      participantsTableData: [
        {
          id: '1',
          name: '张三',
          studentId: 'xxx',
          participatedExperiment: 'ASP测试',
          participatedGroup: 'ASP',
          createdTime: '2023-01-01 14:00'
        },
        {
          id: '2',
          name: '李四',
          studentId: 'xxx',
          participatedExperiment: 'ASP测试',
          participatedGroup: 'ASP',
          createdTime: '2023-01-01 14:00'
        },
        {
          id: '1',
          name: '张三',
          studentId: 'xxx',
          participatedExperiment: 'LPMLN测试',
          participatedGroup: 'LPMLN',
          createdTime: '2023-01-01 14:00'
        },
        {
          id: '1',
          name: '张三',
          studentId: 'xxx',
          participatedExperiment: 'LPMLN测试',
          participatedGroup: 'LPMLN',
          createdTime: '2023-01-01 14:00'
        }
      ],
      // 未开始实验列表数据
      experimentTableData: [
        {
          id: '1',
          expName: 'ASP测试',
          startTime: '2023-01-01 14:00',
          status: '未开始',
          // 可选组别选项
          groupList: [
            {
              label: '实验组1',
              value: 'group_1'
            },
            {
              label: '对照组1',
              value: 'group_2'
            },
            {
              label: '实验组2',
              value: 'group_3'
            }
          ],
          // 选中添加的组
          groupToParticipate: ''
        },
        {
          id: '2',
          expName: 'LPMLN测试',
          startTime: '2023-01-01 14:00',
          status: '未开始',
          groupList: [
            {
              label: '实验组1',
              value: 'group_1'
            },
            {
              label: '对照组1',
              value: 'group_2'
            },
            {
              label: '实验组2',
              value: 'group_3'
            }
          ],
          // 选中添加的组
          groupToParticipate: ''
        }
      ],
      multipleSelection: [],
      pageTotal: 100,
      query: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    // 新增实验
    addExperiment () {

    },
    filterStatus (value, row) {
      return row.status === value
    },
    // 触发开始实验按钮
    handleDelete (index, row) {
      // 二次确认
      this.$confirm('确定要开始吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('实验已开启')
        // TODO 开始流程
      })
        .catch(() => {})
    },
    // 触发添加到实验按钮
    handleAddUserToExperiment (index, row) {
      this.addUserToExperimentFormVisible = true
      // TODO
    },
    // 触发修改参试人员信息按钮
    handleModify (index, row) {
      // TODO
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
.function-box {
  margin-bottom: 10px;
  text-align: right;
}

</style>
