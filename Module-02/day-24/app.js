const state = {
  menu: [],
  cart: [],
  filters: { query: '', category: 'all' }
};


const menuGrid = document.getElementById('menu-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutForm = document.getElementById('checkout-form');


async function loadMenu() {
  try {
    const res = await fetch('menu.json');
    if (!res.ok) throw new Error('Network error');
    state.menu = await res.json();
    render();
  } catch (err) {
    menuGrid.innerHTML = `<p class="error">Failed to load menu items.</p>`;
  }
}


function addToCart(id) {
  const existing = state.cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    const item = state.menu.find(m => m.id === id);
    state.cart.push({ ...item, quantity: 1 });
  }
  render();
}

function updateQty(id, delta) {
  const idx = state.cart.findIndex(item => item.id === id);
  if (idx !== -1) {
    state.cart[idx].quantity += delta;
    if (state.cart[idx].quantity <= 0) state.cart.splice(idx, 1);
  }
  render();
}


function render() {
  // Render Menu Grid
  const filtered = state.menu.filter(item => {
    const q = state.filters.query.toLowerCase();
    const matchQuery = item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    const matchCat = state.filters.category === 'all' || item.category === state.filters.category;
    return matchQuery && matchCat;
  });

  menuGrid.innerHTML = filtered.map(item => `
    <div class="card">
      <img src="${item.image}" alt="${item.name}">
      <div class="card-body">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <div class="price-row">
          <span class="price">${item.price} ETB</span>
          <button class="add-btn" onclick="addToCart(${item.id})">+ Add</button>
        </div>
      </div>
    </div>
  `).join('');

 
  const totalCount = state.cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = state.cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  cartCount.textContent = totalCount;
  cartTotal.textContent = `${totalPrice} ETB`;
  checkoutBtn.disabled = state.cart.length === 0;

  cartItemsContainer.innerHTML = state.cart.length === 0 
    ? '<p style="font-size: 0.8rem; color: #64748b;">Cart is empty.</p>'
    : state.cart.map(item => `
        <div class="cart-item">
          <div><strong>${item.name}</strong><br><small>${item.price} ETB x ${item.quantity}</small></div>
          <div>
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          </div>
        </div>
      `).join('');
}


function validateField(fieldId, errorId, ruleFn, errorMsg) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  const isValid = ruleFn(input.value.trim());

  if (!isValid) {
    input.classList.add('invalid');
    errorEl.textContent = errorMsg;
    return false;
  } else {
    input.classList.remove('invalid');
    errorEl.textContent = '';
    return true;
  }
}

function validateCheckoutForm() {
  const isNameValid = validateField('cust-name', 'err-name', val => val.length >= 3, 'Name must be at least 3 characters.');
  const isPhoneValid = validateField('cust-phone', 'err-phone', val => /^09\d{8}$|^07\d{8}$/.test(val), 'Enter a valid 10-digit phone (09... or 07...).');
  const isAddressValid = validateField('cust-address', 'err-address', val => val.length >= 5, 'Address must be at least 5 characters.');

  return isNameValid && isPhoneValid && isAddressValid;
}

document.getElementById('search-input').addEventListener('input', (e) => {
  state.filters.query = e.target.value;
  render();
});

document.getElementById('category-filters').addEventListener('click', (e) => {
  if (e.target.classList.contains('cat-btn')) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    state.filters.category = e.target.dataset.cat;
    render();
  }
});

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (state.cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  if (validateCheckoutForm()) {
    const name = document.getElementById('cust-name').value;
    alert(`Order placed successfully for ${name}! Total: ${cartTotal.textContent}`);
    state.cart = [];
    checkoutForm.reset();
    render();
  }
});


document.addEventListener('DOMContentLoaded', loadMenu);