<template>
  <div class="layout">
    <div class="layout-header">
      <div class="header">
        <a class="logo" href="/">
          <img src="@/assets/logo.png" alt />
        </a>
      </div>
    </div>
    <div class="layout-main">
      <div class="page page-team__register">
        <el-row>
          <el-col :span="16" :offset="4" class="mt-5 mb-5">
            <el-card :body-style="{ padding: '10px 32px' }">
              <div slot="header">
                <span>团队注册</span>
              </div>
              <!-- card body -->
              <el-form
                :model="form"
                :rules="rules"
                ref="form"
                label-width="120px"
                size="small"
                label-position="left"
              >
                <fieldset>
                  <legend>团队信息</legend>
                  <el-form-item label="团队名称:" prop="name">
                    <el-input v-model="form.name" placeholder></el-input>
                  </el-form-item>
                  <el-form-item label="简介:" prop="remark">
                    <el-input type="textarea" :rows="2" v-model="form.remark" placeholder=""></el-input>
                  </el-form-item>
                </fieldset>
                <fieldset>
                  <legend>管理员信息</legend>
                  <el-form-item label="管理员姓名：" prop="manager_name">
                    <el-input v-model="form.manager_name" placeholder></el-input>
                  </el-form-item>
                  <el-form-item label="管理员手机号：" prop="manager_mobile">
                    <el-input v-model="form.manager_mobile" placeholder></el-input>
                  </el-form-item>
                  <el-form-item label="管理员密码:" prop="manager_password">
                    <el-input v-model="form.manager_password" placeholder></el-input>
                  </el-form-item>
                  <el-form-item label="密码确认:" prop="manager_confirmPass">
                    <el-input v-model="form.manager_confirmPass" placeholder></el-input>
                  </el-form-item>
                </fieldset>

                <el-form-item>
                  <el-button size="small" type="primary" @click="submitForm('form')">注 册</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "teamRegister",
  data() {
    return {
      form: {},
      rules: {
        name:[{required: true, message:'请输入团队名称',trigger:'blur'}],
        manager_name:[{required: true, message:'请输入管理员姓名',trigger:'blur'}],
        manager_mobile:[{required: true, message:'请输入管理员手机号',trigger:'blur'}],
        manager_password:[{required: true, message:'请输入管理员登录密码',trigger:'blur'}],
        manager_confirmPass:[{required: true, message:'请再次输入管理密码',trigger:'blur'}],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.team.create(this.form).then(res => {

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss">
.page-team__register {
  fieldset {
    border: 0;
    padding: 15px 0;
    border-bottom: 1px solid #efefef;
    margin-bottom: 20px;
    legend {
      font-size: 15px;
      line-height: 22px;
      color: #000;
    }
  }
  fieldset:last-child{border: none;}
}
</style>