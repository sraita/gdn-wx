<!--
1. 根据根组织机构获取该组织机构下的角色组 & 角色列表
2. 即： 角色组 和 角色属于 某个组织机构
-->

<template>
  <div class="page page-role">
    <el-card
      :body-style="{ padding: '0px' ,display: 'flex',height:'100%'}"
      shadow="never"
      :style="{height: '100%'}"
    >
      <div class="left">
        <el-form>
          <el-form-item>
            <el-input placeholder="搜索">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button-group>
              <el-button size="mini" icon="el-icon-plus" @click="addRoleGroup">新增角色组</el-button>
              <el-button size="mini" icon="el-icon-plus" @click="addRole">新增角色</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <el-tree
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          :data="treeList"
          @node-click="roleTreeNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <i
                :class="[data.type === 'role-group' ? 'iconfont icon-folder-account' : 'iconfont icon-account-key']"
              ></i>
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
      <div class="main">
        <div class="inline-title">
          <div class="float-right">
            <el-button type="text" size="mini" @click="editRoleOrGroup">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" @click="removeRoleOrGroup">删除</el-button>
          </div>
          <span>
            {{selectdRoleTreeNode.label}}
            <el-tag size="mini" v-if="selectdRoleTreeNode.type === 'role-group'">角色组</el-tag>
            <el-tag size="mini" type="success" v-else>角色</el-tag>
          </span>
        </div>
        <el-divider></el-divider>

        <el-table
          v-if="selectdRoleTreeNode.type === 'role-group'"
          :data="selectdRoleTreeNode.children"
          stripe
          size="mini"
          class="mb-2"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="类型" prop="type"></el-table-column>
          <el-table-column label="状态" prop="state"></el-table-column>
          <el-table-column label="描述" prop="remark"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>

        <el-card :body-style="{ padding: '10px' }" shadow="never">
          <div slot="header">
            <span>功能菜单授权</span>
          </div>
          <!-- card body -->
          <el-row :gutter="10">
            <el-col :span="8">
              <div class>
                <el-tree
                  ref="menuTree"
                  highlight-current
                  default-expand-all
                  show-checkbox
                  node-key="_id"
                  :expand-on-click-node="false"
                  :data="menuTreeList"
                  :check-strictly="true"
                  :default-checked-keys="checkedMenus"
                  @node-click="menuTreeNodeClick"
                  @check="menuTreeCheckHandle"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                      <i class="el-icon-folder"></i>
                      {{ node.label }}
                    </span>
                  </span>
                </el-tree>
              </div>
            </el-col>
            <el-col :span="16">
              <div class>操作权限</div>
              <el-checkbox-group v-model="checkedOpts">
                <el-checkbox v-for="opt in optsList" :label="opt._id" :key="opt._id">{{opt.name}}</el-checkbox>
              </el-checkbox-group>
              <div class="mt-2">页面元素</div>
              <el-checkbox-group v-model="checkedElements">
                <el-checkbox v-for="element in elementsList" :label="element._id" :key="element._id">{{element.name}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
          <div class="mt-2 text-right">
            <el-button plain type="danger" size="small">重置</el-button>
            <el-button plain type="primary" size="small" @click="updateRoleOrGroupAuth">更新</el-button>
          </div>
        </el-card>
      </div>
    </el-card>

    <!-- Dialog 添加角色组 -->
    <el-dialog title="新增角色组" :visible.sync="addRoleGroupDialogVisible" width="30%">
      <el-form
        :model="addRoleGroupForm"
        ref="addRoleGroupForm"
        label-width="80px"
        label-position="left"
        size="mini"
      >
        <el-form-item label="角色组名称" prop="name">
          <el-input v-model="addRoleGroupForm.name"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" v-model="addRoleGroupForm.remark" placeholder></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="addRoleGroupDialogVisible = false" size="mini">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="submitAddRoleGroupForm('addRoleGroupForm')"
        >提 交</el-button>
      </span>
    </el-dialog>

    <!-- Dialog 添加角色 -->
    <el-dialog title="新增角色" :visible.sync="addRoleDialogVisible" width="360px">
      <el-form
        :model="addRoleForm"
        ref="addRoleForm"
        label-width="80px"
        label-position="left"
        size="small"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色组" prop="group">
          <el-select v-model="addRoleForm.group" placeholder>
            <el-option
              v-for="item in roleGroupList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" v-model="addRoleForm.remark" placeholder></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click=" addRoleDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="submitAddRoleForm('addRoleForm')">提 交</el-button>
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
        node.label = node.name;
        node.children = getJsonTree(data, node._id);
        itemArr.push(node);
      }
    }
    return itemArr;
};
export default {
  data() {
    return {
      activeTabName: "activeTabName",
      addRoleGroupForm: {},
      addRoleForm: {},
      addRoleGroupDialogVisible: false, // 添加子部门 Dialog
      addRoleDialogVisible: false, // 添加人员 Dialog
      roleAuthRDialogVisible: false, // 角色授权 Dialog
      roleGroupList: [],
      treeList: [],
      menuTreeList: [],
      selectdRoleTreeNode: {},
      selectdMenuTreeNode: {},

      checkedMenus:[],
      checkedElements:[],
      checkedOpts:[],
      elementsList:[],
      optsList:[]
    }
  },
  methods: {
    checkOrgNode(data) {
      console.log(data);
    },
    roleTreeNodeClick(data) {
      this.selectdRoleTreeNode = data;
      let cb1 = (res) => {
        let list = res.data.list;
        let menuTreeList = list
          .filter(item => {
            return item.parent === null;
          })
          .map(item => {
            item.label = item.name;
            item.children = getJsonTree(res.data.list,item._id);
            return item;
          });
        this.menuTreeList = menuTreeList;
      };

      let cb2 = (res) => {
        let {menus = [], elements = [], opts = []} = res.data;
        this.checkedMenus = menus.map(menu => menu._id);
        this.checkedElements = elements.map(element => element._id);
        this.checkedOpts = opts.map(opt => opt._id);
      }
      if (data.type == 'role-group') {
        this.$api.roleGroup.getRoleGroupMenus(data._id).then(cb1);
        this.$api.roleGroup.getById(data._id).then(cb2)
      } else {
        this.$api.role.getRoleMenus(data._id).then(cb1);
        this.$api.role.getById(data._id).then(cb2);
      }
    },
    menuTreeNodeClick(data) {
      this.selectdMenuTreeNode = data;
      let _id = this.selectdRoleTreeNode._id;
      let menuId = data._id;
      if (this.selectdRoleTreeNode.type == 'role-group') {
        this.$api.roleGroup.getRoleGroupElementsByMenuId(_id,menuId).then(res => {
          this.elementsList = res.data.list;
        });
        this.$api.roleGroup.getRoleGroupOptsByMenuId(_id,menuId).then(res => {
          this.optsList = res.data.list;
        });
      } else {
        this.$api.role.getRoleElementsByMenuId(_id,menuId).then(res => {
          this.elementsList = res.data.list;
        });
        this.$api.role.getRoleOptsByMenuId(_id,menuId).then(res => {
          this.optsList = res.data.list;
        });
      }
    },
    menuTreeCheckHandle(node, {checkedKeys}){
      this.checkedMenus = checkedKeys;
    },
    tabClickHandle() {},
    fetchRoleGroupsTree() {
      this.$api.roleGroup.getRoleTree().then(res => {
        console.log(res);
        let list = res.data.list;
        const treeList = list.map(item => {
          return {
            _id: item._id,
            label: item.name,
            type: "role-group",
            children: item.roles.map(role => {
              role.label = role.name;
              role.type = "role";
              return role;
            })
          };
        });
        this.treeList = treeList;
        console.log(treeList);
      });
    },
    fetchRoleGroupList() {
      this.$api.roleGroup.getList().then(res => {
        this.roleGroupList = res.data.list;
      });
    },
    // 
    fetchMenuList() {

    },
    // 编辑角色或角色组
    editRoleOrGroup() {
      const data = this.selectdRoleTreeNode;
      if (data.type == 'role-group') {

      } else {

      }
    },
    // 删除角色或角色组
    removeRoleOrGroup() {
      const data = this.selectdRoleTreeNode;
      const callback = (res) => {
        this.selectdRoleTreeNode = null;
        this.fetchRoleGroupsTree();
        let message = '角色已删除';
        if (data.type == 'role-group') {
          message = '角色组已删除'
        }
        this.$message({
          type: 'success',
          message: message
        });
      }
      if (data.type == 'role-group') {
        this.$confirm(`是否删除角色组「${data.label}」?`).then(()=> {
          this.$api.roleGroup.remove(data._id).then(callback)
        });
      } else {
        this.$confirm(`是否删除角色「${data.label}」?`).then(()=> {
          this.$api.role.remove(data._id).then(callback)
        });
      }
    },
    // 新增角色组
    addRoleGroup() {
      this.addRoleGroupForm = {
        type: "public"
      };
      this.addRoleGroupDialogVisible = true;
    },
    submitAddRoleGroupForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.roleGroup.create(this.addRoleGroupForm).then(res => {
            this.fetchRoleGroupsTree();
            this.addRoleGroupDialogVisible = false;
            this.$message({ type: "success", message: "新增角色组成功!" });
          });
        } else {
          return false;
        }
      });
    },
    // 新增角色
    addRole() {
      this.addRoleForm = {};
      this.addRoleDialogVisible = true;
    },
    submitAddRoleForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.role.create(this.addRoleForm).then(res => {
            this.fetchRoleGroupsTree();
            this.addRoleDialogVisible = false;
            this.$message({ type: "success", message: "新增角色成功!" });
          });
        } else {
          return false;
        }
      });
    },
    // 更新角色组或角色权限
    updateRoleOrGroupAuth() {
      let params = {
        menus: this.checkedMenus,
        elements: this.checkedElements,
        opts: this.checkedOpts
      };
      const callback = (res) => {
        this.$message({
          type: 'success',
          message: '权限已更新'
        })
      }
      if (this.selectdRoleTreeNode.type === 'role-group') {
        this.$api.roleGroup.updateRoleGroupAuth(this.selectdRoleTreeNode._id,JSON.stringify(params)).then(callback);
      } else {
        this.$api.role.updateRoleAuth(this.selectdRoleTreeNode._id,JSON.stringify(params)).then(callback);
      }
    },
  },
  mounted() {
    this.fetchRoleGroupsTree();
    this.fetchRoleGroupList();
  }
};
</script>

<style lang="scss" scoped>
.page-role {
  height: 100%;
  .left {
    width: 300px;
    flex-shrink: 0;
    padding: 10px;
    background-color: #f5f6f6;
    border-right: 1px solid #eee;
    .el-form-item {
      margin-bottom: 0;
    }
    .el-tree {
      background: transparent;
    }
  }
  .main {
    flex: 1;
    padding: 10px;
  }
}
</style>