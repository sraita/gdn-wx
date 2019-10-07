<template>
  <el-container style="height: 100%;">
    <el-header>
      <Header/>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <Aside/>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '@/components/Layout/Header';
import Aside from '@/components/Layout/Aside';
export default {
  name: 'index',
  components: {
    Header,
    Aside
  }
}
</script>

<style lang="scss">
  .el-header {
    background: #fff;
    padding: 0 !important;
  }
  .el-aside {
    background-color: #e6e6e6;
    .el-menu {
      text-align: justify;
    }
  }
</style>