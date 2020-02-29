<template>
  <div class="app-container">
    <el-card :body-style="{ padding: '15px' }">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="System Log" name="system_log">
          <system-logs></system-logs>
        </el-tab-pane>
        <el-tab-pane label="Access Log" name="access_log">
          <access-logs></access-logs>
        </el-tab-pane>
        <el-tab-pane label="Login Log" name="login_log">
          <login-logs></login-logs>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import AccessLogs from './components/AccessLogs';
import LoginLogs from './components/LoginLogs';
import SystemLogs from './components/SystemLogs';
export default {
  name: 'Log',
  components:{ AccessLogs ,LoginLogs, SystemLogs},
  data() {
    return {
      activeName: 'system_log'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      this.activeName = tab.name;
    }
  },
  mounted() {
    
  },
}
</script>