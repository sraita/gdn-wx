<template>
  <div class="page page-workflow_design">
    <el-card :body-style="{ padding: '10px' }">
      <div slot="header">
        <span>流程设计</span>
      </div>
      <!-- card body -->
      <div class="workflow-process-diagram">
        
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "designWorkFlow"
};
</script>

<style lang="scss">
  .workflow-process-diagram {
    border: 1px solid #eee;
    border-radius: 4px;
    margin: 15px;
    padding: 10px;
    min-height: 100px;
  }
</style>