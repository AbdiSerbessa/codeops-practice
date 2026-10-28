// src/app/cart/page.js
import CartContent from './CartContent';

export const metadata = {
  title: 'Your Cart',
  description: 'Review your selected Ethiopian dishes and order items before proceeding to checkout.',
};

export default function CartPage() {
  return <CartContent />;
}