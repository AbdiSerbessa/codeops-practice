const prices = [200, 500, 800, 1200, 1500];

const grandTotal = prices
  .map((price) => price * 1.15)    
  .filter((priceWithVat) => priceWithVat < 1000) 
  .reduce((total, price) => total + price, 0);  
    
console.log(`Grand Total: ${grandTotal} ETB`);