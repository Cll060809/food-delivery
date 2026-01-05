import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', {
  state: () => {
    const ordersData = localStorage.getItem('orders')
    return ordersData ? { orders: JSON.parse(ordersData) } : { orders: [] }
  },
  getters: {
    allOrders: (state) => state.orders,
    pendingOrders: (state) => state.orders.filter(order => order.status === 'pending'),
    completedOrders: (state) => state.orders.filter(order => order.status === 'completed'),
    cancelledOrders: (state) => state.orders.filter(order => order.status === 'cancelled')
  },
  actions: {
    addOrder(order) {
      this.orders.push(order)
      this.saveToLocalStorage()
    },
    updateOrderStatus(orderId, status) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = status
        this.saveToLocalStorage()
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('orders', JSON.stringify(this.orders))
    },
    loadFromLocalStorage() {
      const ordersData = localStorage.getItem('orders')
      if (ordersData) {
        this.orders = JSON.parse(ordersData)
      }
    }
  }
})