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
          <el-button
            type="text"
            size="small"
            icon="iconfont icon-lock-open"
            v-if="scope.row.status==1"
            @click="changeStatus(scope.row, 0)"
          ></el-button>
          <el-button
            type="text"
            size="small"
            icon="iconfont icon-lock"
            v-else
            @click="changeStatus(scope.row, 0)"
          ></el-button>
          <el-button type="text" size="small" icon="iconfont icon-pencil"></el-button>
          <el-button
            type="text"
            size="small"
            icon="iconfont icon-delete"
            @click="removeItem(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog: 添加客户 -->
    <el-dialog title="添加客户" :visible.sync="addDialogVisible" width="450px">
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="customAddForm"
        label-width="120px"
        size="small"
        label-position="left"
      >
        <fieldset>
          <legend>客户信息</legend>
          <el-form-item label="客户名称：" prop="name">
            <el-input v-model="addForm.name" placeholder></el-input>
          </el-form-item>
          <el-form-item label="用户组:" prop="orgRoleGroup">
            <el-select v-model="addForm.orgRoleGroup" placeholder="">
              <el-option v-for="role in orgRoleGroups"
                :key="role.value"
                :label="role.label"
                :value="role.value">
              </el-option>
            </el-select>
            
          </el-form-item>
          
        </fieldset>
        <fieldset>
          <legend>管理员信息</legend>
          <el-form-item label="登录账户：" prop="account">
            <el-input v-model="addForm.account" placeholder></el-input>
          </el-form-item>
          <el-form-item label="默认密码：" prop="password">
            <el-input v-model="addForm.password" placeholder></el-input>
          </el-form-item>
          <el-form-item label="管理员姓名：" prop="ownerName">
            <el-input v-model="addForm.ownerName" placeholder></el-input>
          </el-form-item>
          <el-form-item label="管理员手机号：" prop="ownerMobile">
            <el-input v-model="addForm.ownerMobile" placeholder></el-input>
          </el-form-item>
        </fieldset>
      </el-form>

      <span slot="footer">
        <el-button size="small" @click=" addDialogVisible= false">取 消</el-button>
        <el-button size="small" type="primary" @click="addSubmit('customAddForm')">提 交</el-button>
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
      form: {},
      addForm: {},
      addRules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        account: [
          { required: true, message: "请输入默认管理账户", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入默认密码", trigger: "blur" }
        ],
        ownerName: [{ required: true, message: "请输入管理员姓名", trigger:"blur"}],
        ownerMobile: [
          { required: true, validator:mobileVaildate, trigger:"blur"},
        ]
      },
      addDialogVisible: false,
      tableData: [{}],
      orgRoleGroups: [{
        label: '翻译服务提供方',
        value:'1'
      },{
        label: '翻译服务使用方',
        value:'2'
      }]
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
      const status = row.status == 1 ? 0 : 1;
      this.$api.custom.update(row._id, { status }).then(res => {
        this.tableData = res.data.list;
      });
    },
    removeItem(row) {
      this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.custom.remove(row._id).then(res => {
          this.tableData = res.data.list;
        });
      });
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