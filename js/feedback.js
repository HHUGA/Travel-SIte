document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  if (currentPath.includes('feedback.html')) {
    const faqs = window.TravelData.faqs;
    const accordion = $('#faq-accordion');

    if (accordion && faqs) {
      accordion.innerHTML = faqs.map(f => `
        <div class="accordion-item">
          <button class="accordion-header" aria-expanded="false">
            <h4>${f.question}</h4>
            <span class="accordion-icon">+</span>
          </button>
          <div class="accordion-content">
            <p>${f.answer}</p>
          </div>
        </div>
      `).join('');

      onEvent(accordion, 'click', (e) => {
        const btn = e.target.closest('.accordion-header');
        if (!btn) return;

        const item = btn.closest('.accordion-item');
        const active = item.classList.contains('active');

        $$('.accordion-item', accordion).forEach(el => {
          el.classList.remove('active');
          el.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        });

        if (!active) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    const form = $('#support-form');
    const nameInput = $('#fb-name');
    const emailInput = $('#fb-email');
    const messageInput = $('#fb-message');
    const formBox = $('#form-panel');
    const successOverlay = $('#success-overlay');
    const writeBtn = $('#submit-another-btn');

    const fields = [nameInput, emailInput, messageInput];

    const validateField = (input) => {
      if (!input) return false;
      const ok = input.checkValidity() && input.value.trim() !== '';
      input.classList.toggle('valid', ok && input.value.trim() !== '');
      input.classList.toggle('invalid', !ok && input.value.trim() !== '');
      return ok;
    };

    fields.forEach(input => {
      if (input) onEvent(input, 'input', () => validateField(input));
    });

    if (form) {
      onEvent(form, 'submit', (e) => {
        e.preventDefault();
        const valid = fields.reduce((acc, el) => {
          const ok = validateField(el);
          if (!ok && el) el.classList.add('invalid');
          return acc && ok;
        }, true);

        if (!valid) {
          showToast('Please correct highlighted errors in the form!', 'error');
          return;
        }

        const submissions = TravelStore.get('tn_feedbacks', []);
        submissions.push({
          id: 'fb_' + Date.now(),
          name: nameInput.value,
          email: emailInput.value,
          message: messageInput.value,
          date: new Date().toLocaleString()
        });
        TravelStore.set('tn_feedbacks', submissions);

        formBox.classList.add('hide');
        successOverlay.classList.remove('hide');
        showToast('Feedback submitted successfully!', 'success');
      });
    }

    if (writeBtn) {
      onEvent(writeBtn, 'click', () => {
        if (form) form.reset();
        fields.forEach(el => { if (el) el.classList.remove('valid', 'invalid'); });
        successOverlay.classList.add('hide');
        formBox.classList.remove('hide');
      });
    }
  }
});
