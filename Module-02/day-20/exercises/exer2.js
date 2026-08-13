function render(data) {
  const output = document.querySelector('#output');
  output.innerHTML = `
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>City:</strong> ${data.address.city}</p>
  `;
}

async function loadAndRenderData() {
  try { 
    const res = await fetch('https://jsonplaceholder.typicode.com/users/8');
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }   
    const data = await res.json();
   
    render(data);

  } 
  
 catch (error) {
    console.error('Error fetching or rendering data:', error);
  }
}
loadAndRenderData();