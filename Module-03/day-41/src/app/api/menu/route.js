// src/app/api/menu/route.js
import { NextResponse } from 'next/server';

// Mock database or your dish collection
const dishes = [
  { id: 'dish_1', name: 'Doro Wat', category: 'Main', price: 350, currency: 'ETB', description: 'Traditional spicy chicken stew served with injera and boiled egg.' },
  { id: 'dish_2', name: 'Beyaynetu', category: 'Main', price: 220, currency: 'ETB', description: 'Assorted vegetarian platter with various vegetable stews on injera.' },
  { id: 'dish_3', name: 'Kitfo', category: 'Main', price: 400, currency: 'ETB', description: 'Minced raw or lightly cooked beef seasoned with mitmita and kocho.' },
  { id: 'dish_4', name: 'Tibs', category: 'Main', price: 380, currency: 'ETB', description: 'Sauteed chunks of beef or lamb cooked with onions, garlic, and peppers.' },
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