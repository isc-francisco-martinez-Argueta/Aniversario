/**
 * ÚNICO archivo que necesitas editar para personalizar la página.
 * Todo el contenido (nombres, fechas, fotos, videos, carta, invitación) vive aquí.
 */
window.Aniversario = window.Aniversario || {};

Aniversario.config = {
  couple: {
    names: 'Aura & Francisco',     // Como aparecerán en grande
    initials: 'A&F',        // Sello del sobre (máx. 3 caracteres)
  },

  // Fecha y hora de la boda (AAAA-MM-DDTHH:MM)
  weddingDate: '2021-12-04T19:00',

  hero: {
    photo: 'media/fotos/hero.webp',
    phrase: 'Cinco años después, volvería a elegirte.',
  },

  // Videos: copia los archivos a media/videos y agrégalos aquí
  videos: [
    { src: 'media/videos/boda.mp4', poster: 'media/videos/cartel.webp', title: 'Nuestra boda' },
  ],

  // Fotos: copia los archivos a media/fotos y agrégalos aquí.
  // wide: true = foto horizontal (ocupa el doble de ancho en la galería)
  photos: [
    { src: 'media/fotos/boda-02.webp', caption: 'Cuando aún éramos novios' },
    { src: 'media/fotos/boda-03.webp', caption: 'Contando los días' },
    { src: 'media/fotos/boda-04.webp', caption: 'Todo listo para ti', wide: true },
    { src: 'media/fotos/boda-05.webp', caption: 'Los detalles de la novia', wide: true },
    { src: 'media/fotos/boda-06.webp', caption: 'Un brindis antes de salir', wide: true },
    { src: 'media/fotos/boda-07.webp', caption: 'Con las que más te quieren', wide: true },
    { src: 'media/fotos/boda-08.webp', caption: 'Los detalles del novio', wide: true },
    { src: 'media/fotos/boda-09.webp', caption: 'El último ajuste', wide: true },
    { src: 'media/fotos/boda-10.webp', caption: 'Manos que acompañan', wide: true },
    { src: 'media/fotos/boda-11.webp', caption: 'La hora se acerca', wide: true },
    { src: 'media/fotos/boda-12.webp', caption: 'El toque final', wide: true },
    { src: 'media/fotos/boda-13.webp', caption: 'Frente a frente, por fin' },
    { src: 'media/fotos/boda-14.webp', caption: 'La mesa esperando', wide: true },
    { src: 'media/fotos/boda-15.webp', caption: 'La mesa de postres', wide: true },
    { src: 'media/fotos/boda-16.webp', caption: 'Nuestra entrada', wide: true },
    { src: 'media/fotos/boda-17.webp', caption: 'El beso en nuestra mesa' },
    { src: 'media/fotos/boda-18.webp', caption: 'Ya como esposos', wide: true },
    { src: 'media/fotos/boda-19.webp', caption: 'Con la familia', wide: true },
    { src: 'media/fotos/boda-20.webp', caption: 'Risas de nuestra boda', wide: true },
    { src: 'media/fotos/boda-21.webp', caption: 'El primer corte, juntos', wide: true },
    { src: 'media/fotos/boda-22.webp', caption: 'Partiendo el pastel' },
    { src: 'media/fotos/boda-23.webp', caption: 'Los que nos acompañaron', wide: true },
    { src: 'media/fotos/boda-24.webp', caption: 'Y empezó la fiesta' },
    { src: 'media/fotos/boda-25.webp', caption: 'A bailar', wide: true },
    { src: 'media/fotos/boda-26.webp', caption: 'Nuestra invitación', wide: true },
    { src: 'media/fotos/boda-27.webp', caption: 'La pista llena', wide: true },
    { src: 'media/fotos/boda-28.webp', caption: 'El show de la noche', wide: true },
    { src: 'media/fotos/boda-29.webp', caption: 'Hasta que el cuerpo aguante', wide: true },
  ],

  letter: {
    greeting: 'Mi amor:',
    paragraphs: [
      'Ese día te vi caminar hacia mí y supe que nada de lo que hubiera hecho antes importaba tanto como lo que estaba por empezar.',
      'Desde entonces hemos reído, nos hemos equivocado, hemos crecido. Y cada mañana sigo encontrando un motivo nuevo para quererte.',
      'No sabes lo feliz que me has hecho. Gracias por darme la oportunidad más grande de mi vida: elegirme como tu esposo y como papá de nuestras dos princesas.',
      'Ana Sofía, con sus tres años recién cumplidos, y Margarita, que está por cumplir el primero, son lo más bonito que hemos hecho juntos.',
      'Por ustedes tres lo doy todo: mi esfuerzo de cada día y todo mi amor son para ti y para ellas.',
      'Gracias por tu paciencia, por tu risa y por hacer de cualquier lugar nuestra casa.',
    ],
    signature: 'Siempre tuyo.',
  },

  // Música de fondo opcional. Ej: 'media/musica/nuestra-cancion.mp3'
  music: '',

  invitation: {
    // Tu WhatsApp con lada de país (52 = México), solo números
    whatsapp: '529613867848',
    // Lugares entre los que ella elige para el desayuno
    places: [
      { id: 'marriott',    label: 'Marriott',    note: 'Desayuno los cuatro, sin prisa y con mucho café.',       icon: 'cup' },
      { id: 'holiday-inn', label: 'Holiday Inn', note: 'Desayuno los cuatro, con pan dulce para las princesas.', icon: 'cloche' },
    ],
  },
};
