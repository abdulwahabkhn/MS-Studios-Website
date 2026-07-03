(function () {
  'use strict';

  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-mobile-panel]');
  const navLinks = document.querySelectorAll('[data-nav-link]');

  function currentPageName() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path === '' ? 'index.html' : path;
  }

  function setActiveNav() {
    const current = currentPageName();
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const target = href.split('/').pop() || 'index.html';
      link.classList.toggle('is-current', target === current);
    });
  }

  function setMenu(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  }

  function bindMenu() {
    if (!toggle || !panel) return;

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      setMenu(open);
    });

    panel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenu(false);
    });
  }

  function bindHeaderState() {
    if (!header) return;

    const update = () => {
      header.classList.toggle('has-scrolled', window.scrollY > 20);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    bindMenu();
    bindHeaderState();
  });
})();
