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
        <el-table-column  prop="name" label="团队名称" width=""></el-table-column>
        <el-table-column  prop="code" label="确认码" width=""></el-table-column>
        <el-table-column  prop="introduction" label="简介" width=""></el-table-column>
        <el-table-column  prop="contact_name" label="联系人" width=""></el-table-column>
        <el-table-column  prop="contact_tel" label="联系电话" width=""></el-table-column>
        <el-table-column  prop="" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteTeam(scope.row)" type="text" size="small">删除</el-button>
            <el-dropdown>
              <el-button type="text" size="small">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>成员管理</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.disable_code">禁止成员加入</el-dropdown-item>
                <el-dropdown-item v-else>允许成员加入</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-button @click="handleManagerMembers(scope.row)" type="text" size="small">成员管理</el-button> -->
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

    <!-- dialog -->
    <el-dialog
      :title="isEdit ? '编辑团队信息': '新增团队'"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="460px"
      @close="visible = false">
      <el-form :model="teamForm" ref="teamForm" label-width="80px">
        <el-form-item label="团队名称:">
          <el-input v-model="teamForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人:">
          <el-input v-model="teamForm.contact_name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:">
          <el-input v-model="teamForm.contact_tel"></el-input>
        </el-form-item>
        <el-form-item label="团队简介:">
          <el-input type="textarea" :rows="2" v-model="teamForm.introduction" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button v-if="isEdit" type="primary" @click="updateTeam('teamForm')" :loading="updating">{{updating ? '正在保存': '保 存'}}</el-button>
        <el-button v-else type="primary" @click="newTeam('teamForm')" :loading="creating">{{creating ? '正在提交': '提 交'}}</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import {getTeams, newTeam, updateTeam, deleteTeam} from '@/api/team';

const defaultTeam = {
  name: '',
  introduction: '',
  contact_name: '',
  contact_tel: ''
}
export default {
  name: 'Teams',
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
    deleteTeam(row) {
      this.$confirm(
        `此操作将解散团队【${row.name}】，团队解散后数据将无法恢复，是否继续？`,
        '提示',
        {type: 'warning'}
      ).then(() => {
        let loading = this.$loading({
          target: '.app-container',
          lock: true,
          text: '正在删除...'
        });
        deleteTeam(row._id).then(res => {
          this.$message.success('删除成功');
          this.resetForm('form');
          this.pagination.page = 1;
          this.fetchData();
        }).catch(err => {
          this.$message.error(err.message);
        }).finally(() => {
          loading.close();
        })
      })
    },
    handleManagerMembers(row) {
      this.$router.push({path:'/teams/members'})
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