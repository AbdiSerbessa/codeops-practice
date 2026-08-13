async function fetchParallelDetails() {
    try { 
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');

        if(!response.ok)throw new Error(`HTTP Error! Status : ${response.status}`);

        const postsList = await response.json();

        const firstTwoItems = postsList.slice(0,2);

        const detailPromise = firstTwoItems.map(async(item)=>{
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${item.id}`);
            if (!res.ok)throw new Error(`HTTP Error! Status: ${res.status}`);
            return res.json();
        });

        const [item1, item2] = await Promise.all(detailPromise);

        console.log('Item 1 Details :',item1);
        console.log(' Item 2 Details: ', item2);
        
    } catch (error) {
        console.log('Error fetching parallel data:',error);
    }
    
}

fetchParallelDetails();