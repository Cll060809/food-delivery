<template>
  <div class="checkout-container">
    <h2>确认订单</h2>
    
    <div class="checkout-sections">
      <div class="checkout-section">
        <h3>收货信息</h3>
        <div class="address-form">
          <div class="form-group">
            <label for="recipient">收货人</label>
            <input type="text" id="recipient" v-model="address.recipient" placeholder="请输入收货人姓名" />
          </div>
          <div class="form-group">
            <label for="phone">联系电话</label>
            <input type="tel" id="phone" v-model="address.phone" placeholder="请输入联系电话" />
          </div>
          <div class="form-group">
            <label for="address">收货地址</label>
            <textarea id="address" v-model="address.address" placeholder="请输入详细地址" rows="3"></textarea>
          </div>
        </div>
        <div class="quick-address">
          <h4>常用地址</h4>
          <InteractiveComponent @address-selected="useSavedAddress" />
        </div>
      </div>

      <div class="checkout-section">
        <h3>支付方式</h3>
        <div class="payment-options">
          <label class="payment-option">
            <input type="radio" v-model="paymentMethod" value="alipay" />
            <span>支付宝</span>
          </label>
          <label class="payment-option">
            <input type="radio" v-model="paymentMethod" value="wechat" />
            <span>微信支付</span>
          </label>
          <label class="payment-option">
            <input type="radio" v-model="paymentMethod" value="card" />
            <span>银行卡</span>
          </label>
        </div>
      </div>

      <div class="checkout-section">
        <h3>订单信息</h3>
        <div class="order-items">
          <div class="order-item" v-for="item in cartStore.items" :key="item.id">
            <span>{{ item.name }} x {{ item.quantity }}</span>
            <span>¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="checkout-section">
        <h3>订单备注</h3>
        <div class="order-notes">
          <InteractiveComponent />
        </div>
      </div>

      <div class="checkout-section">
        <h3>订单总计</h3>
        <div class="order-total">
          <div class="total-item">
            <span>商品总计</span>
            <span>¥{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="total-item">
            <span>配送费</span>
            <span>¥{{ deliveryFee.toFixed(2) }}</span>
          </div>
          <div class="total-item total">
            <span>应付金额</span>
            <span>¥{{ totalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <button class="place-order-btn" @click="placeOrder">提交订单</button>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useOrdersStore } from '../stores/orders'
import { useRestaurantsStore } from '../stores/restaurants'
import InteractiveComponent from '../components/InteractiveComponent.vue'

export default {
  name: 'CheckoutView',
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    const ordersStore = useOrdersStore()
    const restaurantsStore = useRestaurantsStore()
    
    const address = ref({
      recipient: '',
      phone: '',
      address: ''
    })
    
    const paymentMethod = ref('alipay')
    
    // 从本地存储加载订单备注
    const getOrderNotes = () => {
      const savedNotes = localStorage.getItem('orderNotes')
      return savedNotes ? JSON.parse(savedNotes) : []
    }

    const deliveryFee = computed(() => {
      if (!cartStore.restaurantId) return 0
      const restaurant = restaurantsStore.getRestaurantById(cartStore.restaurantId)
      return restaurant ? restaurant.deliveryFee : 0
    })

    const totalAmount = computed(() => {
      return cartStore.totalPrice + deliveryFee.value
    })

    onMounted(() => {
      if (cartStore.isEmpty) {
        router.push('/')
      }
    })

    const useSavedAddress = (savedAddress) => {
      address.value.recipient = savedAddress.name === '公司地址' ? '陈朗朗' : savedAddress.name === '家庭地址' ? '陈朗朗' : '陈朗朗'
      address.value.phone = savedAddress.phone
      address.value.address = savedAddress.detail
    }

    const placeOrder = () => {
      // 简单的表单验证
      if (!address.value.recipient || !address.value.phone || !address.value.address) {
        alert('请填写完整的收货信息')
        return
      }

      // 获取订单备注
      const orderNotes = getOrderNotes()

      // 创建订单
      const order = {
        id: Date.now(),
        time: new Date().toLocaleString(),
        items: cartStore.items,
        restaurantId: cartStore.restaurantId,
        totalPrice: totalAmount.value,
        address: address.value,
        paymentMethod: paymentMethod.value,
        notes: orderNotes,
        status: 'pending'
      }

      // 保存订单
      ordersStore.addOrder(order)
      
      // 清空购物车
      cartStore.clear()
      
      // 跳转到订单列表
      alert('订单提交成功！')
      router.push('/orders')
    }

    return {
      address,
      paymentMethod,
      cartStore,
      deliveryFee,
      totalAmount,
      placeOrder,
      useSavedAddress,
      InteractiveComponent
    }
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.checkout-container h2 {
  color: #333;
  margin-bottom: 20px;
}

.checkout-sections {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 30px;
}

.checkout-section {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

.checkout-section h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  color: #666;
}

.form-group input,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  color: #666;
}

.order-total {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.total-item {
  display: flex;
  justify-content: space-between;
  color: #666;
}

.total-item.total {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
}

.quick-address {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #ddd;
}

.quick-address h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.order-notes {
  margin-top: 10px;
}

.place-order-btn {
  width: 100%;
  padding: 15px;
  font-size: 1.1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>