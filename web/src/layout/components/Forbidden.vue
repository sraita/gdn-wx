<template>
  <div class="page page-error">
    <div class="text-center error-info-container">
      <img src="@/assets/images/403.svg" height="90" alt="File not found Image" />

      <h1 class="error-code">403</h1>
      <h4 class="error-name">没有权限</h4>
      <p class="error-message">
        您暂时没有权限访问该页面，建议您检查一下再试
      </p>
      
      <router-link to="/" exact>
        <el-button type="primary" icon="el-icon-home">Back Home</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "notFound"
};
</script>