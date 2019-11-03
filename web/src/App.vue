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
</style>
