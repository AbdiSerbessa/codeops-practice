const customer ={
    name: "Abdi Serbessa",
    city:"Addis Ababa",
    balance:5000

};

const updatedCustomer={
    ...customer,
    city:"Hawasa",
    phone:"+2159090905"

};

console.log("Original Customer:",customer);
console.log("Updated Customer:",updatedCustomer);