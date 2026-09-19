import  { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('gursha_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [deliveryFee, setDeliveryFee] = useState(150); // Default delivery fee ETB 150

  useEffect(() => {
    localStorage.setItem('gursha_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          price: product.priceETB || product.price || 0,
          title: product.nameEn || product.title,
          tagline: `${product.category || 'Specialty'} | ${product.spiceLevel || 'Standard'}`,
        },
      ];
    });
  };

  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearBasket = () => setCartItems([]);

  // Base calculations
  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const injeraUpgradeFee = cartItems.length > 0 ? 60 : 0;
  const clayPakFee = cartItems.length > 0 ? 40 : 0;
  const vatAndLevy = Math.round(itemsSubtotal * 0.15);

  // Grand Total incorporating the delivery fee
  const grandTotal = itemsSubtotal + injeraUpgradeFee + clayPakFee + vatAndLevy + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        handleQuantityChange,
        handleRemoveItem,
        handleClearBasket,
        deliveryFee,
        setDeliveryFee,
        itemsSubtotal,
        injeraUpgradeFee,
        clayPakFee,
        vatAndLevy,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}