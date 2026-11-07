const categoryById = new Map(categories.map(category => [category.id, category.label]));
const filters = document.querySelector("#category-filters");
const grid = document.querySelector("#product-grid");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search-products");
const sortInput = document.querySelector("#sort-products");
let activeCategory = "todos";

function normalize(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function renderFilters() {
  filters.innerHTML = categories.map(category => `<button type="button" data-category="${category.id}" aria-pressed="${category.id === activeCategory}">${category.label}</button>`).join("");
}

function productCard(product) {
  return `<article class="product-card">
    <a class="product-photo" href="${Mira.productUrl(product)}" aria-label="Ver producto ${product.name}"><img src="${Mira.asset(product.image)}" alt="" width="960" height="640" loading="lazy"><span class="product-badge">${product.badge}</span><span class="view-hint">Ver producto ↗</span></a>
    <div class="product-body"><p class="product-category">${categoryById.get(product.category)} / ${product.id}</p><h3><a class="product-name" href="${Mira.productUrl(product)}">${product.name}</a></h3><ul class="product-features">${product.features.map(feature => `<li>${feature}</li>`).join("")}</ul>
      <div class="product-bottom"><div><small class="price-label">Precio de ejemplo</small><strong class="product-price">${Mira.money(product.price)}</strong></div>${Mira.addButton(product.id)}</div>
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
