import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const data = readFileSync(join(root, "data.js"), "utf8");
const app = readFileSync(join(root, "app.js"), "utf8");
const html = readFileSync(join(root, "index.html"), "utf8");
const fail = message => { throw new Error(message); };
const { products, categories, store } = runInNewContext(`${data}\n({products,categories,store})`);

if (products.length !== 8) fail("Deben existir ocho productos de ejemplo");
if (new Set(products.map(product => product.id)).size !== products.length) fail("Códigos duplicados");
if (store.whatsappNumber !== "") fail("La demo debe dejar el contacto sin configurar");
for (const product of products) {
  if (!Number.isInteger(product.price) || product.price <= 0) fail(`Precio inválido: ${product.id}`);
  if (!categories.some(category => category.id === product.category)) fail(`Categoría inválida: ${product.id}`);
  if (!product.description || product.features.length < 2 || product.specs.length < 3) fail(`Ficha incompleta: ${product.id}`);
  const image = readFileSync(join(root, product.image));
  if (image.length < 1000 || image[0] !== 0xff || image[1] !== 0xd8) fail(`Imagen inválida: ${product.id}`);
}
for (const asset of ["index.html", "styles.css", "app.js", "data.js", "logo.svg"]) if (!statSync(join(root, asset)).size) fail(`Falta ${asset}`);
if (!html.includes("DEMO CONCEPTUAL") || !html.includes("No se realizan compras") || !html.includes('name="robots" content="noindex,nofollow"')) fail("Falta identificar la demo");

const nodes = new Map();
const node = selector => nodes.get(selector) || nodes.set(selector, {
  innerHTML: "", textContent: "", value: "", open: false, hidden: false, offsetWidth: 0,
  classList: { add() {}, remove() {}, contains() { return false; } },
  addEventListener() {}, querySelector() { return null; }
}).get(selector);
node("#sort-products").value = "featured";
const document = { querySelector: node, querySelectorAll() { return []; } };
const journey = runInNewContext(`${data}\n${app}\n
searchInput.value = "cafetera";
renderCatalog();
const search = { count: resultCount.textContent, hasCoffee: grid.innerHTML.includes("MIR-008"), hasPhone: grid.innerHTML.includes("MIR-001") };
searchInput.value = "";
addToCart("MIR-001"); addToCart("MIR-001"); addToCart("MIR-007");
summaryOpen = true; renderCart();
({search, count: cartCount.textContent, total: cartTotal(), order: orderText(), url: whatsappUrl(), summary: cartContent.innerHTML})`, { document, Intl, Map });

if (journey.search.count !== "1 producto de ejemplo" || !journey.search.hasCoffee || journey.search.hasPhone) fail("Falló la búsqueda");
if (journey.count !== "3" || journey.total !== 989700 || !journey.order.includes("2 × Celular") || !journey.order.includes("Freidora de Aire")) fail("Falló el carrito o el total");
if (!journey.url.startsWith("https://wa.me/?text=") || !journey.url.includes("Total%20ilustrativo") || !journey.summary.includes("Mensaje preparado")) fail("Falló el mensaje de consulta");
console.log("OK: ocho fichas, imágenes, búsqueda, carrito, total y mensaje de ejemplo");
