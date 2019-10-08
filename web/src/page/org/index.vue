<template>
  <div class="page">
    <el-card
      :body-style="{ padding: '0px' ,display: 'flex',height:'100%'}"
      shadow="never"
      class="page-org"
    >
      <div class="left">
        <el-form>
          <el-form-item>
            <el-input placeholder="搜索部门与成员">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item style="text-align: center;"> 
            <el-button-group>
              <el-button size="mini" icon="el-icon-plus" @click="addRoleGroupDialogVisible=true">新增企业</el-button>
              <el-button size="mini" icon="el-icon-plus" @click="addRoleDialogVisible=true">新增部门</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>

        <el-tree
          :data="orgList"
          :props="defaultProps"
          @node-click="checkOrgNode"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <i class="el-icon-folder"></i>
              {{ node.label }}
            </span>
            <span>
              <el-dropdown size="medium" type="primary">
                <el-button type="text" size="mini" icon="el-icon-more"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加子部门</el-dropdown-item>
                  <el-dropdown-item>编辑部门</el-dropdown-item>
                  <el-dropdown-item>设置上级</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="main">
        <div class="inline-title">
          <div class="float-right">
            <el-button type="text"  size="mini">编辑部门</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" @click="addOrgDialogVisible=true">添加子部门</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" @click="addOrgDialogVisible=true">设置主管</el-button>
          </div>
          <span>研发部[12 人]</span>
        </div>
         <el-divider></el-divider>

        <div class="inline-title clearfix">
          <div>
            <el-button
              size="mini"
              icon="el-icon-plus"
              @click="addMemberDialogVisible=true"
            >添加人员</el-button>
            <el-button size="mini" icon="el-icon-plus">批量导入</el-button>
          </div>
        </div>
        <el-table stripe size="mini">
          <el-table-column label="姓名"></el-table-column>
          <el-table-column label="职位"></el-table-column>
          <el-table-column label="工号"></el-table-column>
          <el-table-column label="手机号"></el-table-column>
          <el-table-column label="邮箱"></el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- Dialog 添加部门 -->

    <el-dialog title="添加部门" :visible.sync="addOrgDialogVisible" width="30%">
      <el-form :model="addForm" ref="form" label-width="80px">
        <el-form-item label="上级部门" prop="parent">
          <el-input v-model="addForm.parent"></el-input>
        </el-form-item>

        <el-form-item label="部门名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="部门类型" prop="type">
          <el-radio-group v-model="addForm.type">
            <el-radio label="company">公司</el-radio>
            <el-radio label="department">部门</el-radio>
            <el-radio label="team">团队</el-radio>
          </el-radio-group>
          
        </el-form-item>
        
      </el-form>

      <span slot="footer">
        <el-button @click="addOrgDialogVisible = false">取 消</el-button>
        <el-button type="primary">提 交</el-button>
      </span>
    </el-dialog>

    <!-- Dialog 添加人员 -->
    <el-dialog title="添加人员" :visible.sync="addMemberDialogVisible" width="30%">
      <el-form :model="addMemberForm" ref="addMemberForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="addMemberForm.name"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="addMemberForm.org" placeholder="请选择部门"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addMemberForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="addMemberForm.mobile" placeholder></el-input>
        </el-form-item>

        <el-form-item label="角色">
          <el-input v-model="addMemberForm.roles" placeholder></el-input>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="addMemberForm.jobNum" placeholder></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click=" addMemberDialogVisible = false">取 消</el-button>
        <el-button type="primary">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addForm: {},
      addMemberForm: {},
      addOrgDialogVisible: false, // 添加子部门 Dialog
      addMemberDialogVisible: false, // 添加人员 Dialog
      orgList: [
        {
          label: "博雅网艺工作室",
          children: [
            {
              label: "总经办",
            },{
              label: "设计部"
            },{
              label: "财务部"
            },{
              label: "市场部"
            },{
              label: "研发部",
              children: [
                {label: "高德纳小程序项目组"},
                {label: "测试组"}
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    checkOrgNode(data) {
      console.log(data);
    }
  }
};
</script>

<style lang="scss" scoped>
.page-org {
  height: 100%;
  
  .el-card__body {
    display: flex;
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
}
</style>