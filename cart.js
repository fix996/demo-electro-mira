const Mira = (() => {
  const base = document.body.dataset.base || "";
  const productById = new Map(products.map(product => [product.id, product]));
  const cart = new Map();
  const storageKey = "mira-electro-demo-cart-v1";
  const cartCount = document.querySelector("#cart-count");
  const cartDialog = document.querySelector("#cart-dialog");
  const cartContent = document.querySelector("#cart-content");
  const actionStatus = document.querySelector("#action-status");
  let cartOpener = null;
  let summaryOpen = false;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(saved)) {
      for (const entry of saved) {
        if (Array.isArray(entry) && productById.has(entry[0]) && Number.isInteger(entry[1]) && entry[1] > 0) {
          cart.set(entry[0], Math.min(entry[1], 99));
        }
      }
    }
  } catch { /* El carrito sigue funcionando aunque el navegador bloquee el almacenamiento. */ }

  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify([...cart])); } catch { /* Solo afecta la persistencia. */ }
  }

  function money(value) {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
  }

  function asset(path) { return `${base}${path}`; }
  function productUrl(product) { return `${base}productos/${product.slug}.html`; }
  function quantityFor(id) { return cart.get(id) || 0; }
  function cartTotal() { return [...cart].reduce((total, [id, quantity]) => total + productById.get(id).price * quantity, 0); }

  function addButton(id) {
    return `<button type="button" class="add-button" data-add="${id}"><span class="add-label">${quantityFor(id) ? "Agregar otro" : "Agregar al carrito"}</span><span class="add-icon" aria-hidden="true">+</span></button>`;
  }

  function syncButtons(id) {
    document.querySelectorAll(`[data-add="${id}"]`).forEach(button => {
      if (!button.classList.contains("added")) button.querySelector(".add-label").textContent = quantityFor(id) ? "Agregar otro" : "Agregar al carrito";
    });
  }

  function updateCount(animate = false) {
    cartCount.textContent = String([...cart.values()].reduce((total, quantity) => total + quantity, 0));
    if (animate) {
      cartCount.classList.remove("bump");
      void cartCount.offsetWidth;
      cartCount.classList.add("bump");
    }
  }

  function flashAdded(button, id) {
    clearTimeout(button.feedbackTimer);
    button.classList.remove("added");
    void button.offsetWidth;
    button.classList.add("added");
    button.querySelector(".add-label").textContent = "¡Agregado!";
    button.querySelector(".add-icon").textContent = "✓";
    button.feedbackTimer = setTimeout(() => {
      if (!button.isConnected) return;
      button.classList.remove("added");
      button.querySelector(".add-label").textContent = quantityFor(id) ? "Agregar otro" : "Agregar al carrito";
      button.querySelector(".add-icon").textContent = "+";
    }, 1400);
  }

  function addToCart(id, button) {
    const product = productById.get(id);
    if (!product) return;
    if (quantityFor(id) >= 99) {
      actionStatus.textContent = "Máximo de 99 unidades de ejemplo por producto.";
      return;
    }
    cart.set(id, quantityFor(id) + 1);
    persist();
    summaryOpen = false;
    updateCount(true);
    syncButtons(id);
    flashAdded(button, id);
    actionStatus.textContent = `${product.name} agregado al carrito. Hay ${quantityFor(id)} en el carrito.`;
    if (cartDialog.open) renderCart();
  }

  function orderText() {
    const lines = [...cart].map(([id, quantity]) => {
      const product = productById.get(id);
      return `• ${quantity} × ${product.name} (${product.id}) — ${money(product.price * quantity)}`;
    });
    return ["Hola, quiero consultar por estos productos de la DEMO:", ...lines, `Total ilustrativo: ${money(cartTotal())}`, "Por favor confirmen disponibilidad y precio final antes de preparar el pedido."].join("\n");
  }

  function whatsappUrl() {
    const number = /^\d{8,15}$/.test(store.whatsappNumber) ? store.whatsappNumber : "";
    return `https://wa.me/${number}?text=${encodeURIComponent(orderText())}`;
  }

  function renderCart() {
    if (!cart.size) {
      cartContent.innerHTML = `<div class="cart-empty"><strong>Tu carrito está vacío.</strong><p>Explorá el catálogo y sumá los productos que te interesan.</p><a href="${base}index.html#catalogo">Ver productos</a></div>`;
      return;
    }
    cartContent.innerHTML = `<ul class="cart-items">${[...cart].map(([id, quantity]) => {
      const product = productById.get(id);
      return `<li><img src="${asset(product.image)}" alt="" width="75" height="72"><div class="cart-item-body"><strong>${product.name}</strong><span>${money(product.price)} c/u · ${product.id}</span><div class="cart-item-foot"><div class="quantity"><button type="button" data-decrease="${id}" aria-label="Quitar una unidad de ${product.name}">−</button><span>${quantity}</span><button type="button" data-increase="${id}" aria-label="Agregar una unidad de ${product.name}">+</button></div><b>${money(product.price * quantity)}</b></div></div></li>`;
    }).join("")}</ul><p class="cart-total"><span>Total ilustrativo</span><strong>${money(cartTotal())}</strong></p><p class="cart-note">Los precios y el stock se confirmarían con el negocio. Esta demo no cobra ni reserva productos.</p>
      <button type="button" class="cart-primary" id="prepare-order">Preparar pedido de ejemplo <span aria-hidden="true">→</span></button>
      ${summaryOpen ? `<div class="order-summary"><h3 id="order-heading" tabindex="-1">Mensaje preparado</h3><p>Revisá el detalle antes de abrir WhatsApp. En esta demo podés elegir el contacto; el mensaje no se envía automáticamente.</p><textarea readonly aria-label="Resumen del pedido de ejemplo">${orderText()}</textarea><a class="whatsapp-link" href="${whatsappUrl()}" target="_blank" rel="noopener noreferrer">Abrir en WhatsApp <span aria-hidden="true">↗</span></a><small>El negocio debe confirmar productos, precio y forma de entrega. No compartas datos sensibles para probar la demo.</small></div>` : ""}`;
  }

  function openCart(opener) {
    cartOpener = opener;
    renderCart();
    cartDialog.showModal();
    document.querySelector("#close-cart").focus();
  }

  updateCount();
  document.querySelectorAll("[data-add]").forEach(button => syncButtons(button.dataset.add));
  document.addEventListener("click", event => {
    const add = event.target.closest("[data-add]");
    if (add) { addToCart(add.dataset.add, add); return; }
    const open = event.target.closest("[data-open-cart]");
    if (open) { openCart(open); return; }
    const increase = event.target.closest("[data-increase]");
    const decrease = event.target.closest("[data-decrease]");
    if (increase || decrease) {
      const id = increase?.dataset.increase || decrease.dataset.decrease;
      const next = quantityFor(id) + (increase ? 1 : -1);
      if (next > 99) return;
      if (next > 0) cart.set(id, next); else cart.delete(id);
      persist();
      summaryOpen = false;
      updateCount();
      syncButtons(id);
      renderCart();
      (cartContent.querySelector(`[data-${increase ? "increase" : "decrease"}="${id}"]`) || document.querySelector("#close-cart")).focus();
      return;
    }
    if (event.target.closest("#prepare-order")) {
      summaryOpen = true;
      renderCart();
      cartContent.querySelector("#order-heading").focus();
    }
  });
  document.querySelector("#close-cart").addEventListener("click", () => cartDialog.close());
  cartDialog.addEventListener("click", event => { if (event.target === cartDialog) cartDialog.close(); });
  cartDialog.addEventListener("close", () => cartOpener?.focus());

  return { money, asset, productUrl, addButton, syncButtons, quantityFor };
})();
