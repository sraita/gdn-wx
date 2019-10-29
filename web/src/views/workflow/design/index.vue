<template>
  <div class="page page-workflow_design">
    <el-card :body-style="{ padding: '10px' }">
      <div slot="header">
        <span>流程设计</span>
      </div>
      <!-- card body -->
      <div class="workflow-process-diagram">
        
      </div>
      <el-tabs v-model="activeName" @tab-click="tabClickHandle">
        <el-tab-pane label="表单管理" name="model">
          <WorkFlowModel/>
        </el-tab-pane>
        <el-tab-pane label="节点管理" name="nodes">配置管理</el-tab-pane>
        <el-tab-pane label="任务管理" name="tasks">任务管理</el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 新增模型字段 -->
    
  </div>
</template>

<script>
import WorkFlowModel from './components/model';
export default {
  name: "designWorkFlow",
  data(){
    return {
      activeName: 'model',
      modelTableData:[]
    }
  },
  methods: {
    tabClickHandle() {

    }
  },
  components:{
    WorkFlowModel,
  }
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