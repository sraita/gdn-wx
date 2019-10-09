<template>
  <div class="page page-custom">
    <div>
      <div class="float-right">
        <el-button type="primary" size="small" icon="el-icon-plus">添加客户</el-button>
      </div>
      <el-form :model="form" ref="form" :inline="true" label-width="80px" size="small">
        <el-form-item label="">
          <el-input v-model="form.keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <el-table :data="tableData" stripe>
      <el-table-column
        prop="name"
        label="客户名称">
      </el-table-column>
      <el-table-column
        prop="account"
        label="登录账户">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="联系电话">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态">
      </el-table-column>
      <el-table-column
        label="操作">
      </el-table-column>
      
    </el-table>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      tableData: [
        {
          name: '环信云',
          account: 'admin@hxy.com',
          mobile: '138888888888',
          state: '启用',
        }
      ]
    }
  }
}
</script>