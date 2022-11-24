<template>
  <!--新建实验3-实验阶段管理-->
  <el-dialog title="实验阶段管理" :visible.sync="visible" width="35%"
             :show-close="false"
             :before-close="beforeClose">
    <el-form :model="form" label-width="80px" :rules="formRules" ref="formRef">
      <div v-for="(item, index) in form.phaseInfoList" :key="index">
        <div class="phase-title">
          阶段{{index+1}}
          <el-button type="danger" @click="deletePhase(index)" size="small" plain>删除阶段</el-button>
        </div>
        <el-form-item label="阶段名"
                      :prop="'phaseInfoList.' + index + '.phaseName'"
                      :rules="formRules.phaseName">
          <el-input v-model="item.phaseName"></el-input>
        </el-form-item>
        <el-form-item label="阶段类型"
                      :prop="'phaseInfoList.' + index + '.phaseType'"
                      :rules="formRules.phaseType">
          <el-select v-model="item.phaseType">
            <el-option v-for="(phase, index) in allPhaseTypes" :key="index" :label="phase" :value="index"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <!--添加选项按钮-->
    <div class="function-box">
      <el-button type="primary" @click="addPhase" size="small" plain>添加阶段</el-button>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="handleNextDialog(-1)">上一步</el-button>
      <!--下一步需要生成问题管理列表-->
      <el-button type="primary" @click="handleCreateExperiment()">创建实验</el-button>
      <el-button @click="handleNextDialog(0)">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'PhaseDialog',
  data () {
    return {
      allPhaseTypes: ['问卷', '编程'],
      formRules: {
        phaseName: [
          { required: true, message: '请输入阶段名', trigger: 'blur' }
        ],
        phaseType: [
          { required: true, message: '请选择一种问卷类型', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    form: {
      phaseInfoList: []
    },
    visible: {
      type: Boolean
    },
    resetForm: {
      type: Boolean
    }
  },
  watch: {
    resetForm: {
      handler () {
        this.$refs.formRef.resetFields()
      }
    }
  },
  methods: {
    beforeClose () {
      this.$emit('update:visible', false)
    },
    deletePhase (index) {
      this.form.phaseInfoList.splice(index, 1)
    },
    addPhase () {
      this.form.phaseInfoList.push(
        {
          number: this.form.phaseInfoList.length + 1,
          phaseName: '',
          phaseType: ''
        }
      )
    },
    handleNextDialog (type) {
      this.$emit('next-dialog', type)
    },
    handleCreateExperiment () {
      this.$refs.formRef.validate((value) => {
        if (!value) {
          return false
        }
        this.$emit('create-experiment')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.phase-title {
  font-weight: bold;
  padding: 10px;
  .el-button {
    margin-left: 20px;
  }
}
</style>
