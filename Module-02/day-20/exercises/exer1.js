async function getUsdToEtbRate() {
    try{
        const res =await fetch('https://open.er-api.com/v6/latest/USD');
        if(!res.ok) throw new Error(`HTTPS error ! Status: ${res.status}`);
        const data = await res.json();
        return data.rates.ETB;
    }
    catch(error){
        console.log('Error fetching rate:',error);
    }
    
}

getUsdToEtbRate().then(rate=>console.log('1 USD =', rate,'ETB'));