import Dish from '../Dish/Dish';

export default function DishList({ dishes }) {
  if (dishes.length === 0) {
    return <p className="empty-state">No dishes found matching your selection.</p>;
  }

  return (
    <div className="dish-grid">
      {dishes.map((dish) => (
        <Dish
          key={dish.id}
          id={dish.id}
          name={dish.name}
          price={dish.price}
          spicy={dish.spicy}
          imageUrl={dish.imageUrl}
        />
      ))}
    </div>
  );
}