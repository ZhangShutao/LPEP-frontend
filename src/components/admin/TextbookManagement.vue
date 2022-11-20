<template>
  <div class="container">
    <container-header title="自学培训教材管理"></container-header>
    <!--新增教材按钮-->
    <div class="function-box">
      <el-button
        type="info"
        @click="textbookFormDialogTitle = '新增教材'; textbookFormVisible = true"
      >新增教材
      </el-button>
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

    <!--教材信息添加,修改对话框-->
    <el-dialog :title="textbookFormDialogTitle" :visible.sync="textbookFormVisible" width="30%">
      <el-form :model="textbookForm" label-width="80px" >
        <el-form-item label="文件名">
          <el-input v-model="textbookForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属实验">
          <el-select v-model="textbookForm.region" placeholder="请选择所属实验">
            <el-option v-for="(item, index) in experimentItems" :key="index"
                       :label="item.elabel" :value="item.evalue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属组别">
          <el-select v-model="textbookForm.region" placeholder="请选择所属组别">
            <el-option v-for="(item, index) in groupItems" :key="index"
                       :label="item.glabel" :value="item.gvalue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-change="handleUpload"
            :file-list="fileList"
            :auto-upload="false">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="textbookFormVisible = false">确 定</el-button>
        <el-button @click="textbookFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ContainerHeader from '../common/ContainerHeader'
import { baseUrl } from '../../vue.config'

export default {
  name: 'TextbookDownload',
  components: {
    ContainerHeader
  },
  data () {
    return {
      pageTotal: 100,
      query: {
        pageIndex: 1,
        pageSize: 5
      },
      textbookFormVisible: false,
      textbookForm: {},
      textbookFormDialogTitle: '',
      textbookUrlPrefix: baseUrl + 'train/files/',
      experimentItems: [],
      groupItems: [],
      tableData: [],
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }]
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
      this.pageTotal = res.data.recordCount
      this.tableData = res.data.queryTrainingMaterialInfoList
    },
    handlePageChange (newPage) {
      this.query.pageIndex = newPage
      this.getTextbookList()
    },
    // 触发新增教材按钮
    addTextbook () {
      // TODO
    },
    // 文件上传
    handleUpload () {
      console.log(this.fileList)
    },
    // 移除上传文件
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
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
