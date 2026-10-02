/* Scared Read storefront — GitHub Pages compatible, no build step required. */
window.dataLayer = window.dataLayer || [];

const PRODUCTS = [
 {id:"SR-001",name:"The Quiet Path",category:"Spirituality",price:499,author:"Aarav Mehta",stock:12,desc:"A gentle exploration of stillness, purpose and the small rituals that help us reconnect with ourselves.",bg:"#304d43",fg:"#f6e7ce"},
 {id:"SR-002",name:"Letters to Tomorrow",category:"Self Help",price:399,author:"Mira Shah",stock:18,desc:"A collection of practical reflections for building better habits, making brave choices and moving forward with intention.",bg:"#b86f52",fg:"#fff4df"},
 {id:"SR-003",name:"The Inner Garden",category:"Mindfulness",price:549,author:"Dev Malhotra",stock:9,desc:"Simple mindfulness practices designed to help you notice more, worry less and make space for the present.",bg:"#d7c49f",fg:"#45382b"},
 {id:"SR-004",name:"Moonlit Stories",category:"Fiction",price:449,author:"Naina Kapoor",stock:15,desc:"Twelve atmospheric stories about ordinary people, unexpected encounters and the worlds we carry within us.",bg:"#55415f",fg:"#f5e8d5"},
 {id:"SR-005",name:"The Art of Enough",category:"Self Help",price:599,author:"Rhea Joshi",stock:7,desc:"A thoughtful guide to simplifying your choices, protecting your attention and defining success on your own terms.",bg:"#8a6a4b",fg:"#fff8e9"},
 {id:"SR-006",name:"Between Two Seasons",category:"Fiction",price:479,author:"Kabir Rao",stock:11,desc:"A warm coming-of-age novel about friendship, family and the courage to begin again.",bg:"#6d7b72",fg:"#f7f1e6"},
 {id:"SR-007",name:"Small Moments",category:"Mindfulness",price:349,author:"Ishita Sen",stock:20,desc:"Short daily prompts to turn ordinary moments into opportunities for attention, gratitude and calm.",bg:"#c6b7a2",fg:"#40362d"},
 {id:"SR-008",name:"The Way Within",category:"Spirituality",price:629,author:"Arjun Mehra",stock:6,desc:"An accessible introduction to inner inquiry, conscious living and finding meaning without rushing the answer.",bg:"#3f5265",fg:"#edf1ef"}
];

function money(n){return "₹"+Number(n).toLocaleString("en-IN");}
function getCart(){return JSON.parse(localStorage.getItem("sr_cart")||"[]");}
function saveCart(c){localStorage.setItem("sr_cart",JSON.stringify(c));updateCartCount();}
function getUser(){return JSON.parse(localStorage.getItem("sr_user")||"null");}
function pushEvent(eventName, params={}){
  const payload={event:eventName,...params};
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("scaredReadEvent",{detail:payload}));
  console.log("[Scared Read event]",payload);
}
function getAmplitudeUserId(){
  const u=getUser();
  return u ? u.user_id : undefined;
}
function fireAmplitudeEvent(eventName, params={}){
  const payload={...params,user_id:getAmplitudeUserId()};
  /* For Amplitude: when logged out/guest, user_id is actual JS undefined; logged-in is the generated ID. */
  window.dataLayer.push({event:eventName,amplitude_event_name:eventName,amplitude_user_id:payload.user_id,...params});
  console.log("[Amplitude-ready]",payload);
}
function fireEcommerce(eventName, ecommerce){
  pushEvent(eventName,{ecommerce});
  fireAmplitudeEvent(eventName,ecommerce);
}

function renderHeader(){
 const user=getUser(), cart=getCart();
 document.getElementById("site-header").innerHTML=`
 <div class="topbar">FREE SHIPPING ON ORDERS ABOVE ₹999 · MADE FOR CURIOUS READERS</div>
 <header class="navbar">
   <a class="logo" href="index.html">Scared Read<small>BOOKS · STORIES · IDEAS</small></a>
   <nav class="nav-links">
    <a href="index.html">Home</a>
    <div class="menu-wrap"><a href="#" id="browse-trigger">Browse ▾</a><div class="dropdown" id="browse-menu">
      <a href="shop.html">All Books</a><a href="shop.html?category=Spirituality">Spirituality</a><a href="shop.html?category=Self%20Help">Self Help</a><a href="shop.html?category=Mindfulness">Mindfulness</a><a href="shop.html?category=Fiction">Fiction</a>
    </div></div>
    <a href="shop.html">Shop</a>
   </nav>
   <div class="nav-actions">
     <button class="icon-btn" id="header-search" title="Search">⌕</button>
     <div class="menu-wrap"><button class="icon-btn" id="account-trigger" title="Account">♙</button><div class="dropdown" id="account-menu">${user?`<a href="account.html">My Account</a><a href="#" id="logout-link">Logout</a>`:`<a href="login.html">Login</a><a href="register.html">Register</a>`}</div></div>
     <a class="icon-btn" href="cart.html" title="Cart">🛒<span class="cart-count" id="cart-count">${cart.reduce((s,x)=>s+x.qty,0)}</span></a>
     <button class="icon-btn mobile-menu" id="mobile-trigger">☰</button>
   </div>
 </header>`;
 document.getElementById("browse-trigger").onclick=e=>{e.preventDefault();document.getElementById("browse-menu").classList.toggle("open");};
 document.getElementById("account-trigger").onclick=()=>document.getElementById("account-menu").classList.toggle("open");
 document.getElementById("header-search").onclick=()=>{const q=prompt("Search books");if(q)location.href="shop.html?search="+encodeURIComponent(q);}
 const logout=document.getElementById("logout-link"); if(logout)logout.onclick=e=>{e.preventDefault();logoutUser();}
}
function renderFooter(){
 document.getElementById("site-footer").innerHTML=`<footer class="site-footer"><div class="footer-grid">
 <div><a class="logo" href="index.html">Scared Read</a><p>A carefully curated home for books that make you pause, wonder and feel something.</p></div>
 <div class="footer-links"><h3>Explore</h3><a href="shop.html">Shop books</a><a href="shop.html?category=Spirituality">Spirituality</a><a href="shop.html?category=Self%20Help">Self Help</a><a href="shop.html?category=Fiction">Fiction</a></div>
 <div class="footer-links"><h3>Help</h3><a href="account.html">My account</a><a href="cart.html">Your cart</a><a href="checkout.html">Checkout</a></div>
 <div><h3>Stay in the loop</h3><p>New releases, reading lists and occasional notes. No noise.</p><form class="newsletter" id="newsletter-form"><input type="email" placeholder="Your email address" required><button>Join</button></form></div>
 </div><div class="copyright">© ${new Date().getFullYear()} Scared Read. Built for readers.</div></footer>`;
 document.getElementById("newsletter-form").onsubmit=e=>{e.preventDefault();const email=e.target.querySelector("input").value;pushEvent("newsletter_subscribe",{email});showToast("You're on the list. Welcome!");e.target.reset();};
}
function initShared(){renderHeader();renderFooter();}
document.addEventListener("DOMContentLoaded",initShared);

function coverHTML(p,cls="product-cover"){return `<div class="${cls}" style="background:${p.bg};color:${p.fg}"><div><div class="cover-title">${p.name}</div><div class="cover-author">${p.author}</div></div></div>`;}
function productCard(p){
 const wish=JSON.parse(localStorage.getItem("sr_wishlist")||"[]").includes(p.id);
 return `<article class="product-card"><button class="wishlist" data-wish="${p.id}" title="Wishlist">${wish?"♥":"♡"}</button><a href="product.html?id=${p.id}" data-view="${p.id}">${coverHTML(p)}</a><div class="product-info"><p>${p.category}</p><h3><a href="product.html?id=${p.id}">${p.name}</a></h3><p>by ${p.author}</p><div class="price">${money(p.price)}</div></div></article>`;
}
function renderFeaturedProducts(){
 const el=document.getElementById("featured-products");
 const featured=PRODUCTS.slice(0,4);
 if(el)el.innerHTML=featured.map(productCard).join("");
 fireEcommerce("view_item_list",{item_list_id:"home_featured",item_list_name:"Readers' favourites",items:featured.map(p=>itemObject(p))});
 attachWishlist();
 document.querySelectorAll("[data-view]").forEach(a=>a.onclick=()=>{
   const p=PRODUCTS.find(x=>x.id===a.dataset.view);
   fireEcommerce("select_item",{item_list_id:"home_featured",item_list_name:"Readers' favourites",items:[itemObject(p)]});
 });
}
function itemObject(p,qty=1){return {item_id:p.id,item_name:p.name,item_category:p.category,price:p.price,quantity:qty};}
function attachWishlist(){document.querySelectorAll("[data-wish]").forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();toggleWishlist(b.dataset.wish);});}
function toggleWishlist(id){let w=JSON.parse(localStorage.getItem("sr_wishlist")||"[]");const p=PRODUCTS.find(x=>x.id===id);if(w.includes(id)){w=w.filter(x=>x!==id);showToast("Removed from wishlist");}else{w.push(id);fireEcommerce("add_to_wishlist",{currency:"INR",value:p.price,items:[itemObject(p)]});showToast("Added to wishlist");}localStorage.setItem("sr_wishlist",JSON.stringify(w));renderFeaturedProducts();if(document.getElementById("shop-products"))renderShop();}
function initShop(){
 const params=new URLSearchParams(location.search);const cat=params.get("category")||"All";const search=params.get("search")||"";
 document.querySelectorAll('input[name="category"]').forEach(r=>{r.checked=r.value===cat;r.onchange=renderShop;});
 const ss=document.getElementById("shop-search");ss.value=search;document.getElementById("shop-search-btn").onclick=()=>{location.href="shop.html?search="+encodeURIComponent(ss.value);}
 document.getElementById("sort-products").onchange=renderShop;renderShop();
}
function renderShop(){
 let cat=document.querySelector('input[name="category"]:checked')?.value||"All", q=document.getElementById("shop-search").value.toLowerCase(),sort=document.getElementById("sort-products").value;
 let list=PRODUCTS.filter(p=>(cat==="All"||p.category===cat)&&(!q||`${p.name} ${p.author} ${p.category}`.toLowerCase().includes(q)));
 if(sort==="price-low")list.sort((a,b)=>a.price-b.price);if(sort==="price-high")list.sort((a,b)=>b.price-a.price);if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
 document.getElementById("result-count").textContent=`${list.length} ${list.length===1?"book":"books"}`;
 document.getElementById("shop-products").innerHTML=list.length?list.map(productCard).join(""):`<div class="empty-state"><h2>No books found</h2><p>Try another search or category.</p></div>`;
 attachWishlist();
 fireEcommerce("view_item_list",{item_list_id:"shop_results",item_list_name:"Shop results",items:list.map(p=>itemObject(p))});
 document.querySelectorAll("[data-view]").forEach(a=>a.onclick=()=>{
   const p=PRODUCTS.find(x=>x.id===a.dataset.view);
   fireEcommerce("select_item",{item_list_id:"shop_results",item_list_name:"Shop results",items:[itemObject(p)]});
 });
}
function initProduct(){
 const id=new URLSearchParams(location.search).get("id")||PRODUCTS[0].id,p=PRODUCTS.find(x=>x.id===id)||PRODUCTS[0];
 document.title=`${p.name} | Scared Read`;
 fireEcommerce("view_item",{currency:"INR",value:p.price,items:[itemObject(p)]});
 document.getElementById("product-detail").innerHTML=`<div class="product-detail"><div class="detail-cover" style="background:${p.bg};color:${p.fg}"><div><div class="cover-title">${p.name}</div><div class="cover-author">${p.author}</div></div></div><div class="detail-info"><span class="eyebrow">${p.category}</span><h1>${p.name}</h1><p class="author">by ${p.author}</p><div class="detail-price">${money(p.price)}</div><p class="detail-desc">${p.desc}</p><p class="stock">● ${p.stock} copies currently available</p><div class="quantity"><button id="qty-minus">−</button><input id="qty" value="1" readonly><button id="qty-plus">+</button></div><div class="detail-actions"><button class="btn btn-dark" id="add-cart">Add to cart</button><button class="btn btn-light" id="add-wish">♡ Wishlist</button></div></div></div>`;
 document.getElementById("qty-minus").onclick=()=>changeQty(-1,p.stock);document.getElementById("qty-plus").onclick=()=>changeQty(1,p.stock);
 document.getElementById("add-cart").onclick=()=>addToCart(p.id,Number(document.getElementById("qty").value));
 document.getElementById("add-wish").onclick=()=>toggleWishlist(p.id);
}
function changeQty(delta,max){const i=document.getElementById("qty");i.value=Math.max(1,Math.min(max,Number(i.value)+delta));}
function addToCart(id,qty=1){const p=PRODUCTS.find(x=>x.id===id),cart=getCart(),existing=cart.find(x=>x.id===id);if(existing)existing.qty=Math.min(p.stock,existing.qty+qty);else cart.push({id,qty});saveCart(cart);fireEcommerce("add_to_cart",{currency:"INR",value:p.price*qty,items:[itemObject(p,qty)]});showToast("Added to cart");}
function updateCartCount(){const c=document.getElementById("cart-count");if(c)c.textContent=getCart().reduce((s,x)=>s+x.qty,0);}
function initCart(){
 const el=document.getElementById("cart-content"),cart=getCart();if(!cart.length){el.innerHTML=`<div class="empty-state"><h2>Your cart is waiting.</h2><p>Add a book or two and come back here.</p><a class="btn btn-dark" href="shop.html">Browse books</a></div>`;return;}
 const rows=cart.map(x=>{const p=PRODUCTS.find(y=>y.id===x.id);return `<div class="cart-item">${coverHTML(p,"mini-cover")}<div><h3>${p.name}</h3><p>${p.author} · ${money(p.price)}</p><div class="qty-control"><button data-cart-minus="${p.id}">−</button><span>${x.qty}</span><button data-cart-plus="${p.id}">+</button><button class="btn btn-danger" data-cart-remove="${p.id}">Remove</button></div></div><strong>${money(p.price*x.qty)}</strong></div>`}).join("");
 const subtotal=cart.reduce((s,x)=>s+PRODUCTS.find(p=>p.id===x.id).price*x.qty,0),shipping=subtotal>=999?0:79,total=subtotal+shipping;
 el.innerHTML=`<div class="cart-layout"><div>${rows}</div><aside class="summary-card"><h2>Order summary</h2><div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div><div class="summary-row"><span>Shipping</span><span>${shipping?money(shipping):"Free"}</span></div><div class="summary-row summary-total"><span>Total</span><span>${money(total)}</span></div><a class="btn btn-dark full" href="checkout.html" id="checkout-btn">Begin checkout</a></aside></div>`;
 document.querySelectorAll("[data-cart-minus]").forEach(b=>b.onclick=()=>changeCart(b.dataset.cartMinus,-1));document.querySelectorAll("[data-cart-plus]").forEach(b=>b.onclick=()=>changeCart(b.dataset.cartPlus,1));document.querySelectorAll("[data-cart-remove]").forEach(b=>b.onclick=()=>removeCart(b.dataset.cartRemove));
 document.getElementById("checkout-btn").onclick=()=>{fireEcommerce("begin_checkout",{currency:"INR",value:total,items:cart.map(x=>itemObject(PRODUCTS.find(p=>p.id===x.id),x.qty))});};
}
function changeCart(id,d){const c=getCart(),x=c.find(i=>i.id===id),p=PRODUCTS.find(i=>i.id===id);x.qty=Math.max(1,Math.min(p.stock,x.qty+d));saveCart(c);initCart();}
function removeCart(id){const p=PRODUCTS.find(i=>i.id===id),c=getCart().filter(x=>x.id!==id);saveCart(c);fireEcommerce("remove_from_cart",{currency:"INR",value:p.price,items:[itemObject(p)]});initCart();}
function initCheckout(){
 const cart=getCart();if(!cart.length){location.href="cart.html";return;}const subtotal=cart.reduce((s,x)=>s+PRODUCTS.find(p=>p.id===x.id).price*x.qty,0),shipping=subtotal>=999?0:79,total=subtotal+shipping;
 document.getElementById("checkout-summary").innerHTML=`<h2>In your bag</h2>${cart.map(x=>{const p=PRODUCTS.find(y=>y.id===x.id);return `<div class="summary-row"><span>${p.name} × ${x.qty}</span><span>${money(p.price*x.qty)}</span></div>`}).join("")}<div class="summary-row"><span>Shipping</span><span>${shipping?money(shipping):"Free"}</span></div><div class="summary-row summary-total"><span>Total</span><span>${money(total)}</span></div>`;
 fireEcommerce("add_shipping_info",{currency:"INR",value:total,items:cart.map(x=>itemObject(PRODUCTS.find(p=>p.id===x.id),x.qty))});
 document.getElementById("checkout-form").onsubmit=e=>{e.preventDefault();const f=e.target;if(!f.checkValidity()){f.reportValidity();return;}fireEcommerce("add_payment_info",{currency:"INR",value:total,items:cart.map(x=>itemObject(PRODUCTS.find(p=>p.id===x.id),x.qty))});const failed=Math.random()<0.12;if(failed){pushEvent("purchase_error",{reason:"Payment authorization failed",value:total});fireAmplitudeEvent("purchase_error",{reason:"Payment authorization failed",value:total});showToast("Payment failed. Please check your details and try again.","error");return;}const orderId="SR-"+Date.now().toString().slice(-8);fireEcommerce("purchase",{transaction_id:orderId,currency:"INR",value:total,shipping,items:cart.map(x=>itemObject(PRODUCTS.find(p=>p.id===x.id),x.qty))});localStorage.setItem("sr_last_order",JSON.stringify({orderId,total}));localStorage.removeItem("sr_cart");location.href="order-success.html";};
}
function initLogin(){document.getElementById("login-form").onsubmit=e=>{e.preventDefault();const username=e.target.username.value.trim();if(!username)return;const existing=JSON.parse(localStorage.getItem("sr_registered_user")||"null");const userId=existing?.user_id||`SRU-${crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random().toString(36).slice(2,9)}`;const user={user_id:userId,username,...(existing||{})};localStorage.setItem("sr_user",JSON.stringify(user));fireAmplitudeEvent("login",{method:"username"});pushEvent("login",{method:"username",user_id:userId});showToast("Welcome back!");setTimeout(()=>location.href="account.html",500);};}
function initRegister(){document.getElementById("register-form").onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));const userId=`SRU-${crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random().toString(36).slice(2,9)}`;const user={user_id:userId,...d,username:d.email};localStorage.setItem("sr_registered_user",JSON.stringify(user));localStorage.setItem("sr_user",JSON.stringify(user));fireAmplitudeEvent("sign_up",{method:"form"});pushEvent("sign_up",{method:"form",user_id:userId});showToast("Account created successfully");setTimeout(()=>location.href="account.html",500);};}
function logoutUser(){const current=getUser();pushEvent("logout",{user_id:current?.user_id??null});/* Explicitly pass null on logout, not the string "null". */window.dataLayer.push({event:"amplitude_logout",amplitude_user_id:null});localStorage.removeItem("sr_user");showToast("You have been logged out");setTimeout(()=>location.href="index.html",500);}
function initAccount(){const el=document.getElementById("account-content"),u=getUser();if(!u){el.innerHTML=`<h1>Welcome.</h1><p class="muted">You're currently browsing as a guest.</p><a class="btn btn-dark full" href="login.html">Login</a><p class="auth-switch">New here? <a href="register.html">Create an account</a></p>`;return;}el.innerHTML=`<h1>Hello, ${u.firstName||u.username}.</h1><p class="muted">Your Scared Read account is active.</p><div class="summary-card"><div class="summary-row"><span>User ID</span><strong>${u.user_id}</strong></div><div class="summary-row"><span>Email</span><strong>${u.email||"—"}</strong></div></div><button class="btn btn-danger full" id="account-logout">Logout</button>`;document.getElementById("account-logout").onclick=logoutUser;}
function initSuccess(){const o=JSON.parse(localStorage.getItem("sr_last_order")||"null");document.getElementById("order-message").textContent=o?`Your order ${o.orderId} has been placed successfully for ${money(o.total)}.`:"Your order has been placed successfully.";}
function showToast(message,type=""){const old=document.querySelector(".toast");if(old)old.remove();const t=document.createElement("div");t.className="toast "+type;t.textContent=message;document.body.appendChild(t);setTimeout(()=>t.remove(),3000);}
