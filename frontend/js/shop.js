const grid = document.getElementById('products');
const statusEl = document.getElementById('status');

async function loadProducts() {
  const search = document.getElementById('search').value.trim();
  const category = document.getElementById('category').value;
  const query = new URLSearchParams({ ...(search && { search }), ...(category && { category }) });
  try {
    const products = await api('/products?' + query);
    statusEl.textContent = products.length ? '' : 'No products found.';
    grid.innerHTML = products.map(p => `
      <div class="card">
        <img src="${p.image}" alt="${p.name}">
        <div class="info">
          <strong>${p.name}</strong>
          <span class="desc">${p.description}</span>
          <span class="price">₹${p.price}</span>
          <button class="btn" ${p.stock === 0 ? 'disabled' : ''} data-id="${p._id}">
            ${p.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>`).join('');
    grid.querySelectorAll('button[data-id]').forEach(btn => {
      btn.onclick = () => addToCart(products.find(p => p._id === btn.dataset.id));
    });
  } catch (err) {
    statusEl.className = 'msg error';
    statusEl.textContent = 'Could not load products: ' + err.message;
  }
}

let timer;
document.getElementById('search').oninput = () => { clearTimeout(timer); timer = setTimeout(loadProducts, 300); };
document.getElementById('category').onchange = loadProducts;
loadProducts();
