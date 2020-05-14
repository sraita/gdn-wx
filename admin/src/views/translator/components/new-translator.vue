<template>
  <el-dialog
    title="新增译员"
    :visible.sync="myVisible"
    width="30%"
    @close="close">
    
    <el-form :model="form" ref="form" label-width="120px">
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio label="0">未知</el-radio>
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系电话：" prop="tel">
        <el-input v-model="form.tel"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱:" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="QQ号码：" prop="qq">
        <el-input v-model="form.qq"></el-input>
      </el-form-item>
      <el-form-item label="微信号：" prop="wechat">
        <el-input v-model="form.wechat"></el-input>
      </el-form-item>
      <el-form-item label="译员级别：" prop="rank">
        <el-select v-model="form.rank" placeholder="请选择">
          <el-option  label="普通" value="normal"></el-option>
          <el-option  label="高级" value="advanced"></el-option>
          <el-option  label="专家" value="proficient"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    
    <span slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="submiting">
        {{submiting ? '正在提交': '提 交'}}
      </el-button>
    </span>
  </el-dialog>
  
</template>

<script>
import {newTranslator} from '@/api/translator';
export default {
  name: 'newTranslatorCom',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let defaultForm = {
      user: null, // 关联账户
      name: '', // 姓名
      sex: '0',
      tel: '',
      mobile: '',
      email: '',
      qq: '',
      wechat: '',
      picture:'',
      rank: 'normal' //normal:普通,advanced:高级,proficient:专家
    }
    return {
      submiting: false,
      form: Object.assign(defaultForm),
      rules:{
        
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    submit() {
      newTranslator(this.form).then(res => {
        this.$emit('submit')
      })
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
}
</script>