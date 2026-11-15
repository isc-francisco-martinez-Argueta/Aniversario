/** Sobre de bienvenida: se abre al tocar el sello y da paso a la página. */
(function (App) {
  'use strict';

  function initIntro({ onOpen }) {
    const intro = document.getElementById('intro');
    const envelope = document.getElementById('envelope');

    // Todo el sobre responde al toque; el sello sigue siendo el botón accesible
    envelope.addEventListener('click', () => {
      intro.classList.add('is-open');
      document.body.classList.remove('is-locked');
      setTimeout(() => document.documentElement.classList.add('is-ready'), 1400);
      onOpen();
    }, { once: true });
  }

  function initMusic(source) {
    const button = document.getElementById('musicToggle');
    const label = document.getElementById('musicLabel');
    if (!source) return { play() {}, pause() {} };

    const audio = new Audio(source);
    audio.loop = true;
    audio.volume = .6;
    button.hidden = false;

    const render = () => {
      const playing = !audio.paused;
      button.setAttribute('aria-pressed', String(playing));
      label.textContent = playing ? 'Pausar música' : 'Poner música';
    };
    audio.addEventListener('play', render);
    audio.addEventListener('pause', render);
    button.addEventListener('click', () => (audio.paused ? audio.play() : audio.pause()));

    return { play: () => audio.play().catch(() => {}), pause: () => audio.pause() };
  }

  App.intro = { initIntro, initMusic };
})(window.Aniversario);
