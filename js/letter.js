/** Carta que se escribe sola cuando entra en pantalla. Un toque la completa. */
(function (App) {
  'use strict';

  const SPEED_MS = 18;
  const PAUSE_MS = 350;

  /**
   * Cada párrafo reserva su espacio desde el inicio: la "tinta" es lo ya escrito
   * y el resto queda invisible, así la carta no crece ni empuja la página.
   */
  function createParagraph(text) {
    const paragraph = document.createElement('p');
    const ink = document.createElement('span');
    const rest = document.createElement('span');
    ink.className = 'letter__ink';
    rest.className = 'letter__rest';
    rest.textContent = text;
    paragraph.setAttribute('aria-label', text);
    paragraph.append(ink, rest);

    return {
      element: paragraph,
      length: text.length,
      write(position) {
        ink.textContent = text.slice(0, position);
        rest.textContent = text.slice(position);
      },
    };
  }

  function initLetter(article, body, paragraphs) {
    const lines = paragraphs.map(createParagraph);
    let timer = 0;
    let finished = false;

    lines.forEach((line) => body.appendChild(line.element));

    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      lines.forEach((line) => {
        line.write(line.length);
        line.element.classList.remove('is-typing');
      });
      article.classList.add('is-done');
    }

    function type(lineIndex, position) {
      const line = lines[lineIndex];
      if (!line) return finish();

      line.element.classList.add('is-typing');
      line.write(position);
      if (position < line.length) {
        timer = setTimeout(type, SPEED_MS, lineIndex, position + 1);
        return;
      }
      timer = setTimeout(() => {
        line.element.classList.remove('is-typing');
        type(lineIndex + 1, 0);
      }, PAUSE_MS);
    }

    if (App.effects.reducedMotion) return finish();

    article.addEventListener('click', finish, { once: true });
    App.effects.onceVisible(article, () => { if (!finished) type(0, 0); });
  }

  App.letter = { initLetter };
})(window.Aniversario);
