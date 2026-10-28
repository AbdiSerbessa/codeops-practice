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
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: "dish_2",
    name: "Beyaynetu",
    description: "Assorted vegan fasting dishes served on injera.",
    price: 220,
    currency: "ETB",
    category: "Vegetarian",
    available: true,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: "dish_3",
    name: "Kitfo",
    description: "Minced beef seasoned with mitmita and niter kibbeh.",
    price: 400,
    currency: "ETB",
    category: "Main",
    available: true,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: "dish_4",
    name: "Tibs",
    description: "Sautéed chunks of beef or lamb cooked with onions, garlic, and rosemary.",
    price: 380,
    currency: "ETB",
    category: "Main",
    available: true,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: "dish_5",
    name: "Shiro Tegabeno",
    description: "Rich chickpea flour stew served bubbling hot in a clay pot.",
    price: 180,
    currency: "ETB",
    category: "Vegetarian",
    available: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: "dish_6",
    name: "Gomen Besiga",
    description: "Collard greens slow cooked with tender beef chunks and spiced butter.",
    price: 310,
    currency: "ETB",
    category: "Main",
    available: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: "dish_7",
    name: "Special Kitfo",
    description: "Premium minced beef served with ayib (cheese) and gomen.",
    price: 450,
    currency: "ETB",
    category: "Main",
    available: true,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: "dish_8",
    name: "Misir Wat",
    description: "Spicy red lentil stew simmered in berbere sauce.",
    price: 160,
    currency: "ETB",
    category: "Vegetarian",
    available: true,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: "dish_9",
    name: "Kik Alicha",
    description: "Mild split pea stew cooked with turmeric, garlic, and ginger.",
    price: 150,
    currency: "ETB",
    category: "Vegetarian",
    available: true,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80'
  }
];

// Persistent global orders store across hot reloads and server requests
global.dbStore = global.dbStore || {
  orders: [
    {
      id: 'ord_309',
      customer: 'Guluma Shigute',
      neighborhood: 'Phone: 0911124529',
      total: 350,
      totalAmount: 350,
      date: '2026-10-28',
      status: 'PENDING',
      courierLocation: [8.9806, 38.7578],
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ord_239',
      customer: 'Serbessa',
      neighborhood: 'Phone: 0943350427',
      total: 400,
      totalAmount: 400,
      date: '2026-10-28',
      status: 'PENDING',
      courierLocation: [8.9806, 38.7578],
      updatedAt: new Date().toISOString(),
    },
  ],
};

// Mock authenticated user session with staff role for admin access
const mockSessionUser = {
  id: "user_addis_101",
  name: "Abebe Bikila",
  email: "abebe@example.com",
  role: "staff",
};

/**
 * ORM-style database query interface
 */
export const db = {
  dish: {
    findMany: async () => [...mockDishes],
    findUnique: async ({ where }) =>
      mockDishes.find((d) => d.id === where?.id || d.id === where) || null,
  },
  order: {
    findMany: async () => [...global.dbStore.orders],
    findUnique: async (query) => {
      const targetId = typeof query === 'string' ? query : query?.id || query?.where?.id;
      return global.dbStore.orders.find((o) => o.id === targetId) || null;
    },
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
  const computedTotal =
    data.totalAmount ??
    data.total ??
    (data.cartItems
      ? data.cartItems.reduce(
          (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
          0
        )
      : 350);

  const newOrder = {
    id: `ord_${Math.floor(100 + Math.random() * 900)}`,
    customer: data.customerName || data.customer || mockSessionUser.name,
    neighborhood: data.neighborhood || 'Bole, Addis Ababa',
    total: computedTotal,
    totalAmount: computedTotal,
    date: new Date().toISOString().split('T')[0],
    ...data,
    status: 'PENDING',
    courierLocation: [8.9806, 38.7578],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  global.dbStore.orders.unshift(newOrder);
  return newOrder;
}

/**
 * Retrieve a specific order by ID
 */
export async function getOrder(id) {
  const order = global.dbStore.orders.find((o) => o.id === id);
  return order || null;
}

/**
 * Update order status
 */
export async function updateOrderStatus(id, newStatus) {
  const order = global.dbStore.orders.find((o) => o.id === id);
  if (!order) {
    throw new Error("Order not found");
  }

  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  return order;
}

/**
 * Mark an order as cancelled
 */
export async function markCancelled(id) {
  return updateOrderStatus(id, "CANCELLED");
}

/**
 * Read current authenticated user session
 */
export async function getSession() {
  return mockSessionUser;
}