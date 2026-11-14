/**
 * Efectos visuales reutilizables: pétalos, corazones, aparición al hacer scroll,
 * parallax e inclinación 3D. No conocen el contenido de la página.
 */
(function (App) {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PETAL_COLORS = ['#e7c3c1', '#f3d6d2', '#dba9ad', '#f8ebe7', '#c5a26b'];
  const SPARK_COLORS = ['#e7c3c1', '#d58c99', '#c5a26b', '#fffaf6', '#8c9f88'];
  const random = (min, max) => Math.random() * (max - min) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  /* ---------- Pétalos cayendo (canvas) ---------- */
  function createPetals(canvas) {
    if (reducedMotion || !canvas) return { burst() {} };

    const ctx = canvas.getContext('2d');
    const baseCount = window.innerWidth < 700 ? 14 : 30;
    let width = 0, height = 0, petals = [];

    const newPetal = (overrides = {}) => ({
      x: random(0, width), y: random(-height, 0),
      size: random(7, 16), speedY: random(.5, 1.5), speedX: random(-.3, .3),
      phase: random(0, Math.PI * 2), angle: random(0, Math.PI * 2), spin: random(-.02, .02),
      color: pick(PETAL_COLORS), alpha: random(.45, .9), temporary: false,
      ...overrides,
    });

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width * ratio; canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(petal) {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.angle);
      ctx.scale(1, .55 + Math.abs(Math.sin(petal.phase)) * .45);
      ctx.globalAlpha = petal.alpha;
      ctx.fillStyle = petal.color;
      ctx.beginPath();
      ctx.moveTo(0, -petal.size);
      ctx.bezierCurveTo(petal.size, -petal.size * .6, petal.size * .7, petal.size * .8, 0, petal.size);
      ctx.bezierCurveTo(-petal.size * .7, petal.size * .8, -petal.size, -petal.size * .6, 0, -petal.size);
      ctx.fill();
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      petals = petals.filter((petal) => {
        petal.phase += .02;
        petal.angle += petal.spin;
        petal.x += petal.speedX + Math.sin(petal.phase) * .6;
        petal.y += petal.speedY;
        if (petal.temporary) petal.speedY += .04;
        draw(petal);
        if (petal.y < height + 30) return true;
        if (petal.temporary) return false;
        Object.assign(petal, newPetal({ y: -20 }));
        return true;
      });
      requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize);
    petals = Array.from({ length: baseCount }, () => newPetal());
    requestAnimationFrame(tick);

    return {
      burst(amount = 70) {
        for (let i = 0; i < amount; i++) {
          petals.push(newPetal({
            x: width / 2 + random(-60, 60), y: height / 2 + random(-40, 40),
            speedX: random(-5, 5), speedY: random(-9, -2), temporary: true,
          }));
        }
      },
    };
  }

  /* ---------- Corazones (DOM) ---------- */
  function spawnSpark(x, y, { spread = 40, rise = 70, life = 1000 } = {}) {
    if (reducedMotion) return;
    const spark = document.createElement('span');
    spark.className = 'spark';
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    spark.style.scale = random(.7, 1.8).toFixed(2);
    spark.style.setProperty('--color', pick(SPARK_COLORS));
    spark.style.setProperty('--dx', random(-spread, spread) + 'px');
    spark.style.setProperty('--dy', random(-rise, rise * .2) + 'px');
    spark.style.setProperty('--rot', random(-90, 90) + 'deg');
    spark.style.setProperty('--life', life + 'ms');
    spark.addEventListener('animationend', () => spark.remove());
    document.body.appendChild(spark);
  }

  function heartBurst(x, y, amount = 60) {
    for (let i = 0; i < amount; i++) {
      setTimeout(() => spawnSpark(x, y, { spread: 260, rise: 320, life: random(1200, 2400) }), i * 12);
    }
  }

  function initCursorTrail() {
    let last = 0;
    window.addEventListener('pointermove', (event) => {
      const now = performance.now();
      if (now - last < 60) return;
      last = now;
      spawnSpark(event.clientX, event.clientY);
    }, { passive: true });
    window.addEventListener('pointerdown', (event) => {
      for (let i = 0; i < 6; i++) spawnSpark(event.clientX, event.clientY, { spread: 70, rise: 90 });
    }, { passive: true });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  function observeReveal(elements, { stagger = 0 } = {}) {
    const observer = new IntersectionObserver((entries) => {
      entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
        setTimeout(() => entry.target.classList.add('is-visible'), index * stagger);
        observer.unobserve(entry.target);
      });
    }, { threshold: .15 });
    elements.forEach((element) => observer.observe(element));
  }

  function onceVisible(element, callback) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      callback();
    }, { threshold: .35 });
    observer.observe(element);
  }

  /* ---------- Parallax e inclinación ---------- */
  function initParallax(element, factor = .25) {
    if (reducedMotion || !element) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        element.style.transform = `translateY(${window.scrollY * factor}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  function initTilt(container, selector, maxDegrees = 9) {
    if (reducedMotion || !container) return;
    container.addEventListener('pointermove', (event) => {
      const card = event.target.closest(selector);
      if (!card) return;
      const box = card.getBoundingClientRect();
      const px = (event.clientX - box.left) / box.width - .5;
      const py = (event.clientY - box.top) / box.height - .5;
      card.style.setProperty('--ry', (px * maxDegrees * 2).toFixed(1) + 'deg');
      card.style.setProperty('--rx', (-py * maxDegrees * 2).toFixed(1) + 'deg');
    });
    container.addEventListener('pointerout', (event) => {
      const card = event.target.closest(selector);
      if (!card || card.contains(event.relatedTarget)) return;
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  App.effects = {
    reducedMotion, createPetals, spawnSpark, heartBurst, initCursorTrail,
    observeReveal, onceVisible, initParallax, initTilt,
  };
})(window.Aniversario);
