import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => {
    const cartData = localStorage.getItem('cart')
    if (cartData) {
      const { items, restaurantId } = JSON.parse(cartData)
      return { items, restaurantId }
    }
    return { items: [], restaurantId: null }
  },
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    isEmpty: (state) => state.items.length === 0
  },
  actions: {
    addItem(item, restaurantId) {
      if (this.restaurantId && this.restaurantId !== restaurantId) {
        this.clear()
      }
      
      this.restaurantId = restaurantId
      const existingItem = this.items.find(i => i.id === item.id)
      
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ ...item, quantity: 1 })
      }
      
      this.saveToLocalStorage()
    },
    removeItem(itemId) {
      this.items = this.items.filter(item => item.id !== itemId)
      if (this.items.length === 0) {
        this.restaurantId = null
      }
      this.saveToLocalStorage()
    },
    updateQuantity(itemId, quantity) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        item.quantity = quantity
        if (quantity <= 0) {
          this.removeItem(itemId)
        }
        this.saveToLocalStorage()
      }
    },
    clear() {
      this.items = []
      this.restaurantId = null
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify({
        items: this.items,
        restaurantId: this.restaurantId
      }))
    },
    loadFromLocalStorage() {
      const cartData = localStorage.getItem('cart')
      if (cartData) {
        const { items, restaurantId } = JSON.parse(cartData)
        this.items = items
        this.restaurantId = restaurantId
      }
    }
  }
})