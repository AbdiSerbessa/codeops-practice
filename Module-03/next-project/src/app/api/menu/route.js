// src/app/api/menu/route.js
import { NextResponse } from 'next/server';

const dishes = [
  { 
    id: 'dish_1', 
    name: 'Doro Wat', 
    category: 'Main', 
    price: 350, 
    currency: 'ETB', 
    description: 'Traditional spicy chicken stew served with injera and boiled egg.',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 'dish_2', 
    name: 'Beyaynetu', 
    category: 'Vegetarian', 
    price: 220, 
    currency: 'ETB', 
    description: 'Assorted vegetarian platter with various vegetable stews on injera.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 'dish_3', 
    name: 'Kitfo', 
    category: 'Main', 
    price: 400, 
    currency: 'ETB', 
    description: 'Minced raw or lightly cooked beef seasoned with mitmita and kocho.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 'dish_4', 
    name: 'Tibs', 
    category: 'Main', 
    price: 380, 
    currency: 'ETB', 
    description: 'Sauteed chunks of beef or lamb cooked with onions, garlic, and peppers.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 'dish_5', 
    name: 'Shiro Tegabeno', 
    category: 'Vegetarian', 
    price: 180, 
    currency: 'ETB', 
    description: 'Rich chickpea flour stew cooked with garlic and herbs, served bubbling hot.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 'dish_6', 
    name: 'Gomen Besiga', 
    category: 'Main', 
    price: 320, 
    currency: 'ETB', 
    description: 'Collard greens slow-cooked with tender beef chunks and spiced butter.',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 'dish_7', 
    name: 'Shekla Tibs', 
    category: 'Main', 
    price: 450, 
    currency: 'ETB', 
    description: 'Sizzling prime beef served hot in a traditional clay pot over charcoal.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 'dish_8', 
    name: 'Chechebsa', 
    category: 'Breakfast', 
    price: 150, 
    currency: 'ETB', 
    description: 'Shredded flatbread fried with spices and niter kibbeh, served with honey or yogurt.',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 'dish_9', 
    name: 'Sambusa', 
    category: 'Appetizer', 
    price: 80, 
    currency: 'ETB', 
    description: 'Crispy pastry filled with spiced lentils, onions, and green chili.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category') || 'All';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 6; // items per page

  // Filter by category
  let filtered = category === 'All' 
    ? dishes 
    : dishes.filter(d => d.category.toLowerCase() === category.toLowerCase());

  // Filter by search query
  if (search) {
    filtered = filtered.filter(d => 
      d.name.toLowerCase().includes(search) || 
      d.description.toLowerCase().includes(search)
    );
  }

  // Pagination logic
  const startIndex = (page - 1) * limit;
  const paginatedDishes = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    dishes: paginatedDishes,
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / limit),
  });
}