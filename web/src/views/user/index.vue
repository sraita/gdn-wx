<template>
  <div class="page page-user">
    <el-card :body-style="{ padding: '10px' }">
      <div slot="header">
        <span><!-- card title --></span>
      </div>
      <!-- card body -->
      <el-table :data="tableData" stripe size="mini">
        <el-table-column prop="" label="用户名"></el-table-column>
        <el-table-column prop="" label="微信"></el-table-column>
        <el-table-column prop="" label="组织机构"></el-table-column>
        <el-table-column prop="" label="部门"></el-table-column>
        <el-table-column prop="" label="联系电话"></el-table-column>
        <el-table-column prop="" label="邮箱"></el-table-column>
        <el-table-column prop="" label="角色"></el-table-column>
        <el-table-column prop="" label="状态"></el-table-column>
        <el-table-column prop="" label="操作"></el-table-column>
      </el-table>
      <el-row class="mt-2">
        <el-col :span="8"></el-col>
        <el-col :span="16" class="text-right float-right">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="1000">
          </el-pagination>
        </el-col>
      </el-row>
      
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'userPage',
  data() {
    return {
      tableData:[]
    }
  }
}
</script>