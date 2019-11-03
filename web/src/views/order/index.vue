<template>
  <div class="page page-order">
    <el-card :body-style="{ padding: '10px' }">
      <div slot="header">
        <span>订单管理</span>
      </div>
      <!-- card body -->
      <el-table :data="tableData" stripe size="mini">
        <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="会议主题">
            <span>{{ props.row.meeting.subject }}</span>
          </el-form-item>
          <el-form-item label="分析师">
            <span>{{ props.row.meeting.analyst }}</span>
          </el-form-item>
          <el-form-item label="会议时间">
            <span>{{ props.row.meeting.time }}</span>
          </el-form-item>
          <el-form-item label="会议地点">
            <span>{{ props.row.meeting.address }}</span>
          </el-form-item>
          <el-form-item label="项目特殊性">
            <span>{{ props.row.meeting.remark }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
        <el-table-column  label="下单时间" prop="createAt" width="120"></el-table-column>
        <el-table-column  label="下单用户" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.user.name }}</span>
            <p>{{scope.row.user.mobile}}</p>
          </template>
        </el-table-column>
        <el-table-column  label="所属团队" prop="team.name" show-overflow-tooltip	></el-table-column>
        <el-table-column  label="订单类型" prop="type" :formatter="typeFormatter"></el-table-column>
        <el-table-column  label="翻译类型" prop="language" :formatter="languageFormatter"></el-table-column>
        <el-table-column  label="译员" prop="translator.name"></el-table-column>
        <el-table-column  label="状态" prop="status">
          <template slot-scope="scope">
            <el-tag size="mini" :type="getStatusType(scope.row.status)">{{getStatusText(scope.row.status)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column  label="备注" prop="remark"></el-table-column>
        <el-table-column  label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="text-info" @click="viewDetail(scope.row)">查看</el-button>
            <el-button type="text" size="mini" class="text-primary">审批</el-button>
            <el-button type="text" size="mini" class="text-primary">匹配译员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- Dialog: 查看订单详细信息 -->
    <el-dialog
      title="订单详情"
      :visible.sync="dialogVisible"
      width="70%">
      
    </el-dialog>
    
  </div>
</template>

<script>
export default {
  name: 'order',
  data() {
    return {
      dialogVisible:false,
      currentRow:null,
      tableData:[
        {
          createAt: '2019-11-02 11:30',
          user:{
            name: '张三',
            mobile: '13388787867'
          },
          team:{
            name:'测试团队'
          },
          type: 1,
          status: 1,
          language: 'zh-yue',
          meeting:{
            subject: '关于学XXX的会议',
            analyst: '首席分析师',
            time:'2019-11-02 11:30',
            address: '云南省昆明市市政府2号会议厅',
            remark: '<无>'
          },
          translator:{
            name: '[粤] 唐唐'
          },
          remark:'<无>'
        }
      ]
    }
  },
  methods: {
    typeFormatter(row, column) {
      if (row.type == '1') {
        return '普通订单'
      } else {
        return '特殊订单'
      }
    },
    languageFormatter(row, column) {
      let lang = '';
      switch (row.language ) {
        case 'zh-yue':
          lang = '粤语';
          break;
        case 'en':
          lang = '英语';
          break;
        default:
          break;
      }
      return lang;
    },
    getStatusText(status) {
      let txt = '';
      switch(status) {
        case 1:
          txt = '审批中';
          break;
        default:
          break;
      }
      return txt;
    },
    getStatusType(status) {
      let type = ''
      switch(status) {
        case 1:
          type = 'warning';
          break;
        default:
          break;
      }
      return type;
    },
    viewDetail(row) {
      this.currentRow = row;
      this.dialogVisible = true;
    }
  },
}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>