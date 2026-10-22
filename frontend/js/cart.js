const area = document.getElementById('cart-area');
const checkout = document.getElementById('checkout');
const msg = document.getElementById('msg');

function render() {
  const cart = getCart();
  if (cart.length === 0) {
    area.innerHTML = '<p>Your cart is empty. <a href="index.html" style="color:#2563eb">Go shopping</a></p>';
    checkout.style.display = 'none';
    return;
  }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  area.innerHTML = `
    <table>
      <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
      ${cart.map((i, idx) => `
        <tr>
          <td>${i.name}</td>
          <td>₹${i.price}</td>
          <td>
            <button class="btn small" data-act="minus" data-i="${idx}">−</button>
            ${i.qty}
            <button class="btn small" data-act="plus" data-i="${idx}">+</button>
          </td>
          <td>₹${i.price * i.qty}</td>
          <td><button class="btn small danger" data-act="remove" data-i="${idx}">Remove</button></td>
        </tr>`).join('')}
    </table>
    <div class="total">Total: ₹${total}</div>`;
  checkout.style.display = 'block';

  area.querySelectorAll('button[data-act]').forEach(btn => {
    btn.onclick = () => {
      const c = getCart(); const i = Number(btn.dataset.i);
      if (btn.dataset.act === 'plus') c[i].qty++;
      if (btn.dataset.act === 'minus') c[i].qty = Math.max(1, c[i].qty - 1);
      if (btn.dataset.act === 'remove') c.splice(i, 1);
      saveCart(c); render();
    };
  });
}

document.getElementById('place-order').onclick = async () => {
  if (!getUser()) { location.href = 'login.html'; return; }
  const address = document.getElementById('address').value.trim();
  try {
    await api('/orders', {
      method: 'POST',
      body: JSON.stringify({ address, items: getCart().map(i => ({ productId: i.productId, qty: i.qty })) })
    });
    saveCart([]);
    area.innerHTML = '';
    checkout.style.display = 'none';
    area.innerHTML = '<p class="msg ok" style="font-size:18px">✅ Order placed successfully! Thank you.</p>';
  } catch (err) {
    msg.className = 'msg error';
    msg.textContent = err.message;
  }
};

render();
