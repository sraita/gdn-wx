<template>
  <div>
    <el-menu
      default-active="1-4-1"
      background-color="#fff"
      text-color="#6c757d"
      active-text-color="#727cf5"
      :collapse="this.$store.state.app.isSidebarOpen" 
    >
      <el-menu-item index="1" @click="linkTo('dashboard')">
        <i class="el-icon-menu"></i>
        <span slot="title">Dashboard</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">权限管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1" @click="linkTo('org')">组织机构</el-menu-item>
          <el-menu-item index="1-2" @click="linkTo('role')">角色管理</el-menu-item>
          <el-menu-item index="1-3" @click="linkTo('menu')">菜单管理</el-menu-item>
          <el-menu-item index="1-4" @click="linkTo('role')">资源管理</el-menu-item>
          <el-menu-item index="1-5" @click="linkTo('user')">用户管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-document"></i>
        <span slot="title">订单管理</span>
      </el-menu-item>
      <!-- 第三方公司客户 -->
      <el-menu-item index="3" @click="linkTo('custom')">
        <i class="el-icon-document"></i>
        <span slot="title">客户管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Aside',
  methods: {
    linkTo(name,path) {
      this.$router.push({name:name})
    }
  }
}
</script>

<style lang="scss">
.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>