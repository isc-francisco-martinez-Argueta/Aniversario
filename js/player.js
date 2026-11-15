/** Reproductor de video con controles propios, a tono con la página. */
(function (App) {
  'use strict';

  const HIDE_DELAY_MS = 2600;
  const SEEK_STEP_SECONDS = 5;

  const ICONS = {
    play: '<path d="M8 5.5v13l11-6.5z"/>',
    pause: '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>',
    volume: '<path d="M4 9.500v5h3.500l4.500 4v-13l-4.500 4z"/><path class="line" d="M15.500 9a4 4 0 0 1 0 6M18 6.500a7.500 7.500 0 0 1 0 11"/>',
    muted: '<path d="M4 9.500v5h3.500l4.500 4v-13l-4.500 4z"/><path class="line" d="M16 9.500l5 5M21 9.500l-5 5"/>',
    expand: '<path class="line" d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
    shrink: '<path class="line" d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/>',
  };

  function icon(name) {
    return `<svg class="icon icon--${name}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
  }

  function formatTime(totalSeconds) {
    if (!isFinite(totalSeconds)) return '0:00';
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    const tail = String(seconds).padStart(2, '0');
    return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${tail}` : `${minutes}:${tail}`;
  }

  function createButton(className, icons) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.innerHTML = icons.map(icon).join('');
    return button;
  }

  function createVideo(source) {
    const video = document.createElement('video');
    video.src = source.src;
    video.preload = 'metadata';
    video.playsInline = true;
    if (source.poster) video.poster = source.poster;
    return video;
  }

  function createTime() {
    const time = document.createElement('span');
    time.className = 'player__time';
    time.textContent = '0:00';
    return time;
  }

  function createSeek() {
    const seek = document.createElement('input');
    seek.type = 'range';
    seek.className = 'player__seek';
    seek.min = 0;
    seek.max = 0;
    seek.step = 'any';
    seek.value = 0;
    seek.setAttribute('aria-label', 'Avanzar o regresar el video');
    return seek;
  }

  /** @param {{src: string, poster?: string, title?: string}} source */
  function createPlayer(source) {
    const root = document.createElement('div');
    const video = createVideo(source);
    const bigPlay = createButton('player__big', ['play']);
    const bar = document.createElement('div');
    const toggle = createButton('player__btn player__btn--toggle', ['play', 'pause']);
    const current = createTime();
    const seek = createSeek();
    const duration = createTime();
    const mute = createButton('player__btn player__btn--mute', ['volume', 'muted']);
    const fullscreen = createButton('player__btn player__btn--fullscreen', ['expand', 'shrink']);
    let hideTimer = 0;
    let tappedWhileIdle = false;

    root.className = 'player';
    root.tabIndex = 0; // recibe el teclado cuando los controles están ocultos
    root.setAttribute('role', 'group');
    root.setAttribute('aria-label', source.title ? 'Video: ' + source.title : 'Video');
    bar.className = 'player__bar';
    bar.append(toggle, current, seek, duration, mute, fullscreen);
    root.append(video, bigPlay, bar);

    /* ----- Acciones ----- */
    function togglePlay() {
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    }

    function toggleMute() { video.muted = !video.muted; }

    function seekBy(seconds) {
      video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), video.duration || 0);
    }

    function toggleFullscreen() {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (root.requestFullscreen) root.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iPhone
    }

    /* ----- Sincronía con el video ----- */
    function syncPlayback() {
      const playing = !video.paused && !video.ended;
      root.classList.toggle('is-playing', playing);
      if (playing) root.classList.add('is-started');
      if (playing) keepFocus(bigPlay); // el botón grande se oculta al reproducir
      const label = playing ? 'Pausar' : 'Reproducir';
      toggle.setAttribute('aria-label', label);
      bigPlay.setAttribute('aria-label', label + (source.title ? ': ' + source.title : ''));
      wake();
    }

    function syncProgress() {
      const total = video.duration || 0;
      seek.max = total;
      seek.value = video.currentTime;
      seek.style.setProperty('--progress', (total ? (video.currentTime / total) * 100 : 0) + '%');
      seek.setAttribute('aria-valuetext', `${formatTime(video.currentTime)} de ${formatTime(total)}`);
      current.textContent = formatTime(video.currentTime);
      duration.textContent = formatTime(total);
    }

    function syncVolume() {
      root.classList.toggle('is-muted', video.muted);
      mute.setAttribute('aria-label', video.muted ? 'Activar sonido' : 'Silenciar');
    }

    function syncFullscreen() {
      const active = document.fullscreenElement === root;
      root.classList.toggle('is-fullscreen', active);
      fullscreen.setAttribute('aria-label', active ? 'Salir de pantalla completa' : 'Pantalla completa');
    }

    /** Si el foco está en algo que va a ocultarse, lo sube al reproductor para no perder el teclado. */
    function keepFocus(hiding) {
      if (hiding.contains(document.activeElement)) root.focus({ preventScroll: true });
    }

    function hide() {
      keepFocus(bar);
      root.classList.add('is-idle');
    }

    /** Muestra los controles y los esconde tras un rato sin actividad. */
    function wake() {
      root.classList.remove('is-idle');
      clearTimeout(hideTimer);
      if (!video.paused) hideTimer = setTimeout(hide, HIDE_DELAY_MS);
    }

    ['play', 'pause', 'ended'].forEach((type) => video.addEventListener(type, syncPlayback));
    ['loadedmetadata', 'durationchange', 'timeupdate', 'seeked'].forEach((type) => video.addEventListener(type, syncProgress));
    video.addEventListener('volumechange', syncVolume);
    video.addEventListener('waiting', () => root.classList.add('is-waiting'));
    ['playing', 'canplay', 'pause'].forEach((type) => video.addEventListener(type, () => root.classList.remove('is-waiting')));
    document.addEventListener('fullscreenchange', syncFullscreen);

    /* ----- Interacción ----- */
    bigPlay.addEventListener('click', togglePlay);
    toggle.addEventListener('click', togglePlay);
    mute.addEventListener('click', toggleMute);
    fullscreen.addEventListener('click', toggleFullscreen);
    video.addEventListener('dblclick', toggleFullscreen);
    seek.addEventListener('input', () => { video.currentTime = Number(seek.value); });

    // En táctil, el primer toque solo muestra los controles
    root.addEventListener('pointerdown', (event) => {
      tappedWhileIdle = event.pointerType === 'touch' && root.classList.contains('is-idle');
    }, true);
    video.addEventListener('click', () => {
      if (!tappedWhileIdle) togglePlay();
    });
    ['pointermove', 'pointerdown', 'focusin', 'input'].forEach((type) => root.addEventListener(type, wake));

    const shortcuts = {
      k: togglePlay,
      m: toggleMute,
      f: toggleFullscreen,
      ArrowLeft: () => seekBy(-SEEK_STEP_SECONDS),
      ArrowRight: () => seekBy(SEEK_STEP_SECONDS),
    };
    root.addEventListener('keydown', (event) => {
      const onPlayer = event.target === root; // en un botón, espacio ya hace lo suyo
      const action = event.key === ' ' && onPlayer ? togglePlay : shortcuts[event.key];
      const nativeArrow = event.target === seek && event.key.startsWith('Arrow');
      if (!action || nativeArrow || event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      action();
      wake();
    });

    if (!root.requestFullscreen && !video.webkitEnterFullscreen) fullscreen.hidden = true;
    syncPlayback();
    syncProgress();
    syncVolume();
    syncFullscreen();

    return root;
  }

  App.player = { createPlayer };
})(window.Aniversario);
