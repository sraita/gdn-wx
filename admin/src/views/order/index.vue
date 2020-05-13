<template>
  <div class="app-container" v-loading="loading">
    <el-card :body-style="{ padding: '15px' }">
      <el-form :model="form" ref="form" label-width="80px" size="small">
        <el-row :gutter="10">
          <el-col :md="6" :sm="12"></el-col>
          <el-col :md="6" :sm="12">
            <el-form-item label="订单号:">
              <el-input v-model="form.sn" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="12">
            <el-form-item label="类型:">
              <el-select v-model="form.type" placeholder="请选择" clearable>
                <el-option label="普通订单" value="normal"></el-option>
                <el-option label="特殊订单" value="special"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="12">
            <el-form-item label="状态:">
              <el-select v-model="form.status" placeholder="请选择" clearable>
                <el-option label="进行中" value="process"></el-option>
                <el-option label="已完成" value="finish"></el-option>
                <el-option label="已关闭" value="close"></el-option>
                <el-option label="已取消" value="cancel"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="12">
            <el-form-item label-width="0">
              <el-button type="primary" @click="doSearch">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card :body-style="{ padding: '15px' }" class="mt-15">
      <!-- card body -->
      <el-table :data="tableData" stripe size="small">
        <el-table-column prop="sn" label="订单号" width="230">
          <template slot-scope="scope">
            <el-link @click="viewDetail(scope.row._id)">{{scope.row.sn}}</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="small">复制</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="订单类型">
          <template slot-scope="scope">
            <el-tag type="primary" size="mini" v-if="scope.row.type === 'normal'">普通订单</el-tag>
            <el-tag type="danger" size="mini" v-else>特殊订单</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="team.name" label="所属团队" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="meeting_subject" label="会议主题" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="meeting_date" label="会议日期" width="120">
          <template slot-scope="scope">
            {{ scope.row.meeting_date | parseTime('{y}-{m}-{d}') }}
            &nbsp;{{scope.row.meeting_time | getAmpmString}}
          </template>
        </el-table-column>
        <el-table-column prop="meeting_address" label="会议地点" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="meeting_analyst" label="分析师" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="meeting_type" label="项目类型" width="120">
          <template slot-scope="scope">{{ scope.row.meeting_type | projectType}}</template>
        </el-table-column>
        <el-table-column prop="trans_type" label="翻译类型">
          <template slot-scope="scope">{{ scope.row.trans_type | transType}}</template>
        </el-table-column>
        <el-table-column prop="translator" label="译员">
          <template slot-scope="scope">{{ scope.row.translator ? scope.row.translator.username: '未匹配'}}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">{{ scope.row.remark ? scope.row.remark: '-'}}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="primary" size="mini" v-if="scope.row.status === 'process'">进行中</el-tag>
            <el-tag type="success" size="mini" v-if="scope.row.status === 'finish'">已完成</el-tag>
            <el-tag type="info" size="mini" v-if="scope.row.status === 'close'">已关闭</el-tag>
            <el-tag type="info" size="mini" v-if="scope.row.status === 'cancel'">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="160">
          <template slot-scope="scope">{{ scope.row.create_time | parseTime }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="140">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewDetail(scope.row._id)">查看</el-button>
            <el-button v-if="scope.row.process_code === 'order-taking'" type="text" size="small" @click="acceptOrder(scope.row)">接单</el-button>
            <el-button v-if="scope.row.process_code === 'match-translator'" type="text" size="small" @click="matchTranslator(scope.row)">匹配议员</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-15 clearfix">
        <div class="float-right">
          <el-button type="primary" @click="fetchData" size="small" icon="el-icon-refresh">刷新</el-button>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[20, 50, 100, 200]"
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
import _ from 'lodash';
import { getOrders,acceptOrder,matchTranslator } from "@/api/order";
export default {
  name: "OrderIndex",
  data() {
    let defaultLoadingText = '加载中...';
    return {
      loading: false,
      loadingText: '加载中...',
      form: {
        sn: "",
        type: "",
        status: "process",
        create_time: []
      },
      rules: {},
      tableData: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      }
    };
  },
  filters: {
    transType(value) {
      let TRANS_TYPE = {
        en: "英语",
        zh_Yue: "粤语"
      };
      return TRANS_TYPE[value];
    },
    projectType(value) {
      let PROJECT_TYPE = {
        onsite_meeting: "Onside Meeting",
        inquiry: "Inquiry"
      };
      return PROJECT_TYPE[value];
    }
  },
  methods: {
    fetchData() {
      let { page, limit } = this.pagination;
    
      getOrders(this.queryParams,{ page, limit }).then(res => {
        this.pagination.total = res.data.total;
        this.tableData = res.data.list;
      });
    },
    doSearch() {
      this.fetchData();
    },
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.fetchData();
    },
    viewDetail(_id) {
      this.$router.push({name: 'orderDetail', params:{_id}});
    },
    acceptOrder(order) {
      this.$confirm(`是否接单(订单号:${order.sn})?`,'提示').then(() => {
        this.loading = true;
        acceptOrder(order._id,{isAccept: true}).then(res => {
          console.log(res);
        }).finally(() => {
          this.loading = false;
          this.loadingText = defaultLoadingText;
        })
      })
    },
    // 匹配议员
    matchTranslator(order) {

    }
  },
  computed: {
    queryParams() {
      let params = {};
      for(let key in this.form) {
        if (!_.isEmpty(this.form[key])) {
          params[key] = this.form[key];
        }
      }
      if (!_.isEmpty(this.form['sn'])) {
        params = {
          sn: this.form['sn']
        }
      }
      return params;
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style lang="scss">
@import "@/styles/index.scss"; // 全局自定义的css样式
</style>