<template>
  <div class="app-container">
    
    <el-card :body-style="{ padding: '15px' }">
      <el-form :model="form" ref="form" size="small" inline>
        <el-form-item label="账号：">
          <el-input v-model="form.account" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      
    </el-card>

    <el-card :body-style="{ padding: '15px' }" class="mt-15">
      <div slot="header" class="clearfix">
        <div class="fr">
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click="fetchData"></el-button>
        </div>
        <div>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="dialogNewVisible = true" >新增译员</el-button>
          <el-button type="primary" plain size="mini" icon="el-icon-upload" @click="dialogImportVisible = true">导入译员</el-button>
        </div>
      </div>
      <!-- card body -->
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="user.username" label="账号"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="sex" label="性别" width="80">
          <template slot-scope="scope">
            {{scope.row.sex | sex}}
          </template>
        </el-table-column>
        <el-table-column prop="tel" label="电话" width="140"></el-table-column>
        <el-table-column prop="mobile" label="手机" width="140"></el-table-column>
        <el-table-column prop="wechat" label="微信"></el-table-column>
        <el-table-column prop="rank" label="级别">
          <template slot-scope="scope">
            {{scope.row.rank | getRank}}
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="综合评分"></el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button type="text">编辑</el-button>
            <el-button type="text">禁用</el-button>
            <el-button type="text">启用</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-15">
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

    <new-translator-com :visible.sync="dialogNewVisible" @close="dialogNewVisible = false" @submit="onTranslatorCreated"></new-translator-com>
  </div>
</template>

<script>
import {getTranslators} from '@/api/translator';

// Components
import newTranslatorCom from './components/new-translator';

let rankMap = new Map([
  ['normal','普通'],
  ['advanced','高级'],
  ['proficient','专家']
]);
let sexMap = new Map([
  ['0','未知'],
  ['1','男'],
  ['2','女']
]);
export default {
  name: "Translator",
  components: {
    newTranslatorCom
  },
  data() {
    return {
      loading: false,
      form: {},
      queryForm:{
        name: '',
        account: ''
      },
      rules: {},
      tableData: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      },
      dialogNewVisible: false,
      dialogImportVisible: false
    };
  },
  filters:{
    getRank(value) {
      return rankMap.get(value)
    },
    sex(value) {
      return sexMap.get(value)
    }
  },
  methods: {
    fetchData() {
      let {page,limit} = this.pagination;
      this.loading = true;
      getTranslators({},{page,limit}).then(res => {
        let {total, list} = res.data;
        this.tableData = list;
        this.pagination.total = total
      }).finally(() => {
        this.loading = false;
      });
    },
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.fetchData();
    },
    doSearch() {
      this.fetchData();
    },
    onTranslatorCreated() {
      this.dialogNewVisible = false;
      this.fetchData();
    }
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style lang="scss">
@import "@/styles/index.scss"; // 全局自定义的css样式
</style>

<style lang="scss" scoped>
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
</style>