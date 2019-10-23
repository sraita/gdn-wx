<template>
  <div class="page page-org">
    <el-card
      :body-style="{ padding: '0px' ,display: 'flex',height:'100%'}"
      shadow="never"
      :style="{height: '100%'}"
    >
      <div class="left">
        <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="搜索部门与成员">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item style="text-align: center;"> 
            <el-button type="text" icon="el-icon-plus" @click="addDepartment"></el-button>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>

        <el-tree
          :data="treeListData"
          @node-click="treeNodeClick"
          default-expand-all
          :render-content="treeRenderContent"
          :expand-on-click-node="false"
        >
        </el-tree>
      </div>
      <div class="main">
        <div class="inline-title">
          <div class="float-right">
            <span v-if="selectedDepartment.type !== 'team'">
              <el-button type="text" size="mini" @click="addSubDepartment">添加子部门</el-button>
              <el-divider direction="vertical"></el-divider>
            </span>
            <el-button type="text"  size="mini">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text"  size="mini">删除</el-button>
          </div>
          <span>{{selectedDepartment.name}}[12 人]</span>
        </div>
         <el-divider></el-divider>

        <div class="inline-title clearfix">
          <span class="mr-2">部门主管[0]</span>
          <el-button size="mini" @click="setManager">添加主管</el-button>
        </div>
        <el-table stripe size="mini">
          <el-table-column label="姓名"></el-table-column>
          <el-table-column label="职位"></el-table-column>
          <el-table-column label="工号"></el-table-column>
          <el-table-column label="手机号"></el-table-column>
          <el-table-column label="邮箱"></el-table-column>
        </el-table>
        <div class="inline-title mt-3">
          <span class="mr-2">部门人员</span>
          <el-button size="mini" @click="addMember">添加人员</el-button>
        </div>
        <el-table stripe size="mini" :data="memberList">
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="部门" prop="departments">
            <template slot-scope="scope">
              <div class="tag-group">
                <el-tag effect="plain" size="mini" v-for="item in scope.row.departments" :key="item._id">{{item.name}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="职位" prop="roles">
            <template slot-scope="scope">
              <div class="tag-group">
                <el-tag type="warning" effect="plain" size="mini" v-for="item in scope.row.roles" :key="item._id">{{item.name}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 添加部门 -->
    <el-dialog
      title="添加部门"
      :visible.sync="addDepartmentVisible"
      width="360px">
      <el-form :model="addDepartmentForm" ref="addDepartmentForm" size="small" label-width="80px">
        <el-form-item label="部门名称:" prop="name">
          <el-input v-model="addDepartmentForm.name"></el-input>
        </el-form-item>
        <el-form-item label="部门类型:" prop="type">
          <el-radio-group v-model="addDepartmentForm.type">
            <el-radio label="company">子公司</el-radio>
            <el-radio label="department">部门</el-radio>
            <el-radio label="team">团队</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="备注说明:" prop="remark">
          <el-input type="textarea" :rows="2" v-model="addDepartmentForm.remark" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer">
        <el-button size="small" @click="addDepartmentVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitAddDepartmentForm('addDepartmentForm')">提 交</el-button>
      </span>
    </el-dialog>

    <!-- 添加部门成员 -->
    <el-dialog
      title="添加成员"
      :visible.sync="addMemberVisible"
      width="360px">
      <el-form :model="addMemberForm" :rules="addMemberRules" ref="addMemberForm" label-width="60px" size="small" >
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="addMemberForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="mobile">
          <el-input v-model="addMemberForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="addMemberForm.email"></el-input>
        </el-form-item>
        <el-form-item label="部门:" prop="departments">
          <el-select v-model="addMemberForm.departments" multiple placeholder="请选择">
            <el-option v-for="item in departmentList"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位:" prop="roles">
          <el-select v-model="addMemberForm.roles" multiple placeholder="请选择">
            <el-option v-for="item in roleList"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
      <span slot="footer">
        <el-button size="small" @click="addMemberVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitAddMemberForm('addMemberForm')">确 定</el-button>
      </span>
    </el-dialog>
    
    
  </div>
</template>

<script>
import { construct, destruct } from '@aximario/json-tree';

export default {
  data() {
    return {
      orgId: this.$store.state.user.orgId,
      subview:'department',
      addDepartmentForm: {},
      addDepartmentVisible: false, // 添加部门 Dialog
      addMemberForm: {},
      addMemberRules:{
        name:[{required: true, message: '请输入姓名', trigger:'blur'}],
        mobile:[{required: true, message: '请输入手机号', trigger:'blur'}],
        departments:[{required: true, message: '请设置部门信息', trigger:'change'}],
        roles:[{required: true, message: '请设置岗位信息', trigger:'change'}]
      },
      addMemberVisible: false, // 添加人员 Dialog
      treeListData:[],
      departmentList:[], // 所有部门
      roleList:[], // 所有角色
      memberList:[],
      selectedDepartment: {}, // 当前选中部门
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  methods: {
    treeNodeClick(data) {
      console.log(data);
      this.selectedDepartment = data;
      this.fetchMembers();
    },
    treeRenderContent(h, { node, data, store }) {
      console.log(data)
      let iconClass = "";
      switch(data.type) {
        case "company":
          iconClass = "iconfont icon-city";
          break;
        case "department":
          iconClass = "iconfont icon-wallet-travel";
          break;
        case "team":
          iconClass = "iconfont icon-clipboard-account";
          break;
        default:
          break;
      }
      return (
        <span>
          <i class={iconClass}></i>
          <span>{data.name}</span>
        </span>
      );
    },
    fetchDepartments() {
      this.$api.org.getDepartments(this.orgId).then(res => {
        const list = res.data.list;
        this.departmentList = list;
        this.treeListData = construct(list, {
          id: '_id',
          pid: 'parent',
          name: 'name',
          type: 'type',
          children: 'children'
        });
      });
    },
    fetchRoles() {
      this.$api.org.getRoles(this.orgId).then(res => {
        this.roleList = res.data.list;
      })
    },
    fetchMembers() {
      let departmentId = this.selectedDepartment ? this.selectedDepartment._id : '0';
      this.$api.org.getMembers(this.orgId,departmentId).then(res => {
        this.memberList = res.data.list;
      })
    },
    // 添加部门
    addDepartment() {
      this.addDepartmentForm = {};
      this.addDepartmentVisible = true;
    },
    // 添加子部门
    addSubDepartment() {
      this.addDepartmentForm = {
        parent: this.selectedDepartment._id
      }
      this.addDepartmentVisible = true
    },
    submitAddDepartmentForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.org.addDepartment(this.orgId, this.addDepartmentForm).then(res => {
            this.fetchDepartments();
            this.addDepartmentVisible = false;
            this.$message({
              type: 'success',
              message: '添加成功'
            });
          });
        } else {
          return false;
        }
      });
    },
    // 添加部门成员
    addMember() {
      this.addMemberForm = {};
      this.addMemberVisible = true;
    }, 
    submitAddMemberForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.org.addMember(this.orgId, this.addMemberForm).then(res => {
            this.fetchDepartments();
            this.addMemberVisible = false;
            this.$message({
              type: 'success',
              message: '添加成功'
            });
          });
        } else {
          return false;
        }
      });
    },
    // 设置部门主管
    setManager() {

    }
  },
  mounted() {
    this.fetchDepartments();
    this.fetchRoles();
  },
};
</script>

<style lang="scss">
.page-org {
  height: 100%;
  .el-select {width: 100%;}
  .view-change {
    width: 100%;
    .el-radio-button {width: 50%;}
    .el-radio-button__inner{ width: 100% !important;}
  }
  .left {
    width: 260px;
    flex-shrink: 0;
    padding: 10px;
    background-color: #f5f6f6;
    border-right: 1px solid #eee;
    .el-tree {
      background: transparent;
    }
    .el-form-item {margin-bottom: 0;}
  }
  .main {
    flex: 1;
    padding: 10px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-table {
    .el-tag{margin-right: 5px; font-size: 12px;}
  }
}
</style>