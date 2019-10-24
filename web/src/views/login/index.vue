<template>
  <div class="page page-login">
    <div class="login-mask"></div>
    <el-card class="loginBox">
      <el-container class="login-area">
        <el-header>
          <el-row type="flex" align="middle">
            <el-col :span="14">
              <a class="login-logo-area">
                <img alt="Vue logo" class="login-logo" src="@/assets/logo-large.png" />
              </a>
            </el-col>
            <el-col :span="10">
              <h1>高德纳系统管理后台</h1>
            </el-col>
          </el-row>
        </el-header>

        <el-main class="loginBox__container">
          <el-row type="flex" align="middle">
            <el-col :span="14" class="loginBox-left">
              <img src="@/assets/login_pic.png" />
            </el-col>
            <el-col :span="10">
              <el-form
                class="login-form"
                ref="loginForm"
                :rules="rules"
                :model="form"
                size="middle">
                <el-form-item label="账号" prop="username">
                  <el-input v-model="form.username" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <router-link to="/find-pass" class="reset-pass">Forgot Password？</router-link>
                  <el-input v-model="form.password" show-password clearable></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="verifyCode">
                  <el-input
                    placeholder="请输入验证码"
                    v-model="form.verifyCode">
                    <div slot="suffix" class="verify-box" @click="getVerifyCode">
                      <img :src="verifyCodeImg"/>
                    </div>
                  </el-input>
                </el-form-item>
                <el-form-item style="text-align: center;">
                  <el-button type="primary" @click="submitForm('loginForm')" style="width:100%;">登 录</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-main>

        <el-footer height>
          <!-- Footer content -->
          <p class="copyright">@copyright 2019</p>
          <router-link to="#">隐私政策</router-link>
          <router-link to="#">用户服务协议</router-link>
        </el-footer>
      </el-container>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'loginPage',
  data() {
    var verifyCodeValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else if (value !== this.$cookies.get('captcha')) {
        callback(new Error('验证码无效!'));
      } else {
        callback();
      }
    };
    return {
      verifyCodeImg: '',
      form: {
        username: "",
        password: "",
        verifyCode:""
      },
      // 表单验证规则
      rules: {
        username: [{ required: true, message: "请输入登录账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
        verifyCode: [{ validator: verifyCodeValidator, trigger: 'blur' }]
      }
    };
  },
  methods: {
    getUserInfo() {
      this.$api.auth.getUserInfo(localStorage.getItem('userId')).then(res=> {
        console.log(res);
      });
    },
    getVerifyCode() {
      this.form.verifyCode = '';
      this.verifyCodeImg = '/auth/getCaptcha?' + Date.now();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.auth.doLogin(this.form).then(res=>{
            console.log(res);
            const {token, expire_in, refresh_token,userId} = res.data; 
            this.$store.dispatch('auth/updateTokens', {token, refresh_token});
            this.$store.dispatch('user/updateUserId',userId);
            this.$router.replace({
              path: '/'
            });
          }).catch(err => {
            console.log(err);
            this.getVerifyCode();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
 
  },
  mounted() {
    this.getVerifyCode();
  }
};
</script>
<style lang="scss">
  .page-login {
    position: absolute;
    top: 0;left: 0;
    height: 100%;width: 100%;
    background: url("../../assets/login_bg.jpg") center;
    background-size: cover;
    .el-main,.el-header{background: initial;}
  }
  .login-mask {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to top,
      rgb(12, 57, 139),
      rgb(52, 114, 206) 10%,
      rgb(237, 246, 255) 50%,
      white
    );
    opacity: 0.78;
    position: absolute;
  }
  .loginBox {
    position: relative;
    margin: auto;
    max-width: 800px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    top: 50%;
    transform: translateY(-50%);

    .loginBox__container {
      display: flex;
    }
    .loginBox-main {
      flex: 1 1 auto;
      width: 300px;
    }
    .loginBox-left {
      flex: 1;
      img {
        object-fit: contain;
        width: 100%;
      }
    }
    h2 {
      font-size: 16px;
      font-weight: normal;
      margin-bottom: 15px;
      margin-bottom: 20px;
    }

    .login-logo-area {
      display: block;
      margin-left: -10px;
      .login-logo {
        height: 48px;
      }
    }

    .el-link,
    a {
      margin-left: 10px;
      font-size: 12px;
      text-decoration: none;
      color: #409eff;
    }
    p {
      display: inline-block;
      font-size: 12px;
    }
    .el-footer {
    }

    .el-main {
      margin-bottom: 0;
    }
  }

  .login-form {
    label {
      line-height: 26px;
    }
  }
  .reset-pass {line-height: 26px; display: inline-block; float: right;}
  .verify-box {
    padding: 3px 0; height: 100%; cursor: pointer;
    img {height: 100%;}
  }
</style>