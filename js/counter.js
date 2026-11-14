/** Contador de tiempo transcurrido desde la boda. */
(function (App) {
  'use strict';

  const UNITS = [
    ['years', 'años'], ['months', 'meses'], ['days', 'días'],
    ['hours', 'horas'], ['minutes', 'minutos'], ['seconds', 'segundos'],
  ];

  /** Diferencia de calendario entre dos fechas (from <= to). */
  function elapsed(from, to) {
    let years = to.getFullYear() - from.getFullYear();
    let months = to.getMonth() - from.getMonth();
    let days = to.getDate() - from.getDate();
    let hours = to.getHours() - from.getHours();
    let minutes = to.getMinutes() - from.getMinutes();
    let seconds = to.getSeconds() - from.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) { days += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); months--; }
    if (months < 0) { months += 12; years--; }

    return { years, months, days, hours, minutes, seconds };
  }

  function initCounter(list, weddingDate) {
    if (isNaN(weddingDate) || weddingDate > new Date()) {
      list.closest('.counter').hidden = true;
      return;
    }

    const cells = {};
    UNITS.forEach(([key, label]) => {
      const item = document.createElement('li');
      const value = document.createElement('strong');
      const caption = document.createElement('span');
      caption.textContent = label;
      item.append(value, caption);
      list.appendChild(item);
      cells[key] = value;
    });

    const render = () => {
      const diff = elapsed(weddingDate, new Date());
      UNITS.forEach(([key]) => { cells[key].textContent = diff[key]; });
    };
    render();
    setInterval(render, 1000);
  }

  App.counter = { initCounter, elapsed };
})(window.Aniversario);
