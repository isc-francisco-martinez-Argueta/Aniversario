/** Invitación: ella elige desayuno, comida o cena y responde por WhatsApp. */
(function (App) {
  'use strict';

  const ICONS = {
    sunrise: '<path d="M4 34h40M10 40h28"/><path d="M12 34a12 12 0 0 1 24 0"/><path d="M24 8v8M8 20l5 4M40 20l-5 4"/>',
    sun: '<circle cx="24" cy="24" r="9"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4"/>',
    moon: '<path d="M36 28A15 15 0 0 1 20 8a15 15 0 1 0 16 20z"/><path d="M36 8v6M33 11h6"/>',
  };

  function renderMeals(container, meals) {
    meals.forEach((meal) => {
      const label = document.createElement('label');
      label.className = 'meal';
      label.innerHTML = `
        <input type="radio" name="meal" value="${meal.id}">
        <span class="meal__card">
          <svg viewBox="0 0 48 48" aria-hidden="true">${ICONS[meal.icon] || ICONS.sun}</svg>
          <span class="meal__label"></span>
          <span class="meal__note"></span>
        </span>`;
      label.querySelector('.meal__label').textContent = meal.label;
      label.querySelector('.meal__note').textContent = meal.note;
      container.appendChild(label);
    });
  }

  /** Texto de la respuesta; función pura para poder probarla. */
  function buildAnswer(meal) {
    return meal.answer || `Me encantaría un momento de ${meal.label.toLowerCase()} contigo`;
  }

  function whatsappUrl(phone, message) {
    const base = phone ? `https://wa.me/${phone.replace(/\D/g, '')}` : 'https://wa.me/';
    return `${base}?text=${encodeURIComponent(message)}`;
  }

  function initInvitation(invitation) {
    const form = document.getElementById('invite');
    const mealsBox = document.getElementById('meals');
    const submit = document.getElementById('inviteSubmit');
    const accepted = document.getElementById('accepted');
    const detail = document.getElementById('acceptedDetail');

    renderMeals(mealsBox, invitation.meals);

    mealsBox.addEventListener('change', () => {
      mealsBox.classList.add('has-choice');
      submit.hidden = false;
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const meal = invitation.meals.find((item) => item.id === form.elements.meal.value);
      if (!meal) return;

      const answer = buildAnswer(meal);
      detail.textContent = `${answer}.`;
      accepted.hidden = false;
      accepted.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const box = submit.getBoundingClientRect();
      App.effects.heartBurst(box.left + box.width / 2, box.top + box.height / 2, 90);

      window.open(whatsappUrl(invitation.whatsapp, `¡Sí, acepto! 💕 ${answer}.`), '_blank', 'noopener');
    });
  }

  App.invitation = { initInvitation, buildAnswer, whatsappUrl };
})(window.Aniversario);
