
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, Sparkles, Star, X, Truck, ShieldCheck, BadgeCheck, CreditCard } from "lucide-react";
import { PRODUCTS } from "./products";

const SEK = (n) => n.toLocaleString("sv-SE", { style: "currency", currency: "SEK" });

export default function App(){
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [items, setItems] = useState([]); // {id, name, price, image, qty}

  const add = (p, qty=1) => {
    setItems(cur => {
      const i = cur.findIndex(x => x.id===p.id);
      if(i>=0){ const copy=[...cur]; copy[i] = {...copy[i], qty: copy[i].qty+qty}; return copy; }
      return [...cur, { id:p.id, name:p.name, price:p.price, image:p.image, qty }];
    });
  };
  const remove = (id) => setItems(cur => cur.filter(x=>x.id!==id));
  const setQty = (id, qty) => setItems(cur => cur.map(x => x.id===id ? {...x, qty: Math.max(1, qty)} : x));
  const clear = () => setItems([]);
  const subtotal = useMemo(()=> items.reduce((s,x)=>s+x.price*x.qty,0),[items]);
  const shipping = subtotal>800?0:(subtotal>0?49:0);
  const total = subtotal+shipping;

  const filtered = useMemo(()=>{
    let res = PRODUCTS.filter(p =>
      (cat==="all" || p.category===cat) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()))
    );
    if(sort==="price-asc") res.sort((a,b)=>a.price-b.price);
    if(sort==="price-desc") res.sort((a,b)=>b.price-a.price);
    if(sort==="rating") res.sort((a,b)=>Number(b.rating)-Number(a.rating));
    return res;
  },[query,cat,sort]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Header query={query} setQuery={setQuery} sort={sort} setSort={setSort} cat={cat} setCat={setCat} onCart={()=>setCartOpen(true)} />

      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p => (
            <article key={p.id} className="group rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border bg-white">
              <div className="relative">
                <img src={p.image} alt={p.name} className="h-64 w-full object-cover"/>
                {p.badge && <span className="absolute top-3 left-3 bg-white/90 text-zinc-900 text-xs font-medium px-2 py-1 rounded-full shadow">{p.badge}</span>}
              </div>
              <div className="p-4">
                <h3 className="font-medium leading-tight line-clamp-2">{p.name}</h3>
                <div className="mt-1 flex items-center gap-1 text-amber-600 text-sm">
                  <Star className="h-4 w-4 fill-current"/><span>{p.rating}</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-lg font-semibold">{SEK(p.price)}</div>
                  {p.oldPrice && <div className="text-sm text-zinc-400 line-through">{SEK(p.oldPrice)}</div>}
                </div>
                <p className="text-sm text-zinc-600 line-clamp-2 mt-2">{p.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button className="flex-1 rounded-xl bg-black text-white px-4 py-2 text-sm font-medium hover:bg-zinc-800" onClick={()=>add(p)}>Lägg i varukorg</button>
                  <button className="rounded-xl border px-4 py-2 text-sm" onClick={()=>{ add(p); setCheckoutOpen(true); }}>Köp nu</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />

      {cartOpen && <CartDrawer items={items} setQty={setQty} remove={remove} subtotal={subtotal} shipping={shipping} total={total} onClose={()=>setCartOpen(false)} onCheckout={()=>{setCartOpen(false); setCheckoutOpen(true);}} />}
      {checkoutOpen && <CheckoutModal total={total} subtotal={subtotal} shipping={shipping} items={items} onClose={()=>setCheckoutOpen(false)} onSuccess={()=>{ alert("Tack för din beställning! (simulerad)"); clear(); setCheckoutOpen(false); }} />}
    </div>
  )
}

function Header({query,setQuery,sort,setSort,cat,setCat,onCart}){
  const cats = [
    ["all","Alla"],["home","Hem"],["tech","Tech"],["beauty","Skönhet"],
    ["outdoor","Outdoor"],["fitness","Träning"],["pet","Husdjur"],["kids","Barn"]
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
        <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-black text-white grid place-items-center shadow-sm">
            <Sparkles className="h-5 w-5"/>
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">Nordic Drop</div>
            <div className="text-xs text-zinc-500 -mt-0.5">Kvalitet • Snabb leverans</div>
          </div>
        </motion.div>

        <nav className="hidden md:flex items-center gap-2 ml-6">
          {cats.map(([id, name])=>(
            <button key={id} onClick={()=>setCat(id)} className={`px-3 py-1.5 rounded-full text-sm ${cat===id ? "bg-black text-white" : "hover:bg-zinc-100"}`}>{name}</button>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2 w-72 max-w-[50vw]">
          <div className="relative w-full">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Sök produkter…" className="pl-9 w-full border rounded-full py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"/>
          </div>
          <select value={sort} onChange={(e)=>setSort(e.target.value)} className="border rounded-full py-2 px-3 text-sm">
            <option value="featured">Utvalt</option>
            <option value="price-asc">Pris: Lågt → Högt</option>
            <option value="price-desc">Pris: Högt → Lågt</option>
            <option value="rating">Betyg</option>
          </select>
        </div>

        <button onClick={onCart} className="rounded-full p-2 bg-black text-white ml-2">
          <ShoppingCart className="h-5 w-5"/>
        </button>
      </div>
    </header>
  )
}

function Hero(){
  return (
    <section className="bg-gradient-to-b from-white to-zinc-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1 initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.05}} className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Sälj snyggt. Skala smart.
          </motion.h1>
          <p className="text-zinc-600 mt-3 max-w-prose">
            En modern dropshipping-butik med 100 produkter, optimerad för konvertering och byggd med React och Tailwind.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#root"><button className="px-4 py-2 rounded-xl bg-black text-white text-sm">Utforska produkter</button></a>
            <button className="px-4 py-2 rounded-xl border text-sm">Läs mer</button>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm text-zinc-600">
            <div className="flex items-center gap-1"><Star className="h-4 w-4"/> Kundbetyg 4.8</div>
            <div className="flex items-center gap-1"><CreditCard className="h-4 w-4"/> PayPal • Mastercard • Swish</div>
          </div>
        </div>
        <motion.div initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}} className="relative">
          <img src="https://picsum.photos/seed/hero-nordic-drop/1200/800" alt="Hero" className="rounded-3xl shadow-2xl border"/>
          <span className="absolute bottom-4 left-4 text-sm py-2 px-3 rounded-full bg-black text-white">Premium-kollektion</span>
        </motion.div>
      </div>
    </section>
  )
}

function CartDrawer({items,setQty,remove,subtotal,shipping,total,onClose,onCheckout}){
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <aside className="absolute right-0 top-0 h-full w-[90vw] sm:w-[420px] bg-white shadow-xl p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-lg">Varukorg</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-zinc-100"><X className="h-5 w-5"/></button>
        </div>
        <div className="space-y-3">
          {items.length===0 && <div className="text-sm text-zinc-500">Din varukorg är tom.</div>}
          {items.map(it=>(
            <div key={it.id} className="flex gap-3 items-center">
              <img src={it.image} alt={it.name} className="h-16 w-16 object-cover rounded-xl border"/>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{it.name}</div>
                <div className="text-xs text-zinc-500">{SEK(it.price)}</div>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={()=>setQty(it.id, it.qty-1)} className="border rounded px-2">-</button>
                  <div className="w-6 text-center text-sm">{it.qty}</div>
                  <button onClick={()=>setQty(it.id, it.qty+1)} className="border rounded px-2">+</button>
                </div>
              </div>
              <button onClick={()=>remove(it.id)} className="p-1 rounded hover:bg-zinc-100"><X className="h-4 w-4"/></button>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>Delsumma</span><span>{SEK(subtotal)}</span></div>
          <div className="flex justify-between"><span>Frakt</span><span>{shipping===0 ? "Gratis" : SEK(shipping)}</span></div>
          <div className="flex justify-between font-semibold text-base pt-1"><span>Totalt</span><span>{SEK(total)}</span></div>
        </div>

        <button onClick={onCheckout} disabled={items.length===0} className="mt-3 w-full rounded-xl bg-black text-white py-2 font-medium disabled:opacity-50">Gå till kassan</button>

        <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
          <Truck className="h-4 w-4"/> Snabb leverans
          <ShieldCheck className="h-4 w-4"/> 30 dagars öppet köp
          <BadgeCheck className="h-4 w-4"/> Säker betalning
        </div>
      </aside>
    </div>
  )
}

function CheckoutModal({items,subtotal,shipping,total,onClose,onSuccess}){
  const [method, setMethod] = useState("card"); // card | paypal | swish
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[900px] bg-white rounded-2xl shadow-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Kassa</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-zinc-100"><X className="h-5 w-5"/></button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm">E-post</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" className="w-full border rounded-xl px-3 py-2"/>
            </div>
            <div>
              <label className="text-sm">Namn</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="För- och efternamn" className="w-full border rounded-xl px-3 py-2"/>
            </div>
            <div>
              <label className="text-sm">Adress</label>
              <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Gatuadress" className="w-full border rounded-xl px-3 py-2"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Postnummer</label>
                <input value={zip} onChange={e=>setZip(e.target.value)} placeholder="123 45" className="w-full border rounded-xl px-3 py-2"/>
              </div>
              <div>
                <label className="text-sm">Ort</label>
                <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Stockholm" className="w-full border rounded-xl px-3 py-2"/>
              </div>
            </div>
            <div>
              <label className="text-sm mb-1 block">Betalmetod</label>
              <div className="grid gap-2">
                <label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer">
                  <input type="radio" checked={method==="card"} onChange={()=>setMethod("card")}/>
                  <span>Kort (Mastercard m.fl.)</span>
                </label>
                <label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer">
                  <input type="radio" checked={method==="paypal"} onChange={()=>setMethod("paypal")}/>
                  <span>PayPal</span>
                </label>
                <label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer">
                  <input type="radio" checked={method==="swish"} onChange={()=>setMethod("swish")}/>
                  <span>Swish</span>
                </label>
              </div>
            </div>

            {method==="swish" && (
              <div>
                <label className="text-sm">Mobilnummer (Swish)</label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07x-xxxxxxx" className="w-full border rounded-xl px-3 py-2"/>
                <p className="text-xs text-zinc-500 mt-1">Du kommer att få en betalningsförfrågan i Swish-appen (simulerad här).</p>
              </div>
            )}

            {method==="card" && <p className="text-sm text-zinc-500">Här placeras kortformuläret (Stripe/Nets). I demot är det utelämnat.</p>}
            {method==="paypal" && <p className="text-sm text-zinc-500">Här renderas PayPal-knappen via SDK i produktion.</p>}
          </div>

          <div className="rounded-2xl border bg-white p-4 h-fit">
            <div className="font-semibold mb-2">Din order</div>
            <div className="space-y-3 max-h-64 overflow-auto pr-1">
              {items.map((it)=>(
                <div key={it.id} className="flex items-center gap-3">
                  <img src={it.image} alt={it.name} className="h-12 w-12 rounded-lg object-cover border"/>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{it.name}</div>
                    <div className="text-xs text-zinc-500">x {it.qty} • {SEK(it.price)}</div>
                  </div>
                  <div className="text-sm font-medium">{SEK(it.qty*it.price)}</div>
                </div>
              ))}
            </div>
            <div className="my-3 border-t" />
            <div className="text-sm space-y-1">
              <div className="flex justify-between"><span>Delsumma</span><span>{SEK(subtotal)}</span></div>
              <div className="flex justify-between"><span>Frakt</span><span>{shipping===0?'Gratis':SEK(shipping)}</span></div>
              <div className="flex justify-between font-semibold text-base pt-1"><span>Totalt</span><span>{SEK(total)}</span></div>
            </div>
            <button onClick={onSuccess} disabled={items.length===0} className="w-full mt-4 rounded-xl bg-black text-white py-2 font-medium disabled:opacity-50">
              Betala {SEK(total)}
            </button>
            <p className="text-xs text-zinc-500 mt-2">Genom att fortsätta godkänner du våra köpvillkor och integritetspolicy.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Footer(){
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-semibold">Nordic Drop</div>
          <p className="text-zinc-600 mt-2">En snygg, snabb och trygg dropshipping-butik för den nordiska marknaden.</p>
        </div>
        <div>
          <div className="font-semibold">Kundservice</div>
          <ul className="mt-2 space-y-2 text-zinc-600">
            <li>Frakt & leverans</li>
            <li>Byten & returer</li>
            <li>Integritetspolicy</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Företag</div>
          <ul className="mt-2 space-y-2 text-zinc-600">
            <li>Om oss</li>
            <li>Hållbarhet</li>
            <li>Kontakta oss</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Betalning</div>
          <div className="flex items-center gap-2 mt-2 text-zinc-600">
            <CreditCard className="h-4 w-4"/> PayPal, Mastercard & Swish stöds i kassan
          </div>
        </div>
      </div>
    </footer>
  )
}
