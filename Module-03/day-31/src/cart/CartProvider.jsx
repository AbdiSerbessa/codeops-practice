import { createContext, useContext, useReducer, useMemo } from 'react';
import { cartReducer, initialCartState } from './cartReducer';

const CartContext = createContext(null); // <--- Must be defined outside component

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const totalETB = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [state.items]);

  const itemCount = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

 // src/cart/CartProvider.jsx
const contextValue = useMemo(() => ({
  items: state.items,
  totalETB,
  itemCount,
  addItem: (dish) => dispatch({ type: 'ADD_ITEM', payload: dish }),
  decrementItem: (id) => dispatch({ type: 'DECREMENT_ITEM', payload: id }),
  clearCart: () => dispatch({ type: 'CLEAR_CART' })
}), [state.items, totalETB, itemCount]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}