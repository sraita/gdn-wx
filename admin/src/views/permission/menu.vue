<template>
  <div class="app-container">
    <el-card :body-style="{ padding: '15px' }">
      <el-button type="primary" @click="handleAddMenu">新增菜单</el-button>
    </el-card>

    <el-card :body-style="{ padding: '15px' }" class="mt-15">
      <el-table
        :data="menusData"
        stripe
        default-expand-all
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="title" label="菜单名称" width="140">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" class-name="menu-icon" />
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column prop="level" label="层级" width="60">
          <template slot-scope="scope">{{ scope.row.level }} 级</template>
        </el-table-column>
        <el-table-column prop="order" label="排序" width="60"></el-table-column>
        <el-table-column prop="type" label="类型" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 'menu'" type="success" size="mini">菜单</el-tag>
            <el-tag v-else type="primary" size="mini">目录</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 'enable'" type="success" size="mini">显示</el-tag>
            <el-tag v-else type="danger" size="mini">隐藏</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="请求地址"></el-table-column>
        <el-table-column prop="name" label="组件名称"></el-table-column>
        <el-table-column prop="component" label="组件路径"></el-table-column>
        <el-table-column prop="redirect" label="重定向"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope)">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-dropdown @command="handleCommand">
              <el-button type="text" size="small">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{index:scope.$index,row:scope.row,command:'addsub'}">新增子菜单</el-dropdown-item>
                <el-dropdown-item :command="{index:scope.$index,row:scope.row,command:'delete'}">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑菜单':'新增菜单'"
      custom-class="custom-center-dialog"
    >
      <el-form :model="menu" ref="menuForm" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="menu.title"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="menu.status">
            <el-radio label="enable">显示</el-radio>
            <el-radio label="disable">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="menu.order" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="menu.type" placeholder>
            <el-option label="目录" value="toc"></el-option>
            <el-option label="菜单" value="menu"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="menu.icon"></el-input>
        </el-form-item>
        <el-form-item label="请求地址">
          <el-input v-model="menu.url"></el-input>
        </el-form-item>
        <el-form-item label="组件名称">
          <el-input v-model="menu.name"></el-input>
        </el-form-item>
        <el-form-item label="组件路径">
          <el-input v-model="menu.component"></el-input>
        </el-form-item>
        <el-form-item label="重定向到">
          <el-input v-model="menu.redirect"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmRole">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
import { construct, destruct } from '@aximario/json-tree';
import { getMenus, addMenu, updateMenu, deleteMenu } from "@/api/menu";

const defaultMenu = {
  parent: null,
  title: "", // 菜单名称
  status: "enable",
  order: 1,
  level: 1,
  type: "menu", // 资源类型: 目录, 菜单
  icon: "",
  url: "", // 菜单路径
  name: "", // 组件名称
  component: "", // 页面组件路径
  redirect: "" // 重定向
};

export default {
  data() {
    return {
      dialogVisible: false,
      dialogType: "",
      form: {},
      rules: [],
      menu: Object.assign({}, defaultMenu),
      menuRules: [],
      menuList: []
    };
  },
  computed: {
    menusData() {
      let list = deepClone(this.menuList);
      let data =  construct(list, {
        id: '_id',
        pid: 'parent',
        children: 'children'
      });

      console.log(data);
      return data;
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getMenus();
  },
  methods: {
    async getMenus() {
      const res = await getMenus();
      this.menuList = res.data.list;
    },
    handleAddMenu() {
      this.menu = Object.assign({}, defaultMenu);
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.menu = deepClone(scope.row);
      this.dialogType = "edit";
      this.dialogVisible = true;
    },
    handleAddSubMenu(row) {
      this.menu = Object.assign({}, defaultMenu);
      this.menu.parent = row._id;
      this.menu.level += Number(row.level);
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleDelete($index, row) {
      this.$confirm("Confirm to remove the Menu?", "Warning", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(async () => {
          await deleteMenu(row._id);
          this.menuList.splice($index, 1);
          this.$message({
            type: "success",
            message: "Delete succed!"
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleCommand({index,row,command}) {
      switch (command) {
        case 'addsub':
          this.handleAddSubMenu(row);
          break;
        case 'delete':
          this.handleDelete(index, row);
          break;
      
        default:
          break;
      }
    },
    async confirmRole() {
      const isEdit = this.dialogType === "edit";

      if (isEdit) {
        await updateMenu(this.menu._id, this.menu);
        for (let index = 0; index < this.menuList.length; index++) {
          if (this.menuList[index]._id === this.menu._id) {
            this.menuList.splice(index, 1, Object.assign({}, this.menu));
            break;
          }
        }
      } else {
        const { data } = await addMenu(this.menu);
        this.menu._id = data._id;
        this.menuList.push(this.menu);
      }

      const { title } = this.menu;
      console.log(this.menuList)
      this.dialogVisible = false;
      this.$notify({
        title: "Success",
        message: `
            <div>菜单名称: ${title}</div>
          `,
        type: "success"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
  .menu-icon {
    font-size: 14px;
    margin-right: 5px;
  }
}
</style>

<style lang="scss">
.el-table thead th {
  background: #ebecf1;
  color: #5f5f5f;
  font-weight: bold;
}
.custom-center-dialog {
  margin-top: 50px !important;
  max-width: 460px;
}
</style>