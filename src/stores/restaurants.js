import { defineStore } from 'pinia'

export const useRestaurantsStore = defineStore('restaurants', {
  state: () => ({
    restaurants: [
      {
        id: 1,
        name: '肯德基',
        image: '/kfc.jpg',
        banner: '/kfc.jpg',
        rating: 4.5,
        distance: 1.2,
        deliveryTime: 30,
        deliveryFee: 5,
        description: '肯德基是全球知名的快餐品牌，提供美味的汉堡、炸鸡等食品。',
        tags: ['快餐', '汉堡', '炸鸡']
      },
      {
        id: 2,
        name: '麦当劳',
        image: '/mcdonalds.webp',
        banner: '/mcdonalds.webp',
        rating: 4.3,
        distance: 2.1,
        deliveryTime: 25,
        deliveryFee: 4,
        description: '麦当劳是全球领先的快餐连锁品牌，以汉堡、薯条和可乐闻名。',
        tags: ['快餐', '汉堡', '薯条']
      },
      {
        id: 3,
        name: '必胜客',
        image: '/pizza_hut.jpg',
        banner: '/pizza_hut.jpg',
        rating: 4.6,
        distance: 1.8,
        deliveryTime: 40,
        deliveryFee: 6,
        description: '必胜客是全球知名的披萨连锁品牌，提供各种口味的披萨和意大利面。',
        tags: ['披萨', '西餐', '甜点']
      },
      {
        id: 4,
        name: '海底捞',
        image: '/haidilao.jpg',
        banner: '/haidilao.jpg',
        rating: 4.8,
        distance: 3.2,
        deliveryTime: 50,
        deliveryFee: 8,
        description: '海底捞是中国知名的火锅连锁品牌，以优质的服务和美味的火锅闻名。',
        tags: ['火锅', '川菜', '特色']
      }
    ],
    menuItems: [
      // 肯德基菜单
      { id: 1, name: '香辣鸡腿堡', description: '经典香辣鸡腿堡，外酥里嫩', price: 25, restaurantId: 1, isAvailable: true, stock: 100, salesVolume: 120, tags: '汉堡,辣,推荐' },
      { id: 2, name: '奥尔良烤翅', description: '奥尔良风味烤翅，香气四溢', price: 18, restaurantId: 1, isAvailable: true, stock: 150, salesVolume: 80, tags: '小食,奥尔良' },
      { id: 3, name: '薯条', description: '金黄酥脆的薯条，搭配番茄酱', price: 12, restaurantId: 1, isAvailable: true, stock: 200, salesVolume: 200, tags: '小食,经典' },
      { id: 4, name: '可乐', description: '冰镇可乐，清爽解渴', price: 8, restaurantId: 1, isAvailable: true, stock: 300, salesVolume: 250, tags: '饮料,碳酸' },
      { id: 5, name: '全家桶', description: '包含多种美食，适合全家分享', price: 128, restaurantId: 1, isAvailable: true, stock: 50, salesVolume: 30, tags: '套餐,分享' },
      { id: 6, name: '深海鳕鱼堡', description: '鲜嫩鳕鱼汉堡，营养丰富', price: 28, restaurantId: 1, isAvailable: true, stock: 80, salesVolume: 45, tags: '汉堡,海鲜,新品' },
      
      // 麦当劳菜单
      { id: 7, name: '巨无霸', description: '麦当劳经典汉堡，双层牛肉', price: 26, restaurantId: 2, isAvailable: true, stock: 100, salesVolume: 150, tags: '汉堡,经典' },
      { id: 8, name: '麦辣鸡翅', description: '香辣可口的麦辣鸡翅', price: 19, restaurantId: 2, isAvailable: true, stock: 120, salesVolume: 90, tags: '小食,辣' },
      { id: 9, name: '麦乐鸡', description: '外酥里嫩的麦乐鸡', price: 15, restaurantId: 2, isAvailable: true, stock: 180, salesVolume: 180, tags: '小食,儿童' },
      { id: 10, name: '雪碧', description: '冰镇雪碧，清爽解渴', price: 8, restaurantId: 2, isAvailable: true, stock: 250, salesVolume: 220, tags: '饮料,碳酸' },
      { id: 11, name: '麦辣鸡腿堡套餐', description: '麦辣鸡腿堡+薯条+可乐', price: 38, restaurantId: 2, isAvailable: true, stock: 60, salesVolume: 50, tags: '套餐,辣' },
      
      // 必胜客菜单
      { id: 12, name: '超级至尊披萨', description: '经典超级至尊披萨，多种配料', price: 89, restaurantId: 3, isAvailable: true, stock: 40, salesVolume: 60, tags: '披萨,经典,推荐' },
      { id: 13, name: '意式肉酱面', description: '传统意式肉酱面', price: 32, restaurantId: 3, isAvailable: true, stock: 70, salesVolume: 40, tags: '意大利面,经典' },
      { id: 14, name: '鸡米花', description: '香脆鸡米花', price: 22, restaurantId: 3, isAvailable: true, stock: 100, salesVolume: 75, tags: '小食,新品' },
      { id: 15, name: '奶茶', description: '香浓奶茶', price: 16, restaurantId: 3, isAvailable: true, stock: 150, salesVolume: 120, tags: '饮料,热饮' },
      { id: 16, name: '海鲜披萨', description: '鲜美海鲜披萨', price: 99, restaurantId: 3, isAvailable: true, stock: 30, salesVolume: 25, tags: '披萨,海鲜,推荐' },
      
      // 海底捞菜单
      { id: 17, name: '清油锅底', description: '清爽不油腻的清油锅底', price: 48, restaurantId: 4, isAvailable: true, stock: 60, salesVolume: 80, tags: '锅底,辣' },
      { id: 18, name: '麻辣牛肉', description: '鲜嫩麻辣牛肉', price: 68, restaurantId: 4, isAvailable: true, stock: 50, salesVolume: 100, tags: '肉类,辣,推荐' },
      { id: 19, name: '毛肚', description: '脆嫩毛肚', price: 58, restaurantId: 4, isAvailable: true, stock: 40, salesVolume: 90, tags: '海鲜,推荐' },
      { id: 20, name: '蔬菜拼盘', description: '新鲜蔬菜拼盘', price: 28, restaurantId: 4, isAvailable: true, stock: 80, salesVolume: 65, tags: '蔬菜,健康' },
      { id: 21, name: '海底捞特色蘸料', description: '多种调料自助搭配', price: 10, restaurantId: 4, isAvailable: true, stock: 100, salesVolume: 120, tags: '蘸料,特色' }
    ]
  }),
  getters: {
    getAllRestaurants: (state) => state.restaurants,
    getRestaurantById: (state) => (id) => {
      return state.restaurants.find(restaurant => restaurant.id === parseInt(id))
    },
    getMenuItemsByRestaurantId: (state) => (restaurantId) => {
      return state.menuItems.filter(item => item.restaurantId === parseInt(restaurantId))
    },
    getMenuCategoriesByRestaurantId: (state) => (restaurantId) => {
      const items = state.menuItems.filter(item => item.restaurantId === parseInt(restaurantId))
      const categories = new Set()
      items.forEach(item => {
        if (item.tags) {
          item.tags.split(',').forEach(tag => categories.add(tag.trim()))
        }
      })
      return ['全部', ...categories]
    }
  },
  actions: {
    // 可以添加更多操作，如搜索、筛选等
    searchRestaurants(query) {
      const lowerQuery = query.toLowerCase()
      return this.restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(lowerQuery) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    }
  }
})