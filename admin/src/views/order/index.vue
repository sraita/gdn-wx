<template>
  <div class="app-container">
    <el-card :body-style="{ padding: '15px' }">
      <el-form :model="form" ref="form" label-width="80px">
        <el-row :gutter="10">
          <el-col :md="6" :sm="12"></el-col>
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
          <el-col :md="6" :sm="12">
            <el-form-item label="日期:">
              <el-date-picker
                v-model="value1"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card :body-style="{ padding: '15px' }" class="mt-15">
      <!-- card body -->
      <el-table :data="tableData" stripe>
        <el-table-column prop="no" label="订单号"></el-table-column>
        <el-table-column prop="creator" label="下单人"></el-table-column>
        <el-table-column prop="meeting.subject" label="会议主题"></el-table-column>
        <el-table-column prop="meeting.analyst" label="分析师"></el-table-column>
        <el-table-column prop="meeting.date" label="会议日期"></el-table-column>
        <el-table-column prop="meeting.projectType" label="项目类型"></el-table-column>
        <el-table-column prop="meeting.transType" label="项目类型"></el-table-column>
        <el-table-column prop="meeting.address" label="开会地点"></el-table-column>
        <el-table-column prop="type" label="订单类型"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="createAt" label="下单时间"></el-table-column>
        <el-table-column prop="team" label="所属团队"></el-table-column>
        <el-table-column prop="translator" label="匹配译员"></el-table-column>
        <el-table-column prop="appraise" label="评分"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
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
  name: "OrderIndex",
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