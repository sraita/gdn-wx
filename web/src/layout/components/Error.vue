<template>
  <div class="page page-error">
    <div class="text-center error-info-container">
      <img src="@/assets/images/file-searching.svg" height="90" alt="File not found Image" />

      <h1 class="error-code">404</h1>
      <h4 class="error-name">抱歉，您访问的页面不存在</h4>
      <p class="error-message">
        目标页面可能已经被更改、删除或移到其它位置，或您所输入的页面地址有误。
      </p>
      
      <router-link to="/" exact>
        <el-button type="primary" icon="el-icon-home">Back Home</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Error"
};
</script>