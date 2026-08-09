'use strict';

function calculateSplit(rawBill, rawParytSize, paymentMethod='telebirr'){
        const bill = Number(rawBill);
        const partySize = Number(rawParytSize);
        const tipRate = bill > 300 ? 0.10 : 0.05;
        const tipAmount = tipRate*bill;
        let serviceFee = 0;
        switch(paymentMethod){
            case 'telebirr':
                serviceFee = 5;
                break;
            case 'CBE birr':
                  serviceFee = 3;
                  break;
            default:
                servicveFee = 0;
                break;               

        }
        const total = bill + tipAmount+serviceFee;
        const perPersonAmount = total/partySize;

        console.log(` Base bill : ${bill} ETB`);
        console.log(`Total : ${total} ETB`);
        console.log(`PerPersonAmount: ${partySize}`)

        return{total ,perPersonAmount}
}


calculateSplit("450",2,"CBE birr");
calculateSplit("200",5,"CBE birr")