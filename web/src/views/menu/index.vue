<template>
  <div class="page page-menu">
    <el-card
      :body-style="{ padding: '0px' ,display: 'flex',height:'100%'}"
      shadow="never"
      class="page-org"
    >
      <div class="left">
        <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="搜索菜单">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="text" icon="el-icon-plus" @click="addDialogVisible = true"></el-button>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>

        <el-tree
          :data="treeList"
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
            <el-button type="text" size="mini" @click="addDialogVisible=true">添加子菜单</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text"  size="mini">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text"  size="mini">删除</el-button>
          </div>
          <span>角色管理[启用]</span>
        </div>
         <el-divider></el-divider>

        <div class="inline-title clearfix">
          <div>
            <span>操作列表[0]</span>
            <el-button
              size="mini"
              icon="el-icon-plus"
              @click="addOptDialogVisible=true"
            >新增</el-button>
          </div>
        </div>
        <el-table stripe size="mini">
          <el-table-column label="姓名"></el-table-column>
          <el-table-column label="职位"></el-table-column>
          <el-table-column label="工号"></el-table-column>
          <el-table-column label="手机号"></el-table-column>
          <el-table-column label="邮箱"></el-table-column>
        </el-table>

        <div class="inline-title clearfix">
          <div>
            <span>页面元素[0]</span>
            <el-button
              size="mini"
              icon="el-icon-plus"
              @click="addElementDialogVisible=true"
            >新增</el-button>
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

    <!-- Dialog 添加菜单 -->
    <el-dialog
      title="添加菜单"
      :visible.sync="addDialogVisible"
      width="320px;">
      <el-form :model="addForm" ref="addForm" :rules="addFromRules" label-width="68px" size="small" label-position="left">
        <el-form-item label="上级:" v-if="addForm.parent">
          <el-input v-model="addForm.parent.name" placeholder="" disable></el-input>
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图标:" prop="icon">
          <el-input v-model="addForm.icom" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input v-model="addForm.sort" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="路由:" prop="routerName">
          <el-input v-model="addForm.routerName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="路径:" prop="routerPath">
          <el-input v-model="addForm.routerName" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer">
        <el-button size="small" @click="addDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitAddForm('addForm')">提 交</el-button>
      </span>
    </el-dialog>
    
    <!-- Dialog 新增操作 -->
    <el-dialog
      title="新增操作权限"
      :visible.sync="addOptDialogVisible"
      width="320px">
      <el-form :model="addOptForm" ref="addForm" :rules="addFromRules" label-width="80px" size="small" label-position="left">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="addOptForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input v-model="addOptForm.sort" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="API 名称:" prop="routerName">
          <el-input v-model="addOptForm.routerName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="API 路径:" prop="routerPath">
          <el-input v-model="addOptForm.routerName" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="addOptDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitAddOptForm('addOptForm')">提 交</el-button>
      </span>
    </el-dialog>

    <!-- Dialog 新增页面元素 -->
    <el-dialog
      title="新增页面元素"
      :visible.sync="addElementDialogVisible"
      width="320px">
      <el-form :model="addElementForm" ref="addForm" :rules="addFromRules" label-width="64px" size="small" label-position="left">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="addElementForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input v-model="addOptForm.sort" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="addElementDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitAddElementForm('addOptForm')">提 交</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
export default {
  name: 'menuPage',
  data() {
    return {
      addDialogVisible: false, // 新增菜单 Dialog 
      addForm: {
        parent: null
      },
      addFromRules: {},
      addOptForm: {},
      addElementForm: {},
      addOptDialogVisible: false, // 新增操作部门 Dialog
      addElementDialogVisible: false, // 新增页面元素人员 Dialog
      treeList: [
        {
          label: "权限管理",
          children: [
            {
              label: "组织机构",
            },{
              label: "角色管理"
            },{
              label: "菜单管理"
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
    submitAddForm(formName) {

    },
    submitAddOptForm() {

    },
    submitAddElementForm() {

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