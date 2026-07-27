/**
 * Scroll reveals, number counters, progress bars, and subtle parallax.
 */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  const counters = document.querySelectorAll('[data-counter]');
  const progressLines = document.querySelectorAll('.progress-line');
  const hero = document.querySelector('.hero');

  const revealAll = () => {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    progressLines.forEach((element) => element.classList.add('is-visible'));
  };

  const animateCounter = (element) => {
    if (element.dataset.counted === 'true') return;

    const target = Number(element.dataset.counter || 0);
    const duration = Number(element.dataset.duration || 1500);
    const startTime = performance.now();
    element.dataset.counted = 'true';

    const update = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString('en-IN');

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealAll();
    counters.forEach((counter) => {
      counter.textContent = Number(counter.dataset.counter || 0).toLocaleString('en-IN');
    });
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -35px' });

    revealElements.forEach((element) => revealObserver.observe(element));
    progressLines.forEach((element) => revealObserver.observe(element));

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.55 });

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  if (hero && !reduceMotion && window.innerWidth >= 992) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.13, 90);
        hero.style.backgroundPositionY = `calc(50% + ${offset}px)`;
        ticking = false;
      });
    }, { passive: true });
  }
})();
