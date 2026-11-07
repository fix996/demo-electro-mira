import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const root = fileURLToPath(new URL("../", import.meta.url));
const data = readFileSync(join(root, "dist", "data.js"), "utf8");
const template = readFileSync(join(root, "templates", "product.html"), "utf8");
const { products, categories } = runInNewContext(`${data}\n({products,categories})`);
const categoryById = new Map(categories.map(category => [category.id, category.label]));
const money = value => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const output = join(root, "dist", "productos");

mkdirSync(output, { recursive: true });
for (const [index, product] of products.entries()) {
  if (!/^[a-z0-9-]+$/.test(product.slug)) throw new Error(`Slug inválido: ${product.id}`);
  const related = products.filter(candidate => candidate.id !== product.id && candidate.category === product.category)
    .concat(products.filter(candidate => candidate.id !== product.id && candidate.category !== product.category)).slice(0, 3);
  const values = {
    title: product.name,
    description: product.description,
    name: product.name,
    id: product.id,
    category: categoryById.get(product.category).toUpperCase(),
    index: String(index + 1).padStart(2, "0"),
    image: `../${product.image}`,
    alt: product.alt,
    price: money(product.price),
    features: product.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join(""),
    specs: product.specs.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join(""),
    related: related.map(item => `<a class="related-card" href="${escapeHtml(item.slug)}.html"><img src="../${escapeHtml(item.image)}" width="960" height="640" loading="lazy" alt=""><span>${escapeHtml(categoryById.get(item.category))}</span><strong>${escapeHtml(item.name)}</strong><small>Precio de ejemplo · ${escapeHtml(money(item.price))}</small><b aria-hidden="true">↗</b></a>`).join("")
  };
  const html = template.replace(/{{([a-z]+)}}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Falta el dato ${key}`);
    return ["features", "specs", "related"].includes(key) ? values[key] : escapeHtml(values[key]);
  });
  writeFileSync(join(output, `${product.slug}.html`), html);
}
console.log(`OK: ${products.length} páginas completas de producto generadas`);
