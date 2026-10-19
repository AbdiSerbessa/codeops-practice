/**
 * In-memory mock database and helper utilities for Addis Eats.
 * Provides data access functions for dishes, orders, and session management.
 */

// Mock dish records
const mockDishes = [
  {
    id: "dish_1",
    name: "Doro Wat",
    description: "Traditional spicy chicken stew served with injera and boiled egg.",
    price: 350,
    currency: "ETB",
    category: "Main",
    available: true,
  },
  {
    id: "dish_2",
    name: "Beyaynetu",
    description: "Assorted vegan fasting dishes served on injera.",
    price: 220,
    currency: "ETB",
    category: "Vegetarian",
    available: true,
  },
  {
    id: "dish_3",
    name: "Kitfo",
    description: "Minced beef seasoned with mitmita and niter kibbeh.",
    price: 400,
    currency: "ETB",
    category: "Main",
    available: true,
  },
  {
    id: "dish_4",
    name: "Shiro Tegabeno",
    description: "Rich chickpea flour stew served bubbling hot in a clay pot.",
    price: 180,
    currency: "ETB",
    category: "Vegetarian",
    available: true,
  },
  {
    id: "dish_5",
    name: "Sizzling Beef Tibs",
    description: "Sautéed beef cubes cooked with onions, rosemary, and green chilies.",
    price: 380,
    currency: "ETB",
    category: "Main",
    available: true,
  },
  {
    id: "dish_6",
    name: "Gomen Besiga",
    description: "Tender collard greens sautéed with seasoned beef and aromatic spices.",
    price: 320,
    currency: "ETB",
    category: "Main",
    available: true,
  },
  {
    id: "dish_7",
    name: "Special Beef Firfir",
    description: "Shredded injera tossed in spicy berbere sauce with beef tenderloin pieces.",
    price: 260,
    currency: "ETB",
    category: "Main",
    available: true,
  },
  {
    id: "dish_8",
    name: "Chechebsa (Kita Firfir)",
    description: "Pan-fried shredded flatbread tossed in spiced butter (niter kibbeh) and honey.",
    price: 190,
    currency: "ETB",
    category: "Breakfast",
    available: true,
  },
  {
    id: "dish_9",
    name: "Layered Spris Juice",
    description: "Freshly layered smoothie featuring mango, avocado, and papaya juice.",
    price: 120,
    currency: "ETB",
    category: "Beverage",
    available: true,
  },

];

// In-memory orders store
const mockOrders = [];

// Mock authenticated user session
const mockSessionUser = {
  id: "user_addis_101",
  name: "Abebe Bikila",
  email: "abebe@example.com",
};

/**
 * ORM-style database query interface
 */
export const db = {
  dish: {
    findMany: async () => [...mockDishes],
    findUnique: async ({ where }) =>
      mockDishes.find((d) => d.id === where.id) || null,
  },
  order: {
    findMany: async () => [...mockOrders],
  },
};

/**
 * Fetch a single dish by ID
 */
export async function getDish(id) {
  const dish = mockDishes.find((d) => d.id === id);
  return dish || null;
}

/**
 * Create a new order in memory
 */
export async function createOrder(data) {
  const newOrder = {
    id: `ord_${Math.floor(100 + Math.random() * 900)}`,
    ...data,
    status: "PENDING",
    userId: mockSessionUser.id,
    createdAt: new Date().toISOString(),
  };

  mockOrders.push(newOrder);
  return newOrder;
}

/**
 * Retrieve a specific order by ID
 */
export async function getOrder(id) {
  const order = mockOrders.find((o) => o.id === id);
  return order || null;
}

/**
 * Mark an order as cancelled
 */
export async function markCancelled(id) {
  const order = mockOrders.find((o) => o.id === id);
  if (!order) {
    throw new Error("Order not found");
  }

  order.status = "CANCELLED";
  order.updatedAt = new Date().toISOString();
  return order;
}

/**
 * Read current authenticated user session
 */
export async function getSession() {
  return mockSessionUser;
}