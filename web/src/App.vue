<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './assets/css/global.scss';
html, body {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-size: 14px;
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.layout {
  height: 100%;
  overflow: hidden;
  .layout-header {
    position: fixed;
    height: 60px;
    top: 0;
    right: 0;
    left: 0;
    z-index: 9;
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
    }
  }
  .layout-main {
    padding-top: 60px;
    background: #f1f4f7;
    transition: transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    overflow: auto;
    height: 100%;
    .page {
      padding: 15px;
    }
  }
  .layout-aside {
    width: 200px;
    position: fixed;
    top: 0;
    left: 0;
    bottom:0;
    padding-top: 60px;
    z-index: 8;
    background: #fff;
    overflow-y: auto;
    .el-menu {
      text-align: justify;
      border-right: none;
    }
  }
}
.inline-title {
  font-size: 15px;
  font-weight: 600;
  line-height: initial;
  padding: 10px 0;
}
</style>
