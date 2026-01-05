<template>
  <div class="restaurant-container">
    <div class="student-info">24210816007 陈朗朗</div>
    <div class="restaurant-header">
      <!-- 使用public目录下的图片 -->
      <img 
        :src="`/${['kfc', 'mcdonalds', 'pizza_hut', 'haidilao'][parseInt(route.params.id) - 1]}.${parseInt(route.params.id) === 2 ? 'webp' : 'jpg'}`" 
        :alt="restaurant.name" 
        class="restaurant-banner" 
      />
      <div class="restaurant-info">
        <h1>{{ restaurant.name }}</h1>
        <div class="restaurant-meta">
          <span class="rating">⭐ {{ restaurant.rating }}</span>
          <span class="distance">{{ restaurant.distance }}km</span>
          <span class="delivery-time">{{ restaurant.deliveryTime }}分钟</span>
          <span class="delivery-fee">配送费 ¥{{ restaurant.deliveryFee }}</span>
        </div>
        <div class="restaurant-description">{{ restaurant.description }}</div>
      </div>
    </div>

    <div class="menu-container">
      <div class="menu-tabs">
        <button 
          v-for="category in categories" 
          :key="category"
          :class="['tab-btn', { active: activeCategory === category }]"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <div class="menu-items">
        <div 
          class="menu-item" 
          v-for="item in filteredMenuItems" 
          :key="item.id"
          :class="{ 'unavailable': !item.isAvailable }"
        >
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p class="item-description">{{ item.description }}</p>
            <p class="item-price">¥{{ item.price }}</p>
            <div class="item-meta">
              <span v-if="item.isAvailable" class="stock">库存: {{ item.stock }}</span>
              <span v-else class="unavailable-text">已售罄</span>
              <span class="sales">月销: {{ item.salesVolume }}</span>
              <span class="tags" v-if="item.tags">
                <span v-for="tag in item.tags.split(',')" :key="tag" class="tag">
                  {{ tag.trim() }}
                </span>
              </span>
            </div>
          </div>
          <div class="item-actions">
            <button 
              class="add-to-cart-btn" 
              @click="addToCart(item)"
              :disabled="!item.isAvailable || item.stock <= 0"
            >
              {{ item.isAvailable && item.stock > 0 ? '加入购物车' : '已售罄' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="cart-summary" v-if="!cartStore.isEmpty">
      <div class="cart-info">
        <span>购物车({{ cartStore.totalItems }})</span>
        <span>总计: ¥{{ cartStore.totalPrice.toFixed(2) }}</span>
      </div>
      <router-link to="/cart" class="view-cart-btn">去结算</router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useRestaurantsStore } from '../stores/restaurants'

export default {
  name: 'RestaurantView',
  setup() {
    const route = useRoute()
    const cartStore = useCartStore()
    const restaurantsStore = useRestaurantsStore()
    const activeCategory = ref('全部')

    const restaurant = computed(() => {
      return restaurantsStore.getRestaurantById(route.params.id)
    })

    const menuItems = computed(() => {
      return restaurantsStore.getMenuItemsByRestaurantId(route.params.id)
    })

    const categories = computed(() => {
      return restaurantsStore.getMenuCategoriesByRestaurantId(route.params.id)
    })

    const filteredMenuItems = computed(() => {
      if (activeCategory.value === '全部') {
        return menuItems.value
      }
      return menuItems.value.filter(item => {
        return item.tags && item.tags.split(',').some(tag => tag.trim() === activeCategory.value)
      })
    })

    const addToCart = (item) => {
      cartStore.addItem(item, restaurant.value.id)
      alert('已加入购物车')
    }

    return {
      restaurant,
      menuItems,
      categories,
      activeCategory,
      filteredMenuItems,
      cartStore,
      addToCart,
      route
    }
  }
}
</script>

<style scoped>
.student-info {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.restaurant-container {
  max-width: 1200px;
  margin: 0 auto;
}

.restaurant-banner {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.restaurant-info {
  padding: 20px;
  background-color: white;
  box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.1);
}

.restaurant-info h1 {
  margin: 0 0 10px 0;
  color: #333;
}

.restaurant-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #666;
}

.restaurant-description {
  color: #888;
  font-size: 0.95rem;
}

.menu-container {
  padding: 20px;
}

.menu-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.tab-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
}

.tab-btn.active {
  background-color: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

.item-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.item-description {
  margin: 0 0 5px 0;
  color: #888;
  font-size: 0.9rem;
}

.item-price {
  margin: 0 0 8px 0;
  color: #e74c3c;
  font-weight: bold;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.8rem;
  color: #888;
}

.stock {
  color: #27ae60;
}

.sales {
  color: #f39c12;
}

.tags {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.tag {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.75rem;
  color: #666;
}

.unavailable {
  opacity: 0.6;
}

.unavailable-text {
  color: #e74c3c;
  font-weight: bold;
}

.add-to-cart-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.add-to-cart-btn {
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cart-summary {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.cart-info {
  display: flex;
  flex-direction: column;
}

.view-cart-btn {
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>