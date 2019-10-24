<template>
  <div class="page page-user">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-3"> 
      <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card :body-style="{ padding: '10px' }">
      <!-- card body -->
      <el-table :data="tableData" stripe size="mini" v-loading="loading">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop label="微信"></el-table-column>
        <el-table-column prop="org.name" label="组织机构"></el-table-column>
        <el-table-column prop="departments" label="部门" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="item in scope.row.departments" :key="item._id">
              {{item.name}}
              <span>|</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="联系电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="roles" label="角色" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="item in scope.row.roles" :key="item._id">
              {{item.name}}
              <span>|</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
      <el-row class="mt-2">
        <el-col :span="8"></el-col>
        <el-col :span="16" class="text-right float-right">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.page"
            :page-sizes="[10,25, 50, 100]"
            :page-size="pagination.limit"
            layout="total, sizes, prev, pager, next"
            :total="totalCount"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "userPage",
  data() {
    return {
      loading: false,
      tableData: [],
      totalCount: 0,
      pagination: {
        limit: 25,
        page: 1
      }
    };
  },
  methods: {
    fetchUserList() {
      this.loading = true;
      this.$api.user
        .getList(this.pagination)
        .then(res => {
          this.tableData = res.data.list;
          this.totalCount = res.data.total;
        })
        .finally(() => (this.loading = false));
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.fetchUserList();
    },
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.fetchUserList();
    }
  },
  mounted() {
    this.fetchUserList();
  }
};
</script>