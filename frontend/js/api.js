// Shared helpers used on every page
const API_URL = 'http://localhost:5000/api';   // change this when you deploy the backend

// ---- API call helper (adds the login token automatically) ----
async function api(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// ---- Cart (saved in the browser) ----
const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
const saveCart = (cart) => { localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); };

function addToCart(product) {
  const cart = getCart();
  const found = cart.find(i => i.productId === product._id);
  if (found) found.qty += 1;
  else cart.push({ productId: product._id, name: product.name, price: product.price, qty: 1 });
  saveCart(cart);
}

function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = getCart().reduce((n, i) => n + i.qty, 0);
}

// ---- Login state ----
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');

function renderNav() {
  const user = getUser();
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.innerHTML = `
    <a href="index.html">Shop</a>
    <a href="cart.html">Cart <span class="cart-badge" id="cart-count">0</span></a>
    ${user ? `<span>Hi, ${user.name}</span><a href="#" id="logout">Logout</a>` : `<a href="login.html">Login</a>`}
  `;
  const logout = document.getElementById('logout');
  if (logout) logout.onclick = (e) => { e.preventDefault(); localStorage.removeItem('token'); localStorage.removeItem('user'); location.href = 'index.html'; };
  updateCartCount();
}
document.addEventListener('DOMContentLoaded', renderNav);
