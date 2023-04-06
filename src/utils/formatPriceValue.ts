export function formatPriceValue(price:Number){
    const priceString = String(price.toLocaleString()).padStart(3,'0');
    return `${priceString.slice(0,-2)},${priceString.slice(-2)}`
}