<template>
  <div>
    <el-menu
      default-active="1-4-1"
      background-color="#fff"
      text-color="#6c757d"
      active-text-color="#727cf5"
      :collapse="this.$store.state.app.sidebar.collapse" 
    >
      <menu-tree v-for="item in menuTree" :key="item.id" :menu="item"></menu-tree>
    </el-menu>
  </div>
</template>

<script>
import MenuTree from '@/components/MenuTree'
export default {
  name: 'Aside',
  methods: {
    linkTo(name,path) {
      this.$router.push({name:name})
    }
  },
  computed: {
    menuTree() {
      return this.$store.state.app.menuTree;
    }
  },
  components: {
    MenuTree
  }
}
</script>

<style lang="scss">
.el-menu:not(.el-menu--collapse) {
  width: 240px;
}
</style>