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
      <el-table-column type="index" width="70"></el-table-column>
      <el-table-column label="姓名" prop="realname" width="100"></el-table-column>
      <el-table-column label="学号" prop="username" width="100"></el-table-column>
      <!--<el-table-column label="管理员" prop="isAdmin" width="100" :formatter="changeStatus"></el-table-column>-->
      <el-table-column label="添加时间" prop="createTime" width="200"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleDelete(scope.row.userId)">删除
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleAddUserToExperiment(scope.row.userId)">添加到实验
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
    <user-add-dialog :visible.sync="userAddFormVisible"
                     @finish-add-participate="getAllParticipates"
                     @close-dialog="userAddFormVisible = false"></user-add-dialog>

    <!--添加用户到实验对话框-->
    <el-dialog title="添加用户到实验" :visible.sync="addUserToExperimentFormVisible" width="70%">
      <!--实验列表-->
      <el-table
        :data="experimentTableData"
        stripe
        border>
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
import UserAddDialog from './AddExperimentDialog/UserAddDialog'
export default {
  name: 'ParticipantsTable',
  components: {
    ContainerHeader,
    UserAddDialog
  },
  data () {
    return {
      // 参试人员列表数据
      participantsTableData: [],
      userAddFormVisible: false,
      userAddForm: {
        studentId: '',
        name: '',
        isAdmin: false
      },
      addUserToExperimentFormVisible: false,
      addUserToExperimentForm: {
      },
      multipleSelection: [],
      pageTotal: 100,
      query: {
        pageIndex: 1,
        pageSize: 5
      }
    }
  },
  created () {
    this.getAllParticipates()
  },
  methods: {
    // 获取所有参试人员
    async getAllParticipates () {
      const { data: res } = await this.$http.get('admin/listalltester', {
        params: this.query
      })
      this.pageTotal = res.data.recordCount
      this.participantsTableData = res.data.testerInfoList
    },
    handlePageChange (newPage) {
      this.query.pageIndex = newPage
      this.getAllParticipates()
    },
    changeStatus (row, column) {
      const value = row[column.property]
      if (value === 0) {
        return '否'
      } else {
        return '是'
      }
    },
    // 用户删除
    handleDelete (userId) {
      this.$confirm('确定要删除该用户吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get('admin/deletetester', {
          params: { userId: userId }
        })
        if (res.status === 204) {
          this.$message.success('用户已删除')
        } else {
          this.$message.error(res.msg)
        }
      }).finally(() => {
        this.getAllParticipates()
      })
    },
    // 触发添加到实验按钮
    handleAddUserToExperiment (index, row) {
      this.addUserToExperimentFormVisible = true
      // TODO
    }
  }
}
</script>

<style scoped>
.table-box {
  /*width: 80%*/
}
.function-box {
  margin-bottom: 10px;
  text-align: right;
}

</style>
