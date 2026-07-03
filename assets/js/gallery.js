(function () {
  'use strict';

  function bindGalleryFilters() {
    const filterBars = document.querySelectorAll('[data-gallery-filters]');
    if (!filterBars.length) return;

    filterBars.forEach((bar) => {
      const gallery = document.querySelector(bar.dataset.galleryFilters);
      if (!gallery) return;

      const buttons = bar.querySelectorAll('[data-filter]');
      const items = gallery.querySelectorAll('[data-category]');

      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const filter = button.dataset.filter;

          buttons.forEach((item) => item.classList.toggle('is-active', item === button));
          items.forEach((item) => {
            const categories = (item.dataset.category || '').split(' ');
            const matches = filter === 'all' || categories.includes(filter);
            item.classList.toggle('is-hidden', !matches);
          });
        });
      });
    });
  }

  function lazyMarkImageSlots() {
    const slots = document.querySelectorAll('.image-slot');
    if (!slots.length || !('IntersectionObserver' in window)) {
      slots.forEach((slot) => slot.classList.add('is-loaded'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-loaded');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '180px' });

    slots.forEach((slot) => observer.observe(slot));
  }

  function bindEnquiryLinks() {
    document.querySelectorAll('[data-enquire-service]').forEach((button) => {
      button.addEventListener('click', () => {
        const service = encodeURIComponent(button.dataset.enquireService || '');
        window.location.href = `contact.html?service=${service}`;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindGalleryFilters();
    lazyMarkImageSlots();
    bindEnquiryLinks();
  });
})();
