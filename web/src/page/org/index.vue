<template>
<div class="page">
  <el-card
    :body-style="{ padding: '0px' ,display: 'flex',height:'100%'}"
    shadow="never"
    class="page-org">
    <div class="left">
      <el-form>
        <el-form-item>
          <el-input placeholder="搜索部门与成员">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <el-tree 
        :data="orgList" 
        :props="defaultProps"
        @node-click="checkOrgNode">
        <span class="custom-tree-node"  slot-scope="{ node, data }">
          <span>
            <i class="el-icon-folder"></i>
            {{ node.label }}
          </span>
        </span>
      </el-tree>
    </div>
    <div class="main">
      <div class="inline-title">
        <span>宝山电力有限公司</span>
        <el-button type="text" icon="el-icon-edit" >编辑部门</el-button>
        <el-button icon="el-icon-setting" size="mini"></el-button>
      </div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">南方电网</el-breadcrumb-item>
      <el-breadcrumb-item>宝山电力有限公司</el-breadcrumb-item>
    </el-breadcrumb>
      <div class="inline-title clearfix">
        <div class="float-right">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="addOrgDialogVisible=true">添加子部门</el-button>
        </div>
        <span>
          <i class="el-icon-office-building"></i>
          下级部门
        </span>
      </div>
      <el-collapse accordion>
        <el-collapse-item title="一致性 Consistency(2)" name="1">
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>
        <el-collapse-item title="反馈 Feedback(5)" name="2">
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
      </el-collapse>
      <div class="inline-title clearfix">
        <div class="float-right">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="addMemberDialogVisible=true">添加人员</el-button>
          <el-button type="primary" size="mini" icon="el-icon-plus">批量导入</el-button>
        </div>
        <span>
          <i class="el-icon-suitcase"></i>
          部门人员
        </span>
      </div>
      <el-table border stripe size="mini">
        <el-table-column label="姓名"></el-table-column>
        <el-table-column label="职位"></el-table-column>
        <el-table-column label="工号"></el-table-column>
        <el-table-column label="手机号"></el-table-column>
        <el-table-column label="邮箱"></el-table-column>
      </el-table>
    </div>
  </el-card>

  <!-- Dialog 添加部门 -->
  
  <el-dialog
    title="添加部门"
    :visible.sync="addOrgDialogVisible"
    width="30%">
    <el-form :model="addForm" ref="form" label-width="80px">
      <el-form-item label="上级部门" prop="parent">
        <el-input v-model="addForm.parent"></el-input>
      </el-form-item>

      <el-form-item label="部门名称" prop="name">
        <el-input v-model="addForm.name" placeholder="请输入部门名称"></el-input>
      </el-form-item>
      
    </el-form>
    
    <span slot="footer">
      <el-button @click="addOrgDialogVisible = false">取 消</el-button>
      <el-button type="primary">提 交</el-button>
    </span>
  </el-dialog>

  <!-- Dialog 添加人员 -->
  <el-dialog
    title="添加人员"
    :visible.sync="addMemberDialogVisible"
    width="30%">
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
        <el-input v-model="addMemberForm.mobile" placeholder=""></el-input>
      </el-form-item>

      <el-form-item label="角色">
        <el-input v-model="addMemberForm.roles" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="工号">
        <el-input v-model="addMemberForm.jobNum" placeholder=""></el-input>
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
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
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
    .el-tree {background: transparent;}
  }
  .main {
    flex: 1;
    padding: 10px;
  }
}
</style>