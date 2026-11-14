/** Carta que se escribe sola cuando entra en pantalla. */
(function (App) {
  'use strict';

  const SPEED_MS = 28;

  function typeParagraph(element, text) {
    return new Promise((resolve) => {
      let position = 0;
      element.classList.add('is-typing');
      const timer = setInterval(() => {
        element.textContent = text.slice(0, ++position);
        if (position < text.length) return;
        clearInterval(timer);
        element.classList.remove('is-typing');
        setTimeout(resolve, 350);
      }, SPEED_MS);
    });
  }

  function initLetter(article, body, paragraphs) {
    const elements = paragraphs.map((text) => {
      const paragraph = document.createElement('p');
      paragraph.setAttribute('aria-label', text);
      body.appendChild(paragraph);
      return paragraph;
    });

    if (App.effects.reducedMotion) {
      elements.forEach((element, index) => { element.textContent = paragraphs[index]; });
      article.classList.add('is-done');
      return;
    }

    App.effects.onceVisible(article, async () => {
      for (let index = 0; index < elements.length; index++) {
        await typeParagraph(elements[index], paragraphs[index]);
      }
      article.classList.add('is-done');
    });
  }

  App.letter = { initLetter };
})(window.Aniversario);
