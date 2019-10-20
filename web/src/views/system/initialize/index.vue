<template>
  <div class="page page-system-initialize">
      <el-card 
        :body-style="{ padding: '10px' }" 
        :style="{width: '40%'}"
        class="p-6 text-center">
        <!-- Logo -->
        <div class="auth-brand text-center text-lg-left">
          <a href="index.html">
            <span>
              <img src="assets/images/logo-light.png" alt height="18" />
            </span>
          </a>
        </div>

        <!-- User pic with title-->
        <div class="text-center w-75 m-auto">
          <img
            src="assets/images/users/avatar-1.jpg"
            height="88"
            alt="user-image"
            class="rounded-circle shadow"
          />
          <h4 class="text-dark-50 text-center mt-3 font-weight-bold">Hi ! Michael</h4>
          <p class="text-muted mb-4">Enter your password to access the admin.</p>
        </div>

        <el-form :model="form" ref="form">
          <el-form-item label="Password:">
            <el-input v-model="form.password" placeholder="" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">初始化</el-button>
          </el-form-item>
        </el-form>
        
      </el-card>
  </div>
</template>

<script>
export default {
  name: "systemInitialize",
  data() {
    return {
      form:{},
      rules:{}
    };
  }
};
</script>

<style lang="scss">
.page-system-initialize {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url("../../../assets/bg-pattern-light.svg") center;
  background-position: center;
  background-size: cover;
}
</style>