export const initialCartState = {
  items: []
};

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);

      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case 'DECREMENT_ITEM': {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload);
      if (existingIndex === -1) return state;

      const existingItem = state.items[existingIndex];
      if (existingItem.quantity > 1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: existingItem.quantity - 1,
        };
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
}