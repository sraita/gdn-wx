<template>
  <div class="page page-system-initialize">
    <div class="checking-init-state" v-if="checking">正在检查初始化状态</div>
    <div v-else>
      <div v-if="initialized" class="system-initialized">系统已完成初始化！</div>
      <div v-else>
        <el-card
          :body-style="{ padding: '10px' }"
          :style="{width: '450px'}"
          class="p-3 text-center"
        >
          <!-- Logo -->
          <div class="auth-brand text-center text-lg-left">
            <a href="index.html">
              <span>
                <img src="@/assets/logo-large.png" alt height="32" />
              </span>
            </a>
          </div>
          <div v-if="initializing" class="mt-2 text-left">
            <h3 class="init-title">正在初始化</h3>
            <div class="init-message mt-2">{{message}}</div>
          </div>
          <div v-else>
            <el-form
              :model="form"
              ref="form"
              :rules="rules"
              size="small"
              label-width="90px"
              label-position="left"
            >
              <fieldset>
                <legend>系统信息设置</legend>
                <el-form-item label="系统名称:" prop="system_name">
                  <el-input v-model="form.system_name" placeholder="请输入系统名称"></el-input>
                </el-form-item>
                <el-form-item label="系统简介:" prop="system_remark">
                  <el-input
                    type="textarea"
                    :rows="2"
                    v-model="form.system_remark"
                    placeholder="请输入系统简介"
                  ></el-input>
                </el-form-item>
              </fieldset>
              <fieldset>
                <legend>初始化管理员账号</legend>
                <el-form-item label="账号:" prop="username">
                  <el-input v-model="form.username" placeholder type="text"></el-input>
                </el-form-item>
                <el-form-item label="姓名:" prop="name">
                  <el-input v-model="form.name" placeholder type="text"></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                  <el-input v-model="form.password" placeholder type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码:" prop="confirm_pass">
                  <el-input v-model="form.confirm_pass" placeholder type="password"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('form')">初始化</el-button>
                </el-form-item>
              </fieldset>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { checkPassStrong } from "@/utils/validate";
export default {
  name: "systemInitialize",
  data() {
    var userPassVerify = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (checkPassStrong(value) < 2) {
        callback(new Error("密码为6~18个字符，且为数字和字母组合"));
      } else {
        callback();
      }
    };
    var confirmPassVerify = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      form: {
        system_name: "",
        system_remark: "",
        username: "",
        name: "",
        password: "",
        confirm_pass: ""
      },
      rules: {
        system_name: [
          { required: true, message: "请输入系统名称", trigger: "blur" }
        ],
        system_remark: [
          { required: true, message: "请输入系统简介", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入管理员账号", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入管理员姓名", trigger: "blur" }
        ],
        password: [
          { validator: userPassVerify, trigger: "blur" },
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        confirm_pass: [
          { validator: confirmPassVerify, trigger: "blur" },
          { required: true, message: "请再次输入密码", trigger: "blur" }
        ]
      },
      checking: true, // 正在检查初始化状态
      initialized: false, // 是否已初始化
      initializing: false, // 正在初始化？
      message: ""
    };
  },
  methods: {
    checkInitState() {
      const that = this;
      this.checking = true;
      this.$api.system
        .checkSysInitState()
        .then(res => {
          this.initialized = res.data.initialized;
        })
        .catch(err => {
          this.$alert("初始化状态检查出错，请刷新重试！", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              window.reload;
            }
          });
        })
        .finally(() => {
          setTimeout(function() {
            that.checking = false;
          }, 500);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.initializing = true;
            this.message = "正在校验解锁码...";
            let {value:sysPass} = await this.$prompt("请输入系统解锁密码", "提示", {
              type: 'warning',
              inputType:'password',
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            });
            await this.$api.system.verifySysPass({password:sysPass});
            this.message = "正在初始化系统资源...";
            await this.$api.system.initSysResources();
            this.message = "正在初始化系统角色信息...";
            await this.$api.system.initSysRoles();
            this.message = "正在创建系统管理员...";
            await this.$api.system.initSysAdmin(this.form)
          } catch (err) {
            this.$message({
              type: "error",
              message: "系统初始化失败！原因是:" + err.message
            });
          } finally {
            debugger;
            this.message = "";
            this.initializing = false;
            this.initialized = true;
            let msg = `<h5>系统初始化成功!</h5>
                        <p>管理员账号: ${this.form.username}</p>
                        <p>管理员密码: ${this.form.password}</p>`;
            this.$alert(msg, "系统初始化成功", {
              confirmButtonText: "我知道了!",
              dangerouslyUseHTMLString: true,
              callback: action => {
                this.$router.push({name:"dashboard"});
              }
            });
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.checkInitState();
  }
};
</script>

<style lang="scss">
.page-system-initialize {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../../../assets/bg-pattern-light.svg") center;
  background-position: center;
  background-size: cover;

  fieldset {
    border: none;
    margin: 0;
    margin-top: 20px;
    padding: 15px;
    &:first-child {
      border-bottom: 1px solid #eee;
    }
  }
  legend {
    text-align: left;
    font: 14px/1.4 bold;
  }
  .el-form {
    text-align: justify;
  }
  .init-title{font-size: 16px;}
  .init-message {font-size: 14px; color: #8c8c8c;}
}
</style>