<!--
1. 根据根组织机构获取该组织机构下的角色组 & 角色列表
2. 即： 角色组 和 角色属于 某个组织机构
-->

<template>
  <div class="page page-role">
    <el-card :body-style="{ padding: '10px' }">
      <div slot="header" class="clearfix">
        <div class="float-right">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="addRole">新增角色</el-button>
        </div>
        <span>角色管理</span>
      </div>
      <!-- card body -->
      <el-table :data="roleList" stripe size="mini">
        <el-table-column label="角色名" prop="name"></el-table-column>
        <el-table-column label="当前状态" prop="status"></el-table-column>
        <el-table-column label="备注说明" prop="remark"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="setRoleAuth(scope.row)">授权</el-button>
            <el-button type="text" size="small" @click="editRole(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="removeRole(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Dialog 添加角色 -->
    <el-dialog :title="isEdit?'编辑角色':'新增角色'" :visible.sync="dialogVisible" width="360px">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="85px"
        size="small"
      >
        <el-form-item label="角色名称:" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="互斥角色:">
          <el-select v-model="form.exclusions" multiple placeholder="请选择">
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.name"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注说明:" prop="remark">
          <el-input type="textarea" :rows="2" v-model="form.remark" placeholder></el-input>
        </el-form-item>
        <el-form-item label prop="isSingle">
          <el-checkbox label="是否为独立角色" name="type" v-model="form.isSingle" checked></el-checkbox>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click=" dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="submitform('form')">提 交</el-button>
      </span>
    </el-dialog>

    <!-- Dialog 角色授权 -->
    <el-dialog title="角色授权" :visible.sync="roleAuthVisible" width="600px">
      <el-tree
        ref="menuTree"
        highlight-current
        default-expand-all
        show-checkbox
        node-key="_id"
        :expand-on-click-node="false"
        :data="menuTreeList"
        :default-checked-keys="checkedMenus"
        @check="menuTreeCheckHandle"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <i class="el-icon-folder"></i>
            {{ data.name }}
          </span>
        </span>
      </el-tree>
      <span slot="footer">
        <el-button @click="roleAuthVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRoleAuth">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { construct, destruct } from '@aximario/json-tree';
export default {
  data() {
    return {
      isEdit: false,
      form: {},
      rules:{
        name:[{required: true, message: '请输入角色名', trigger: 'blur'}]
      },
      dialogVisible: false, // 添加人员 Dialog
      roleAuthVisible: false, // 角色授权 Dialog
      roleList: [],
      menuTreeList: [],
      checkedMenus: [],
      currentRow: null
    };
  },
  methods: {
    menuTreeCheckHandle(node, { checkedKeys }) {
      this.checkedMenus = checkedKeys;
    },
    getRoles() {
      this.$api.role.getRoles().then(res => {
        this.roleList = res.data.list;
      });
    },
    getMenus() {
      this.$api.menu.getMenus().then(res => {
        let list = res.data.list;
        this.menuTreeList = construct(list, {
          id: '_id',
          pid: 'parent',
          children: 'children'
        });
      });
    },
    // 新增角色
    addRole() {
      this.form = {};
      this.isEdit = false;
      this.dialogVisible = true;
    },
    // 编辑角色
    editRole(row) {
      this.form = row;
      this.isEdit = true;
      this.dialogVisible = true;
    },
    // 角色授权
    setRoleAuth(row) {
      this.currentRow = row;
      
      var arr = row.menus; //后台返回的id组成的数组
      var newArr = [];
      var item = '';

      arr.forEach(item=>{
         checked(item,this.menuTreeList,newArr)
      })
      this.checkedMenus = newArr;
      
      function checked(id,data,newArr){
        data.forEach(item => {
          if (item.id == id) {
            if (!item.children || item.children.length == 0) {
              newArr.push(item.id)
            }
          } else {
            if (item.children && item.children.length > 0) {
              checked(id,item.children, newArr);
            }
          }
        });
      }

      this.$nextTick(function() {
        this.$refs.menuTree.setCheckedKeys(newArr);
      })
      this.roleAuthVisible = true;
    },
    // 删除角色
    removeRole(row) {
      this.$confirm(`是否删除角色「${row.name}」?`,'提示',{type: 'warning'}).then(() => {
        this.$api.role
          .remove(row._id)
          .then(res => {
            this.getRoles();
            this.$message({
              type: "success",
              message: "已删除"
            });
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: "删除失败"
            });
          });
      });
    },
    // 新增角色
    addRole() {
      this.form = {};
      this.dialogVisible = true;
    },
    submitform(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.$api.role.update(this.form._id, this.form).then(res => {
              this.getRoles();
              this.dialogVisible = false;
              this.$message({ type: "success", message: "已更新!" });
            })
          } else {
            this.$api.role.create(this.form).then(res => {
              this.getRoles();
              this.dialogVisible = false;
              this.$message({ type: "success", message: "新增角色成功!" });
            });
          }
        } else {
          return false;
        }
      });
    },
    // 更新角色组或角色权限
    updateRoleAuth() {
      var parentArr = this.$refs.menuTree.getHalfCheckedKeys();
      var childeArr = this.$refs.menuTree.getCheckedKeys();
      var arr = childeArr.concat(parentArr);

      let params = {
        menus: arr
      };
      this.$api.role
        .updateRoleAuth(this.currentRow._id, JSON.stringify(params))
        .then(res => {
          this.getRoles();
          this.roleAuthVisible = false;
          this.$message({
            type: "success",
            message: "权限已更新"
          });
        });
    }
  },
  mounted() {
    this.getRoles();
    this.getMenus();
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