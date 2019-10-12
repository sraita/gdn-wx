<template>
  <div class="header">
    <ul class="nav float-right">
      <li class="nav-item">
        <a href="javascript:;" class="nav-link">
          <i class="el-icon-setting"></i>
        </a>
      </li>
      <li class="nav-item">
        <a href="javascript:;" class="nav-link nav-notifi">
          <el-dropdown trigger="click">
            <span>
              <el-badge is-dot class="item">
                <i class="iconfont icon-bell-outline"></i>
              </el-badge>
            </span>
            <el-dropdown-menu slot="dropdown" class="nav-notifi-box">
              <div class="nav-notifi-header">
                <a href="javascript:;" class="float-right">Clear All</a>
                <span>Notifications</span>
              </div>
              <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus-outline">螺蛳粉</el-dropdown-item>
              <el-dropdown-item icon="el-icon-check">双皮奶</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-check">蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </a>
      </li>
      <li class="nav-item">
        <el-dropdown trigger="click">
          <a href="javascript:;" class="nav-link nav-user">
              <div class="user-avatar float-left">
                <img src="@/assets/default-avatar.png" alt="User Avatar"/>
              </div>
              <div class="user-info">
                <p class="user-name">{{userInfo.username}}</p>
                <p class="user-job">SD</p>
              </div>
          </a>
          <el-dropdown-menu slot="dropdown" class="nav-user-box">
            <el-dropdown-item icon="iconfont icon-lock-outline">修改密码</el-dropdown-item>
            <el-dropdown-item icon="iconfont icon-logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
    <el-button type="text" icon="el-icon-s-fold" class="sidebar-toggle" @click="toggleSideBar"></el-button>
    <a class="logo" href="/">
      <img src="@/assets/logo.png" alt="">
    </a>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      userInfo: this.$store.state.user.userInfo
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSidebar');
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  background-color: #fff;
  box-shadow: 0 0 35px 0 rgba(154,161,171,.15);
  height: 60px;
  .logo {
    display: inline-block;
    line-height: 60px;
    img {
      height: 20px;
      vertical-align: middle;
    }
  }

  .sidebar-toggle {
    width: 60px; height: 60px; color: #727cf5; font-size: 18px;
  }
  .nav-item {
    list-style: none;
    display: inline-block;
    line-height: 60px;
    float: left;

    i {
      font-size: 20px;
      vertical-align: middle;
    }
    .el-badge {line-height: 1;}
  }
  .nav-link {
    padding: 0;
    color: #98a6ad;
    min-width: 32px;
    display: block;
    text-align: center;
    margin: 0 10px;
    text-decoration: none;
  }
  .nav-user {
    padding:14px 10px;
    text-align: left!important;
    position: relative;
    background-color: #fafbfd;
    border: 1px solid #f1f3fa;
    border-width: 0 1px;
    height: 60px;
    line-height: 1;
  }
  .user-avatar img {
    height: 32px;
    width: 32px;
    border-radius: 50%;
  }
  .user-info {
    padding-left: 42px;

    p {margin: 0; line-height: 1.2;}
    .user-name {font-size: 14px;  font-weight: 600;}
    .user-job {font-size: 12px;}
  }

}

// Notification
.nav-notifi-box {
  width: 300px;
  padding: 0;
}
.nav-notifi-header {
  padding: 10px;
  a {color: #00c4ff; text-decoration: none;}
}

// Nav User Box
.nav-user-box {
  width: 160px;
}
</style>