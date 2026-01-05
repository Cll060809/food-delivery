<!-- 模板部分开始 -->
<template>
  <!-- 根容器，使用home类名进行样式控制 -->
  <div class="home">
    <!-- 页面头部，包含标题和搜索栏 -->
    <header class="home-header">
      <!-- 页面主标题 -->
      <h1>美食外卖</h1>
      <!-- 搜索栏容器 -->
      <div class="search-bar">
        <!-- 搜索输入框，使用v-model双向绑定到searchQuery数据 -->
        <input type="text" placeholder="搜索商家或美食" v-model="searchQuery" />
        <!-- 搜索按钮，点击触发search方法 -->
        <button @click="search">搜索</button>
      </div>
    </header>
    
    <!-- 主要内容区域，显示餐厅列表 -->
    <main class="restaurants-container">
      <!-- 餐厅卡片，使用v-for循环遍历filteredRestaurants数据 -->
      <div class="restaurant-card" v-for="restaurant in filteredRestaurants" :key="restaurant.id" @click="navigateToRestaurant(restaurant.id)">
        <!-- 使用public目录下的图片：动态绑定图片源和描述 -->
        <img 
          :src="restaurant.image"
          :alt="restaurant.name"
          class="restaurant-image"
        />
        <!-- 餐厅信息容器 -->
        <div class="restaurant-info">
          <!-- 餐厅名称 -->
          <h3>{{ restaurant.name }}</h3>
          <!-- 餐厅元信息容器 -->
          <div class="restaurant-meta">
            <!-- 餐厅评分 -->
            <span class="rating">⭐ {{ restaurant.rating }}</span>
            <!-- 餐厅距离 -->
            <span class="distance">{{ restaurant.distance }}km</span>
            <!-- 配送时间 -->
            <span class="delivery-time">{{ restaurant.deliveryTime }}分钟</span>
          </div>
          <!-- 餐厅标签容器 -->
          <div class="restaurant-tags">
            <!-- 循环显示餐厅标签 -->
            <span v-for="tag in restaurant.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- 添加交互组件区域 -->
    <section class="interactive-section">
      <!-- 使用之前创建的InteractiveComponent组件，包含显示/隐藏内容和待办事项功能 -->
      <InteractiveComponent />
    </section>
  </div>
</template>

<!-- 脚本部分开始 -->
<script>
// 导入Vue的响应式API：ref用于创建响应式数据，computed用于创建计算属性
import { ref, computed } from 'vue'
// 导入Vue Router的useRouter钩子，用于路由跳转
import { useRouter } from 'vue-router'
// 导入餐厅数据仓库，用于获取餐厅列表
import { useRestaurantsStore } from '../stores/restaurants'
// 导入交互组件，用于实现显示/隐藏和待办事项功能
import InteractiveComponent from '../components/InteractiveComponent.vue'

// 导出组件定义
export default {
  // 组件名称
  name: 'HomeView',
  // 注册子组件
  components: {
    InteractiveComponent // 注册InteractiveComponent组件
  },
  // Composition API的setup函数，用于设置组件逻辑
  setup() {
    // 获取路由实例，用于页面跳转
    const router = useRouter()
    // 创建响应式数据searchQuery，用于存储搜索输入值
    const searchQuery = ref('')
    // 获取餐厅数据仓库实例
    const restaurantsStore = useRestaurantsStore()

    // 创建计算属性filteredRestaurants，用于根据搜索条件过滤餐厅列表
    const filteredRestaurants = computed(() => {
      // 如果没有搜索条件，返回所有餐厅
      if (!searchQuery.value) return restaurantsStore.getAllRestaurants
      // 将搜索条件转换为小写，以便不区分大小写搜索
      const query = searchQuery.value.toLowerCase()
      // 过滤餐厅列表，返回名称或标签包含搜索条件的餐厅
      return restaurantsStore.getAllRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(query))
      )
    })

    // 搜索方法，目前仅打印搜索条件到控制台
    const search = () => {
      console.log('搜索:', searchQuery.value)
    }

    // 导航到餐厅详情页的方法
    const navigateToRestaurant = (id) => {
      // 使用router.push跳转到指定id的餐厅详情页
      router.push(`/restaurant/${id}`)
    }

    // 返回组件需要暴露的数据和方法
    return {
      searchQuery, // 搜索输入值
      filteredRestaurants, // 过滤后的餐厅列表
      search, // 搜索方法
      navigateToRestaurant // 导航到餐厅详情页的方法
    }
  }
}
</script>

<!-- 样式部分开始，使用scoped属性确保样式只应用于当前组件 -->
<style scoped>
/* 根容器样式 */
.home {
  max-width: 1200px; /* 最大宽度 */
  margin: 0 auto; /* 水平居中 */
  padding: 20px; /* 内边距 */
}

/* 页面头部样式 */
.home-header {
  text-align: center; /* 文本居中 */
  margin-bottom: 30px; /* 底部外边距 */
}

/* 页面标题样式 */
.home-header h1 {
  font-size: 2.5rem; /* 字体大小 */
  color: #e74c3c; /* 字体颜色 */
  margin-bottom: 20px; /* 底部外边距 */
}

/* 搜索栏样式 */
.search-bar {
  display: flex; /* 使用flex布局 */
  max-width: 500px; /* 最大宽度 */
  margin: 0 auto; /* 水平居中 */
}

/* 搜索输入框样式 */
.search-bar input {
  flex: 1; /* 占满剩余空间 */
  padding: 12px; /* 内边距 */
  font-size: 1rem; /* 字体大小 */
  border: 2px solid #ddd; /* 边框 */
  border-radius: 4px 0 0 4px; /* 左上角和左下角圆角 */
}

/* 搜索按钮样式 */
.search-bar button {
  padding: 12px 20px; /* 内边距 */
  font-size: 1rem; /* 字体大小 */
  background-color: #e74c3c; /* 背景颜色 */
  color: white; /* 字体颜色 */
  border: none; /* 无边框 */
  border-radius: 0 4px 4px 0; /* 右上角和右下角圆角 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
}

/* 餐厅列表容器样式 */
.restaurants-container {
  display: grid; /* 使用grid布局 */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* 自动填充，最小宽度300px */
  gap: 20px; /* 网格间距 */
}

/* 餐厅卡片样式 */
.restaurant-card {
  border: 1px solid #ddd; /* 边框 */
  border-radius: 8px; /* 圆角 */
  overflow: hidden; /* 隐藏溢出内容 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
  transition: transform 0.2s; /* 变换过渡效果 */
}

/* 餐厅卡片鼠标悬停效果 */
.restaurant-card:hover {
  transform: translateY(-5px); /* 向上移动5px */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

/* 餐厅图片样式 */
.restaurant-image {
  width: 100%; /* 宽度100% */
  height: 200px; /* 固定高度200px */
  object-fit: cover; /* 图片覆盖填充 */
}

/* 餐厅信息容器样式 */
.restaurant-info {
  padding: 15px; /* 内边距 */
}

/* 餐厅名称样式 */
.restaurant-info h3 {
  margin: 0 0 10px 0; /* 外边距 */
  color: #333; /* 字体颜色 */
}

/* 餐厅元信息容器样式 */
.restaurant-meta {
  display: flex; /* 使用flex布局 */
  gap: 15px; /* 间距 */
  margin-bottom: 10px; /* 底部外边距 */
  font-size: 0.9rem; /* 字体大小 */
  color: #666; /* 字体颜色 */
}

/* 餐厅标签容器样式 */
.restaurant-tags {
  display: flex; /* 使用flex布局 */
  gap: 8px; /* 间距 */
  flex-wrap: wrap; /* 自动换行 */
}

/* 单个标签样式 */
.tag {
  background-color: #f0f0f0; /* 背景颜色 */
  padding: 4px 8px; /* 内边距 */
  border-radius: 4px; /* 圆角 */
  font-size: 0.8rem; /* 字体大小 */
  color: #666; /* 字体颜色 */
}
</style>