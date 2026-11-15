# Aniversario

Landing del 5.º aniversario de Aura & Francisco: sobre de bienvenida, portada con contador,
video de la boda, galería de fotos, carta e invitación a desayunar en el lugar que ella elija.

Sitio estático (HTML, CSS y JavaScript sin dependencias). Abre `index.html` o sírvelo con Herd.

## Estructura

- `index.html`: estructura de la página.
- `css/styles.css`: estilos y animaciones.
- `js/config.js`: **todo el contenido editable** (nombres, fecha, fotos, video, carta, invitación, WhatsApp).
- `js/effects.js`: pétalos, corazones, aparición al hacer scroll, parallax.
- `js/intro.js`, `counter.js`, `media.js`, `letter.js`, `invitation.js`: un módulo por sección.
- `js/main.js`: punto de entrada que conecta la configuración con los módulos.
- `media/`: fotos, videos y música.
- `js/player.js`: reproductor de video con controles propios.
- `media/icons/`: icono del sitio. `media/social/compartir.jpg`: imagen de la vista previa al compartir.

## Vista previa al compartir

Las etiquetas `og:*` de `index.html` usan la URL pública del sitio. Si cambia el dominio, actualiza `og:url` y `og:image`.
