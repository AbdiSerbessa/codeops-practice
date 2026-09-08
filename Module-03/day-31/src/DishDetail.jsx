import { useParams, useNavigate } from 'react';
import { useFetch } from './hooks/useFetch';
import { useCart } from './cart/CartProvider';

export default function DishDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: dishes, loading, error } = useFetch('/dishes.json');
  const { items, addItem, decrementItem } = useCart();

  if (loading) return <p>Loading dish details...</p>;
  if (error) return <p>Error loading dish details.</p>;

  const dish = dishes?.find((d) => String(d.id) === String(id));
  if (!dish) return <h3>Dish not found!</h3>;

  const cartItem = items.find((i) => String(i.id) === String(id));
  const count = cartItem ? cartItem.quantity : 0;

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a2238', borderRadius: '8px', color: '#fff' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '15px', cursor: 'pointer' }}>
        &larr; Back to Menu
      </button>
      <h2>{dish.name} {dish.spicy && <span>🌶️ Spicy</span>}</h2>
      <p style={{ fontSize: '1.2rem', color: '#10b981' }}>{dish.price} ETB</p>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        {count > 0 && (
          <button onClick={() => decrementItem(dish.id)}>−</button>
        )}
        <span>Qty: {count}</span>
        <button onClick={() => addItem(dish)}>+ Add to Cart</button>
      </div>
    </div>
  );
}