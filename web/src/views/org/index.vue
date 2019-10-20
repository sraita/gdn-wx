<template>
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
        <div class="mt-3">
             
   
          <el-radio-group v-model="subview" class="view-change">
            <el-radio-button label="department">
            <router-link to="/org">组织架构</router-link>
            </el-radio-button>
            <el-radio-button label="role">
             <router-link to="/org/role">角色</router-link>
             </el-radio-button>
          </el-radio-group>
          </div>
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
          </span>
        </el-tree>
      </div>
      <div class="main">
        <div class="inline-title">
          <div class="float-right">
            <el-button type="text"  size="mini">编辑部门</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" @click="addSubDepartment">添加子部门</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" @click="setManager">设置主管</el-button>
             <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" @click="setManager">添加员工</el-button>
             <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" @click="setManager">添加角色</el-button>
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
</template>

<script>
export default {
  data() {
    return {
      subview:'department',
      addDepartmentForm: {},
      addDepartmentVisible: false, // 添加部门 Dialog
      addMemberForm: {},
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
    },
    // 添加部门
    addDepartment() {
      this.addDepartmentForm = {};
      this.addDepartmentVisible = true;
    },
    // 添加子部门
    addSubDepartment() {
      
    },
    // 设置部门主管
    setManager() {

    }
  }
};
</script>

<style lang="scss">
.page-org {
  height: 100%;
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
}
</style>