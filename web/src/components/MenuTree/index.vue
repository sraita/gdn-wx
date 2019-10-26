<template>
  <el-submenu v-if="menu.children && menu.children.length > 1" :index="menu.id">
    <template slot="title">
      <i :class="menu.icon"></i>
      <span slot="title">{{menu.name}}</span>
    </template>
    <el-menu-item-group>
      <MenuTree v-for="item in menu.children" :key="item.id" :menu="item"></MenuTree>
    </el-menu-item-group>
  </el-submenu>
  <el-menu-item v-else :index="menu.id" @click="clickHandle(menu)">
    <i :class="menu.icon"></i>
    <span slot="title">{{menu.name}}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'MenuTree',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  methods: {
    clickHandle(menu) {
      this.$router.push({name:menu.routerName})
    }
  },
}
</script>