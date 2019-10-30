<template>
  <div>
    <div>
      <el-button type="primary" size="mini" @click="dialogVisible = true">新增</el-button>
    </div>
    <!-- 模型列表 -->
    <el-table :data="tableData" stripe size="mini" v-loading="loading">
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="引用结点" prop="node.name"></el-table-column>
      <el-table-column label="创建时间" prop="createAt"></el-table-column>
      <el-table-column label="更新时间" prop="updateAt"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" class="text-primary" @click="designForm(scope.row)">表单设计</el-button>
          <el-button type="text" class="text-primary" @click="update(scope.row)">修改</el-button>
          <el-button type="text" class="text-danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增字段 Dialog -->
    <el-dialog
      :title="isEdit?'编辑表单':'新增表单'"
      :visible.sync="dialogVisible"
      width="400px">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="表单名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">提 交</el-button>
      </span>
    </el-dialog>
    
    <!-- 表单设计 -->
    <el-dialog title="表单设计器" :visible.sync="formDisignerVisible" width="90%" top="5%" :lock-scroll="false" :modal="false">
      <fm-making-form ref="makingform" style="height: 500px;" preview generate-json>
        <template slot="action"></template>
      </fm-making-form>

      <span slot="footer">
        <el-button @click="formDisignerVisible = false">放弃修改</el-button>
        <el-button type="primary" @click="saveData('makingform')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "WorkFlowModel",
  data() {
    return {
      flowId: this.$router.currentRoute.params._id,
      loading: false,
      dialogVisible: false,
      formDisignerVisible: false,
      tableData: [{}],
      form:{},
      rules:{
        name: [{required: true, message: '请输入表单名称', trigger:"blur"}]
      },
      isEdit: false,
      currentRow: null
    };
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.$api.workflow.getFormList(this.flowId).then(res => {
        this.tableData = res.data.list;
      }).finally(() => {
        this.loading = false;
      });
    },
    designForm(row) {
      this.currentRow = row;
      this.formDisignerVisible = true;
    },
    saveData(refName) {
      let {config, list} = this.$refs[refName].getJSON();
      this.$api.workflow.designForm(this.currentRow._id, {config, list}).then(res => {
        console.log(res);
        this.$message({type: 'success', message: '已保存!'});
      }).catch(e => {
        this.$message({type: 'error', message: '保存失败!'})
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            flowId: this.flowId,
            name: this.form.name
          }
          this.$api.workflow.createForm(params).then(res => {
            this.fetchData();
            this.dialogVisible = false;
            this.$message({type: 'success', message: '新增表单成功!'});
          }).catch(e => {
            this.$message({type: 'error', message: '新增表单失败!'})
          });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.fetchData();
  },
};
</script>