// Central State Object
const state = {
  rates: {},
  selectedCurrency: '',
  conversionResult: null,
  watchlist: [], // Loaded from localStorage on init
  status: {
    loading: false,
    error: null
  }
};

// DOM Elements
const convertForm = document.getElementById('convert-form');
const amountInput = document.getElementById('amount');
const currencySelect = document.getElementById('currency-select');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
const watchlistUl = document.getElementById('watchlist');
const addWatchlistBtn = document.getElementById('add-watchlist-btn');

// --- Persistence Helpers (save and load) ---
function save() {
  localStorage.setItem('currency_watchlist', JSON.stringify(state.watchlist));
}

function load() {
  const savedData = localStorage.getItem('currency_watchlist');
  if (savedData) {
    try {
      state.watchlist = JSON.parse(savedData);
    } catch (err) {
      console.error('Failed to parse watchlist from localStorage:', err);
      state.watchlist = [];
    }
  }
}

// 1. Fetch live exchange rates
async function loadRates() {
  state.status.loading = true;
  state.status.error = null;
  render();

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    
    if (!res.ok) {
      throw new Error(`Failed to fetch exchange rates (HTTP ${res.status})`);
    }

    const data = await res.json();
    state.rates = data.rates;
  } catch (err) {
    state.status.error = err.message || 'An unexpected error occurred.';
  } finally {
    state.status.loading = false;
    render();
  }
}

// 2. Convert Form Submit Event
convertForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const rawAmount = amountInput.value.trim();
  const selectedCurrency = currencySelect.value;
  const parsedAmount = Number(rawAmount);

  if (!rawAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
    state.status.error = 'Please enter a valid positive number for amount.';
    state.conversionResult = null;
    render();
    return;
  }

  if (!selectedCurrency || !state.rates[selectedCurrency]) {
    state.status.error = 'Please select a target currency.';
    state.conversionResult = null;
    render();
    return;
  }

  state.status.error = null;
  const rate = state.rates[selectedCurrency];
  const convertedTotal = (parsedAmount * rate).toFixed(2);

  state.conversionResult = `${parsedAmount} USD = ${convertedTotal} ${selectedCurrency} (Rate: ${rate})`;
  render();
});

// 3. Add to Watchlist (With save)
addWatchlistBtn.addEventListener('click', () => {
  const selectedCurrency = currencySelect.value;

  if (!selectedCurrency) {
    state.status.error = 'Please select a currency to add to your watchlist.';
    render();
    return;
  }

  // Guard against duplicate entries
  if (state.watchlist.includes(selectedCurrency)) {
    state.status.error = `${selectedCurrency} is already in your watchlist.`;
    render();
    return;
  }

  state.status.error = null;
  state.watchlist.push(selectedCurrency);
  
  // Save to localStorage whenever state.watchlist changes
  save();
  render();
});

// 4. Delegated Click Listener to remove a row by data-c (With save)
watchlistUl.addEventListener('click', (event) => {
  const currencyToRemove = event.target.dataset.c;

  if (currencyToRemove) {
    state.watchlist = state.watchlist.filter((c) => c !== currencyToRemove);
    
    // Save to localStorage whenever state.watchlist changes
    save();
    render();
  }
});

// 5. Render Functions
function renderWatchlist() {
  watchlistUl.innerHTML = '';

  if (state.watchlist.length === 0) {
    watchlistUl.innerHTML = '<li>No currencies in watchlist.</li>';
    return;
  }

  state.watchlist.forEach((currency) => {
    const li = document.createElement('li');
    const rate = state.rates[currency] || 'N/A';

    li.innerHTML = `
      <span><strong>${currency}</strong>: ${rate}</span>
      <button type="button" class="remove-btn" data-c="${currency}">Remove</button>
    `;
    watchlistUl.appendChild(li);
  });
}

function render() {
  // Render Status
  if (state.status.loading) {
    statusDiv.textContent = 'Loading latest exchange rates...';
    statusDiv.style.color = '#2563eb';
    return;
  }

  if (state.status.error) {
    statusDiv.textContent = `Error: ${state.status.error}`;
    statusDiv.style.color = '#dc2626';
  } else {
    statusDiv.textContent = '';
  }

  // Render Dropdown options
  const currentSelection = currencySelect.value;
  currencySelect.innerHTML = '<option value="">-- Select Currency --</option>';

  Object.keys(state.rates).forEach((currency) => {
    const option = document.createElement('option');
    option.value = currency;
    option.textContent = currency;
    if (currency === currentSelection) {
      option.selected = true;
    }
    currencySelect.appendChild(option);
  });

  // Render Result
  resultDiv.textContent = state.conversionResult || '';

  // Render Watchlist
  renderWatchlist();
}

// 6. Initialization Sequence
async function init() {
  load();       // Load saved watchlist into state from localStorage
  await loadRates(); // Fetch live rates and trigger initial render
}

document.addEventListener('DOMContentLoaded', init);