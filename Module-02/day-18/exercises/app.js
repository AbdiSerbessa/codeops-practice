import {VAT,addVat} from './money.js';

const basePrice=1000;
const finalPrice = addVat(basePrice);

console.log(`VAT Rate: ${VAT *100}%`);
console.log(`Price with VAT : ${finalPrice} ETB`);