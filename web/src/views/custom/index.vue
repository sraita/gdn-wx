<template>
  <div class="page page-custom">
    <div>
      <div class="float-right">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="addVisible = true"
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
      <el-table-column prop="manager.name" label="管理员"></el-table-column>
      <el-table-column prop="manager.mobile" label="管理员联系电话"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 1">启用</el-tag>
          <el-tag size="small" v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="removeItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog: 添加客户 -->
    <el-dialog title="添加客户" :visible.sync="addVisible" width="450px">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        size="small"
        label-position="left">
        <fieldset>
          <legend>团队信息</legend>
          <el-form-item label="团队名称:" prop="name">
            <el-input v-model="form.name" placeholder></el-input>
          </el-form-item>
          <el-form-item label="简介:" prop="remark">
            <el-input type="textarea" :rows="2" v-model="form.remark" placeholder=""></el-input>
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>管理员信息</legend>
          <el-form-item label="管理员姓名：" prop="manager_name">
            <el-input v-model="form.manager_name" placeholder></el-input>
          </el-form-item>
          <el-form-item label="管理员手机号：" prop="manager_mobile">
            <el-input v-model="form.manager_mobile" placeholder></el-input>
          </el-form-item>
          <el-form-item label="管理员密码:" prop="manager_password">
            <el-input v-model="form.manager_password" placeholder></el-input>
          </el-form-item>
          <el-form-item label="密码确认:" prop="manager_confirmPass">
            <el-input v-model="form.manager_confirmPass" placeholder></el-input>
          </el-form-item>
        </fieldset>

      </el-form>

      <span slot="footer">
        <el-button size="small" @click=" addVisible= false">取 消</el-button>
        <el-button size="small" type="primary" @click="addSubmit('customform')">提 交</el-button>
      </span>
    </el-dialog>
    <!-- Dialog 编辑客户信息 -->
    <el-dialog
      title="编辑客户信息"
      :visible.sync="editVisible"
      width="400px">
      <el-form :model="editForm" ref="editForm" :rules="editRules" size="small">
        <el-form-item label="客户名称:" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="简介:" prop="remark">
          <el-input type="textarea" :rows="2" v-model="editForm.remark" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer">
        <el-button size="small" @click="editVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('editForm')">提 交</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import { isMobile } from '@/utils/validate';
console.log(isMobile)
export default {
  name: "customPage",
  data() {
    var mobileVaildate = (rule, value,callback)=>{
      if (!value){
        callback(new Error('请输入电话号码'))
      }else  if (!isMobile(value)){
        callback(new Error('请输入正确的手机号码'))
      }else {
        callback()
      }
    }
    return {
      addVisible: false,
      form: {},
      rules: {
        name:[{required: true, message:'请输入团队名称',trigger:'blur'}],
        manager_name:[{required: true, message:'请输入管理员姓名',trigger:'blur'}],
        manager_mobile:[{required: true, message:'请输入管理员手机号',trigger:'blur'}],
        manager_password:[{required: true, message:'请输入管理员登录密码',trigger:'blur'}],
        manager_confirmPass:[{required: true, message:'请再次输入管理密码',trigger:'blur'}],
      },

      editVisible: false,
      editForm:{},
      editRules:{
        name:[{required: true, message:'请输入团队名称',trigger:'blur'}],
      },

      currentRow: null,
      tableData: [{}],
      roleGroups: []
    };
  },
  methods: {
    fetchData() {
      this.$api.team.getList({ page: 1, limit: 10 }).then(res => {
        this.tableData = res.data.list;
      });
    },
    fetchPublicRoleGroups() {
      this.$api.roleGroup.getPublicRoleGroups().then(res => {
        this.roleGroups = res.data.list;
      })
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
      const status = row.status == 1 ? 0 : 1;
      this.$api.custom.update(row._id, { status }).then(res => {
        this.tableData = res.data.list;
      });
    },
    editItem(row) {
      this.currentRow = row;
      this.editForm = {
        name: row.name,
        remark: row.remark
      }
      this.editVisible = true;
    },
    removeItem(row) {
      this.$confirm("此操作将永久删除该团队, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.team.remove(row._id).then(res => {
          this.fetchData();
          this.$message({
            type: 'success',
            message: '已删除'
          })
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName == 'editForm') {
            this.$api.team.update(this.currentRow._id, this.editForm).then(res => {
              this.fetchData();
              this.editVisible = false;
              this.$message({
                type: 'success',
                message: '已更新'
              })
            }).catch(err => {
              this.$message({
                type: 'error',
                message: '更新失败!'
              })
            });
          } else {
            this.$api.team.create(this.form).then(res => {
              this.fetchData();
              this.addVisible = false;
              this.$refs[formName].resetFields();
              this.$message({
                type: 'success',
                message: '客户已添加'
              })
            });
          }
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

<style lang="scss">
.page-custom {
  fieldset {
    border: 0;
    padding: 15px 0;
    border-bottom: 1px solid #efefef;
    &:first-child {
      margin-bottom: 20px;
    }
    legend {
      font-size: 15px;
      line-height: 22px;
      color: #000;
    }
  }
}
</style>