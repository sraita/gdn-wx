<template>
  <div class="app-container">
    <el-card :body-style="{ padding: '15px', paddingBottom: 0}">
      <div class="flex">
        <el-button type="primary" @click="visible = true">新增团队</el-button>
        
        <el-form :model="form" ref="form" inline>
          <el-form-item label="">
            <el-input v-model="form.name" placeholder="团队名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      
    </el-card>

    <el-card :body-style="{ padding: '10px' }" class="mt-15">
      <el-table :data="tableData" stripe size="small">
        <el-table-column  prop="openid" label="openId" width=""></el-table-column>
        <el-table-column  prop="name" label="成员名称" width=""></el-table-column>
        <el-table-column  prop="name" label="所在团队" width=""></el-table-column>
        <el-table-column  prop="contact_tel" label="联系电话" width=""></el-table-column>
        <el-table-column  prop="" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleManagerMembers(scope.row)" type="text" size="small">设为管理员</el-button>
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="toggleStatus(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-10">
        <el-pagination
          @size-change="pageSizeChange"
          @current-change="currentPageChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total" background>
        </el-pagination>
        
      </div>
    </el-card>
  </div>
</template>

<script>
import {getTeams, newTeam, updateTeam} from '@/api/team';

const defaultTeam = {
  name: '',
  introduction: '',
  contact_name: '',
  contact_tel: ''
}
export default {
  name: 'TeamMembers',
  data() {
    return {
      form: {
        name: ''
      },
      tableData:[],
      pagination: {
        total: 0,
        page: 1,
        limit: 10
      },
      isEdit: false,
      visible: false,
      teamForm: {},
      rules: {

      },
      creating: false,
      updating: false
    }
  },
  methods: {
    doSearch() {
      this.fetchData();
    },
    fetchData() {
      let query = Object.assign(this.form);
      let {limit, page} = this.pagination;
      let params = {limit,page}

      for (let key in query) {
        if (query[key]) {
          params[key] = query[key];
        }
      }
      getTeams(params).then(res => {
        console.log(res);
        const {list, total} = res.data;
        this.tableData  = list;
        this.pagination.total = total;
      });
    },
    pageSizeChange(val) {

    },
    currentPageChange(val) {

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleEdit(row) {
      this.isEdit = true;
      this.teamForm = Object.assign(defaultTeam, row);
      this.visible = true;
    },
    newTeam(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.creating = true;
          newTeam(this.teamForm).then(res => {
            this.visible = false;
            this.resetForm('form');
            this.pagination.page = 1;
            this.fetchData();
          }).catch(err => {

          }).finally(() => {
            this.creating = false;
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    updateTeam(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {...this.teamForm}
          const _id = params._id;
          delete params._id;

          this.updating = true;
          updateTeam(_id, params).then(res => {
            this.visible = false;
            this.resetForm('form');
            this.pagination.page = 1;
            this.fetchData();
          }).catch(err => {

          }).finally(() => {
            this.updating = false;
          });;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    toggleStatus(row) {
      updateTeam({}).then(res => {

      });
    },
    handleManagerMembers(row) {

    }
  },
  mounted() {
    this.fetchData();
  },
}
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
</style>