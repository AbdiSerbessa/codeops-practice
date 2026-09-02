import { CartProvider } from './cart/CartProvider';
import Menu from './Components/Menu/Menu';

export default function App() {
  return (
    <CartProvider>
      <main>
        <Menu />
      </main>
    </CartProvider>
  );
}