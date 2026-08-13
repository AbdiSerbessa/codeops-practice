const statusContainer = document.getElementById('status-container');
const retryBtn = document.getElementById('retry-btn');

async function fetchData() {
    statusContainer.className = 'loading';
    statusContainer.textContent = 'Loading...';

    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');

        if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }
        const data = await res.json();

        statusContainer.className = 'data';
        statusContainer.innerHTML = `
        <strong>Title : </strong> ${data.title}<br>
        <strong>Completed:</strong> ${data.completed ? 'Yes' : 'No'}
        `;
    } 
    catch (error) {
        statusContainer.className = 'error';
        statusContainer.textContent = `Error : ${error.message}`;
        
    }
    
}

fetchData();

retryBtn.addEventListener('click',fetchData);