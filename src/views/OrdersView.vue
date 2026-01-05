<template>
  <div class="orders-container">
    <h2>我的订单</h2>
    
    <div v-if="ordersStore.allOrders.length === 0" class="no-orders">
      <p>您还没有订单</p>
      <router-link to="/" class="go-shopping-btn">去逛逛</router-link>
    </div>
    
    <div v-else class="orders-list">
      <div class="order-card" v-for="order in ordersStore.allOrders" :key="order.id">
        <div class="order-header">
          <span class="order-id">订单号: {{ order.id }}</span>
          <span class="order-time">{{ order.time }}</span>
          <span :class="['order-status', order.status]">
            {{ getStatusText(order.status) }}
          </span>
        </div>

        <div class="order-items">
          <div class="order-item" v-for="item in order.items" :key="item.id">
            <span>{{ item.name }}</span>
            <span>x{{ item.quantity }}</span>
            <span>¥{{ item.price }}</span>
          </div>
        </div>

        <div class="order-address">
          <h4>收货信息</h4>
          <p>{{ order.address.recipient }} {{ order.address.phone }}</p>
          <p>{{ order.address.address }}</p>
        </div>

        <div class="order-payment">
          <div class="payment-method">
            支付方式: {{ getPaymentText(order.paymentMethod) }}
          </div>
          <div class="order-total">
            总计: ¥{{ order.totalPrice.toFixed(2) }}
          </div>
        </div>

        <div class="order-actions">
          <button 
            v-if="order.status === 'pending'" 
            class="action-btn cancel-btn"
            @click="cancelOrder(order.id)"
          >
            取消订单
          </button>
          <button 
            v-if="order.status === 'pending'" 
            class="action-btn pay-btn"
            @click="payOrder(order.id)"
          >
            立即支付
          </button>
          <button 
            v-if="order.status === 'pending'" 
            class="action-btn confirm-btn"
            @click="confirmOrder(order.id)"
          >
            确认收货
          </button>
          <button class="action-btn reorder-btn" @click="reorder(order)">
            再次购买
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useOrdersStore } from '../stores/orders'
import { useCartStore } from '../stores/cart'

export default {
  name: 'OrdersView',
  setup() {
    const ordersStore = useOrdersStore()
    const cartStore = useCartStore()

    onMounted(() => {
      ordersStore.loadFromLocalStorage()
    })

    const getStatusText = (status) => {
      const statusMap = {
        pending: '待支付',
        paid: '已支付',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || status
    }

    const getPaymentText = (method) => {
      const paymentMap = {
        alipay: '支付宝',
        wechat: '微信支付',
        card: '银行卡'
      }
      return paymentMap[method] || method
    }

    const cancelOrder = (orderId) => {
      if (confirm('确定要取消订单吗？')) {
        ordersStore.updateOrderStatus(orderId, 'cancelled')
      }
    }

    const payOrder = (orderId) => {
      ordersStore.updateOrderStatus(orderId, 'paid')
      alert('支付成功！')
    }

    const confirmOrder = (orderId) => {
      ordersStore.updateOrderStatus(orderId, 'completed')
      alert('订单已完成！')
    }

    const reorder = (order) => {
      // 将订单商品添加到购物车
      order.items.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          cartStore.addItem(item, order.restaurantId) // 使用订单关联的商家ID
        }
      })
      alert('商品已添加到购物车')
    }

    return {
      ordersStore,
      getStatusText,
      getPaymentText,
      cancelOrder,
      payOrder,
      confirmOrder,
      reorder
    }
  }
}
</script>

<style scoped>
.orders-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.orders-container h2 {
  color: #333;
  margin-bottom: 20px;
}

.no-orders {
  text-align: center;
  padding: 50px 0;
}

.no-orders p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

.go-shopping-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: white;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.order-id {
  font-weight: bold;
  color: #333;
}

.order-time {
  color: #666;
  font-size: 0.9rem;
}

.order-status {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
}

.order-status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.order-status.paid {
  background-color: #d4edda;
  color: #155724;
}

.order-status.completed {
  background-color: #d1ecf1;
  color: #0c5460;
}

.order-status.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.order-items {
  margin-bottom: 15px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #666;
}

.order-address {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.order-address h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.order-address p {
  margin: 5px 0;
  color: #666;
}

.order-payment {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.payment-method {
  color: #666;
}

.order-total {
  font-size: 1.2rem;
  font-weight: bold;
  color: #e74c3c;
}

.order-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.pay-btn {
  background-color: #4caf50;
  color: white;
}

.confirm-btn {
  background-color: #2196f3;
  color: white;
}

.reorder-btn {
  background-color: #9e9e9e;
  color: white;
}
</style>