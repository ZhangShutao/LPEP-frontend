<template>
  <div class="container">
    <container-header title="参试人员列表"></container-header>
    <div class="function-box">
      <el-button
        type="warning"
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
            @click="handleAddUserToExperiment(scope.row.userId)">添加到实验
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.userId)">删除用户
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页按钮-->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="userQueryInfo.pageIndex"
        :page-size="userQueryInfo.pageSize"
        :total="userQueryPageTotal"
        @current-change="handleUserPageChange">
      </el-pagination>
    </div>

    <!--用户添加对话框-->
    <user-add-dialog :visible.sync="userAddFormVisible"
                     @finish-add-participate="getAllParticipates"
                     @close-dialog="userAddFormVisible = false"></user-add-dialog>

    <add-user-to-experiment-dialog :visible.sync="addUserToExperimentFormVisible"
                                   :user-id="selectedUserId"
                                   @close-dialog="addUserToExperimentFormVisible = false"></add-user-to-experiment-dialog>
  </div>
</template>

<script>
import ContainerHeader from '../../common/ContainerHeader'
import UserAddDialog from '../AddExperimentDialog/UserAddDialog'
import AddUserToExperimentDialog from './AddUserToExperimentDialog'
export default {
  name: 'ParticipantsTable',
  components: {
    ContainerHeader,
    UserAddDialog,
    AddUserToExperimentDialog
  },
  data () {
    return {
      userQueryPageTotal: 0,
      userQueryInfo: {
        pageIndex: 1,
        pageSize: 10
      },
      participantsTableData: [],
      userAddFormVisible: false,
      addUserToExperimentFormVisible: false,
      selectedUserId: ''
    }
  },
  created () {
    this.getAllParticipates()
  },
  methods: {
    // 获取所有参试人员
    async getAllParticipates () {
      const { data: res } = await this.$http.get('admin/listalltester', {
        params: this.userQueryInfo
      })
      this.userQueryPageTotal = res.data.recordCount
      this.participantsTableData = res.data.testerInfoList
    },
    handleUserPageChange (newPage) {
      this.userQueryInfo.pageIndex = newPage
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
    handleAddUserToExperiment (userId) {
      this.addUserToExperimentFormVisible = true
      this.selectedUserId = userId
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
