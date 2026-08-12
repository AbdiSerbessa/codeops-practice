
let items = [];


const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemCount = document.getElementById('item-count');
const listElement = document.getElementById('list');

function render() {
  listElement.innerHTML = '';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.dataset.id = item.id;

    if (item.bought) {
      li.classList.add('done');
    }

    li.innerHTML = `
      <span class="item-text">${item.name}</span>
      <button class="delete-btn" data-action="delete">Remove</button>
    `;

    listElement.appendChild(li);
  });

  const remainingCount = items.filter((item) => !item.bought).length;
  itemCount.textContent = `Items remaining: ${remainingCount}`;
}

itemForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = itemInput.value.trim();
  if (!name) return;

  // Mutate State Array
  items.push({
    id: Date.now().toString(),
    name: name,
    bought: false
  });

  itemInput.value = '';
  render();
});

listElement.addEventListener('click', (e) => {
  const row = e.target.closest('li');
  if (!row) return;

  const itemId = row.dataset.id;


  if (e.target.dataset.action === 'delete') {
    items = items.filter((item) => item.id !== itemId);
  } else {
    
    items = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, bought: !item.bought };
      }
      return item;
    });
  }

  render();
});


render();