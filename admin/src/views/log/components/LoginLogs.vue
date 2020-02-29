<template>
  <div>
    <el-table :data="list" stripe size="small" :height="tableHeight - 210">
      <el-table-column prop="timestamp" label="Time" width="180"></el-table-column>
      <el-table-column prop="userId" label="userId" width="180">
        <template slot-scope="scope">
          {{scope.row.operator ? scope.row.operator._id : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="account" label="Account" width="120"></el-table-column>
      <el-table-column
        label="User Name"
        width="120"
        :formatter="getFullName">
      </el-table-column>
      <el-table-column prop="referer" label="Referer" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="event" label="Event" width="80"></el-table-column>
      <el-table-column prop="ip" label="IP Address" width="120"></el-table-column>
      <el-table-column prop="result" label="result" width="80"></el-table-column>
      <el-table-column prop="reason" label="Reason" min-width="120"></el-table-column>
    </el-table>
    <div class="mt-2">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="pagination.limit"
        layout="total, sizes, prev, pager, next"
        :total="pagination.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginLogs',
  data() {
    return {
      list:[],
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
    }
  },
  methods: {
    fetchData() {
      let {page, limit} = this.pagination;
      this.$api.system.loginLogs({page, limit}).then(res => {
        const {list,total} = res.data;
        this.list = list;
        this.pagination.total = total;
      })
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.fetchData();
    },
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.fetchData();
    },
    getFullName(row, column, cellValue, index) {
      let fullname = ''
      if (row.operator) {
        fullname = `${row.operator.firstName} ${row.operator.lastName}`
      }
      return fullname;
    },
  },
  mounted() {
    this.fetchData();
  },
}
</script>