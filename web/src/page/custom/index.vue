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
      <el-form :model="form" ref="form" :inline="true" label-width="80px" size="small">
        <el-form-item label>
          <el-input v-model="form.keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" stripe>
      <el-table-column prop="name" label="客户名称"></el-table-column>
      <el-table-column prop="account" label="登录账户"></el-table-column>
      <el-table-column prop="mobile" label="联系电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>

    <!-- Dialog: 添加客户 -->
    <el-dialog title="添加客户" :visible.sync="addDialogVisible" width="460px">
      <el-form :model="addForm" ref="customAddForm" label-width="90px" size="small">
        <el-form-item label="客户名称：">
          <el-input v-model="addForm.name" placeholder></el-input>
        </el-form-item>
        <el-form-item label="登录账户：">
          <el-input v-model="addForm.account" placeholder></el-input>
        </el-form-item>
        <el-form-item label="邮件：">
          <el-input v-model="addForm.email" placeholder></el-input>
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="addForm.tel" placeholder></el-input>
        </el-form-item>
        <el-form-item label="手机：">
          <el-input v-model="addForm.tel" placeholder></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button size="small" @click=" addDialogVisible= false">取 消</el-button>
        <el-button size="small" type="primary">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {get, post} from '@/utils/http';
export default {
  data() {
    return {
      form: {},
      addForm: {},
      addRules: {},
      addDialogVisible: false,
      tableData: [
        {
          name: "环信云",
          account: "admin@hxy.com",
          mobile: "138888888888",
          state: "启用"
        }
      ]
    };
  },
  methods: {
    doSearch() {
      get('/org').then(res=>{
        console.log(res);
      })
    },
    addSubmit(formName) {
      
    }
  }
};
</script>