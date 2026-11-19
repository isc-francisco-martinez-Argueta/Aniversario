/** Punto de entrada: conecta la configuración con cada módulo. */
(function (App) {
  'use strict';

  const { config, effects, intro, counter, media, letter, invitation } = App;

  function bindTexts() {
    const texts = {
      names: config.couple.names,
      phrase: config.hero.phrase,
      verse: config.weddingInvitation.verse,
      verseRef: config.weddingInvitation.verseRef,
      blessing: config.weddingInvitation.blessing,
      venue: config.weddingInvitation.venue,
      greeting: config.letter.greeting,
      signature: config.letter.signature,
    };
    document.querySelectorAll('[data-bind]').forEach((element) => {
      const key = element.dataset.bind;
      if (key === 'names') renderNames(element, texts[key]);
      else element.textContent = texts[key] || '';
    });
    document.title = `${config.couple.names} · 5.º aniversario`;
  }

  /** Escribe los nombres con el "&" en una tipografía legible. */
  function renderNames(element, text) {
    element.textContent = '';
    text.split('&').forEach((part, index) => {
      if (index > 0) {
        const amp = document.createElement('span');
        amp.className = 'amp';
        amp.textContent = '&';
        element.appendChild(amp);
      }
      element.appendChild(document.createTextNode(part));
    });
  }

  /** Portada: cada palabra es un bloque (para que no se corte) y cada letra se anima. */
  function splitHeroNames() {
    const title = document.querySelector('.hero__names');
    const text = config.couple.names;
    let letterIndex = 0;
    title.setAttribute('aria-label', text);
    title.textContent = '';

    text.split(' ').forEach((word, wordIndex) => {
      if (wordIndex > 0) title.appendChild(document.createTextNode(' '));
      const wordSpan = document.createElement('span');
      wordSpan.className = word === '&' ? 'word amp' : 'word';
      wordSpan.setAttribute('aria-hidden', 'true');
      [...word].forEach((character) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.style.setProperty('--i', letterIndex++);
        span.textContent = character;
        wordSpan.appendChild(span);
      });
      title.appendChild(wordSpan);
    });
  }

  /** El celular no necesita la versión de escritorio de la portada. */
  function usePhotoForScreen(element, photo) {
    const small = window.matchMedia('(max-width: 760px)');
    const apply = () => {
      const src = small.matches ? photo.replace(/\.webp$/, '-1200.webp') : photo;
      element.style.backgroundImage = `url("${src}")`;
    };
    apply();
    small.addEventListener('change', apply);
  }

  function initHero(weddingDate) {
    const photo = document.getElementById('heroPhoto');
    if (config.hero.photo) {
      usePhotoForScreen(photo, config.hero.photo);
      photo.classList.add('has-photo');
      document.getElementById('hero').classList.add('hero--photo');
    }
    if (!isNaN(weddingDate)) {
      document.getElementById('heroDate').textContent = new Intl.DateTimeFormat('es-MX', {
        day: 'numeric', month: 'long', year: 'numeric',
      }).format(weddingDate);
    }
    effects.initParallax(photo);
  }

  /** Mientras se ve un video: sin pétalos encima y sin música de fondo compitiendo. */
  function initVideoFocus(container, music) {
    const sync = () => {
      const watching = [...container.querySelectorAll('video')].some((video) => !video.paused && !video.ended);
      document.documentElement.classList.toggle('is-watching', watching);
      if (watching) music.pause();
    };
    ['play', 'pause', 'ended'].forEach((type) => container.addEventListener(type, sync, true));
  }

  function init() {
    document.documentElement.classList.add('has-js');
    const weddingDate = new Date(config.weddingDate);

    bindTexts();
    splitHeroNames();
    initHero(weddingDate);
    counter.initCounter(document.getElementById('counter'), weddingDate);

    media.renderVideos(document.getElementById('videos'), config.videos);
    const lightbox = media.createLightbox(document.getElementById('lightbox'), config.photos);
    const gallery = document.getElementById('gallery');
    media.renderGallery(gallery, config.photos, lightbox.open);
    effects.initTilt(gallery, '.polaroid');

    letter.initLetter(document.getElementById('letter'), document.getElementById('letterBody'), config.letter.paragraphs);
    invitation.initInvitation(config.invitation);

    effects.observeReveal(document.querySelectorAll('.reveal'));
    effects.observeReveal(document.querySelectorAll('.polaroid'), { stagger: 110 });
    effects.initCursorTrail('.player, .lightbox');
    // Fuera de la portada los pétalos se atenúan para no estorbar la lectura
    effects.watchVisibility(document.getElementById('hero'), (visible) => {
      document.documentElement.classList.toggle('is-past-hero', !visible);
    });

    const petals = effects.createPetals(document.getElementById('petals'));
    const music = intro.initMusic(config.music);
    initVideoFocus(document.getElementById('videos'), music);
    intro.initIntro({
      weddingDate,
      availableFrom: new Date(config.availableFrom),
      openSeconds: config.weddingInvitation.openSeconds,
      onOpen: () => music.play(),
      onEnter: () => petals.burst(),
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})(window.Aniversario);
