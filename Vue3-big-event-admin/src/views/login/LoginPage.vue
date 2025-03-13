<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { userLoginOrRegisterService } from '@/api/user'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores'
import router from '@/router'
const userStore = useUserStore()
const isRegister = ref(false)
const form = ref()
// 注册 整个用于提交form数据对象
const formModel = ref({
  username: '',
  password: '',
  repassword: '',
})
// 整个表单校验规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 5, max: 10, message: '用户名必须5-10位的字符!', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { pattern: /^\S{6,15}$/, message: '密码必须是 6-15位 的非空字符' },
  ],
  repassword: [
    {
      validator: (rule, value: string, callback: (err?: Error) => void) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})
const register = async () => {
  // 注册成功之前先进行校验,校验成功 -> 进行请求,校验失败 -> 进行提示
  await form.value.validate()
  await userLoginOrRegisterService(formModel)
  ElMessage({
    message: '注册成功',
    type: 'success',
  })
  isRegister.value = false
}
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: '',
  }
})
const login = async () => {
  await form.value.validate()
  const res = await userLoginOrRegisterService(formModel)
  userStore.setToken(res.data.token)
  ElMessage.success('登录成功')
  router.push('/')
}
</script>

<template>
  <!--
    1. el-form => :model="ruleForm"       绑定的整个form的数据对象
    2. el-form => :rules="rules"          绑定的整个rules规则对象
    3. 表单元素 => v-model="ruleForm.xxx"  给表单元素，绑定form的子属性
    4. prop配置生效的是哪个校验规则(和rules中的字段要对应)
  -->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            v-model="formModel.repassword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="register">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link>
        </el-form-item>
      </el-form>
      <el-form ref="form" size="large" autocomplete="off" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space>登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
