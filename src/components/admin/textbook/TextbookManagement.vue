<template>
  <div class="container">
    <container-header title="自学培训教材管理"></container-header>
    <!--新增教材按钮-->
    <div class="function-box">
      <el-button type="warning" @click="textbookFormVisible = true">新增教材</el-button>
    </div>
    <!--教材列表-->
    <el-table
      class="table-box"
      :data="tableData"
      size="small">
      <el-table-column label="教材" prop="textbook">
        <template slot-scope="scope">
          <el-link type="primary" :href="textbookUrlPrefix + scope.row.id" target="_blank">{{scope.row.title}}（点击下载）</el-link>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" prop="lastUpdateTime">
      </el-table-column>
      <el-table-column label="所属实验" prop="experName">
      </el-table-column>
      <el-table-column label="所属组别" prop="groupName"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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

    <textbook-add-dialog :visible="textbookFormVisible"
                         @close-dialog="textbookFormVisible = false"></textbook-add-dialog>
  </div>
</template>

<script>
import ContainerHeader from '../../common/ContainerHeader'
import TextbookAddDialog from './TextbookAddDialog'
import { baseUrl } from '../../../vue.config'

export default {
  name: 'TextbookDownload',
  components: {
    ContainerHeader,
    TextbookAddDialog
  },
  data () {
    return {
      tableData: [],
      textbookUrlPrefix: baseUrl + 'train/files/',
      pageTotal: 0,
      query: {
        pageIndex: 1,
        pageSize: 5
      },
      textbookFormVisible: false
    }
  },
  created () {
    this.getTextbookList()
  },
  methods: {
    async getTextbookList () {
      const { data: res } = await this.$http.get('admin/listalltrainingmaterial', {
        params: this.query
      })
      if (res.status !== 200) {
        return this.$message.error('获取教材失败')
      }
      this.pageTotal = res.data.recordCount
      this.tableData = res.data.queryTrainingMaterialInfoList
    },
    handlePageChange (newPage) {
      this.query.pageIndex = newPage
      this.getTextbookList()
    },
    // 触发删除教材按钮
    handleDelete (textbookId) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get('admin/deletetrainingmaterial', {
          params: { id: textbookId }
        })
        if (res.status === 204) {
          this.$message.success('教材已删除')
        } else {
          this.$message.error(res.msg)
        }
      }).finally(() => {
        this.getTextbookList()
      })
    }
  }
}
</script>

<style scoped>
.function-box {
  margin-bottom: 10px;
  text-align: right;
}

.table-box {
  /*width: 80%;*/
}

</style>
