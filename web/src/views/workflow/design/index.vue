<template>
  <div class="page page-workflow_design">
    <el-card :body-style="{ padding: '10px' }">
      <div slot="header">
        <span>流程设计</span>
      </div>
      <!-- card body -->
      <div class="workflow-process-diagram">
        <div class="node node-start">
          <div class="node-content"></div>
        </div>
        <div class="node node-normal is-select">
          <div class="node-content">
            <span class="node-name">提交申请</span>
          </div>
        </div>
        <div class="node node-solt">
          <div class="node-content">
            <span class="node-name">Solt</span>
          </div>
        </div>
        <div class="node node-end">
          <div class="node-content"></div>
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="tabClickHandle">
        <el-tab-pane label="表单管理" name="model">
          <WorkFlowModel />
        </el-tab-pane>
        <el-tab-pane label="节点管理" name="nodes">
          <FlowNode />
        </el-tab-pane>
        <el-tab-pane label="任务管理" name="tasks">任务管理</el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 新增模型字段 -->
  </div>
</template>

<script>
import WorkFlowModel from "./components/model";
import FlowNode from "./components/node";

export default {
  name: "designWorkFlow",
  data() {
    return {
      activeName: "model",
      modelTableData: [],
      activities: [
        {
          content: "活动按期开始",
          timestamp: "2018-04-15"
        },
        {
          content: "通过审核",
          timestamp: "2018-04-13"
        },
        {
          content: "创建成功",
          timestamp: "2018-04-11"
        }
      ]
    };
  },
  methods: {
    tabClickHandle() {}
  },
  components: {
    WorkFlowModel,
    FlowNode
  }
};
</script>

<style lang="scss">
.workflow-process-diagram {
  border: 1px solid #8c8c8c;
  border-radius: 4px;
  margin: 15px;
  padding: 10px;
  min-height: 100px;
  display: flex;
  align-items: center;
  .node {
    display: inline-block;
    position: relative;
    padding: 10px;
    margin-right: 64px;
    
    &::after,
    &::before{
      position: absolute;
      content:"";
      top: 50%;
      left: 100%;
    }
    &::after{
      height: 2px;
      width: 84px;
      margin-left: -10px;
      margin-top: -1px;
      border:1px solid #8c8c8c;
      border-bottom-color: transparent;
    }
    &::before{
      margin-left: 67px;
      border: 6px solid transparent;
      border-left-color: #8c8c8c;
      width: 6px; height: 6px;
      margin-left: 68px;
      border: 4px solid transparent;
      border-left: 6px solid #8c8c8c;
      margin-top: -4px;
    }

    &:last-child{margin-right: 10px;}
    &:last-child::before,&:last-child:after{content: none;}
  }
  .node.is-select{
    outline: 1px dashed #727cf5;
  }
  .node .node-content {
    border-radius: 4px;
    border: 1px solid #ddd;
    padding: 10px;
    font-size: 12px;
  }
  .node-normal .node-content, .node-solt .node-content{
    height: 64px; min-width: 120px;
  }
  .node-start .node-content,.node-end .node-content{
    width: 32px; height: 32px;
    border-radius: 50%;
  }
  .node-end .node-content{border-width: 2px;}

}
</style>