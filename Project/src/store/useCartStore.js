import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: item.quantity || 1 }] };
    }),
    updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
      ),
    })),
    
  removeFromCart: (id) =>
    set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
  clearCart: () => set({ cart: [] }),
}));