
const signupForm = document.getElementById('signup-form');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const errorArea = document.getElementById('error-message');
const signupCountDisplay = document.getElementById('signup-count');


const ETHIOPIAN_PHONE_REGEX = /^(?:\+251|0)[97]\d{8}$/;

document.addEventListener('DOMContentLoaded', updateSignupCount);

signupForm.addEventListener('submit', (event) => {

  event.preventDefault();

 
  clearError();

  const nameValue = nameInput.value.trim();
  const phoneValue = phoneInput.value.trim();

  if (nameValue.length < 2) {
    showError('Name must be at least two characters long.');
    nameInput.focus();
    return;
  }

  if (!ETHIOPIAN_PHONE_REGEX.test(phoneValue)) {
    showError('Please enter a valid Ethiopian phone number (e.g., 0912345678 or +251912345678).');
    phoneInput.focus();
    return;
  }

  const savedSignups = getSavedSignups();
  savedSignups.push({ name: nameValue, phone: phoneValue });
  localStorage.setItem('signups', JSON.stringify(savedSignups));

 
  signupForm.reset();

  updateSignupCount();
});


function getSavedSignups() {
  const data = localStorage.getItem('signups');
  return data ? JSON.parse(data) : [];
}

function updateSignupCount() {
  const signups = getSavedSignups();
  if (signupCountDisplay) {
    signupCountDisplay.textContent = signups.length;
  }
}

function showError(message) {
  errorArea.textContent = message;
  errorArea.style.display = 'block';
}

function clearError() {
  errorArea.textContent = '';
  errorArea.style.display = 'none';
}