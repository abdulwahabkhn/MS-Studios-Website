(function () {
  'use strict';

  function revealOnScroll() {
    const items = document.querySelectorAll('.reveal');

    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

    items.forEach((item) => observer.observe(item));
  }

  function animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.counter || 0);
        const suffix = element.dataset.suffix || '';
        const duration = 1100;
        const startTime = performance.now();

        function tick(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = `${Math.round(target * eased)}${suffix}`;

          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(element);
      });
    }, { threshold: 0.4 });

    counters.forEach((counter) => observer.observe(counter));
  }

  function bindParallax() {
    const targets = document.querySelectorAll('[data-parallax]');
    if (!targets.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const update = () => {
      const viewportHeight = window.innerHeight || 1;
      targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        const movement = Number(target.dataset.parallax || 18);
        target.style.transform = `translate3d(0, ${progress * movement}px, 0)`;
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function hideLoader() {
    const loader = document.querySelector('[data-loader]');
    if (!loader) return;

    window.setTimeout(() => {
      loader.classList.add('is-hidden');
      window.setTimeout(() => loader.remove(), 760);
    }, 260);
  }

  document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();
    animateCounters();
    bindParallax();
  });

  window.addEventListener('load', hideLoader);
})();
