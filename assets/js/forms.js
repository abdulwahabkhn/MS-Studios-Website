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

  function trimFieldValue(form, fieldName) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    const value = String(field?.value || '').trim();

    if (field) {
      field.value = value;
    }

    return value;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isReasonablePhone(phone) {
    const digits = phone.replace(/\D/g, '');

    return (
      /^\+?[0-9\s().-]+$/.test(phone) &&
      digits.length >= 7 &&
      digits.length <= 15
    );
  }

  function setFieldError(form, fieldName, hasError) {
    const field = form.querySelector(`[name="${fieldName}"]`);

    if (!field) return;

    field.classList.toggle('form-error', hasError);
    field.setAttribute('aria-invalid', String(hasError));
  }

  function clearFieldErrors(form) {
    ['name', 'email', 'phone', 'message'].forEach((fieldName) => {
      setFieldError(form, fieldName, false);
    });
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

  function setSubmittingState(button, text) {
    if (!button) return;

    button.disabled = true;
    button.textContent = 'Sending...';
    button.setAttribute('aria-busy', 'true');
    button.dataset.originalText = text;
  }

  function restoreSubmitButton(button, fallbackText) {
    if (!button) return;

    button.disabled = false;
    button.textContent = button.dataset.originalText || fallbackText;
    button.setAttribute('aria-busy', 'false');
  }

  async function submitNetlifyForm(form) {
    const formData = new FormData(form);

    const response = await fetch('/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Submission failed with status ${response.status}`);
    }
  }

  function bindContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    const success = document.querySelector('[data-form-success]');
    const successName = document.querySelector('[data-success-name]');
    const submitButton = form.querySelector('[type="submit"]');
    const submitText = submitButton?.textContent || 'Send Enquiry';

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      clearFieldErrors(form);

      const payload = getContactPayload(form);

      if (!validateContactPayload(form, payload)) {
        setFeedback(
          success,
          'Please check the form.',
          'Name, email, phone, and message are required. Use a valid email and phone number.'
        );
        return;
      }

      setSubmittingState(submitButton, submitText);

      try {
        await submitNetlifyForm(form);

        form.reset();

        if (successName) {
          successName.textContent = payload.name;
        }

        setFeedback(
          success,
          `Thank you, ${payload.name}.`,
          'Your enquiry has been sent to MS Studio. We will follow up soon.'
        );
      } catch (error) {
        setFeedback(
          success,
          'We could not send your enquiry.',
          'Something went wrong while sending your enquiry. Please try again in a moment.'
        );
      } finally {
        restoreSubmitButton(submitButton, submitText);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    prefillService();
    bindContactForm();
  });
})();