<template>
  <div class="cart-container">
  <div class="student-info">24210816007 陈朗朗</div>
  <h2>购物车</h2>
  
  <!-- 购物车备注功能 -->
  <div class="cart-notes">
    <h3>购物车备注</h3>
    <div class="notes-input">
      <input 
        v-model="cartNotes" 
        @keyup.enter="saveCartNotes"
        placeholder="输入购物车备注信息（如：统一少辣、不要香菜等）..."
        class="notes-input-field"
      />
      <button @click="saveCartNotes" class="save-notes-btn">保存备注</button>
    </div>
    <div v-if="savedNotes" class="saved-notes">
      <div class="note-content">
        <p><strong>已保存备注：</strong>{{ savedNotes }}</p>
        <button class="delete-note-btn" @click="deleteCartNotes">删除</button>
      </div>
    </div>
  </div>
    
    <div v-if="cartStore.isEmpty" class="empty-cart">
      <p>购物车是空的</p>
      <router-link to="/" class="go-shopping-btn">去逛逛</router-link>
    </div>
    
    <div v-else>
      <div class="cart-items">
        <!-- 显示未隐藏的菜品 -->
        <div class="batch-actions">
          <button class="hide-all-btn" @click="hideAllItems" v-if="cartStore.items.some(item => !hiddenItems.includes(item.id))">
            隐藏所有菜品
          </button>
          <button class="show-all-btn" @click="showAllItems" v-if="hiddenItems.length > 0">
            显示所有菜品
          </button>
        </div>
        
        <div 
          class="cart-item" 
          v-for="item in cartStore.items.filter(item => !hiddenItems.includes(item.id))" 
          :key="item.id"
        >
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p class="item-price">¥{{ item.price }}</p>
          </div>
          <div class="item-quantity">
            <button class="quantity-btn" @click="updateQuantity(item.id, item.quantity - 1)">-</button>
            <span class="quantity">{{ item.quantity }}</span>
            <button class="quantity-btn" @click="updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>
          <div class="item-subtotal">
            ¥{{ (item.price * item.quantity).toFixed(2) }}
          </div>
          <div class="item-actions">
            <button class="remove-item-btn" @click="removeItem(item.id)">
              删除
            </button>
          </div>
        </div>

        <!-- 折叠的隐藏菜品区域 -->
        <div v-if="hiddenItems.length > 0" class="hidden-items-section">
          <div class="hidden-items-header" @click="toggleHiddenSection">
            <h3>{{ showHiddenItems ? '收起' : '展开' }}隐藏的菜品 ({{ hiddenItems.length }})</h3>
            <span class="toggle-icon">{{ showHiddenItems ? '▼' : '▶' }}</span>
          </div>
          
          <div v-if="showHiddenItems" class="hidden-items-list">
            <div 
              class="cart-item hidden" 
              v-for="item in cartStore.items.filter(item => hiddenItems.includes(item.id))" 
              :key="item.id"
            >
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p class="item-price">¥{{ item.price }}</p>
              </div>
              <div class="item-quantity">
                <button class="quantity-btn" @click="updateQuantity(item.id, item.quantity - 1)">-</button>
                <span class="quantity">{{ item.quantity }}</span>
                <button class="quantity-btn" @click="updateQuantity(item.id, item.quantity + 1)">+</button>
              </div>
              <div class="item-subtotal">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </div>
              <div class="item-actions">
                <button class="remove-item-btn" @click="removeItem(item.id)">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-actions">
        <button class="clear-cart-btn" @click="clearCart">清空购物车</button>
      </div>

      <div class="cart-total">
        <div class="total-item">
          <span>商品总计</span>
          <span>¥{{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <div class="total-item">
          <span>配送费</span>
          <span>¥5.00</span>
        </div>
        <div class="total-item total">
          <span>应付金额</span>
          <span>¥{{ (cartStore.totalPrice + 5).toFixed(2) }}</span>
        </div>
      </div>

      <button class="checkout-btn" @click="checkout">去结算</button>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

export default {
  name: 'CartView',
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    
    // 购物车备注功能
    const cartNotes = ref('')
    const savedNotes = ref('')
    
    // 隐藏菜品功能
    const hiddenItems = ref([])
    const showHiddenItems = ref(false) // 控制隐藏菜品区域是否展开

    onMounted(() => {
      cartStore.loadFromLocalStorage()
      // 加载已保存的备注
      const saved = localStorage.getItem('cartNotes')
      if (saved) {
        savedNotes.value = saved
      }
    })

    const updateQuantity = (itemId, quantity) => {
      cartStore.updateQuantity(itemId, quantity)
    }

    const removeItem = (itemId) => {
      cartStore.removeItem(itemId)
    }

    const clearCart = () => {
      if (confirm('确定要清空购物车吗？')) {
        cartStore.clear()
      }
    }

    const checkout = () => {
      // 将购物车备注保存到localStorage，以便结账页面使用
      if (savedNotes.value) {
        localStorage.setItem('orderNotes', JSON.stringify([savedNotes.value]))
      }
      router.push('/checkout')
    }
    
    // 保存购物车备注
    const saveCartNotes = () => {
      if (cartNotes.value.trim()) {
        savedNotes.value = cartNotes.value.trim()
        localStorage.setItem('cartNotes', savedNotes.value)
        cartNotes.value = ''
      }
    }
    
    // 删除购物车备注
    const deleteCartNotes = () => {
      savedNotes.value = ''
      localStorage.removeItem('cartNotes')
    }
    
    // 批量隐藏所有菜品
    const hideAllItems = () => {
      hiddenItems.value = cartStore.items.map(item => item.id)
    }
    
    // 批量显示所有菜品
    const showAllItems = () => {
      hiddenItems.value = []
    }
    
    // 切换隐藏菜品区域的展开/收起状态
    const toggleHiddenSection = () => {
      showHiddenItems.value = !showHiddenItems.value
    }

    return {
      cartStore,
      updateQuantity,
      removeItem,
      clearCart,
      checkout,
      cartNotes,
      savedNotes,
      saveCartNotes,
      deleteCartNotes,
      hiddenItems,
      hideAllItems,
      showAllItems,
      showHiddenItems,
      toggleHiddenSection
    }
  }
}
</script>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.student-info {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 15px;
  font-weight: bold;
}

.cart-container h2 {
  color: #333;
  margin-bottom: 20px;
}

.empty-cart {
  text-align: center;
  padding: 50px 0;
}

.empty-cart p {
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

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  gap: 15px;
}

.item-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.item-price {
  margin: 0;
  color: #e74c3c;
  font-weight: bold;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.quantity {
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.item-subtotal {
  font-weight: bold;
  color: #333;
  text-align: right;
}

.remove-item-btn {
  padding: 8px 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cart-actions {
  margin-bottom: 20px;
}

.clear-cart-btn {
  padding: 10px 20px;
  background-color: #9e9e9e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cart-total {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.total-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
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

.cart-notes {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notes-input {
  display: flex;
  margin-bottom: 15px;
}

.notes-input-field {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.save-notes-btn {
  background-color: #008CBA;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
}

.save-notes-btn:hover {
  background-color: #007B9A;
}

.saved-notes {
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.note-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-note-btn {
  padding: 6px 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.delete-note-btn:hover {
  background-color: #d32f2f;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.toggle-visibility-btn {
  padding: 8px 12px;
  background-color: #9e9e9e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cart-item.hidden {
  opacity: 0.5;
  background-color: #f5f5f5;
}

/* 批量操作按钮样式 */
.batch-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.hide-all-btn {
  padding: 10px 20px;
  background-color: #9e9e9e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.hide-all-btn:hover {
  background-color: #757575;
}

.show-all-btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.show-all-btn:hover {
  background-color: #388e3c;
}

/* 隐藏菜品区域样式 */
.hidden-items-section {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.hidden-items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: #f9f9f9;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid #ddd;
}

.hidden-items-header:hover {
  background-color: #f5f5f5;
}

.hidden-items-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
  font-weight: normal;
}

.toggle-icon {
  font-size: 0.8rem;
  color: #666;
  transition: transform 0.2s ease;
}

.hidden-items-list {
  padding: 10px;
}

.hidden-items-list .cart-item {
  margin-bottom: 10px;
}

.hidden-items-list .cart-item:last-child {
  margin-bottom: 0;
}

.checkout-btn {
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