<template>
  <!--添加用户到实验对话框-->
  <el-dialog title="添加用户到实验" :visible.sync="visible" width="50%"
              :show-close="false"
              :before-close="beforeClose">
    <!--实验列表-->
    <el-table
      :data="experimentTableData"
      stripe
      border
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index" width="70"></el-table-column>
      <el-table-column label="实验名" prop="title"></el-table-column>
      <el-table-column label="开始时间" prop="startTime"></el-table-column>
      <el-table-column label="添加到组" prop="group">
        <template slot-scope="scope">
          <el-select v-model="scope.row.groupId" placeholder="请选择所属组别"
                     @focus="getGroupFromExperiment(scope.row.experId)">
            <el-option v-for="(item, index) in groupList" :key="index"
                       :label="item.groupName" :value="item.groupId"></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="experimentQueryInfo.pageIndex"
        :page-size="experimentQueryInfo.pageSize"
        :total="experimentQueryPageTotal"
        @current-change="handleExperimentPageChange">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleAdd">添 加</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddUserToExperimentDialog',
  data () {
    return {
      multipleSelection: [],
      experimentQueryPageTotal: 0,
      experimentQueryInfo: {
        userId: '',
        pageIndex: 1,
        pageSize: 5
      },
      experimentTableData: [],
      groupList: []
    }
  },
  props: {
    visible: {
      type: Boolean
    },
    // 所属用户
    userId: {
      type: String
    }
  },
  watch: {
    userId: {
      handler (newValue) {
        this.getNotInExperiment()
      }
    }
  },
  methods: {
    // 获取用户未参与实验
    async getNotInExperiment () {
      this.experimentQueryInfo.userId = this.userId
      const { data: res } = await this.$http.post('admin/getnotinexpers', this.experimentQueryInfo)
      if (res.status !== 200) {
        return this.$message.error('获取实验信息错误')
      }
      this.experimentTableData = res.data.experInfoList
      this.experimentQueryPageTotal = res.data.recordCount
    },
    async getGroupFromExperiment (experId) {
      const { data: res } = await this.$http.get('exper/querygroups', {
        params: { experId: experId }
      })
      if (res.status !== 200) {
        return this.$message.error('获取组别信息错误')
      }
      this.groupList = res.data
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleExperimentPageChange (newPage) {
      this.experimentQueryInfo.pageIndex = newPage
      this.getNotInExperiment()
    },
    beforeClose () {
      this.$emit('update:visible', false)
    },
    handleClose () {
      this.$emit('close-dialog')
    },
    // 用户添加到实验
    handleAdd () {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请至少选择一组实验添加')
      }
      this.multipleSelection.forEach(async (item) => {
        const { data: res } = await this.$http.post('admin/addtestertoexper', {
          userId: this.userId,
          experId: item.experId,
          groupId: item.groupId
        })
        if (res.status !== 200) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.getNotInExperiment()
      })
    }
  }
}
</script>

<style scoped>

</style>
