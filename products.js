
const categories = ["home","tech","beauty","outdoor","fitness","pet","kids"];
export const PRODUCTS = Array.from({length:100}).map((_,i)=>{
  const price = 99 + (i%9)*50 + Math.round(Math.random()*40);
  const oldPrice = Math.random()>0.6 ? price + 80 + (i%5)*20 : null;
  const rating = (3 + (i%3) + (Math.random()>0.7?0.5:0)).toFixed(1);
  const category = categories[ Math.floor(Math.random()*categories.length) ];
  return {
    id: `p-${i+1}`,
    name: `Produkt ${i+1}`,
    description: "Elegant, noga utvald dropshipping-produkt med snabb leverans och trygg checkout.",
    price, oldPrice, rating, category,
    image: `https://picsum.photos/seed/ds${i+1}/800/800`,
    badge: Math.random()>0.8 ? "Bästsäljare" : (Math.random()>0.85 ? "Nyhet" : null),
  };
});
