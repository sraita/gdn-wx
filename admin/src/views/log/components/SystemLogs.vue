<template>
  <div>
    <el-table :data="list" stripe size="small" :height="tableHeight - 210">
      <el-table-column prop="timestamp" label="Time" width="180"></el-table-column>
      <el-table-column prop="category" label="Category" width="100"></el-table-column>
      <el-table-column prop="level" label="Level" width="80">
        <template slot-scope="scope">
          <el-tag :type="getTagType(scope.row.level)" size="mini">
          {{scope.row.level.levelStr}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="data" label="Data">
        <template slot-scope="scope">
          <div v-if="typeof scope.row.data === 'string'">
            {{scope.row.data}}
          </div>
          <div v-else :style="{color: scope.row.level.colour}">
            <p>{{scope.row.data.name}}:{{scope.row.data.message}}</p>
            <p>
              <code>
                <pre>{{scope.row.data.stack}}</pre>
              </code>
            </p>
          </div>
        </template>
      </el-table-column>
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
  name: 'SystemLogs',
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
      this.$api.system.systemLogs({page, limit}).then(res => {
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
    getTagType(level){
      switch (level.levelStr) {
        case "ERROR":
          return "danger";
          break;
        case "WARN":
          return "warning";
          break;
        case "INFO":
          return "info";
          break;
        case "DEBUG":
          return "primary";
          break;
      
        default:
          break;
      }
    }
  },
  mounted() {
    this.fetchData();
  },
}
</script>