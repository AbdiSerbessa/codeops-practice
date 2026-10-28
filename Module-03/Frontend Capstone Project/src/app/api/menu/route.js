// src/app/api/menu/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category') || 'All';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 6; // items per page

  // Fetch directly from the centralized database
  const dishes = await db.dish.findMany();

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