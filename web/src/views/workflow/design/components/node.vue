<template>
  <div>

    <div>
      <el-button type="primary" size="mini" @click="dialogVisible = true">新增</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="节点类型" prop="type"></el-table-column>
      <el-table-column label="下一节点" prop="next.name"></el-table-column>
      <el-table-column label="办理时限" prop="expireIn"></el-table-column>
      <el-table-column label="成功判定条件" prop="condition"></el-table-column>
      <el-table-column label="操作">
         <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="update(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- Dialog 新增节点 -->
    <el-dialog
      :title="isEdit ? '编辑节点': '新增节点'"
      :visible.sync="dialogVisible"
      width="400px"
      size="small">
      
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
        <el-form-item label="上一结点:">
          <el-select v-model="form.prec" placeholder="请选择上一节点">
            <el-option v-for="item in nodeList"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
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
            :marks="{'-1':'不限制', 7:'7天', 15:'15天',30:'30天'}">
          </el-slider>
        </el-form-item>
        <el-form-item label="备注说明:">
          <el-input type="textarea" :rows="2" v-model="form.remark" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提 交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
      
    </el-dialog>
    
  </div>
</template>

<script>
export default {
  name: 'FlowNode',
  data() {
    return {
      loading: false,
      tableData:[],

      dialogVisible: false,
      isEdit: false,
      form:{
        type: 'normal',
        condition: 'all'
      },
      rules:{}
    }
  },
  methods: {
    submitForm(formName) {

    }
  },
  computed: {
    nodeList:{
      get: function () {
        let nodes = this.tableData.filter(item => {
          if(item.type !== 'end') {
            return item;
          }
        });
        return nodes;
      }
    }
  },
}
</script>

<style lang="scss">
  .el-slider{
    margin: 0 5px;
    .el-slider__runway{
      margin-bottom: 26px;
    }
    .el-slider__stop {
      background-color: #d0d9ec;
    }
    .el-slider__marks-text{
      font-size: 12px; margin-top: 12px; line-height: 20px;
      &:first-child{left: -10px !important;transform: translateX(0); }
      &:last-child{transform: translateX(0); right: -10px !important; left: auto !important;}
    }
  }
</style>