(function () {
  'use strict';

  function setFooterYear() {
    document.querySelectorAll('[data-year]').forEach((item) => {
      item.textContent = new Date().getFullYear();
    });
  }

  function bindSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setFooterYear();
    bindSmoothAnchors();
  });
})();
