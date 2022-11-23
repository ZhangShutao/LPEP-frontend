<template>
  <!--新建实验2-组别管理-->
  <el-dialog title="组别管理" :visible="visible" width="35%"
             :show-close="false"
             :before-close="beforeClose">
    <el-form :model="form" label-width="80px" :rules="formRules" ref="formRef">
      <div v-for="(item, index) in form.groupInfoList" :key="index">
        <div class="group-title">
          组别{{index+1}}
          <el-button type="danger" @click="deleteGroup(index)" size="small" plain>删除组别</el-button>
        </div>
        <el-form-item label="组别名"
                      :prop="'groupInfoList.' + index + '.groupName'"
                      :rules="formRules.groupName">
          <el-input v-model="item.groupName"></el-input>
        </el-form-item>
        <!--<el-form-item label="求解器">-->
        <!--  <el-select v-model="item.solver">-->
        <!--    <el-option v-for="(solver, index) in allSolverTypes" :key="index" :label="solver" :value="solver"></el-option>-->
        <!--  </el-select>-->
        <!--</el-form-item>-->
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
      formRules: {
        groupName: [
          { required: true, message: '请输入组别名', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    form: {
      groupInfoList: []
    },
    visible: {
      type: Boolean
    }
  },
  methods: {
    beforeClose () {
      this.$emit('update:visible', false)
    },
    handleNextDialog (type) {
      if (type === 1) {
        this.$refs.formRef.validate((value) => {
          if (!value) {
            return false
          }
          this.$emit('next-dialog', type)
        })
      } else {
        this.$emit('next-dialog', type)
      }
    },
    addGroup () {
      this.form.groupInfoList.push(
        {
          groupName: '',
          groupId: 0
        }
      )
    },
    deleteGroup (index) {
      this.form.groupInfoList.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.group-title {
  font-weight: bold;
  padding: 10px;
  .el-button {
    margin-left: 20px;
  }
}
</style>
