//question 1. Write a vat(amount, rate = 0.15) function using a default parameter, then write the same logic as an arrow function with an implicit return.



//Standard Function Declaration

function vat (amount,rate=0.15){
    return amount*rate;
}

console.log(vat(100));
console.log(vat(100,0.20));

//arrow Function declaaration

const vat= (amount,rate=0.15)=>amount*rate;
console.log(vat(100));
console.log(vat(100,0.20));







// questin #2. Write a makeCounter closure that returns a function incrementing a private count. Call it several
// times and, in a comment, explain why count stays private.

function makeCounter(){
    let count=0; //private variable enclosed
    return function (){
        count++;
        return count;
    };
}

const counter = makeCounter();

console.log(counter());
console.log(counter());
console.log(counter());

/*
Why 'count' stays private:
\
Closure: The inner function maintains a reference to its surrounding lexical environment even after 'makeCounter' finishes execution. 
   This allows the returned inner function to read and update 'count' 
   without ever exposing 'count' to the outer global scope.
*/










//Question-3 3. Write a discountBy(rate) factory and create memberPrice (10%) and salePrice (30%) from it.Apply both to a price of 1000 ETB.

function discountBy(rate){
    return function (price){
        return price*(1-rate);
    }

}
const memberPrice = discountBy(0.10);
const salePrice=discountBy(0.30);

const originalPrice=1000;

console.log(`member price : ${memberPrice(originalPrice)} ETB`);

console.log(`sale price : ${salePrice(originalPrice)} ETB`);










//Question # 4. 4. Write a higher-order applyToAll(list, fn) that runs fn over every item and returns the results, then use it to add VAT to an array of prices.


function applyToAll(list, fn) {
  const result = [];
  for (const item of list) {
    result.push(fn(item));
  }
  return result;
}

const addVat = (price) => price * 1.15;

const prices = [100, 200, 500, 1000];
const pricesWithVat = applyToAll(prices, addVat);

console.log(pricesWithVat); 







//Question #5 Use forEach (a callback) to print each Ethiopian city in an array with its index, e.g. "1. AddisAbaba".


const cities = ["Addis Ababa","Adama","Hawasa"];
function printCity(city,index){
    console.log(`${index+1}.${city}`);
}

cities.forEach(printCity);