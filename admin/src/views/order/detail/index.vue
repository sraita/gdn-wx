<template>
  <div class="app-container">
    <el-card :body-style="{ padding: '10px' }" class="top-card">
      <div slot="header" class="flex-box">
        <div class="top-info">
          <span>订单号: {{order.sn}}</span>
          <el-divider direction="vertical"></el-divider>
          <span>下单时间：{{order.create_time | parseTime}}</span>
          <el-divider direction="vertical"></el-divider>
          <span :class="['order-type', 'order-type_'+order.type]">{{order.type==='normal'?'普通订单':'特殊订单'}}</span>
        </div>
        <div class="el-card_toolbox">
          <el-button v-if="order.process_code === 'order-taking'" type="primary" plain size="small">接单</el-button>
          <el-button v-if="order.process_code === 'match-translator'" type="primary" plain size="small">匹配议员</el-button>
        </div>
      </div>
      <div class="flex-box">
          <div class="order-info">
            <h2 class="order-status">{{order.process_code | currentProgress}}</h2>
            <dl>
              <dd class="clearfix">
                <span class="label">项目类型：</span>
                <div class="info_container">{{order.meeting_type | projectType}}</div>
              </dd>
              <dd class="clearfix">
                <span class="label">翻译类型：</span>
                <div class="info_container">{{order.trans_type | transType}}</div>
              </dd>
              <dd class="clearfix">
                <span class="label">议员：</span>
                <div class="info_container">未匹配</div>
              </dd>
              <dd class="clearfix">
                <span class="label">备注：</span>
                <div class="info_container"><无></div>
              </dd>
            </dl>
          </div>

          <el-steps :active="1" align-center>
            <el-step v-for="(item,index) in steps" :key="index" :title="item.name">
              <svg-icon :icon-class="item.icon" slot="icon"/>
            </el-step>
          </el-steps>
      </div>
      
    </el-card>

    <el-card :body-style="{ padding: '15px 30px' }" class="mt-15">
      <el-row :gutter="10">
        <el-col :span="8">
          <dl>
            <dt>客户信息</dt>
            <dd class="clearfix">
              <span class="label">所属团队：</span>
              <!-- <div class="info_container">{{order.team.name}}</div> -->
            </dd>
            <dd class="clearfix">
              <span class="label">联系人：</span>
              <div class="info_container">{{order.contact_name}}</div>
            </dd>
            <dd class="clearfix">
              <span class="label">联系电话：</span>
              <div class="info_container">{{order.contact_tel}}</div>
            </dd>
          </dl>
        </el-col>
        <el-col :span="8">
          <dl>
            <dt>会议信息</dt>
            <dd class="clearfix">
              <span class="label">分析师：</span>
              <div class="info_container">{{order.meeting_analyst}}</div>
            </dd>
            <dd class="clearfix">
              <span class="label">会议主题：</span>
              <div class="info_container">{{order.meeting_subject}}</div>
            </dd>
            <dd class="clearfix">
              <span class="label">会议地点：</span>
              <div class="info_container">{{order.meeting_address}}</div>
            </dd>
            <dd class="clearfix">
              <span class="label">会议日期：</span>
              <div class="info_container">
                {{order.meeting_date | parseTime('{y}-{m}-{d}')}} {{order.meeting_time | getAmpmString}}
              </div>
            </dd>
            <dd class="clearfix">
              <span class="label">翻译类型：</span>
              <div class="info_container">{{order.trans_type}}</div>
            </dd>
            <dd class="clearfix">
              <span class="label">项目类型：</span>
              <div class="info_container">{{order.meeting_type}}</div>
            </dd>
          </dl>
        </el-col>
        <el-col :span="8">
          <dl>
            <dt>译员信息</dt>
            <dd class="clearfix">
              <span class="label">姓名：</span>
              <div class="info_container"></div>
            </dd>
            <dd class="clearfix">
              <span class="label">联系电话：</span>
              <div class="info_container"></div>
            </dd>
            <dd class="clearfix">
              <span class="label">联系邮箱：</span>
              <div class="info_container"></div>
            </dd>
            <dd class="clearfix">
              <span class="label">QQ：</span>
              <div class="info_container"></div>
            </dd>
            <dd class="clearfix">
              <span class="label">微信：</span>
              <div class="info_container"></div>
            </dd>
          </dl>
        </el-col>
      </el-row>
      
    </el-card>
    
  </div>
</template>


<script>
  import {getOrderInfo} from '@/api/order'
  export default {
    name: 'orderDetail',
    filters: {
      currentProgress(value) {
        let processMap = new Map([
          ['pv-approval','  PV 审批'],
          ['submit-order', '提交订单'],
          ['order-taking', '唐能翻译接单'],
          ['predict-price', '唐能预估价格'],
          ['match-translator', '匹配议员'],
          ['confirm-service', '确认服务信息'],
          ['confirm-order', '完成']
        ]);
        return processMap.get(value);
      },
      transType(value) {
        let TRANS_TYPE = {
          en: "英语",
          zh_Yue: "粤语"
        };
        return TRANS_TYPE[value];
      },
      projectType(value) {
        let PROJECT_TYPE = {
          onsite_meeting: "Onside Meeting",
          inquiry: "Inquiry"
        };
        return PROJECT_TYPE[value];
      }
    },
    data() {
      return {
        order: {}
      }
    },
    methods: {
      fetchData() {
        getOrderInfo(this._id).then(res => {
          this.order = res.data;
        });
      }
    },
    computed: {
      _id() {
        return this.$route.params._id;
      },
      steps() {
        let {type, meeting_type} = this.order;
        let arr = [];
        if (type === 'normal' && meeting_type === 'inquiry') { // 电话会议
          arr =  [
            {code: 'submit-order', name: '提交订单', icon: 'submit-order'},
            {code: 'order-taking', name: '唐能翻译接单', icon: 'accept-order'},
            {code: 'match-translator', name: '匹配议员', icon: 'trans'},
            {code: 'confirm-service', name: '确认服务信息', icon: 'confirm-order'},
            {code: 'confirm-order', name: '完成', icon: 'done-circle'}
          ]
        } else if (type === 'normal' && meeting_type === 'onsite_meeting') {
          arr =  [
            {code: 'submit-order', name: '提交订单', icon: 'submit-order'},
            {code: 'pv-approval', name: 'PV 审批', icon: 'shenpi'},
            {code: 'order-taking', name: '唐能翻译接单', icon: 'accept-order'},
            {code: 'match-translator', name: '匹配议员', icon: 'trans'},
            {code: 'confirm-service', name: '确认服务信息', icon: 'confirm-order'},
            {code: 'confirm-order', name: '完成', icon: 'done-circle'}
          ]
        } else if (type === 'special') {
          arr = [
            {code: 'submit-order', name: '提交订单', icon: 'submit-order'},
            {code: 'order-taking', name: '唐能翻译接单', icon: 'accept-order'},
            {code: 'predict-price', name: '唐能预估价格', icon: 'accept-order'},
            {code: 'match-translator', name: '匹配议员', icon: 'trans'},
            {code: 'confirm-service', name: '确认服务信息', icon: 'confirm-order'},
            {code: 'pv-approval', name: 'PV 审批', icon: 'shenpi'},
            {code: 'confirm-order', name: '完成', icon: 'done-circle'}
          ]
        }
        return arr;
      }
    },
    mounted() {
      this.fetchData();
    },
  }
</script>

<style lang="scss" scoped>
  .top-card /deep/{
    .el-card__header {
      padding:10px;
    }
    .top-info {
      span { font-size: 14px;}
      .order-type{
        position: relative;
        padding-left: 15px;
        &::after{
          position: absolute;
          content: "";
          width: 6px;
          height: 6px;
          left: 0;
          top: 50%;
          margin-top: -4px;
          border-radius: 50%;
          background-color: #2294ff;
        }
        &.order-type_normal::after {
          background-color: #2294ff;
        }
        &.order-type_special::after {
          background-color: #F56C6C;
        }
      }
    }
    .flex-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .order-info {
        padding: 0 15px;
        width: 320px;
        .order-status{
          margin: 0;
          font-size: 20px;
          font-weight: normal;
        }
      }
      .el-steps {
        flex: auto;
      }
      .el-step__icon.is-text {
        border: 0;
        border-radius: 0;
        font-size: 24px;
        width: 40px;
      }
    }  
  }

  dl {
    dt{
      font-size: 16px;
      margin-bottom: 15px;
    }
    dd {
      margin-left: 0;
      font-size: 14px;
      line-height: 2;
      .label {
        float: left;
        width: 90px;
      }
    }
  }
</style>