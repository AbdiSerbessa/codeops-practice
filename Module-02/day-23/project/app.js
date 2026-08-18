// Global Central State
const state = {
  menuItems: [],
  filters: {
    searchQuery: '',
    category: 'all'
  },
  cart: []
};

// DOM References
const menuGrid = document.getElementById('menu-grid');
const searchInput = document.getElementById('search-input');
const categoryButtonsContainer = document.getElementById('category-buttons');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// --- 1. Fetch JSON Data ---
async function fetchMenuData() {
  try {
    const response = await fetch('./data/menu.json');
    if (!response.ok) throw new Error('Failed to load menu data');
    state.menuItems = await response.json();
    render();
  } catch (error) {
    menuGrid.innerHTML = `<p class="error-msg">Error loading menu items: ${error.message}</p>`;
  }
}

// --- 2. Filter & Interaction Logic ---
function getFilteredItems() {
  return state.menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(state.filters.searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(state.filters.searchQuery.toLowerCase());
    const matchesCategory = state.filters.category === 'all' || item.category === state.filters.category;
    return matchesSearch && matchesCategory;
  });
}

function addToCart(itemId) {
  const existingItem = state.cart.find((item) => item.id === itemId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const menuItem = state.menuItems.find((item) => item.id === itemId);
    if (menuItem) {
      state.cart.push({ ...menuItem, quantity: 1 });
    }
  }
  render();
}

function updateQuantity(itemId, change) {
  const targetIndex = state.cart.findIndex((item) => item.id === itemId);
  if (targetIndex !== -1) {
    state.cart[targetIndex].quantity += change;
    if (state.cart[targetIndex].quantity <= 0) {
      state.cart.splice(targetIndex, 1);
    }
  }
  render();
}

// --- 3. Render Functions ---
function renderMenu() {
  const filtered = getFilteredItems();

  if (filtered.length === 0) {
    menuGrid.innerHTML = '<p class="empty-msg">No food items found matching your criteria.</p>';
    return;
  }

  menuGrid.innerHTML = filtered.map((item) => `
    <article class="menu-card">
      <img src="${item.image}" alt="${item.name}">
      <div class="menu-card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="price-row">
          <span class="price">${item.price} ETB</span>
          <button class="add-btn" data-id="${item.id}">+ Add</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderCart() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartCount.textContent = totalCount;
  cartTotal.textContent = totalPrice;
  checkoutBtn.disabled = state.cart.length === 0;

  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    return;
  }

  cartItemsContainer.innerHTML = state.cart.map((item) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <div><small>${item.price} ETB × ${item.quantity}</small></div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
      </div>
    </div>
  `).join('');
}

function render() {
  renderMenu();
  renderCart();
}

// --- 4. Event Listeners ---
searchInput.addEventListener('input', (e) => {
  state.filters.searchQuery = e.target.value;
  renderMenu();
});

categoryButtonsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    state.filters.category = e.target.dataset.category;
    renderMenu();
  }
});

menuGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('add-btn')) {
    const itemId = Number(e.target.dataset.id);
    addToCart(itemId);
  }
});

cartItemsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('qty-btn')) {
    const itemId = Number(e.target.dataset.id);
    const action = e.target.dataset.action;
    updateQuantity(itemId, action === 'increase' ? 1 : -1);
  }
});

checkoutBtn.addEventListener('click', () => {
  if (state.cart.length > 0) {
    // Example: Redirect to a checkout page
    // window.location.href = 'checkout.html';
    
    // Or clear cart and confirm
    alert('Order placed successfully!');
    state.cart = [];
    render();
  }
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', fetchMenuData);