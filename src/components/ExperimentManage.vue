<template>
  <!--实验信息管理表格-->
  <div class="container">
    <el-row>
      <el-button size="small" round>全部实验</el-button>
      <el-button size="small" round>进行中实验</el-button>
      <el-button size="small" round>未开始实验</el-button>
      <el-button size="small" round>已结束实验</el-button>
    </el-row>
    <!--相关实验功能-->

    <el-table
      :data="tableData"
      border
      class="table"
      ref="multipleTable"
      header-cell-class-name="table-header"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="id" label="实验ID" width="70" align="center"></el-table-column>
      <el-table-column prop="name" label="实验名称"></el-table-column>
      <el-table-column prop="time" label="实验时间" align="center"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            class="red"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="handle-box">
      <el-button
        type="primary"
        icon="el-icon-delete"
        class="handle-del mr10"
        @click="delAllSelection"
      >批量删除</el-button>
      <el-button
        type="success"
        icon="el-icon-add"
        @click="delAllSelection"
      >新增</el-button>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="query.pageIndex"
        :page-size="query.pageSize"
        :total="pageTotal"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExperimentManage',
  data () {
    return {
      tableData: [
        {
          name: '实验一',
          id: '22345',
          time: '2012-12-23'
        }
      ],
      query: {
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'pageIndex', 1)
      this.getData()
    },
    // 删除操作
    handleDelete (index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
        .catch(() => {})
    },
    // 多选操作
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
  text-align: right;
}

.table {
  width: 100%;
  font-size: 14px;
}
.pagination {
  margin: 20px 0;
  text-align: right;
}

.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
</style>
