<template>
  <div class="page page-menu">
    <el-card
      :body-style="{ padding: '10px'}"
      shadow="never"
      class="page-org"
    >
      <div slot="header" class="clearfix">
        <div class="float-right">
          <el-button size="mini" icon="el-icon-plus" type="primary" @click="addMenu">新增菜单</el-button>
        </div>
        <span>菜单管理</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        default-expand-all
        size="mini"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="name" label="名称" width="160" sort-by="sort"></el-table-column>
        <el-table-column prop="icon" label="图标" width="56">
          <template slot-scope="scope">
            <i :class="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop="routerName" label="路由" width="160"></el-table-column>
        <el-table-column prop="routerPath" label="路径"></el-table-column>
        <el-table-column label="操作" width="180" align="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="text-primary" @click="addSubMenu(scope.row)">添加子菜单</el-button>
            <el-button type="text" size="small" class="text-info" @click="editMenu(scope.row)">编辑</el-button>
            <el-button type="text" size="small" class="text-danger" @click="deleteMenu(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Dialog 添加菜单 -->
    <el-dialog title="添加菜单" :visible.sync="addDialogVisible" width="360px">
      <el-form
        :model="addForm"
        ref="addForm"
        :rules="addFromRules"
        label-width="68px"
        size="small"
        label-position="left"
      >
        <el-form-item label="名称:" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图标:" prop="icon">
          <el-input v-model="addForm.icon" placeholder></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input v-model="addForm.sort" placeholder></el-input>
        </el-form-item>
        <el-form-item label="路由:" prop="routerName">
          <el-input v-model="addForm.routerName" placeholder></el-input>
        </el-form-item>
        <el-form-item label="路径:" prop="routerPath">
          <el-input v-model="addForm.routerPath" placeholder></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button size="small" @click="addDialogVisible = false">取 消</el-button>
        <el-button
          v-if="addForm.isEdit"
          size="small"
          type="primary"
          @click="submitEditForm('addForm')"
        >保存</el-button>
        <el-button v-else size="small" type="primary" @click="submitAddForm('addForm')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { construct, destruct } from "@aximario/json-tree";
export default {
  name: "menuPage",
  data() {
    return {
      tableData: [],
      addDialogVisible: false, // 新增菜单 Dialog
      addForm: {},
      addFromRules: {},
      addOptForm: {},
      addElementForm: {},
      addOptDialogVisible: false, // 新增操作部门 Dialog
      addElementDialogVisible: false, // 新增页面元素人员 Dialog
      treeList: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      selectedNode: {},
      elementListTable: [],
      optsListTable: []
    };
  },
  methods: {
    addMenu() {
      this.addForm = {};
      this.addDialogVisible = true;
    },
    addSubMenu(row) {
      this.addForm = {
        parent: row._id
      };
      this.addDialogVisible = true;
    },
    editMenu(row) {
      this.addForm = row;
      this.addForm.isEdit = true;
      this.addDialogVisible = true;
    },
    deleteMenu(row) {
      this.$confirm(`是否删除菜单「${row.name}」?`,'提示',{type:'warning'}).then(() => {
        this.$api.menu.remove(row._id).then(res => {
          console.log(res);
          this.fetchMenuList();
          this.$message({ type: "success", message: "删除成功" });
        });
      });
    },
    fetchMenuList() {
      this.$api.menu.getMenus().then(res => {
        const list = res.data.list;
        this.tableData = construct(list, {
          id: "_id",
          pid: "parent",
          children: "children"
        });
      });
    },
    submitAddForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.menu.create(this.addForm).then(res => {
            console.log(res);
            this.addDialogVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    submitEditForm(formName) {
      this.$refs[formName].validate(valid => {
        debugger;
        if (valid) {
          this.$api.menu.update(this.addForm._id, this.addForm).then(res => {
            console.log(res);
            this.addDialogVisible = false;
            this.fetchMenuList();
            this.$message({
              type: "success",
              message: "修改成功"
            });
          });
        } else {
          return false;
        }
      });
    },
  },
  computed: {},
  mounted() {
    this.fetchMenuList();
  }
};
</script>

<style lang="scss">
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
      .el-tree--highlight-current
        .el-tree-node.is-current
        > .el-tree-node__content {
        background-color: #727cf5;
        color: #fff;
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
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