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
import Header from './components/Header';
import Aside from './components/Aside';
export default {
  name: 'defaultLayout',
  components: {
    Header,
    Aside
  },
  methods: {
    getUserInfo() {
      this.$api.auth.getUserInfo(localStorage.getItem('userId')).then(res=> {
        this.$store.dispatch('user/updateUserInfo', res.data)
      });
    }
  },
  mounted() {
    this.getUserInfo();
  }
}
</script>

<style lang="scss">
  .el-header {
    background: #fff;
    padding: 0 !important;
    box-shadow: 0 0 35px 0 rgba(154,161,171,.15);
    z-index: 1;
  }
  .el-aside {
    background-color: #fff;
    box-shadow: 0 0 35px 0 rgba(154,161,171,.15);
    z-index: 1;
    .el-menu {
      text-align: justify;border-right: none;
    }
  }
  .el-main {
    background-color: #fafbfe; padding: 10px;
  }
  .inline-title {
    font-size: 15px; font-weight: 600; line-height: initial; padding: 10px 0;
  }
  .page {height: 100%;}
  .el-divider--horizontal {
    margin: 10px 0;
  }
</style>