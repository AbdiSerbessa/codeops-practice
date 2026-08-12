const customer ={
    name:"Abdi Serbessa",
    city:"Addis Ababa",
    balance:"5000"
};

const {name,city}=customer;

function great({name}){
    console.log(`Hello, ${name} ! welcome back.`);
}

console.log(`Customer:${name} from ${city}`);

great(customer);