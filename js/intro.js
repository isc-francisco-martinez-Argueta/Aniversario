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

  /** Con este parámetro en la dirección (?adelanto) la invitación se abre aunque no sea la fecha. */
  const PREVIEW_PARAM = 'adelanto';
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  /** "Faltan 11 días", "Falta 1 hora"… según lo que quede. */
  function timeLeft(milliseconds) {
    const [size, one, many] = milliseconds >= DAY ? [DAY, 'día', 'días']
      : milliseconds >= HOUR ? [HOUR, 'hora', 'horas']
      : [MINUTE, 'minuto', 'minutos'];
    const amount = Math.max(1, Math.ceil(milliseconds / size));
    return amount === 1 ? `Falta 1 ${one}` : `Faltan ${amount} ${many}`;
  }

  /**
   * Candado por fecha: hasta `opensAt` la invitación queda sellada y el texto dice cuándo se
   * podrá abrir y cuánto falta. Al llegar la fecha se libera sola, sin recargar la página.
   */
  function createDateLock(opensAt, { intro, button, label }) {
    const preview = new URLSearchParams(window.location.search).has(PREVIEW_PARAM);
    const isDue = () => preview || isNaN(opensAt) || Date.now() >= opensAt;
    if (isDue()) return { isLocked: () => false };

    const open = { text: label.textContent, aria: button.getAttribute('aria-label') };
    const day = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(opensAt);
    const remaining = document.createElement('small');
    let locked = true;

    const release = () => {
      locked = false;
      clearInterval(ticker);
      document.removeEventListener('visibilitychange', refresh);
      label.textContent = open.text;
      button.setAttribute('aria-label', open.aria);
      intro.classList.remove('is-sealed');
    };

    function refresh() {
      if (!locked) return;
      if (isDue()) release();
      else remaining.textContent = timeLeft(opensAt - Date.now());
    }

    intro.classList.add('is-sealed');
    label.replaceChildren(`Podrás abrirla el ${day}`, remaining);
    button.setAttribute('aria-label', `Disponible el ${day}`);
    const ticker = setInterval(refresh, 30 * 1000);
    document.addEventListener('visibilitychange', refresh);
    refresh();

    return {
      isLocked() {
        refresh();
        return locked;
      },
    };
  }

  /** Un "todavía no": la invitación se sacude un poco al tocarla antes de tiempo. */
  function shake(element) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    element.animate(
      { translate: ['0', '-7px', '6px', '-4px', '2px', '0'] },
      { duration: 450, easing: 'ease-in-out' },
    );
  }

  /**
   * Primer toque: se abren las solapas (onOpen). Segundo toque, o al pasar openSeconds:
   * la invitación da paso a la página (onEnter). Antes de `availableFrom` no se abre.
   */
  function initIntro({ weddingDate, availableFrom, openSeconds, onOpen, onEnter }) {
    const intro = document.getElementById('intro');
    const gatefold = document.getElementById('gatefold');
    const seal = document.getElementById('openInvitation');
    const cta = document.getElementById('introCta');
    let autoEnter;

    renderWeddingDate(document.getElementById('weddingDate'), weddingDate);
    const dateLock = createDateLock(availableFrom, { intro, button: seal, label: cta });

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
      if (dateLock.isLocked()) shake(gatefold);
      else if (!intro.classList.contains('is-open')) open();
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
