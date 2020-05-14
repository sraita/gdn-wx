<template>
  <el-dialog
    title="添加用户"
    :visible.sync="myVisible"
    width="30%"
    @close="close">
    
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" size="small">
      <el-form-item label="账号：" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio label="0">未知</el-radio>
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户状态：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="enable">启用</el-radio>
          <el-radio label="disable">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="真实姓名：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱：" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="所属团队：" prop="team">
        <el-select v-model="form.team" placeholder="请选择">
          <el-option v-for="item in teams"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户角色：" prop="roles">
        <el-select v-model="form.roles" placeholder="请选择">
          <el-option v-for="item in roles"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      
    </el-form>
    
    <span slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit('form')" :loading="submiting">
        {{submiting ? '正在提交': '提 交'}}
      </el-button>
    </span>
  </el-dialog>
  
</template>

<script>
import {addUser} from '@/api/user';
import {getTeams} from '@/api/team';
import {getRoles} from '@/api/role';

export default {
  name: 'newUserCom',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let defaultForm = {
      username: '', // 用户名
      password: '', // 密码
      name: '', // 姓名
      sex: '0',
      status: 'enable',
      mobile: '',
      email: '',
      team: null,
      roles: []
    }
    return {
      submiting: false,
      form: Object.assign(defaultForm),
      rules:{
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message:'请输入密码', trigger:'blur'}
        ]
      },
      teams:[],
      roles:[]
    }
  },
  methods: {
    getTeams() {
      getTeams().then(res => {
        this.teams = res.data.list;
      });
    },
    getRoles() {
      getRoles().then(res => {
        this.roles = res.data.list;
      });
    },
    close() {
      this.$emit('close')
    },
    submit(formName) {
      this.submiting = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addUser(this.form).then(res => {
            this.$emit('submit');
            this.resetForm(formName);
          }).finally(() => {
            this.submiting = false;
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  computed: {
    myVisible: {
      get() {
        return this.visible
      },
      set() {}
    }
  },
  mounted() {
    this.getTeams();
    this.getRoles();
  },
}
</script>