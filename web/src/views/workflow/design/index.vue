<template>
  <div class="page page-workflow_design">
    <el-card :body-style="{ padding: '0 15px' }">
      <el-tabs v-model="activeName" @tab-click="tabClickHandle">
        <el-tab-pane label="表单管理" name="model">
          <FlowModel />
        </el-tab-pane>
        <el-tab-pane label="流程设计" name="tasks">
          <div class="workflow-process-diagram">
            <div class="node node-start">
              <div class="node-content"></div>
            </div>
            <div class="node node-normal is-select" v-contextmenu:contextmenu>
              <div class="node-content">
                <span class="node-name">提交申请</span>
              </div>
            </div>
            <div class="node node-solt" v-contextmenu:contextmenu>
              <div class="node-content">
                <span class="node-name">Solt</span>
              </div>
            </div>
            <div class="node node-end" v-contextmenu:contextmenu>
              <div class="node-content"></div>
            </div>
            <div
              v-for="item in nodeList"
              :key="item._id"
              :class="['node','node-'+item.type]"
              v-contextmenu:contextmenu
              @click="nodeClickHandle(item)"
            >
              <div class="node-content">
                <span class="node-name">{{item.name}}</span>
              </div>
            </div>
          </div>
          <el-divider></el-divider>
          <div class="inline-title">
            <span>节点信息</span>
          </div>
          <el-row>
            <el-col :span="12">节点类型: {{selectedNode.type}}</el-col>
            <el-col :span="12">节点名称: {{selectedNode.name}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">完成条件: {{selectedNode.condition}}</el-col>
            <el-col :span="12">办理时限: {{selectedNode.expireIn}}</el-col>
          </el-row>
          <el-divider></el-divider>

          <div class="inline-title">
            <span>任务列表</span>
          </div>
          <div>
            <el-button type="primary" size="mini" @click="addTaskVisible = true">添加任务</el-button>
          </div>
          <el-table :data="tableData" stripe v-loading="loading">
            <el-table-column label="任务名称" prop="name"></el-table-column>
            <el-table-column label="任务类型" prop="type"></el-table-column>
            <el-table-column label="办理时限" prop="expireIn"></el-table-column>
            <el-table-column label="超时处理" prop="ifExpired"></el-table-column>
            <el-table-column label="任务分配" prop="ifExpired"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="update(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="remove(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 新增模型字段 -->
    <!-- Node ContextMenu -->
    <v-contextmenu ref="contextmenu" theme="dark">
      <v-contextmenu-item @click="dialogVisible = true">
        <i class="iconfont icon-plus-box-outline"></i> 添加节点
      </v-contextmenu-item>
      <v-contextmenu-item @click="addTaskVisible = true">
        <i class="iconfont icon-note-plus-outline"></i> 添加任务
      </v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item :disabled="selectedNode.type != 'normal'">
        <i class="iconfont icon-pencil-box-outline"></i> 编辑
      </v-contextmenu-item>
      <v-contextmenu-item :disabled="selectedNode.type != 'normal'">
        <i class="iconfont icon-trash"></i> 删除
      </v-contextmenu-item>
    </v-contextmenu>

    <!-- Dialog 新增节点 -->
    <el-dialog
      :title="isEdit ? '编辑节点': '新增节点'"
      :visible.sync="dialogVisible"
      width="400px"
      size="small"
    >
      <el-form :model="form" ref="form" size="small" label-width="90px">
        <el-form-item label="节点名称:">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="节点类型:">
          <el-select v-model="form.type" placeholder="请选择节点类型">
            <el-option label="普通节点" value="normal"></el-option>
            <el-option label="插槽" value="slot"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="判定条件:">
          <el-radio-group v-model="form.condition">
            <el-radio label="all">所有任务</el-radio>
            <el-radio label="one">任意一个任务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="办理时限:">
          <el-slider
            v-model="form.expireIn"
            :min="-1"
            :max="30"
            :marks="{'-1':'不限制', 7:'7天', 15:'15天',30:'30天'}"
          ></el-slider>
        </el-form-item>
        <el-form-item label="备注说明:">
          <el-input type="textarea" :rows="2" v-model="form.remark" placeholder></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提 交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- Dialog 添加任务 -->
    <el-dialog title="添加任务" :visible.sync="addTaskVisible" width="400px">
      <el-form :model="addTaskForm" ref="addTaskForm" label-width="80px">
        <el-form-item label="任务名称:" prop="name">
          <el-input v-model="addTaskForm.name"></el-input>
        </el-form-item>
        <el-form-item label="任务类型:">
          <el-select v-model="addTaskForm.type" placeholder="请选择任务类型">
            <el-option label="普通任务" value="normal"></el-option>
            <el-option label="系统服务" value="service"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务分配:">
          <el-select v-model="addTaskForm.roles" placeholder="请选择" multi>
            <el-option label="部门主管" value="normal"></el-option>
            <el-option label="财务" value="service"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="办理时限:">
          <el-slider
            v-model="addTaskForm.expireIn"
            :min="-1"
            :max="30"
            :marks="{'-1':'不限制', 7:'7天', 15:'15天',30:'30天'}"
          ></el-slider>
        </el-form-item>
        <el-form-item label="超时处理:">
          <el-radio-group v-model="addTaskForm.ifExpired">
            <el-radio label="fail">任务失败</el-radio>
            <el-radio label="success">任务成功</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addTaskVisible = false">取 消</el-button>
        <el-button type="primary">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FlowModel from "./components/model";

export default {
  name: "designWorkFlow",
  data() {
    return {
      activeName: "model",
      modelTableData: [],
      nodeList: [],
      selectedNode: {},
      dialogVisible: false,
      isEdit: false,
      form: {
        type: "normal",
        condition: "all"
      },
      rules: {},

      // 添加任务
      addTaskVisible: false,
      addTaskForm: {},
      addTaskRules: {}
    };
  },
  methods: {
    tabClickHandle() {},
    nodeClickHandle(node) {
      this.selectedNode = node;
    }
  },
  components: {
    FlowModel
  }
};
</script>

<style lang="scss">
.workflow-process-diagram {
  border: 1px solid #8c8c8c;
  border-radius: 4px;
  margin: 15px 0;
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
    &::before {
      position: absolute;
      content: "";
      top: 50%;
      left: 100%;
    }
    &::after {
      height: 2px;
      width: 84px;
      margin-left: -10px;
      margin-top: -1px;
      border: 1px solid #8c8c8c;
      border-bottom-color: transparent;
    }
    &::before {
      margin-left: 67px;
      border: 6px solid transparent;
      border-left-color: #8c8c8c;
      width: 6px;
      height: 6px;
      margin-left: 68px;
      border: 4px solid transparent;
      border-left: 6px solid #8c8c8c;
      margin-top: -4px;
    }

    &:last-child {
      margin-right: 10px;
    }
    &:last-child::before,
    &:last-child:after {
      content: none;
    }
  }
  .node.is-select {
    outline: 1px dashed #727cf5;
  }
  .node .node-content {
    border-radius: 4px;
    border: 1px solid #ddd;
    padding: 10px;
    font-size: 12px;
  }
  .node-normal .node-content,
  .node-solt .node-content {
    height: 64px;
    min-width: 120px;
  }
  .node-start .node-content,
  .node-end .node-content {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  .node-end .node-content {
    border-width: 2px;
  }
}

.el-slider {
  margin: 0 5px;
  .el-slider__runway {
    margin-bottom: 26px;
  }
  .el-slider__stop {
    background-color: #d0d9ec;
  }
  .el-slider__marks-text {
    font-size: 12px;
    margin-top: 12px;
    line-height: 20px;
    &:first-child {
      left: -10px !important;
      transform: translateX(0);
    }
    &:last-child {
      transform: translateX(0);
      right: -10px !important;
      left: auto !important;
    }
  }
}
</style>