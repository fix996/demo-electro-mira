import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const data = readFileSync(join(root, "data.js"), "utf8");
const home = readFileSync(join(root, "index.html"), "utf8");
const { products, categories, store } = runInNewContext(`${data}\n({products,categories,store})`);
const fail = message => { throw new Error(message); };
const pages = readdirSync(join(root, "productos")).filter(file => file.endsWith(".html"));
const money = value => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);

if (products.length !== 8 || pages.length !== products.length) fail("Deben existir ocho productos y ocho páginas");
if (new Set(products.map(product => product.id)).size !== products.length) fail("Códigos duplicados");
if (new Set(products.map(product => product.slug)).size !== products.length) fail("URLs duplicadas");
if (store.whatsappNumber !== "") fail("La demo debe dejar el contacto sin configurar");
if (!home.includes("DEMO CONCEPTUAL") || !home.includes("No se realizan compras") || !home.includes("Las imágenes, personas y frases de esta sección son ficticias")) fail("Falta identificar la demo y las opiniones ficticias");

for (const product of products) {
  if (!Number.isInteger(product.price) || product.price <= 0) fail(`Precio inválido: ${product.id}`);
  if (!categories.some(category => category.id === product.category)) fail(`Categoría inválida: ${product.id}`);
  if (!product.description || product.features.length < 2 || product.specs.length < 3) fail(`Ficha incompleta: ${product.id}`);
  if (!/^[a-z0-9-]+$/.test(product.slug)) fail(`URL inválida: ${product.id}`);
  const image = readFileSync(join(root, product.image));
  if (image.length < 1000 || image[0] !== 0xff || image[1] !== 0xd8) fail(`Imagen inválida: ${product.id}`);
  const page = readFileSync(join(root, "productos", `${product.slug}.html`), "utf8");
  if (!page.includes(product.id) || !page.includes(product.name) || !page.includes(money(product.price)) || !page.includes('class="product-hero wrap"') || !page.includes("../cart.js")) fail(`Página incompleta: ${product.id}`);
  for (const [label, value] of product.specs) if (!page.includes(label) || !page.includes(value)) fail(`Falta una especificación: ${product.id}`);
  if (!page.includes(`data-add="${product.id}"`) || !page.includes("../index.html#catalogo")) fail(`Falta recorrido de compra: ${product.id}`);
}
for (const asset of ["index.html", "styles.css", "cart.js", "catalog.js", "data.js", "logo.svg", "assets/opinion-notebook.jpg", "assets/opinion-cafetera.jpg", "assets/opinion-tv.jpg"]) {
  if (!statSync(join(root, asset)).size) fail(`Falta ${asset}`);
}
for (const path of [join(root, "index.html"), ...pages.map(page => join(root, "productos", page))]) {
  const content = readFileSync(path, "utf8");
  for (const [, reference] of content.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const local = reference.split("#")[0];
    if (!local || /^https?:/.test(local)) continue;
    if (!existsSync(resolve(dirname(path), local))) fail(`Enlace o recurso roto: ${path} -> ${reference}`);
  }
}
console.log("OK: ocho páginas de producto, imágenes, enlaces y contenido de demo");
