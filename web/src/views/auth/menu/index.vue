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
          <el-form-item label>
            <el-button type="text" icon="el-icon-plus" @click="addMenu"></el-button>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>

        <el-tree
          :data="treeList"
          :props="defaultProps"
          @node-click="checkOrgNode"
          default-expand-all
          highlight-current	
          :current-node-key="0"
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
            <el-button type="text" size="mini" @click="addSubMenu">添加子菜单</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" @click="editMenu">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" @click="deleteMenu">删除</el-button>
          </div>
          <span>{{selectedNode.name}}[启用]</span>
        </div>
        <el-divider></el-divider>
        
      </div>
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
        <el-button v-if="addForm.isEdit" size="small" type="primary" @click="submitEditForm('addForm')">保存</el-button>
        <el-button v-else size="small" type="primary" @click="submitAddForm('addForm')">提 交</el-button>
        
      </span>
    </el-dialog>
  </div>
</template>

<script>
var getJsonTree = function(data, parentId) {
    var itemArr = [];
    for (var i = 0; i < data.length; i++) {
      var node = data[i];
      if (node.parent == parentId) {

        var newNode = {
          _id:node._id,
          label: node.name,
          data: node            
        };
        newNode.children = getJsonTree(data, node._id);
        itemArr.push(newNode);
      }
    }
    return itemArr;
};
export default {
  name: "menuPage",
  data() {
    return {
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
    checkOrgNode(node) {
      this.selectedNode = node.data;
      this.fetchOptsByMenuId(this.selectedNode._id);
      this.fetchElementsByMenuId(this.selectedNode._id);
    },
    addMenu() {
      this.addForm = {};
      this.addDialogVisible = true;
    },
    addSubMenu() {
      this.addForm = {
        parent: this.selectedNode._id,
      };
      this.addDialogVisible = true;
    },
    editMenu() {
      this.addForm = this.selectedNode;
      this.addForm.isEdit = true;
      this.addDialogVisible = true;
    },  
    deleteMenu() {
      this.$confirm(`是否删除菜单「${this.selectedNode.name}」?`).then(()=>{
        this.$api.menu.remove(this.selectedNode._id).then(res => {
          console.log(res);
          this.fetchMenuList();
          this.$message({type: 'success', message: "删除成功"})
        })
      });
    },
    // 添加页面元素
    addElement() {
      this.addElementForm = {
        menu: this.selectedNode._id
      };
      this.addElementDialogVisible = true;
    },
    // 编辑页面元素
    editElement(row) {
      this.addElementForm = {
        isEdit: true,
        _id: row._id,
        name: row.name,
        sort: row.sort
      };
      this.addElementDialogVisible = true;
    },
    // 删除页面元素
    removeElement(row) {
      this.$confirm(`是否删除元素「${row.name}」?`).then(()=>{
        this.$api.element.remove(row._id).then(res => {
          console.log(res);
          this.fetchElementsByMenuId(this.selectedNode._id);
          this.$message({type: 'success', message: "删除成功"})
        })
      });
    },
    // 新增操作
    addOptItem () {
      this.addOptForm = {
        menu: this.selectedNode._id
      };
      this.addOptDialogVisible = true;
    },
    editOptItem(row) {
      this.addOptForm = row;
      this.addOptForm.isEdit = true;
      this.addOptDialogVisible = true;
    },
    removeOptItem(row) {
      this.$confirm(`是否「${row.name}」?`).then(()=>{
        this.$api.opt.remove(row._id).then(res => {
          console.log(res);
          this.fetchOptsByMenuId(this.selectedNode._id);
          this.$message({type: 'success', message: "删除成功"})
        })
      });
    },
    fetchMenuList() {
      this.$api.menu.getMenus().then(res => {
        let list = res.data.list;
        let treeList = list
          .filter(item => {
            return item.parent === null;
          })
          .map(item => {
            return {
              label: item.name,
              data: item,
              children: getJsonTree(res.data.list,item._id)
            };
          });
        this.treeList = treeList;
        console.log(treeList);
      });
    },
    fetchElementsByMenuId(menuId) {
      this.$api.element.getListByMenuId(menuId).then(res => {
        console.log(res);
        this.elementListTable = res.data.list;
      })
    },
    fetchOptsByMenuId(menuId) {
      this.$api.opt.getListByMenuId(menuId).then(res => {
        console.log(res);
        this.optsListTable = res.data.list;
      })
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
          this.$api.menu.update(this.addForm._id,this.addForm).then(res => {
            console.log(res);
            this.addDialogVisible = false;
            this.fetchMenuList();
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          });
        } else {
          return false;
        }
      });
    },
    submitAddOptForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.opt.create(this.addOptForm).then(res => {
            this.addOptDialogVisible = false;
            this.fetchOptsByMenuId(this.selectedNode._id);
            this.$message({
              type: 'success',
              message: '添加成功'
            });
          })
        } else {
          return false;
        }
      })
    },

    submitEditOptForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.opt.update(this.addOptForm._id, this.addOptForm).then(res => {
            console.log(res);
            this.addOptDialogVisible = false;
            this.fetchOptsByMenuId(this.selectedNode._id);
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          });
        } else {
          return false;
        }
      })
    },
    submitAddElementForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.element.create(this.addElementForm).then(res => {
            this.addElementDialogVisible = false;
            this.fetchElementsByMenuId(this.selectedNode._id);
            this.$message({
              type: 'success',
              message: '添加成功'
            });
          })
        } else {
          return false;
        }
      })
    },
    submitEditElementForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.element.update(this.addElementForm._id, this.addElementForm).then(res => {
            console.log(res);
            this.addElementDialogVisible = false;
            this.fetchElementsByMenuId(this.selectedNode._id);
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          });
        } else {
          return false;
        }
      })
    }
  },
  computed: {
    getOptsCount() {
      return this.optsListTable.length;
    },
    getElementsCount() {
      return this.elementListTable.length;
    }
  },
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
      .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
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