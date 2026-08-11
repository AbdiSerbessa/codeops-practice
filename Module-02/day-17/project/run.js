import { makeReceiptMaker } from './order.js';

const makeStandardReceipt = makeReceiptMaker(0);

const makeMemberReceipt = makeReceiptMaker(0.10);

console.log(makeStandardReceipt(120, 200));
console.log(makeStandardReceipt(150, 250));

console.log(makeMemberReceipt(100, 300)); 