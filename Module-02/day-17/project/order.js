export const subtotal = (...prices) =>
  prices.reduce((sum, price) => sum + price, 0);

export const discountBy = (rate) => (amount) => amount * (1 - rate);

export const withVat = (amount, vatRate = 0.15) => amount * (1 + vatRate);
export const toETB = (amount) => `${amount} ETB`;

export function makeReceiptMaker(discountRate = 0) {
  let orderNumber = 1; 

  return function (...prices) {
    const rawSubtotal = subtotal(...prices);
    const discountedPrice = discountBy(discountRate)(rawSubtotal);
    const finalAmount = withVat(discountedPrice);

    const receipt = `#${orderNumber}: ${toETB(finalAmount)}`;
    orderNumber++; 
    return receipt;
  };
}