// Demo product data
const products = [
{ id: 'n1', name: 'Aarohi Kundan Necklace', price: 1299, category: 'necklaces', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1200&auto=format&fit=crop' },
{ id: 'e1', name: 'Diya Jhumka Earrings', price: 499, category: 'earrings', image: 'https://images.unsplash.com/photo-1617038260897-41a55bcb5b1c?q=80&w=1200&auto=format&fit=crop' },
{ id: 'b1', name: 'Meera Golden Bangles (Set of 4)', price: 899, category: 'bangles', image: 'https://images.unsplash.com/photo-1622844991510-5e0e650ba9ee?q=80&w=1200&auto=format&fit=crop' },
{ id: 's1', name: 'Niharika Bridal Set', price: 2499, category: 'sets', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=1200&auto=format&fit=crop' }
];


const state = { filter: 'all', search: '', maxPrice: 3000, sort: 'new', cart: JSON.parse(localStorage.getItem('gg_cart')||'[]') };
const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });


function saveCart(){ localStorage.setItem('gg_cart', JSON.stringify(state.cart)); renderCart(); }
function addToCart(item){ const found = state.cart.find(c=>c.id===item.id); if(found) found.qty++; else state.cart.push({ ...item, qty:1 }); saveCart(); }
function removeFromCart(id){ state.cart = state.cart.filter(c=>c.id!==id); saveCart(); }
function updateQty(id, qty){ const it = state.cart.find(c=>c.id===id); if(!it) return; it.qty = Math.max(1, qty|0); saveCart(); }


function filteredProducts(){ return products.filter(p=> (state.filter==='all' || p.category===state.filter) && p.price <= state.maxPrice && p.name.toLowerCase().includes(state.search)); }
function sortProducts(list){ switch(state.sort){ case 'priceLow': return list.sort((a,b)=>a.price-b.price); case 'priceHigh': return list.sort((a,b)=>b.price-a.price); default: return list; } }


function renderGrid(){ const grid = document.getElementById('products'); const items = sortProducts(filteredProducts()); grid.innerHTML = items.map(p=>`
<article class="card">
<img src="${p.image}" alt="${p.name}" />
<div class="info">
<div class="title">${p.name}</div>
<div class="price">${fmt.format(p.price)}</div>
<div style="margin-top:8px"><button class="btn" data-id="${p.id}">Add to cart</button></div>
</div>
</article>
`).join('');


document.getElementById('emptyState').classList.toggle('hidden', items.length!==0);
grid.querySelectorAll('button[data-id]').forEach(b=>b.addEventListener('click', ()=>{ const prod = products.find(p=>p.id===b.dataset.id); addToCart(prod); }));
}


function renderCart(){ const wrap = document.getElementById('cartItems'); if(!wrap) return; if(state.cart.length===0) wrap.innerHTML = '<div class="empty">Your cart is empty.</div>'; else wrap.innerHTML = state.cart.map(c=>`
<div class="cart-item">
<img src="${c.image}" alt="">
<div style="flex:1">
<div>${c.name}</div>
<div style="color:#666">${fmt.format(c.price)}</div>
<div style="margin-top:6px">Qty: <input type="number" min="1" value="${c.qty}" data-id="${c.id}" style="width:56px"></div>
</div>
<div style="text-align:right">
<div>${fmt.format(c.price*c.qty)}</div>
<button class="btn" data-remove="${c.id}" style="margin-top:6px">Remove</button>
</div>
</div>`).join('');


const subtotal = state.cart.reduce((s,i)=>s+i.price*i.qty,0);
document.getElementById('cartSubtotal').textContent = fmt.format(subtotal);
const count = state.cart.reduce((s,i)=>s+i.qty,0);
const badge = document.getElementById('cartCount'); if(count>0){ badge.textContent = count; badge.classList.remove('hidden'); } else { badge.classList.add('hidden'); }


wrap.querySelectorAll('input[type=number]').forEach(inp=>inp.addEventListener('change', ()=>updateQty(inp.dataset.id, +inp.value)));
wrap.querySelectorAll('button[data-remove]').forEach(b=>b.addEventListener('click', ()=>removeFromCart(b.dataset.remove)));
}


// init
renderGrid(); renderCart(); document.getElementById('year').textContent = new Date().getFullYear();


// UI events
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click', ()=>{ state.filter = b.dataset.filter; renderGrid(); }));
document.getElementById('price').addEventListener('input', e=>{ state.maxPrice = +e.target.value; document.getElementById('priceVal').textContent = e.target.value; renderGrid(); });
document.getElementById('sort').addEventListener('change', e=>{ state.sort = e.target.value; renderGrid(); });


// search
document.getElementById('search').addEventListener('input', e=>{ state.search = e.target.value.toLowerCase(); renderGrid(); });


// cart modal
const cartEl = document.getElementById('cart'); document.getElementById('cartBtn').addEventListener('click', ()=>cartEl.classList.toggle('hidden'));
document.getElementById('closeCart').addEventListener('click', ()=>cartEl.classList.add('hidden'));
document.getElementById('checkoutBtn').add