<template>
  <div class="login-container">
    <div class="login-form">
      <h2>登录</h2>
      <div class="form-group">
        <label for="phone">手机号</label>
        <input type="tel" id="phone" v-model="form.phone" placeholder="请输入手机号" />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="form.password" placeholder="请输入密码" />
      </div>
      <button class="login-btn" @click="login">登录</button>
      <div class="register-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const form = ref({
      phone: '',
      password: ''
    })

    const login = () => {
      // 简单的模拟登录
      if (form.value.phone && form.value.password) {
        const user = {
          id: 1,
          name: '用户',
          phone: form.value.phone
        }
        const token = 'mock-token-' + Date.now()
        authStore.login(user, token)
        router.push('/')
      } else {
        alert('请输入手机号和密码')
      }
    }

    return {
      form,
      login
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-form h2 {
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

.login-btn {
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

.register-link {
  text-align: center;
  color: #666;
}

.register-link a {
  color: #e74c3c;
  text-decoration: none;
}
</style>