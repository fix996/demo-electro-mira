const productById = new Map(products.map(product => [product.id, product]));
const categoryById = new Map(categories.map(category => [category.id, category.label]));
const cart = new Map();
const filters = document.querySelector("#category-filters");
const grid = document.querySelector("#product-grid");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search-products");
const sortInput = document.querySelector("#sort-products");
const cartCount = document.querySelector("#cart-count");
const cartDialog = document.querySelector("#cart-dialog");
const cartContent = document.querySelector("#cart-content");
const productDialog = document.querySelector("#product-dialog");
const productContent = document.querySelector("#product-content");
const actionStatus = document.querySelector("#action-status");
let activeCategory = "todos";
let cartOpener = null;
let productOpener = null;
let summaryOpen = false;

function money(value) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
}

function normalize(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function quantityFor(id) {
  return cart.get(id) || 0;
}

function cartTotal() {
  return [...cart].reduce((total, [id, quantity]) => total + productById.get(id).price * quantity, 0);
}

function addButton(id) {
  return `<button type="button" class="add-button" data-add="${id}"><span class="add-label">${quantityFor(id) ? "Agregar otro" : "Agregar al carrito"}</span><span class="add-icon" aria-hidden="true">+</span></button>`;
}

function syncButtons(id) {
  document.querySelectorAll(`[data-add="${id}"]`).forEach(button => {
    if (button.classList.contains("added")) return;
    button.querySelector(".add-label").textContent = quantityFor(id) ? "Agregar otro" : "Agregar al carrito";
  });
}

function updateCount() {
  cartCount.textContent = String([...cart.values()].reduce((total, quantity) => total + quantity, 0));
  cartCount.classList.remove("bump");
  void cartCount.offsetWidth;
  cartCount.classList.add("bump");
}

function flashAdded(button, id) {
  if (!button) return;
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
  cart.set(id, quantityFor(id) + 1);
  summaryOpen = false;
  updateCount();
  syncButtons(id);
  flashAdded(button, id);
  actionStatus.textContent = `${product.name} agregado al carrito. Hay ${quantityFor(id)} en el carrito.`;
  if (cartDialog.open) renderCart();
}

function renderFilters() {
  filters.innerHTML = categories.map(category => `<button type="button" data-category="${category.id}" aria-pressed="${category.id === activeCategory}">${category.label}</button>`).join("");
}

function productCard(product) {
  return `<article class="product-card">
    <button type="button" class="product-photo" data-view="${product.id}" aria-label="Ver ficha de ${product.name}"><img src="${product.image}" alt="" width="960" height="640" loading="lazy"><span class="product-badge">${product.badge}</span><span class="view-hint">Ver ficha ↗</span></button>
    <div class="product-body"><p class="product-category">${categoryById.get(product.category)} / ${product.id}</p><h3><button type="button" class="product-name" data-view="${product.id}">${product.name}</button></h3><ul class="product-features">${product.features.map(feature => `<li>${feature}</li>`).join("")}</ul>
      <div class="product-bottom"><div><small class="price-label">Precio de ejemplo</small><strong class="product-price">${money(product.price)}</strong></div>${addButton(product.id)}</div>
    </div></article>`;
}

function renderCatalog() {
  const query = normalize(searchInput.value.trim());
  const visible = products.filter(product => (activeCategory === "todos" || product.category === activeCategory) && normalize(`${product.name} ${product.description} ${product.features.join(" ")} ${categoryById.get(product.category)}`).includes(query));
  if (sortInput.value === "price-asc") visible.sort((a, b) => a.price - b.price);
  if (sortInput.value === "price-desc") visible.sort((a, b) => b.price - a.price);
  if (sortInput.value === "name") visible.sort((a, b) => a.name.localeCompare(b.name, "es"));
  resultCount.textContent = `${visible.length} ${visible.length === 1 ? "producto" : "productos"} de ejemplo`;
  grid.innerHTML = visible.map(productCard).join("");
  emptyState.hidden = visible.length > 0;
}

function openProduct(id, opener) {
  const product = productById.get(id);
  if (!product) return;
  productOpener = opener;
  productContent.innerHTML = `<div class="detail-layout"><div class="detail-image"><img src="${product.image}" alt="${product.alt}" width="960" height="640"></div>
    <div class="detail-info"><p class="eyebrow">${categoryById.get(product.category).toUpperCase()} / ${product.id}</p><h2 id="product-dialog-title">${product.name}</h2><p>${product.description}</p><strong class="detail-price"><small>Precio de ejemplo</small>${money(product.price)}</strong>
      <h3>Características de ejemplo</h3><dl class="specs">${product.specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>
      ${addButton(product.id)}<p class="detail-note">Precio, características y disponibilidad ilustrativos. El negocio confirmaría los datos antes de cerrar un pedido.</p>
    </div></div>`;
  productDialog.showModal();
  document.querySelector("#close-product").focus();
}

function orderText() {
  const lines = [...cart].map(([id, quantity]) => {
    const product = productById.get(id);
    return `• ${quantity} × ${product.name} (${product.id}) — ${money(product.price * quantity)}`;
  });
  return [`Hola, quiero consultar por estos productos de la DEMO:`, ...lines, `Total ilustrativo: ${money(cartTotal())}`, `Por favor confirmen disponibilidad y precio final antes de preparar el pedido.`].join("\n");
}

function whatsappUrl() {
  const number = /^\d{8,15}$/.test(store.whatsappNumber) ? store.whatsappNumber : "";
  return `https://wa.me/${number}?text=${encodeURIComponent(orderText())}`;
}

function renderCart() {
  if (!cart.size) {
    cartContent.innerHTML = `<div class="cart-empty"><strong>Tu carrito está vacío.</strong><p>Explorá el catálogo y sumá los productos que te interesan.</p><button type="button" id="back-to-products">Ver productos</button></div>`;
    return;
  }
  cartContent.innerHTML = `<ul class="cart-items">${[...cart].map(([id, quantity]) => {
    const product = productById.get(id);
    return `<li><img src="${product.image}" alt="" width="75" height="72"><div class="cart-item-body"><strong>${product.name}</strong><span>${money(product.price)} c/u · ${product.id}</span><div class="cart-item-foot"><div class="quantity"><button type="button" data-decrease="${id}" aria-label="Quitar una unidad de ${product.name}">−</button><span>${quantity}</span><button type="button" data-increase="${id}" aria-label="Agregar una unidad de ${product.name}">+</button></div><b>${money(product.price * quantity)}</b></div></div></li>`;
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

renderFilters();
renderCatalog();
filters.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters();
  renderCatalog();
  filters.querySelector(`[data-category="${activeCategory}"]`).focus();
});
searchInput.addEventListener("input", renderCatalog);
sortInput.addEventListener("change", renderCatalog);
document.querySelector("#clear-filters").addEventListener("click", () => {
  activeCategory = "todos";
  searchInput.value = "";
  sortInput.value = "featured";
  renderFilters();
  renderCatalog();
  searchInput.focus();
});
grid.addEventListener("click", event => {
  const view = event.target.closest("[data-view]");
  if (view) { openProduct(view.dataset.view, view); return; }
  const add = event.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add, add);
});
productContent.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add, add);
});
document.querySelector("#close-product").addEventListener("click", () => productDialog.close());
productDialog.addEventListener("click", event => { if (event.target === productDialog) productDialog.close(); });
productDialog.addEventListener("close", () => productOpener?.focus());
document.querySelectorAll("[data-open-cart]").forEach(button => button.addEventListener("click", () => openCart(button)));
document.querySelector("#close-cart").addEventListener("click", () => cartDialog.close());
cartDialog.addEventListener("click", event => { if (event.target === cartDialog) cartDialog.close(); });
cartDialog.addEventListener("close", () => cartOpener?.focus());
cartContent.addEventListener("click", event => {
  if (event.target.id === "back-to-products") { cartDialog.close(); document.querySelector("#catalogo").scrollIntoView(); return; }
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  if (increase || decrease) {
    const id = increase?.dataset.increase || decrease.dataset.decrease;
    const next = quantityFor(id) + (increase ? 1 : -1);
    if (next > 0) cart.set(id, next); else cart.delete(id);
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
