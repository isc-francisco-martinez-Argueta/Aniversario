/** Invitación de bienvenida: las solapas de encaje se abren al tocarla y dan paso a la página. */
(function (App) {
  'use strict';

  /** Lo que tardan las solapas en abrirse; antes de eso un toque no cuenta como "continuar". */
  const FLAPS_OPEN_MS = 2000;

  /** Escribe la fecha de la boda en la tarjeta: mes y año, día (un círculo por dígito) y hora. */
  function renderWeddingDate(container, date) {
    if (isNaN(date)) return;
    const part = (options) => new Intl.DateTimeFormat('es-MX', options).format(date);
    const slot = (name) => container.querySelector(`[data-date="${name}"]`);

    slot('month').textContent = part({ month: 'long' });
    slot('year').textContent = part({ year: 'numeric' });
    slot('time').textContent = part({ hour: '2-digit', minute: '2-digit', hour12: false });
    slot('day').replaceChildren(...[...part({ day: '2-digit' })].map((digit) => {
      const span = document.createElement('span');
      span.textContent = digit;
      return span;
    }));
  }

  /**
   * Primer toque: se abren las solapas (onOpen). Segundo toque, o al pasar openSeconds:
   * la invitación da paso a la página (onEnter).
   */
  function initIntro({ weddingDate, openSeconds, onOpen, onEnter }) {
    const intro = document.getElementById('intro');
    const gatefold = document.getElementById('gatefold');
    const seal = document.getElementById('openInvitation');
    const cta = document.getElementById('introCta');
    let autoEnter;

    renderWeddingDate(document.getElementById('weddingDate'), weddingDate);

    const enter = () => {
      clearTimeout(autoEnter);
      gatefold.removeEventListener('click', onTap);
      intro.classList.add('is-leaving');
      document.body.classList.remove('is-locked');
      document.documentElement.classList.add('is-ready');
      onEnter();
    };

    const inviteToContinue = () => {
      cta.textContent = cta.dataset.continue;
      seal.setAttribute('aria-label', cta.dataset.continue);
      intro.classList.add('is-waiting');
    };

    const open = () => {
      intro.classList.add('is-open');
      setTimeout(inviteToContinue, FLAPS_OPEN_MS);
      autoEnter = setTimeout(enter, openSeconds * 1000);
      onOpen();
    };

    // Toda la invitación responde al toque; el sello sigue siendo el botón accesible
    function onTap() {
      if (!intro.classList.contains('is-open')) open();
      else if (intro.classList.contains('is-waiting')) enter();
    }
    gatefold.addEventListener('click', onTap);
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
