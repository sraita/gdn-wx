<template>
  <div class="page page-workflow_category">
    <el-card :body-style="{ padding: '10px' }">
      <div slot="header">
        <span>模型分类管理</span>
      </div>
      <!-- card body -->
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="create" size="mini">新增</el-button>
        </el-col>
      </el-row>

      <el-table :data="tableData" stripe size="mini">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="备注说明" prop="remark"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" class="text-primary" @click="update(scope.row)">修改</el-button>
            <el-button type="text" class="text-danger" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Dialog 新增 -->
    <el-dialog :title="isEdit?'更新模型分类':'新增模型分类'" :visible.sync="dialogVisible" width="400px">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="模型名称:" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注说明:">
          <el-input type="textarea" :rows="2" v-model="form.remark" placeholder=""></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'workFlowCategory',
  data() {
    return {
      tableData:[],
      dialogVisible: false,
      isEdit: false,
      loading: false,
      form: {},
      rules: {
        name:[{required: true, message:'请输入分类名称', trigger: 'blur'}],
      },
    }
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.$api.workflow.getCategories().then(res => {
        this.tableData = res.data.list;
      });
    },
    create() {
      this.isEdit = false;
      this.form = {};
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.$api.workflow.updateCategory(this.form._id,this.form).then(res => {
              this.fetchData();
              this.$message({type:'success', message: '修改成功！'})
            });
          } else {
            this.$api.workflow.createCategory(this.form).then(res => {
              this.fetchData();
              this.$message({type:'success', message: '已新增分类！'})
            });
          }
        } else {
          return false;
        }
      });
    },
    update(row) {
      this.isEdit = true;
      this.form = row;
      this.dialogVisible = true;
    },
    remove(row) {

    }
  },
  mounted() {
    this.fetchData();
  },
}
</script>