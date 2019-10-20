<template>
  <div class="page page-jobs">
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
              <el-button size="mini" icon="el-icon-plus" @click="addRoleGroup">新增角色组</el-button>
              <el-button size="mini" icon="el-icon-plus" @click="addRole">新增角色</el-button>
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
    <el-dialog title="新增角色组" :visible.sync="addRoleGroupVisible" width="400px">
      <el-form
        :model="addRoleGroupForm"
        ref="addRoleGroupForm"
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
        <el-button @click="addRoleGroupVisible = false" size="mini">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="submitAddRoleGroupForm('addRoleGroupForm')"
        >提 交</el-button>
      </span>
    </el-dialog>

    <!-- Dialog 添加角色 -->
    <el-dialog title="新增角色" :visible.sync="addRoleVisible" width="400px">
      <el-form
        :model="addRoleForm"
        ref="addRoleForm"
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
        </el-form-item >
        <el-form-item label="互斥角色">
          <el-select v-model="addRoleForm.exclusions" multiple placeholder="请选择">
          <el-option
            v-for="role in roleList"
            :key="role._id"
            :label="role.name"
            :value="role._id">
          </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" v-model="addRoleForm.remark" placeholder></el-input>
        </el-form-item>
        <el-form-item label="" prop="type">
          <el-checkbox label="是否为独立角色" name="type" checked></el-checkbox>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click=" addRoleVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="submitAddRoleForm('addRoleForm')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addRoleForm:{},
      addRoleVisible: false,
      addRoleGroupForm:{},
      addRoleGroupVisible: false,

      roleGroupList: [],
      roleList: [
        {_id: '1',name:'超级管理员'},
        {_id: '2', name: '财务'}
      ],
      treeList:[
        {label: '默认',type:'role-group',children:[{label: '主管理员'}]}
      ],
      selectdRoleTreeNode:[]
    };
  },
  methods: {
    checkOrgNode(data) {
      console.log(data);
    },
    roleTreeNodeClick() {

    },
    fetchRoleGroupList() {
      this.$api.roleGroup.getList().then(res => {
        this.roleGroupList = res.data.list;
      });
    },
    // 添加角色组
    addRoleGroup() {
      this.addRoleGroupForm = {};
      this.addRoleGroupVisible = true;
    },
    // 新增角色
    addRole() {
      this.addRoleForm = {};
      this.addRoleVisible = true;
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
    editRoleOrGroup() {

    },
    removeRoleOrGroup() {

    }
  },
  mounted() {
    this.fetchRoleGroupList();
  },
};
</script>

<style lang="scss">
.page-jobs {
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