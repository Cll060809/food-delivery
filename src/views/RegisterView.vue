<template>
  <div class="register-container">
    <div class="register-form">
      <h2>注册</h2>
      <div class="form-group">
        <label for="name">姓名</label>
        <input type="text" id="name" v-model="form.name" placeholder="请输入姓名" />
      </div>
      <div class="form-group">
        <label for="phone">手机号</label>
        <input type="tel" id="phone" v-model="form.phone" placeholder="请输入手机号" />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="form.password" placeholder="请输入密码" />
      </div>
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input type="password" id="confirmPassword" v-model="form.confirmPassword" placeholder="请确认密码" />
      </div>
      <button class="register-btn" @click="register">注册</button>
      <div class="login-link">
        已有账号？<router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const form = ref({
      name: '',
      phone: '',
      password: '',
      confirmPassword: ''
    })

    const register = () => {
      // 简单的表单验证
      if (!form.value.name || !form.value.phone || !form.value.password) {
        alert('请填写所有必填字段')
        return
      }
      
      if (form.value.password !== form.value.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }

      // 模拟注册
      const user = {
        id: Date.now(),
        name: form.value.name,
        phone: form.value.phone
      }
      const token = 'mock-token-' + Date.now()
      authStore.register(user, token)
      router.push('/')
    }

    return {
      form,
      register
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.register-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.register-form h2 {
  text-align: center;
  color: #e74c3c;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
}

.register-btn {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
}

.login-link {
  text-align: center;
  color: #666;
}

.login-link a {
  color: #e74c3c;
  text-decoration: none;
}
</style>