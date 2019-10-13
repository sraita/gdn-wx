<template>
  <div class="page page-custom">
    <div>
      <div class="float-right">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="addDialogVisible = true"
        >添加客户</el-button>
      </div>
      <el-form :model="form" ref="customQueryForm" :inline="true" label-width="80px" size="small">
        <el-form-item label>
          <el-input v-model="form.keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" stripe size="mini">
      <el-table-column prop="name" label="客户名称"></el-table-column>
      <el-table-column prop="account" label="登录账户"></el-table-column>
      <el-table-column prop="mobile" label="联系电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 1">启用</el-tag>
          <el-tag size="small" v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="iconfont icon-lock-open" v-if="scope.row.status==1" @click="changeStatus(scope.row, 0)"></el-button>
          <el-button type="text" size="small" icon="iconfont icon-lock" v-else  @click="changeStatus(scope.row, 0)"></el-button>
          <el-button type="text" size="small" icon="iconfont icon-pencil"></el-button>
          <el-button type="text" size="small" icon="iconfont icon-delete" @click="removeItem(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog: 添加客户 -->
    <el-dialog title="添加客户" :visible.sync="addDialogVisible" width="400px">
      <el-form :model="addForm" :rules="addRules" ref="customAddForm" label-width="100px" size="small">
        <el-form-item label="客户名称：" prop="name">
          <el-input v-model="addForm.name" placeholder></el-input>
        </el-form-item>
        <el-form-item label="登录账户：" prop="account">
          <el-input v-model="addForm.account" placeholder></el-input>
        </el-form-item>
        <el-form-item label="默认密码：" prop="password">
          <el-input v-model="addForm.password" placeholder></el-input>
        </el-form-item>
        <el-form-item label="电子邮件：" prop="email">
          <el-input v-model="addForm.email" placeholder></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="tel">
          <el-input v-model="addForm.tel" placeholder></el-input>
        </el-form-item>
        <el-form-item label="联系手机：" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button size="small" @click=" addDialogVisible= false">取 消</el-button>
        <el-button size="small" type="primary" @click="addSubmit('customAddForm')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'customPage',
  data() {
    return {
      form: {},
      addForm: {},
      addRules: {
        name:[
          { required: true, message: '请输入客户名称', trigger: 'blur' },
        ],
        account: [{required: true, message: '请输入默认管理账户', trigger: 'blur' }],
        password: [{required: true, message: '请输入默认密码', trigger: 'blur' }]
      },
      addDialogVisible: false,
      tableData: [{}]
    };
  },
  methods: {
    fetchData() {
      this.$api.custom.list({ page: 1, limit: 10 }).then(res => {
        this.tableData = res.data.list;
      });
    },
    doSearch(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeStatus(row) {
      const status = row.status == 1 ? 0 : 1 
      this.$api.custom.update(row._id,{status}).then(res=> {
        this.tableData = res.data.list;
      })
    },
    removeItem(row) {
      this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.custom.remove(row._id).then(res=> {
            this.tableData = res.data.list;
          });
        })
    },
    addSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.custom.create(this.addForm).then(res => {
            this.tableData = res.data.list;
            this.addDialogVisible = false;
            this.$refs[formName].resetFields();
          });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>