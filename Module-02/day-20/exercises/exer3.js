async function testNetworkError() {
    try {
        const res = await fetch('https://invalid-domain-does-not-exist-12345.com');
        const data = await res.json();
        console.log('Success:',data);
    } 
    
    catch (error) {
        console.log('catch block triggered (Network Error):',error.message);
    }
}


async function testHttp404Error() {
    try{
        const res = await fetch('https://jsonplaceholder.typicode.com/nonexistent-route');
        console.log(`HTTP Status: ${res.status}`);
        console.log(`res.ok value: ${res.ok}`);

        if (!res.ok){
            throw new Error(`HTTP Error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Success:',data);
    }
    catch (error){
        console.error('Cath block triggered (Handled 404):', error.message);

    }
    
}

async function runTest() {
    await testNetworkError();
    await testHttp404Error();
}
runTest();