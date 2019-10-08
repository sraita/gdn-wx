<!--
1. 根据根组织机构获取该组织机构下的角色组 & 角色列表
2. 即： 角色组 和 角色属于 某个组织机构
-->

<template>
<div class="page">
  <el-card
    :body-style="{ padding: '0px' ,display: 'flex',height:'100%'}"
    shadow="never"
    class="page-org">
    <div class="left">
      <el-form>
        <el-form-item>
          <el-input placeholder="搜索">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item style="text-align: center;"> 
          <el-button-group>
            <el-button size="mini" icon="el-icon-plus" @click="addRoleGroupDialogVisible=true">新增角色组</el-button>
            <el-button size="mini" icon="el-icon-plus" @click="addRoleDialogVisible=true">新增角色</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
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
          <div class="float-right">
            <el-button type="text"  size="mini">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" @click="roleAuthRDialogVisible=true">角色授权</el-button>
          </div>
          <span>管理员[启用]</span>
        </div>
        <el-divider></el-divider>
         
        <el-table border stripe size="mini" :data="tableData">
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="编码" prop="code"></el-table-column>
          <el-table-column label="类型" prop="type"></el-table-column>
          <el-table-column label="状态" prop="state"></el-table-column>
          <el-table-column label="描述" prop="desc"></el-table-column>
        </el-table>
      </div>
  </el-card>

  <!-- Dialog 添加角色组 -->
  <el-dialog
    title="新增角色组"
    :visible.sync="addRoleGroupDialogVisible"
    width="30%">
    <el-form 
      :model="addRoleGroupForm" 
      ref="addRoleGroupForm" 
      label-width="80px"
      label-position="left"
      size="mini">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="addRoleGroupForm.name"></el-input>
      </el-form-item>

      <el-form-item label="角色代码" prop="code">
        <el-input v-model="addRoleGroupForm.code" placeholder="请输入部门名称"></el-input>
      </el-form-item>
      <el-form-item label="分组到" prop="groupId">
        <el-select v-model="addRoleGroupForm.groupId" placeholder="">
          <el-option v-for="item in roleGroupList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="addRoleGroupForm.state">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input type="textarea" :rows="2" v-model="addRoleGroupForm.desc" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    
    <span slot="footer">
      <el-button @click="addRoleGroupDialogVisible = false" size="mini">取 消</el-button>
      <el-button type="primary" size="mini">提 交</el-button>
    </span>
  </el-dialog>

  <!-- Dialog 添加角色 -->
  <el-dialog
    title="新增角色"
    :visible.sync="addRoleDialogVisible"
    width="30%">
    <el-form 
      :model="addRoleForm" 
      ref="addRoleForm" 
      label-width="80px"
      label-position="left"
      size="small">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="addRoleForm.name"></el-input>
      </el-form-item>

      <el-form-item label="角色代码" prop="code">
        <el-input v-model="addRoleForm.code" placeholder="请输入部门名称"></el-input>
      </el-form-item>
      <el-form-item label="分组到" prop="groupId">
        <el-select v-model="addRoleForm.groupId" placeholder="">
          <el-option v-for="item in roleGroupList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="addRoleForm.state">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input type="textarea" :rows="2" v-model="addRoleForm.desc" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    
    <span slot="footer">
      <el-button @click=" addRoleDialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" size="small">提 交</el-button>
    </span>
  </el-dialog>

  <!-- 角色授权 Dialog -->
  <el-dialog
    title="角色授权"
    :visible.sync="roleAuthRDialogVisible"
    width="30%">
    <el-tree
      :data="orgList"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :props="defaultProps">
    </el-tree>
    <span slot="footer">
      <el-button size="small" @click="roleAuthRDialogVisible = false">取 消</el-button>
      <el-button size="small" type="primary" >提 交</el-button>
    </span>
  </el-dialog>
  
  </div>
  
</template>

<script>
export default {
  data() {
    return {
      activeTabName: 'activeTabName',
      addRoleGroupForm: {},
      addRoleForm: {},
      addRoleGroupDialogVisible: false, // 添加子部门 Dialog
      addRoleDialogVisible: false, // 添加人员 Dialog
      roleAuthRDialogVisible: false, // 角色授权 Dialog
      roleGroupList:[],
      orgList: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
            
            },
            {
              label: "二级 1-2"
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1"
            },
            {
              label: "二级 2-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableData:[
        {
          name: '角色管理',
          code: 'MENU_ROLE_MANAGER',
          type: 'menu',
          state: 1,
          desc: '<无>'
        }
      ]
    };
  },
  methods: {
    checkOrgNode(data) {
      console.log(data);
    },
    tabClickHandle() {

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
    width: 300px;
    flex-shrink: 0;
    padding: 10px;
    background-color: #f5f6f6;
    border-right: 1px solid #eee;
    .el-form-item {margin-bottom: 0;}
    .el-tree {background: transparent;}
  }
  .main {
    flex: 1;
    padding: 10px;
  }
}
</style>