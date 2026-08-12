const customer = {
    name: "Abdi Serbessa",
    city: "Addis Ababa",
    balance: "5000"
};

for (const[key,value]of Object.entries(customer)){
    console.log(`${key}:${value}`);
}