<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">New Role</el-button>

    <el-card :body-style="{ padding: '15px' }" class="mt-15">
      <el-table :data="rolesList" style="width: 100%;margin-top:30px;" stripe>
        <el-table-column align="center" label="编码" width="220">
          <template slot-scope="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" width="220">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="header-center" label="描述">
          <template slot-scope="scope">
            {{ scope.row.desc }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色编码">
          <el-input v-model="role.code" placeholder="角色编码" />
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="单一角色">
          <el-switch v-model="role.single"></el-switch>
        </el-form-item>
         <!-- <el-form-item label="互斥角色">
           <el-select v-model="role.mutex" placeholder="">
             <el-option v-for="item in mutexSelectData"
               :key="item._id"
               :label="item.name"
               :value="item._id">
             </el-option>
           </el-select>
        </el-form-item> -->
        <el-form-item label="角色描述">
          <el-input
            v-model="role.desc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="菜单授权">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            default-expand-all
            node-key="_id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { construct, destruct } from '@aximario/json-tree';
import { deepClone } from '@/utils'
import { getMenus } from '@/api/menu'
import { getRoutes, getRoles,getRole, addRole, deleteRole, updateRole,getRoleRoutes } from '@/api/role'

const defaultRole = {
  code: '',
  name: '',
  desc: '',
  menus: [],
  single: false,
  mutex:[]
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },

      menus:[]
    }
  },
  computed: {
    routesData() {
      const result = construct(this.menus, {
        id: '_id',
        pid: 'parent',
        children: 'children'
      });
      return result;
    },
    mutexSelectData() {
      return this.rolesList.filter(item => item._id != this.role._id);
    }
  },
  created() {
    // Mock: get all menus and roles list from server
    this.getMenus();
    this.getRoles();
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data.list
    },
    // 获取所有菜单列表
    async getMenus() {
      const res = await getMenus();
      this.menus = res.data.list;
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const menus = this.role.menus;
        this.$refs.tree.setCheckedKeys(menus);
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.key)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      console.log(checkedKeys)
      this.role.menus = checkedKeys;
      if (isEdit) {
        await updateRole(this.role._id, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index]._id === this.role._id) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.role.key = data.key
        this.rolesList.push(this.role)
      }

      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${key}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
