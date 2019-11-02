<template>
  <div class="page page-workflow_design">
    <el-card :body-style="{ padding: '0 15px' }">
      <el-tabs v-model="activeName" @tab-click="tabClickHandle">
        <el-tab-pane label="表单管理" name="model">
          <FlowModel />
        </el-tab-pane>
        <el-tab-pane label="流程设计" name="tasks">
          <el-scrollbar
            :native="false"
            wrapClass="diagram-scroll-wrap"
            viewClass="diagram-scroll-view"
            class="diagram-scroll-bar"
          >
            <div class="workflow-process-diagram">
              <div
                v-for="item in sortedNodeList"
                :key="item._id"
                :class="['node','node-'+item.type,{'is-select':item._id == selectedNode._id}]"
                @click="nodeClickHandle(item)"
              >
                <div class="node-content" v-if="item.type == 'end'">
                  <span class="node-name">{{item.name}}</span>
                </div>
                <div class="node-content" v-else v-contextmenu:contextmenu>
                  <div class="node-icon" v-if="item.type == 'normal'">
                    <i class="iconfont icon-package-variant-closed"></i>
                  </div>
                  <div class="node-icon" v-if="item.type == 'slot'">
                    <i class="iconfont icon-package-variant"></i>
                  </div>
                  <span class="node-name">{{item.name}}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
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

          <div v-if="selectedNode.type == 'normal'">
          <div class="inline-title">
            <span>任务列表</span>
          </div>
          <div>
            <el-button type="primary" size="mini" @click="addTask">添加任务</el-button>
          </div>
          <el-table :data="taskList" stripe v-loading="loading" size="mini">
            <el-table-column label="任务名称" prop="name"></el-table-column>
            <el-table-column label="任务类型" prop="type"></el-table-column>
            <el-table-column label="办理时限" prop="expireIn"></el-table-column>
            <el-table-column label="超时处理" prop="ifExpired"></el-table-column>
            <el-table-column label="办理人" prop="users"></el-table-column>
            <el-table-column label="办理角色" prop="roles"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="assignTaskRoleVisible = true">ASSIGN</el-button>
                <el-button type="primary" size="mini" @click="updateTask(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="removeTask(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- Node ContextMenu -->
    <v-contextmenu ref="contextmenu" theme="dark" event-type="click">
      <v-contextmenu-item
        @click="menuItemClickHandle"
        key="addNode"
        :disabled="selectedNode.type == 'end'"
      >
        <i class="iconfont icon-plus-box-outline"></i> 添加节点
      </v-contextmenu-item>
      <v-contextmenu-item
        @click="menuItemClickHandle"
        key="addTask"
        :disabled="['start','slot','end'].includes(selectedNode.type)"
      >
        <i class="iconfont icon-note-plus-outline"></i> 添加任务
      </v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item
        @click="menuItemClickHandle"
        key="editNode"
        :disabled="['start','end'].includes(selectedNode.type)"
      >
        <i class="iconfont icon-pencil-box-outline"></i> 编辑
      </v-contextmenu-item>
      <v-contextmenu-item
        @click="menuItemClickHandle"
        key="removeNode"
        :disabled="['start','end'].includes(selectedNode.type)"
      >
        <i class="iconfont icon-trash"></i> 删除
      </v-contextmenu-item>
    </v-contextmenu>

    <!-- Dialog 新增节点 -->
    <el-dialog
      :title="isEditNode ? '编辑节点': '新增节点'"
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
        <el-form-item label="判定条件:" v-if="form.type == 'normal'">
          <el-radio-group v-model="form.condition">
            <el-radio label="all">所有任务</el-radio>
            <el-radio label="one">任意一个任务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="办理时限:" v-if="form.type == 'normal'">
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
          <el-button type="primary" @click="submitNodeForm('form')">提 交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- Dialog 添加任务 -->
    <el-dialog 
      :title="isEditTask ? '编辑任务' :'添加任务'" :visible.sync="taskDialogVisible" width="400px">
      <el-form :model="taskForm" :rules="taskRules" ref="taskForm" label-width="80px">
        <el-form-item label="任务名称:" prop="name">
          <el-input v-model="taskForm.name"></el-input>
        </el-form-item>
        <el-form-item label="任务类型:">
          <el-select v-model="taskForm.type" placeholder="请选择任务类型">
            <el-option label="普通任务" value="normal"></el-option>
            <el-option label="系统服务" value="service"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="办理时限:">
          <el-slider
            v-model="taskForm.expireIn"
            :min="-1"
            :max="30"
            :marks="{'-1':'不限制', 7:'7天', 15:'15天',30:'30天'}"
          ></el-slider>
        </el-form-item>
        <el-form-item label="超时处理:">
          <el-radio-group v-model="taskForm.ifExpired">
            <el-radio label="fail">任务失败</el-radio>
            <el-radio label="success">任务成功</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="taskDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTaskForm('taskForm')">提 交</el-button>
      </span>
    </el-dialog>

    <!-- Dialog 任务分配 - 指定角色 -->
    <el-dialog
      title="任务分配"
      :visible.sync="assignTaskRoleVisible"
      width="540px">
      <el-transfer
        v-model="taskForm.roles"
        :titles="['角色', '已分配']"
        :data="roleList">
      </el-transfer>
      <span slot="footer">
        <el-button @click="assignTaskRoleVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
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
      flowId: this.$router.currentRoute.params._id,
      activeName: "model",
      modelTableData: [],
      nodeList: [],
      contextmenuNode: {},
      selectedNode: {},
      dialogVisible: false,
      isEditNode: false,
      form: {
        type: "normal",
        condition: "all"
      },
      rules: {},

      // 添加任务
      isEditTask: false,
      taskDialogVisible: false,
      taskForm: {},
      taskRules: {},

      taskList: [],
      loading: false,

      assignTaskRoleVisible: false,
      roleList:[],
    };
  },
  methods: {
    tabClickHandle() {},
    nodeClickHandle(node) {
      this.selectedNode = node;
      this.getNodeTasks();
    },
    // menuItemClick
    menuItemClickHandle(vm, event) {
      switch (vm.$vnode.key) {
        case "addNode":
          this.form.node = this.selectedNode._id;
          this.form.flow = this.flowId;

          this.isEditNode = false;
          this.dialogVisible = true;
          break;
        case "addTask":
          this.addTask();
          break;
        case "editNode":
          this.form = this.selectedNode;
          this.isEditNode = true;
          this.dialogVisible = true;
          break;
        case "removeNode":
          this.$confirm("此操作将永久删除该环节, 是否继续?", "提示", {
            type: "warning"
          }).then(() => {
            this.$api.workflow.removeNode(this.selectedNode._id).then(res => {
              this.$message({ type: "success", message: "已删除!" });
              this.getNodeList();
            })
            .catch(e => {
              this.$message({ type: "error", message: "删除失败!" });
            });
          });
          break;
        default:
          break;
      }
    },
    getNodeList() {
      this.$api.workflow.getNodeList({ flow: this.flowId }).then(res => {
        console.log(res);
        this.nodeList = res.data.list;
      });
    },
    addTask() {
      if (this.selectedNode && this.selectedNode._id) {
        this.taskForm.flow = this.flowId;
        this.taskForm.node = this.selectedNode._id;

        this.isEditTask = false;
        this.taskDialogVisible = true;
      } else {
        this.$message({type:'warning',message:'请选择环节!'})
      }
    },
    // 编辑任务
    updateTask(row) {
      this.isEditTask = true;
      this.taskForm = row;

      this.taskDialogVisible = true;
    },
    // 删除任务
    removeTask(row) {
      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.workflow.removeTask(row._id).then(res => {
          this.$message({ type: "success", message: "已删除!" });
          this.getNodeTasks();
        })
        .catch(e => {
          this.$message({ type: "error", message: "删除失败!" });
        });
      });
    },
    getNodeTasks() {
      this.$api.workflow
        .getNodeTasks({ flow: this.flowId, node: this.selectedNode._id })
        .then(res => {
          this.taskList = res.data.list;
        });
    },
    submitNodeForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditNode) {
            this.$api.workflow.updateNode(this.form._id, this.form).then(res => {
                this.getNodeList();
                this.dialogVisible = false;
                this.$message({ type: "success", message: "更新节点成功!" });
              })
              .catch(e => {
                this.$message({ type: "error", message: "更新节点失败!" });
              });
          } else {
            this.$api.workflow
              .createNode(this.form)
              .then(res => {
                console.log(res);
                this.getNodeList();
                this.dialogVisible = false;
                this.$message({ type: "success", message: "新增节点成功!" });
              })
              .catch(e => {
                this.$message({ type: "error", message: "新增节点失败!" });
              });
          }
        } else {
          return false;
        }
      });
    },
    submitTaskForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditTask) {
            this.$api.workflow
              .updateTask(this.taskForm._id,this.taskForm)
              .then(res => {
                console.log(res);
                this.getNodeTasks();
                this.dialogVisible = false;
                this.$message({ type: "success", message: "已更新!" });
              })
              .catch(e => {
                this.$message({ type: "error", message: "更新失败!" });
              });
          } else {
            this.$api.workflow
              .createTask(this.taskForm)
              .then(res => {
                console.log(res);
                this.getNodeTasks();
                this.dialogVisible = false;
                this.$message({ type: "success", message: "新增任务成功!" });
              })
              .catch(e => {
                this.$message({ type: "error", message: "新增任务失败!" });
              });
          }
        } else {
          return false;
        }
      });
    }
  },
  components: {
    FlowModel
  },
  computed: {
    sortedNodeList: {
      get() {
        let list = [];
        let tmpArr = this.nodeList.filter(item => item.type == "start");
        if (tmpArr.length == 0) {
          return list;
        }

        let start = tmpArr[0];
        list.push(start);
        
        this.selectedNode = start;

        function pushNext(next, nodeList) {
          if (next) {
            for (var i = 0; i < nodeList.length; i++) {
              let node = nodeList[i];
              if (node._id == next) {
                list.push(node);
                pushNext(node.next, nodeList);
                break;
              }
            }
          }
        }

        pushNext(start.next, this.nodeList);
        return list;
      }
    }
  },
  mounted() {
    this.getNodeList();
  }
};
</script>

<style lang="scss">
.diagram-scroll-bar {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 15px 0;
}
.diagram-scroll-wrap {
  overflow-y: hidden;
}
.workflow-process-diagram {
  padding: 32px 10px;
  white-space: nowrap;

  .node {
    display: inline-block;
    position: relative;
    padding: 5px;
    margin-right: 50px;
    vertical-align: middle;

    &::after,
    &::before {
      position: absolute;
      content: "";
      top: 50%;
      left: 100%;
    }
    &::after {
      height: 2px;
      width: 55px;
      margin-left: -5px;
      margin-top: -1px;
      border: 1px solid #8c8c8c;
      border-bottom-color: transparent;
    }
    &::before {
      border: 6px solid transparent;
      border-left-color: #8c8c8c;
      width: 6px;
      height: 6px;
      margin-left: 50px;
      border: 4px solid transparent;
      border-left: 6px solid #8c8c8c;
      margin-top: -4px;
    }

    &:last-child {
      margin-right: 30px;
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
    border: 1px solid #8c8c8c;
    padding: 5px;
    font-size: 12px;
    cursor: pointer;
  }
  .node .node-name {
    padding-left: 20px;
    line-height: 20px;
    display: block;
  }
  .node .node-icon {
    color: #8c8c8c;
    line-height: 20px;
    float: left;
  }
  .node-normal .node-content,
  .node-slot .node-content {
    height: 64px;
    min-width: 120px;
  }
  .node-start .node-content,
  .node-end .node-content {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    .node-name {
      display: none;
    }
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