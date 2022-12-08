<template>
  <!--参试人员管理-->
  <el-dialog title="参试人员管理" :visible.sync="visible" width="50%"
             :show-close="false"
             :before-close="beforeClose">
    <div class="function-box">
      <el-button type="info" @click="handleAddUserToExperiment">添加用户到实验</el-button>
      <el-button type="info" @click="userAddVisible = true">新增用户</el-button>
    </div>
    <el-table
      class="table-box"
      :data="participantsTableData"
      stripe
      border>
      // 空数据状态的插槽
      <template slot="empty">
        该实验暂没有用户加入
      </template>
      <el-table-column type="index" width="70"></el-table-column>
      <el-table-column label="学号" prop="username"></el-table-column>
      <el-table-column label="姓名" prop="realname"></el-table-column>
      <el-table-column label="当前实验所属组别" prop="groupName"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDeleteUser(scope.row.userId)">从实验中移除用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="userQueryInfo.pageIndex"
        :page-size="userQueryInfo.pageSize"
        :total="userQueryPageTotal"
        @current-change="handlePageChange">
      </el-pagination>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="handleCloseDialog">完成</el-button>
      <el-button @click="handleCloseDialog">取 消</el-button>
    </div>
    <user-participate-dialog :visible.sync="addUserToExperimentVisible"
                             :experId="experId"
                             @close-dialog="handleCloseAddUserToExperimentDialog"></user-participate-dialog>
    <user-add-dialog :visible.sync="userAddVisible"
                     @finish-add-participate="getAllParticipates"
                     @close-dialog="userAddVisible = false"></user-add-dialog>
  </el-dialog>
</template>

<script>
import UserAddDialog from './UserAddDialog'
import UserParticipateDialog from './UserParticipateDialog'
export default {
  name: 'UserDialog',
  components: {
    UserAddDialog,
    UserParticipateDialog
  },
  data () {
    return {
      userQueryPageTotal: 0,
      userQueryInfo: {
        pageIndex: 1,
        pageSize: 10
      },
      participantsTableData: [],
      addUserToExperimentVisible: false,
      userAddVisible: false,
      groupList: []
    }
  },
  props: {
    visible: {
      type: Boolean
    },
    experId: {
      type: String
    }
  },
  watch: {
    experId: {
      handler () {
        this.getAllParticipates()
      }
    }
  },
  methods: {
    beforeClose () {
      this.$emit('update:visible', false)
    },
    handleCloseDialog () {
      this.$emit('close-dialog')
    },
    handlePageChange (newPage) {
      this.userQueryInfo.pageIndex = newPage
      this.getAllParticipates()
    },
    // 获取所有参试人员
    async getAllParticipates () {
      const { data: res } = await this.$http.post('user/getallusergroup', {
        experId: this.experId,
        pageIndex: this.userQueryInfo.pageIndex,
        pageSize: this.userQueryInfo.pageSize
      })
      this.userQueryPageTotal = res.data.recordCount
      this.participantsTableData = res.data.userWithGroupInfoList
    },
    // 用户删除
    handleDeleteUser (userId) {
      this.$confirm('确定要从实验中删除该用户吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.post('user/deletefromexper', {
          experId: this.experId,
          userId: userId
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
    // 触发添加用户到实验按钮
    async handleAddUserToExperiment () {
      this.addUserToExperimentVisible = true
      const { data: res } = await this.$http.get('exper/querygroups', {
        params: { experId: this.experId }
      })
      if (res.status !== 200) {
        return this.$message.error('获取组别信息错误')
      }
      this.groupList = res.data
    },
    handleCloseAddUserToExperimentDialog () {
      this.addUserToExperimentVisible = false
      this.getAllParticipates()
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
</style>
