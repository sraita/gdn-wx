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
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="dialogNewVisible = true" >添加用户</el-button>
        </div>
      </div>
      <!-- card body -->
      <el-table :data="tableData" stripe v-loading="loading" size="small">
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="sex" label="性别" width="80">
          <template slot-scope="scope">
            {{scope.row.sex | sex}}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机" width="140"></el-table-column>
        <el-table-column prop="email" label="电子邮箱" width="140"></el-table-column>
        <el-table-column prop="team" label="所属团队">
          <template slot-scope="scope">
            {{scope.row.team ? scope.row.team.name: '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_disable" type="danger" size="mini">禁用</el-tag>
            <el-tag v-else type="success" size="mini">启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="roles" label="角色">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.roles" :key="item._id" size="mini">{{item.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="editUser(scope.row)">编辑</el-button>
            <el-button type="text" v-if="scope.row.is_disable" @click="changeUserStatus(scope.row, false)">启用</el-button>
            <el-button type="text" v-else @click="changeUserStatus(scope.row, true)">禁用</el-button>
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

    <!-- 新增用户 -->
    <new-user-com :visible="dialogNewVisible" @close="dialogNewVisible = false" @submit="onUserAdded"></new-user-com>
    <edit-user-com :visible="dialogEditVisible" :user="selectedUser" @close="dialogEditVisible = false" @submit="onUserUpdated"></edit-user-com>
  </div>
</template>

<script>
import {getUsers,updateUser} from '@/api/user';

// Components
import newUserCom from './components/newUserCom';
import editUserCom from './components/editUserCom';

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
  name: "Users",
  components: {
    newUserCom,
    editUserCom
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
      selectedUser: {},
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      },
      dialogNewVisible: false,
      dialogEditVisible: false,
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
      getUsers({},{page,limit}).then(res => {
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
    onUserAdded() {
      this.dialogNewVisible = false;
      this.fetchData();
    },
    // 编辑用户
    editUser(row) {
      this.selectedUser = row;
      this.dialogEditVisible = true;
    },
    onUserUpdated() {
      this.dialogEditVisible = false;
      this.fetchData();
    },
    changeUserStatus(data,is_disable) {
      let msg = is_disable ? `是否禁用账号(${data.username})?` : `是否启用账号(${data.username})?`;
      this.$confirm(msg, '提示',{
        type: 'warning',
        confirmButtonText: is_disable ? '禁用' : '启用'
      }).then(res => {
        updateUser(data._id,{
          is_disable
        }).then(res => {
          this.fetchData();
        });
      })
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