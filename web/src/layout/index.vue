<template>
  <div class="layout">
    <div class="layout-header">
      <Header />
    </div>
    <div class="layout-aside" :style="{width: sideBarWidth+'px'}">
      <Aside />
    </div>
    <div class="layout-main" :style="{marginLeft: sideBarWidth+'px'}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header";
import Aside from "./components/Aside";
export default {
  name: "defaultLayout",
  components: {
    Header,
    Aside
  },
  methods: {
  },
  computed: {
    sideBarWidth() {
      return this.$store.state.app.sidebar.collapse
        ? this.$store.state.app.sidebar.miniWidth
        : this.$store.state.app.sidebar.width;
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss">
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
  }
  .layout-main {
    padding-top: 60px;
    margin-left: 200px;
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