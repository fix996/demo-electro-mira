# mira. electro — demo de tienda de tecnología

Sitio independiente y estático para mostrar una tienda de electrónica y pequeños electrodomésticos. La marca, los ocho equipos, sus fotos, características y precios son **ficticios e ilustrativos**.

## Recorrido

El visitante puede buscar, filtrar y ordenar los productos; abrir una página completa para cada uno de los ocho equipos; sumar unidades al carrito; modificar cantidades y preparar un mensaje de consulta para WhatsApp. Agregar muestra una confirmación visible. El mensaje no se envía automáticamente. La demo no cobra, no comprueba stock y no confirma pedidos.

El carrito se guarda en `localStorage` para que persista al pasar entre catálogo y páginas de producto dentro del mismo navegador. No contiene datos personales. `store.whatsappNumber` está vacío: WhatsApp permite elegir el contacto. Para un negocio real se debe configurar el número aprobado en `dist/data.js` y validar fotos, modelos, precios, características, disponibilidad, garantías y condiciones de entrega.

La página también muestra fotos ilustrativas de la fachada y el interior, fotos y opiniones ficticias de compradores, una guía de compra de ejemplo, ubicación esquemática, horarios ilustrativos y espacios para redes sociales. No hay reseñas de Instagram, dirección ni perfiles reales. Antes de usarla para un comercio, reemplazar estos elementos por información y testimonios autorizados por el dueño y sus compradores.

## Abrir y comprobar

Desde esta carpeta: `python -m http.server 8770 --directory dist`. Abrir `http://localhost:8770/`.

Si se modifica `dist/data.js` o `templates/product.html`, ejecutar `node scripts/build-pages.mjs` para regenerar las ocho páginas. Comprobación: `node --check dist/data.js; node --check dist/cart.js; node --check dist/catalog.js; node scripts/check.mjs`.

No necesita instalar dependencias. Las imágenes se generaron para esta demo con ImageGen sin marcas y se optimizaron como JPEG locales. El logo es un SVG propio.

## Archivos

- `dist/data.js`: catálogo y configuración de ejemplo, fuente única de nombres, precios y especificaciones.
- `dist/catalog.js`: búsqueda, filtros y tarjetas del catálogo.
- `dist/cart.js`: carrito compartido, persistencia y mensaje.
- `templates/product.html`, `scripts/build-pages.mjs`: plantilla y generador de páginas completas.
- `dist/productos/`: ocho páginas generadas con URL propia.
- `dist/index.html`, `dist/styles.css`, `dist/logo.svg`: estructura, diseño e identidad.
- `dist/assets/`: fotos locales ilustrativas, incluidas fachada, interior y escenas ficticias de compradores. Estas últimas se generaron con ImageGen a partir de escenas de notebook en casa, cafetera en cocina y TV en sala; no retratan compradores reales.
