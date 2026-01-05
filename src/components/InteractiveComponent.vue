<template>
  <div class="interactive-container">
    <h2>外卖订单辅助功能</h2>

    <!-- 交互功能1：点击按钮显示/隐藏常用地址 -->
    <div class="toggle-section">
      <h3>常用地址</h3>
      <button @click="toggleVisibility" class="toggle-btn">
        {{ isVisible ? '隐藏地址' : '显示地址' }}
      </button>
      <div v-if="isVisible" class="toggle-content">
        <div 
          v-for="(address, index) in addresses" 
          :key="index" 
          class="address-item"
          @click="selectAddress(address)"
        >
          <h4>{{ address.name }}</h4>
          <p>{{ address.detail }}</p>
          <p>联系电话：{{ address.phone }}</p>
          <div class="select-address-btn">选择</div>
        </div>
      </div>
    </div>

    <!-- 交互功能2：点餐备注功能 -->
    <div class="todo-section">
      <h3>点餐备注</h3>
      <div class="todo-input">
        <input 
          v-model="newTodo" 
          @keyup.enter="addTodo"
          placeholder="输入备注信息（如：少辣、不要香菜等）..."
          class="todo-input-field"
        />
        <button @click="addTodo" class="add-btn">添加备注</button>
      </div>
      <ul class="todo-list">
        <li v-for="(todo, index) in todos" :key="index" class="todo-item">
          <span>{{ todo }}</span>
          <button @click="removeTodo(index)" class="remove-btn">删除</button>
        </li>
      </ul>
      <div v-if="todos.length === 0" class="empty-todo">
        <p>暂无备注信息</p>
      </div>
    </div>

    <!-- 交互功能3：订单快捷操作 -->
    <div class="order-section">
      <h3>订单快捷操作</h3>
      <div class="quick-actions">
        <button @click="clearAllNotes" class="action-btn">清空所有备注</button>
        <button @click="useLastOrder" class="action-btn">使用上次订单</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../stores/cart';

export default {
  name: 'InteractiveComponent',
  data() {
    return {
      // 数据模型定义
      isVisible: false, // 控制常用地址显示/隐藏的状态
      newTodo: '', // 新备注信息的输入值
      todos: [], // 备注信息列表
      addresses: [
        {
          name: '公司地址',
          detail: '北京市朝阳区建国路88号',
          phone: '138****1234'
        },
        {
          name: '家庭地址',
          detail: '北京市海淀区中关村大街1号',
          phone: '138****5678'
        },
        {
          name: '学校地址',
          detail: '北京市海淀区清华大学',
          phone: '138****9012'
        }
      ]
    }
  },
  computed: {
    cartStore() {
      return useCartStore();
    }
  },
  mounted() {
    // 从本地存储加载备注信息
    const savedNotes = localStorage.getItem('orderNotes');
    if (savedNotes) {
      this.todos = JSON.parse(savedNotes);
    }
  },
  methods: {
    // 交互功能1：切换常用地址可见性
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    // 交互功能1：选择地址
    selectAddress(address) {
      // 这里可以将选择的地址传递给父组件或存储到状态管理
      this.$emit('address-selected', address);
      alert(`已选择地址：${address.name}`);
    },
    // 交互功能2：添加备注信息
    addTodo() {
      if (this.newTodo.trim()) {
        this.todos.push(this.newTodo.trim());
        this.newTodo = ''; // 清空输入框
        this.saveNotes();
      }
    },
    // 交互功能2：删除备注信息
    removeTodo(index) {
      this.todos.splice(index, 1);
      this.saveNotes();
    },
    // 保存备注到本地存储
    saveNotes() {
      localStorage.setItem('orderNotes', JSON.stringify(this.todos));
    },
    // 交互功能3：清空所有备注
    clearAllNotes() {
      if (confirm('确定要清空所有备注吗？')) {
        this.todos = [];
        this.saveNotes();
      }
    },
    // 交互功能3：使用上次订单
    useLastOrder() {
      // 这里可以从本地存储加载上次订单信息
      const lastOrder = localStorage.getItem('lastOrder');
      if (lastOrder) {
        const orderData = JSON.parse(lastOrder);
        alert(`已加载上次订单：${orderData.restaurantName}`);
        // 可以将订单数据添加到购物车
      } else {
        alert('暂无上次订单记录');
      }
    }
  }
}
</script>

<style scoped>
.interactive-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.toggle-section,
.todo-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

h3 {
  color: #555;
  margin-bottom: 15px;
}

.toggle-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.toggle-btn:hover {
  background-color: #45a049;
}

.toggle-content {
  margin-top: 15px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.address-item {
  margin-bottom: 15px;
  padding: 15px;
  border-bottom: 1px dashed #eee;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.address-item:hover {
  background-color: #f5f5f5;
}

.address-item:last-child {
  margin-bottom: 0;
  padding-bottom: 15px;
  border-bottom: none;
}

.address-item h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 1.1rem;
}

.address-item p {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.select-address-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #ff6b6b;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.order-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quick-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.action-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  flex: 1;
}

.action-btn:hover {
  background-color: #45a049;
}

.todo-input {
  display: flex;
  margin-bottom: 15px;
}

.todo-input-field {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.add-btn {
  background-color: #008CBA;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
}

.add-btn:hover {
  background-color: #007B9A;
}

.todo-list {
  list-style-type: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
}

.remove-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.remove-btn:hover {
  background-color: #da190b;
}

.empty-todo {
  text-align: center;
  color: #666;
  padding: 20px;
  background-color: white;
  border-radius: 4px;
  border: 1px dashed #ddd;
}
</style>