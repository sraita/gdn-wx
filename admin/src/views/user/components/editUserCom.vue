<template>
  <el-dialog
    title="编辑用户"
    :visible.sync="myVisible"
    width="30%"
    @close="close">
    
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" size="small">
      <el-form-item label="账号：" prop="username" readonly>
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio label="0">未知</el-radio>
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
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
      <el-form-item label="用户角色：" prop="role">
        <el-select v-model="form.role" placeholder="请选择">
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
import {updateUser} from '@/api/user';
import {getTeams} from '@/api/team';
import {getRoles} from '@/api/role';

let defaultForm = {
  username: '', // 用户名
  name: '', // 姓名
  sex: '0',
  mobile: '',
  email: '',
  team: null,
  role: null
}
export default {
  name: 'editUserCom',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    user:{
      type: Object,
      default:() => {}
    }
  },
  data() {
    
    return {
      submiting: false,
      form: Object.assign(defaultForm),
      rules:{
        
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
          let data = Object.assign(this.form);
          delete data._id;

          updateUser(this._id,data).then(res => {
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
    },
    _id() {
      return this.user ? this.user._id : null;
    }
  },
  watch: {
    user:{
      handler(val,oldVal){
        if (val) {
          this.form = {
            username: val.username, // 用户名
            name: val.name, // 姓名
            sex: val.sex,
            mobile: val.mobile,
            email: val.email,
            team: val.team ? val.team._id: null,
            role: val.role ? val.role._id: null
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getTeams();
    this.getRoles();
  },
}
</script>