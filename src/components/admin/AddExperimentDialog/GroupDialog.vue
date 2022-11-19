<template>
  <!--新建实验2-组别管理-->
  <el-dialog title="组别管理" :visible.sync="visible" width="35%" >
    <el-form :model="form" label-width="80px" >
      <div v-for="(item, index) in form.groups" :key="index">
        <div style="font-weight: bold">组别{{index+1}}<br/></div>
        <el-form-item label="组别名">
          <el-input v-model="item.groupName"></el-input>
        </el-form-item>
        <el-form-item label="求解器">
          <el-select v-model="item.solver">
            <el-option v-for="(solver, index) in allSolverTypes" :key="index" :label="solver" :value="solver"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="function-box">
      <el-button type="primary" @click="addGroup" size="small" plain>添加组别</el-button>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="handleNextDialog(-1)">上一步</el-button>
      <el-button type="primary" @click="handleNextDialog(1)">下一步</el-button>
      <el-button @click="handleNextDialog(0)">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'GroupDialog',
  data () {
    return {
      allSolverTypes: []
    }
  },
  props: {
    form: {
      groups: []
    },
    visible: {
      type: Boolean
    }
  },
  created () {
    this.getAllSolverTypes()
  },
  methods: {
    handleNextDialog (type) {
      this.$emit('next-dialog', type)
    },
    // 获取所有求解器
    getAllSolverTypes () {
      // TODO(后端请求)
      this.allSolverTypes = ['ASP求解器', 'LPLMN求解器']
    },
    addGroup () {
      this.$emit('add-group')
    }
  }
}
</script>

<style scoped>

</style>
