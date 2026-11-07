# mira. electro — demo de tienda de tecnología

Sitio independiente y estático para mostrar una tienda de electrónica y pequeños electrodomésticos. La marca, los ocho equipos, sus fotos, características y precios son **ficticios e ilustrativos**.

## Recorrido

El visitante puede buscar, filtrar y ordenar los productos; abrir una ficha con características; sumar unidades al carrito; modificar cantidades y preparar un mensaje de consulta para WhatsApp. Agregar muestra una confirmación visible. El mensaje no se envía automáticamente. La demo no cobra, no comprueba stock y no confirma pedidos.

El carrito vive solo en la memoria de la pestaña. `store.whatsappNumber` está vacío: WhatsApp permite elegir el contacto. Para un negocio real se debe configurar el número aprobado en `dist/data.js` y validar fotos, modelos, precios, características, disponibilidad, garantías y condiciones de entrega.

La página también muestra fotos ilustrativas de la fachada y el interior, una guía de compra de ejemplo, ubicación esquemática, horarios ilustrativos y espacios para redes sociales. No hay dirección ni perfiles reales. Antes de usarla para un comercio, reemplazar las fotos, dirección, mapa, horarios, redes y condiciones por información confirmada por el dueño.

## Abrir y comprobar

Desde esta carpeta: `python -m http.server 8770 --directory dist`. Abrir `http://localhost:8770/`.

Comprobación: `node --check dist/data.js; node --check dist/app.js; node scripts/check.mjs`.

No necesita instalar dependencias. Las imágenes se generaron para esta demo con ImageGen sin marcas y se optimizaron como JPEG locales. El logo es un SVG propio.

## Archivos

- `dist/data.js`: catálogo y configuración de ejemplo.
- `dist/app.js`: búsqueda, filtros, fichas, carrito y mensaje.
- `dist/index.html`, `dist/styles.css`, `dist/logo.svg`: estructura, diseño e identidad.
- `dist/assets/`: fotos locales ilustrativas, incluidas fachada e interior ficticios.
