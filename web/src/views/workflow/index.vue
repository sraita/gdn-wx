<template>
  <div class="page page-workflow">
    <el-card :body-style="{ padding: '10px' }" v-loading="lodaing">
      <div slot="header">
        <span>工作流管理</span>
      </div>
      <!-- card body -->
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="create" size="mini">新增</el-button>
          <el-button type="danger" @click="create" size="mini">删除选中</el-button>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-form :model="queryForm" ref="queryForm" :inline="true" size="mini">
            <el-form-item>
              <el-select v-model="queryForm.category" placeholder="请选择分类">
                <el-option
                  v-for="item in categoryList"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryForm.name" placeholder="输入模型名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitQuery('queryForm')">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-table :data="tableData" stripe size="mini">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="分类" prop="category.name"></el-table-column>
        <el-table-column label="创建时间" prop="createdAt"></el-table-column>
        <el-table-column label="更新时间" prop="updateAt"></el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>
        <el-table-column label="备注说明" prop="remark"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" class="text-primary" @click="design(scope.row)">流程设计</el-button>
            <el-button type="text" class="text-success" @click="design(scope.row)">部署</el-button>
            <el-button type="text" class="text-danger" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Dialog 新增工作流 -->
    <el-dialog title="新增工作流程定义" :visible.sync="dialogVisible" width="400px">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="所属分类:" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option
              v-for="item in categoryList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注说明:" prop="remark">
          <el-input type="textarea" :rows="2" v-model="form.remark" placeholder></el-input>
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
  name: "workFlowIndex",
  data() {
    return {
      lodaing: false,
      queryForm: {
        name: "",
        category: ""
      },
      queryRules: {},
      dialogVisible: false,
      form: {},
      rules: {
        name: [{ required: true, message: "请输入模型名称", trigger: "blur" }],
        category: [{ required: true, message: "请选择分类", trigger: "change" }]
      },
      categoryList: [],
      tableData: []
    };
  },
  methods: {
    fetchCategoryList() {
      this.$api.workflow.getCategories().then(res => {
        this.categoryList = res.data.list;
      });
    },
    fetchData() {
      this.lodaing = true;
      this.$api.workflow
        .getList()
        .then(res => {
          this.tableData = res.data.list;
        })
        .finally(() => {
          this.lodaing = false;
        });
    },
    // 查询
    submitQuery(formName) {},
    // 新建模型
    create() {
      this.form = {};
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.workflow.create(this.form).then(res => {
            this.fetchData();
            this.$message({ type: "success", message: "工作流程定义新增成功！" });
            this.dialogVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    // 流程设计
    design(row) {
      this.$router.push({name: 'designWorkFlow', params:{_id: row._id}});
    },
    remove(row) {
      this.$confirm("此操作将永久删除该模型, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.workflow.remove(row._id).then(res => {
          this.fetchData();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    }
  },
  mounted() {
    this.fetchCategoryList();
    this.fetchData();
  }
};
</script>