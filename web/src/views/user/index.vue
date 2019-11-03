<template>
  <div class="page page-user">
    <el-card :body-style="{ padding: '10px' }">
      <div slot="header" class="clearfix">
        <div class="float-right">
          <el-button type="primary" size="small" @click="addUser" icon="el-icon-plus">添加用户</el-button>
        </div>
        <span>用户管理</span>
      </div>
      <!-- card body -->
      <el-table :data="tableData" stripe size="mini" v-loading="loading">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="name" label="真实姓名"></el-table-column>
        <el-table-column prop="mobile" label="联系手机"></el-table-column>
        <el-table-column prop="tel" label="联系电话"></el-table-column>
        <el-table-column prop="email" label="电子邮件"></el-table-column>
        <el-table-column prop label="微信"></el-table-column>
        <el-table-column prop="org.name" label="所属团队"></el-table-column>
        <el-table-column prop="roles" label="角色" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="item in scope.row.roles" :key="item._id">
              {{item.name}}
              <span>|</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作" width="180" align="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              class="text-primary"
              @click="changePass(scope.row)"
            >修改密码</el-button>
            <el-button type="text" size="small" class="text-info" @click="editUser(scope.row)">编辑</el-button>
            <el-button
              type="text"
              size="small"
              class="text-danger"
              @click="deleteMenu(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="mt-2">
        <el-col :span="8"></el-col>
        <el-col :span="16" class="text-right float-right">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[25, 50, 100,200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="totalCount"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>

    <!-- Dialog 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="400px">
      <el-form :model="form" :rules="rules" ref="form" label-width="85px" size="small">
        <el-form-item label="用户账号:" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="登录密码:" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="密码确认:" prop="confirmPass">
          <el-input v-model="form.confirmPass"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名:" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="联系手机:" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="tel">
          <el-input v-model="form.tel"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱:" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="用户角色:" prop="roles">
          <el-select v-model="form.roles" placeholder="请选择用户角色">
            <el-option
              v-for="item in roleList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属团队:" prop>
          <el-select v-model="form.team" placeholder="请选择用户所属团队">
            <el-option
              v-for="item in customList"
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
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- Dialog 编辑用户信息 -->
    <el-dialog title="编辑用户" :visible.sync="editVisible" width="400px">
      <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="85px" size="small">
        <el-form-item label="真实姓名:" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系手机:" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="tel">
          <el-input v-model="editForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱:" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="用户角色:" prop="roles">
          <el-select v-model="editForm.roles" placeholder="请选择用户角色">
            <el-option
              v-for="item in roleList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属团队:" prop>
          <el-select v-model="editForm.team" placeholder="请选择用户所属团队">
            <el-option
              v-for="item in customList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注说明:" prop="remark">
          <el-input type="textarea" :rows="2" v-model="editForm.remark" placeholder></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="editVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitEditForm('editForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- Dialog 修改密码 -->
    <el-dialog title="修改用户密码" :visible.sync="changePassVisible" width="400px">
      <el-form
        :model="changePassForm"
        :rules="changePassRules"
        ref="changePassForm"
        label-width="85px"
        size="small"
      >
        <el-form-item label="新密码:" prop="password">
          <el-input v-model="changePassForm.password"></el-input>
        </el-form-item>
        <el-form-item label="密码确认:" prop="confirmPass">
          <el-input v-model="changePassForm.confirmPass"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="changePassVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('changePassForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "userPage",
  data() {
    return {
      loading: false,
      dialogVisible: false,
      form: {},
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        confirmPass: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入用户真实姓名", trigger: "blur" }
        ],
        // roles: [
        //   { required: true, message: "请设置用户角色", trigger: "change" }
        // ]
      },
      // Edit Form
      editVisible: false,
      editForm: {},
      editRules: {},
      // change Pass
      changePassVisible: false,
      changePassForm: {},
      changePassRules: {},

      tableData: [],
      totalCount: 0,
      pageNum: 1,
      pageSize: 50,

      // 团队列表
      customList: [],
      // 角色列表
      roleList: []
    };
  },
  methods: {
    fetchUserList() {
      this.loading = true;
      this.$api.user
        .getList({page: this.pageNum, limit: this.pageSize})
        .then(res => {
          this.tableData = res.data.list;
          this.totalCount = res.data.total;
        })
        .finally(() => (this.loading = false));
    },
    getRoles() {
      this.$api.role.getRoles().then(res => {
        this.roleList = res.data.list;
      })
    },
    getCustoms() {
      this.$api.custom.getList().then(res => {
        this.customList = res.data.list;
      })
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.fetchUserList();
    },
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.fetchUserList();
    },
    addUser() {
      this.isEdit = false;
      this.form = {};
      this.dialogVisible = true;
    },
    editUser(row) {
      this.editForm = row;
      this.editVisible = true;
    },
    changePass(row) {
      this.changePassForm = {
        _id: row._id
      };
      this.changePassVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch(formName) {
            case "form":
              this.$api.user.create(this.form).then(res => {
                console.log(res);
                this.fetchUserList();
                this.dialogVisible = false;
              })
              break;
            case "changePassForm":
              

              this.$api.user.changePassword(this.changePassForm._id, {
                password: this.changePassForm.password
              }).then(res => {
                this.changePassVisible = false;
                this.$message({type:'success', message:'密码修改成功!'});
              }).catch(err => {
                this.$message({type:'error', message:err.name});
              });
              break;
            default:
              break;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    this.fetchUserList();
    this.getRoles();
    this.getCustoms();
  }
};
</script>