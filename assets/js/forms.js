(function () {
  'use strict';

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function prefillService() {
    const service = getQueryParam('service');
    const select = document.querySelector('[data-service-select]');
    const message = document.querySelector('[data-message-field]');

    if (!service || !select) return;

    const decoded = decodeURIComponent(service);
    Array.from(select.options).forEach((option) => {
      if (option.value === decoded || option.textContent === decoded) {
        select.value = option.value;
      }
    });

    if (message && !message.value) {
      message.value = `I am interested in ${decoded}. Please share availability and package details.`;
    }
  }

  function getContactEndpoint() {
    if (window.MS_STUDIO_CONTACT_ENDPOINT) {
      return window.MS_STUDIO_CONTACT_ENDPOINT;
    }

    const isLocalPage = window.location.protocol === 'file:'
      || window.location.hostname === 'localhost'
      || window.location.hostname === '127.0.0.1';

    return isLocalPage ? 'http://localhost:5000/api/contact' : '/api/contact';
  }

  function trimFieldValue(form, fieldName) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    const value = String(field?.value || '').trim();

    if (field) field.value = value;

    return value;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isReasonablePhone(phone) {
    const digits = phone.replace(/\D/g, '');

    return /^\+?[0-9\s().-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15;
  }

  function setFieldError(form, fieldName, hasError) {
    const field = form.querySelector(`[name="${fieldName}"]`);

    if (!field) return;

    field.classList.toggle('form-error', hasError);
    field.setAttribute('aria-invalid', String(hasError));
  }

  function setFeedback(feedback, title, message) {
    if (!feedback) return;

    const heading = feedback.querySelector('.card-title');
    const paragraph = feedback.querySelector('p');

    if (heading) heading.textContent = title;
    if (paragraph) paragraph.textContent = message;

    feedback.hidden = false;
    feedback.setAttribute('aria-live', 'polite');
    feedback.focus();
  }

  function getContactPayload(form) {
    return {
      name: trimFieldValue(form, 'name'),
      email: trimFieldValue(form, 'email'),
      phone: trimFieldValue(form, 'phone'),
      message: trimFieldValue(form, 'message'),
    };
  }

  function validateContactPayload(form, payload) {
    const errors = {
      name: !payload.name,
      email: !payload.email || !isValidEmail(payload.email),
      phone: !payload.phone || !isReasonablePhone(payload.phone),
      message: !payload.message,
    };

    Object.entries(errors).forEach(([fieldName, hasError]) => {
      setFieldError(form, fieldName, hasError);
    });

    return !Object.values(errors).some(Boolean);
  }

  function applyServerErrors(form, errors) {
    Object.keys(errors || {}).forEach((fieldName) => {
      setFieldError(form, fieldName, true);
    });
  }

  function bindContactForm() {
    const form = document.querySelector('[data-contact-form]');
    const success = document.querySelector('[data-form-success]');
    const submitButton = form?.querySelector('[type="submit"]');
    const submitText = submitButton?.textContent || 'Send Enquiry';
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const payload = getContactPayload(form);

      if (!validateContactPayload(form, payload)) {
        setFeedback(success, 'Please check the form.', 'Name, email, phone, and message are required. Use a valid email and phone number.');
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        submitButton.setAttribute('aria-busy', 'true');
      }

      try {
        const response = await fetch(getContactEndpoint(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.success) {
          applyServerErrors(form, result.errors);
          setFeedback(success, 'We could not send your booking.', result.message || 'Please try again in a moment.');
          return;
        }

        form.reset();
        setFeedback(success, `Thank you, ${payload.name}.`, result.message || 'Booking sent successfully.');
      } catch (error) {
        setFeedback(success, 'We could not reach the booking server.', 'Please check your connection and try again.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitText;
          submitButton.setAttribute('aria-busy', 'false');
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    prefillService();
    bindContactForm();
  });
})();
