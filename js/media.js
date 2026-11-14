/** Videos, galería de fotos tipo polaroid y visor a pantalla completa. */
(function (App) {
  'use strict';

  const TILTS = [-4, 3, -2, 5, -3, 2, 4, -5];
  const EMPTY_PHOTOS = 6;

  function emptyBlock(className, text) {
    const block = document.createElement('div');
    block.className = className;
    block.textContent = text;
    return block;
  }

  /* ---------- Videos ---------- */
  function renderVideos(container, videos) {
    const items = videos.length ? videos : [null];

    items.forEach((video) => {
      const figure = document.createElement('figure');
      figure.className = 'film reveal';

      if (video) {
        figure.appendChild(App.player.createPlayer(video));
      } else {
        figure.appendChild(emptyBlock('film__empty', 'Aquí va el video de la boda. Cópialo a media/videos y agrégalo en js/config.js'));
      }

      if (video && video.title) {
        const caption = document.createElement('figcaption');
        caption.textContent = video.title;
        figure.appendChild(caption);
      }
      container.appendChild(figure);
    });

    // Solo un video suena a la vez
    container.addEventListener('play', (event) => {
      container.querySelectorAll('video').forEach((other) => {
        if (other !== event.target) other.pause();
      });
    }, true);
  }

  /* ---------- Galería ---------- */
  function renderGallery(container, photos, onOpen) {
    const items = photos.length ? photos : Array.from({ length: EMPTY_PHOTOS }, () => null);

    items.forEach((photo, index) => {
      const card = document.createElement(photo ? 'button' : 'div');
      card.className = photo && photo.wide ? 'polaroid polaroid--wide' : 'polaroid';
      card.style.setProperty('--r', TILTS[index % TILTS.length] + 'deg');

      if (photo) {
        card.type = 'button';
        card.setAttribute('aria-label', 'Ver en grande: ' + (photo.caption || 'foto ' + (index + 1)));
        const image = document.createElement('img');
        image.src = photo.src;
        image.alt = photo.caption || '';
        image.loading = 'lazy';
        image.addEventListener('error', () => {
          image.replaceWith(emptyBlock('polaroid__empty', 'No encontré ' + photo.src));
        });
        card.appendChild(image);
        card.addEventListener('click', () => onOpen(index));
      } else {
        card.appendChild(emptyBlock('polaroid__empty', 'Tu foto aquí'));
      }

      const caption = document.createElement('span');
      caption.className = 'polaroid__caption';
      caption.textContent = photo ? (photo.caption || '') : '';
      card.appendChild(caption);
      container.appendChild(card);
    });
  }

  /* ---------- Visor ---------- */
  function createLightbox(root, photos) {
    const image = root.querySelector('#lightboxImg');
    const caption = root.querySelector('#lightboxCaption');
    let current = 0;
    let opener = null;

    function show(index) {
      current = (index + photos.length) % photos.length;
      image.src = photos[current].src;
      image.alt = photos[current].caption || '';
      caption.textContent = photos[current].caption || '';
    }

    function open(index) {
      opener = document.activeElement;
      show(index);
      root.hidden = false;
      document.body.classList.add('is-locked');
      root.querySelector('[data-action="close"]').focus();
    }

    function close() {
      root.hidden = true;
      document.body.classList.remove('is-locked');
      if (opener) opener.focus();
    }

    const actions = { close, prev: () => show(current - 1), next: () => show(current + 1) };

    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (button) actions[button.dataset.action]();
      else if (event.target === root) close();
    });

    document.addEventListener('keydown', (event) => {
      if (root.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') actions.prev();
      if (event.key === 'ArrowRight') actions.next();
    });

    let touchStartX = 0;
    root.addEventListener('touchstart', (event) => { touchStartX = event.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', (event) => {
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) (delta > 0 ? actions.prev : actions.next)();
    });

    return { open };
  }

  App.media = { renderVideos, renderGallery, createLightbox };
})(window.Aniversario);
