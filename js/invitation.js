/** Invitación a desayunar: ella elige el lugar y responde por WhatsApp. */
(function (App) {
  'use strict';

  const ICONS = {
    cup: '<path d="M10 18h24v10a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10z"/><path d="M34 21h3a5 5 0 0 1 0 10h-3"/><path d="M17 6v6M24 4v8M31 6v6M6 43h34"/>',
    cloche: '<path d="M6 34h36M4 40h40"/><path d="M9 34a15 15 0 0 1 30 0"/><circle cx="24" cy="15" r="2.500"/>',
  };

  function renderPlaces(container, places) {
    places.forEach((place) => {
      const label = document.createElement('label');
      label.className = 'place';
      label.innerHTML = `
        <input type="radio" name="place" value="${place.id}">
        <span class="place__card">
          <svg viewBox="0 0 48 48" aria-hidden="true">${ICONS[place.icon] || ICONS.cup}</svg>
          <span class="place__label"></span>
          <span class="place__note"></span>
        </span>`;
      label.querySelector('.place__label').textContent = place.label;
      label.querySelector('.place__note').textContent = place.note;
      container.appendChild(label);
    });
  }

  /** Texto de la respuesta; función pura para poder probarla. */
  function buildAnswer(place) {
    return place.answer || `Me encantaría desayunar en el ${place.label} contigo y con nuestras dos princesas`;
  }

  function whatsappUrl(phone, message) {
    const base = phone ? `https://wa.me/${phone.replace(/\D/g, '')}` : 'https://wa.me/';
    return `${base}?text=${encodeURIComponent(message)}`;
  }

  function initInvitation(invitation) {
    const form = document.getElementById('invite');
    const placesBox = document.getElementById('places');
    const submit = document.getElementById('inviteSubmit');
    const accepted = document.getElementById('accepted');
    const detail = document.getElementById('acceptedDetail');

    renderPlaces(placesBox, invitation.places);

    placesBox.addEventListener('change', () => {
      placesBox.classList.add('has-choice');
      submit.hidden = false;
      submit.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const place = invitation.places.find((item) => item.id === form.elements.place.value);
      if (!place) return;

      const answer = buildAnswer(place);
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
