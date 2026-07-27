/**
 * Shared interface behavior.
 * No page structure or HTML content is generated in JavaScript.
 */
(() => {
  'use strict';

  const body = document.body;
  const header = document.getElementById('siteHeader');
  const scrollTopButton = document.getElementById('scrollTop');
  const pageLoader = document.getElementById('pageLoader');
  const navbarCollapse = document.getElementById('primaryNavigation');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');

  const setScrollState = () => {
    const isScrolled = window.scrollY > 24;

    if (header) {
      header.classList.toggle('is-scrolled', isScrolled);
    }

    if (scrollTopButton) {
      scrollTopButton.classList.toggle('is-visible', window.scrollY > 520);
    }
  };

  const hideLoader = () => {
    if (!pageLoader) return;
    pageLoader.classList.add('is-hidden');
  };

  const setActiveNavigation = () => {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.site-header a[href]');

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return;

      const linkFile = href.split('/').pop();
      if (linkFile === currentFile) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  };

  const closeMobileNavigation = (event) => {
    if (!navbarCollapse || window.innerWidth >= 1200) return;
    if (!event.target.closest('.nav-link, .dropdown-item, .nav-book-btn')) return;
    if (event.target.classList.contains('dropdown-toggle')) return;
    if (typeof bootstrap === 'undefined') return;

    const collapse = bootstrap.Collapse.getInstance(navbarCollapse);
    if (collapse) collapse.hide();
  };

  const openLightbox = (button) => {
    if (!lightboxImage || !lightboxCaption) return;

    const fullImage = button.dataset.full;
    const caption = button.dataset.caption || 'The Royal Bagpipe Band Shere Punjab performance';

    lightboxImage.src = fullImage;
    lightboxImage.alt = caption;
    lightboxCaption.textContent = caption;
  };

  document.addEventListener('click', (event) => {
    const galleryButton = event.target.closest('.gallery-item[data-full]');
    if (galleryButton) openLightbox(galleryButton);

    const anchor = event.target.closest('a[href^="#"]');
    if (anchor) {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  });

  if (navbarCollapse) {
    navbarCollapse.addEventListener('click', closeMobileNavigation);
    navbarCollapse.addEventListener('show.bs.collapse', () => body.classList.add('menu-open'));
    navbarCollapse.addEventListener('hidden.bs.collapse', () => body.classList.remove('menu-open'));
  }

  if (scrollTopButton) {
    scrollTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const lightboxModal = document.getElementById('galleryLightbox');
  if (lightboxModal && lightboxImage) {
    lightboxModal.addEventListener('hidden.bs.modal', () => {
      lightboxImage.removeAttribute('src');
      lightboxImage.alt = '';
      if (lightboxCaption) lightboxCaption.textContent = '';
    });
  }

  window.addEventListener('scroll', setScrollState, { passive: true });
  window.addEventListener('load', hideLoader, { once: true });
  window.setTimeout(hideLoader, 1800);

  setActiveNavigation();
  setScrollState();
})();
