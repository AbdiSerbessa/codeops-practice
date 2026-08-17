const state = {
  rates: {},
  conversions: [],
  status: {
    loading: false,
    error: null
  }
};

const convertForm = document.getElementById('convert-form');
const amountInput = document.getElementById('amount');
const currencySelect = document.getElementById('currency-select');
const statusDiv = document.getElementById('status');
const conversionsListUl = document.getElementById('conversions-list');

function save() {
  localStorage.setItem('currency_conversions', JSON.stringify(state.conversions));
}

function load() {
  const savedData = localStorage.getItem('currency_conversions');
  if (savedData) {
    try {
      state.conversions = JSON.parse(savedData);
    } catch (err) {
      console.error('Failed to parse conversions from localStorage:', err);
      state.conversions = [];
    }
  }
}

function getCountryCode(currency) {
  const customMap = { EUR: 'EU', GBP: 'GB', USD: 'US', ETB: 'ET', BTC: 'US' };
  return customMap[currency] || currency.slice(0, 2);
}

function getFlagEmoji(currency) {
  const countryCode = getCountryCode(currency).toUpperCase();
  if (countryCode.length !== 2) return '🌐';
  return String.fromCodePoint(...[...countryCode].map((char) => 127397 + char.charCodeAt(0)));
}

function getFlagUrl(currency) {
  const countryCode = getCountryCode(currency).toLowerCase();
  return `https://flagcdn.com/w20/${countryCode}.png`;
}

async function loadRates() {
  state.status.loading = true;
  state.status.error = null;
  render();

  try {
    const [res] = await Promise.all([
      fetch('https://open.er-api.com/v6/latest/ETB'),
      new Promise((resolve) => setTimeout(resolve, 1000))
    ]);

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
function validateFormInputs(rawAmount, selectedCurrency) {
  amountInput.classList.remove('invalid');
  currencySelect.classList.remove('invalid');

  if (!state.rates || Object.keys(state.rates).length === 0) {
    return { isValid: false, message: 'Exchange rates are not loaded yet. Please wait.' };
  }

  if (!rawAmount || rawAmount.trim() === '') {
    amountInput.classList.add('invalid');
    return { isValid: false, message: 'Amount is required.' };
  }

  const parsedAmount = Number(rawAmount);

  if (isNaN(parsedAmount) || !Number.isFinite(parsedAmount)) {
    amountInput.classList.add('invalid');
    return { isValid: false, message: 'Please enter a valid numeric amount.' };
  }

  if (parsedAmount <= 0) {
    amountInput.classList.add('invalid');
    return { isValid: false, message: 'Amount must be greater than zero.' };
  }

  if (parsedAmount > 100000000) {
    amountInput.classList.add('invalid');
    return { isValid: false, message: 'Amount exceeds maximum limit (100,000,000 ETB).' };
  }

  const decimalParts = rawAmount.split('.');
  if (decimalParts.length > 1 && decimalParts[1].length > 4) {
    amountInput.classList.add('invalid');
    return { isValid: false, message: 'Amount cannot exceed 4 decimal places.' };
  }

  if (!selectedCurrency || selectedCurrency.trim() === '') {
    currencySelect.classList.add('invalid');
    return { isValid: false, message: 'Please select a target currency.' };
  }

  if (!state.rates[selectedCurrency]) {
    currencySelect.classList.add('invalid');
    return { isValid: false, message: 'Exchange rate unavailable for selected currency.' };
  }

  return { isValid: true, parsedAmount, rate: state.rates[selectedCurrency] };
}

convertForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const rawAmount = amountInput.value;
  const selectedCurrency = currencySelect.value;

  const validation = validateFormInputs(rawAmount, selectedCurrency);

  if (!validation.isValid) {
    state.status.error = validation.message;
    renderStatus();
    return;
  }

  state.status.error = null;

  const latestConversion = state.conversions[0];
  if (
    latestConversion &&
    latestConversion.amount === validation.parsedAmount &&
    latestConversion.currency === selectedCurrency
  ) {
    state.status.error = 'This conversion is already at the top of your list.';
    renderStatus();
    return;
  }

  const convertedTotal = (validation.parsedAmount * validation.rate).toFixed(2);

  const conversionEntry = {
    id: Date.now(),
    amount: validation.parsedAmount,
    currency: selectedCurrency,
    convertedTotal: convertedTotal,
    rate: validation.rate
  };

  state.conversions.unshift(conversionEntry);
  save();
  render();
});

amountInput.addEventListener('input', () => {
  amountInput.classList.remove('invalid');
  if (state.status.error) {
    state.status.error = null;
    renderStatus();
  }
});

currencySelect.addEventListener('change', () => {
  currencySelect.classList.remove('invalid');
  if (state.status.error) {
    state.status.error = null;
    renderStatus();
  }
});

if (conversionsListUl) {
  conversionsListUl.addEventListener('click', (event) => {
    const idToRemove = Number(event.target.dataset.id);
    if (idToRemove) {
      state.conversions = state.conversions.filter((item) => item.id !== idToRemove);
      save();
      render();
    }
  });
}
function renderStatus() {
  if (state.status.loading) {
    statusDiv.innerHTML = '<div class="spinner"></div> Loading exchange rates...';
    statusDiv.style.color = '#2563eb';
    return;
  }

  if (state.status.error) {
    statusDiv.textContent = `Error: ${state.status.error}`;
    statusDiv.style.color = '#dc2626';
  } else {
    statusDiv.textContent = '';
  }
}

function renderConversions() {
  if (!conversionsListUl) return;

  conversionsListUl.innerHTML = '';

  if (state.conversions.length === 0) {
    conversionsListUl.innerHTML = '<li class="empty-msg">No conversions yet. Click Convert above!</li>';
    return;
  }

  state.conversions.forEach((item) => {
    const li = document.createElement('li');
    const flagUrl = getFlagUrl(item.currency);

    li.innerHTML = `
      <div class="conversion-info">
        <img src="${flagUrl}" alt="${item.currency} flag" class="flag-icon" onerror="this.style.display='none'">
        <span><strong>${item.amount} ETB</strong> = <strong>${item.convertedTotal} ${item.currency}</strong> <small>(Rate: ${item.rate})</small></span>
      </div>
      <button type="button" class="remove-btn" data-id="${item.id}">Remove</button>
    `;
    conversionsListUl.appendChild(li);
  });
}

function render() {
  renderStatus();

  const currentSelection = currencySelect.value;
  currencySelect.innerHTML = '<option value="">-- Select Currency --</option>';

  Object.keys(state.rates).forEach((currency) => {
    const option = document.createElement('option');
    option.value = currency;
    option.textContent = `${getFlagEmoji(currency)} ${currency}`;
    if (currency === currentSelection) {
      option.selected = true;
    }
    currencySelect.appendChild(option);
  });

  renderConversions();
}
async function init() {
  load();
  await loadRates();
}

document.addEventListener('DOMContentLoaded', init);