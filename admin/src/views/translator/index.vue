<template>
  <div class="app-container">
    <el-card :body-style="{ padding: '15px' }">
      <el-form :model="form" ref="form" label-width="80px">
        <el-row :gutter="10">
          <el-col :md="6" :sm="12">
            <el-form-item label="订单号:">
              <el-input v-model="form.orderNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="12">
            <el-form-item label="类型:">
              <el-select v-model="value" placeholder="请选择">
                <el-option label="普通订单" value="0"></el-option>
                <el-option label="特殊订单" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="12">
            <el-form-item label="状态:">
              <el-select v-model="value" placeholder="请选择">
                <el-option label="普通订单" value="0"></el-option>
                <el-option label="特殊订单" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="12">
            <el-form-item label="下单人:">
              <el-input v-model="form.orderNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        
      </el-form>
    </el-card>

    <el-card :body-style="{ padding: '15px' }" class="mt-15">
      <!-- card body -->
      <el-table :data="tableData" stripe>
        <el-table-column prop="user.username" label="账号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="tel" label="电话"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="wechat" label="微信"></el-table-column>
        <el-table-column prop="" label="地址"></el-table-column>
        <el-table-column prop="rank" label="级别"></el-table-column>
        <el-table-column prop="rank" label="好评率"></el-table-column>
        <el-table-column label="订单统计">

        </el-table-column>
      </el-table>

      <div class="mt-15">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[20, 40, 80, 100]"
          :page-size="pagination.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          background
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Translator",
  data() {
    return {
      form: {},
      rules: {},
      tableData: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      }
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/index.scss"; // 全局自定义的css样式
</style>