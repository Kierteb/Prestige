/* ==========================================================================
   Prestige 4 Cleaners — Shared JavaScript
   ========================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     Nav: transparent ↔ solid on scroll
  ----------------------------------------------------------------------- */
  const nav = document.querySelector('.nav');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.remove('nav-transparent');
      nav.classList.add('nav-solid');
    } else {
      nav.classList.remove('nav-solid');
      nav.classList.add('nav-transparent');
    }
  }

  if (nav) {
    nav.classList.add('nav-transparent');
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* -----------------------------------------------------------------------
     Active nav link
  ----------------------------------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* -----------------------------------------------------------------------
     Hamburger / Mobile Menu
  ----------------------------------------------------------------------- */
  const hamburger    = document.querySelector('.hamburger');
  const mobileMenu   = document.querySelector('.mobile-menu');
  const mobileLinks  = document.querySelectorAll('.mobile-menu a');

  function toggleMenu(open) {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', open);
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      toggleMenu(!isOpen);
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  /* -----------------------------------------------------------------------
     Smooth scroll for anchor links
  ----------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height'), 10) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* -----------------------------------------------------------------------
     Intersection Observer — fade-up & fade-in animations
  ----------------------------------------------------------------------- */
  const animatedEls = document.querySelectorAll('.fade-up, .fade-in');

  if ('IntersectionObserver' in window && animatedEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    animatedEls.forEach(el => el.classList.add('visible'));
  }

  /* -----------------------------------------------------------------------
     Before / After Sliders
  ----------------------------------------------------------------------- */
  function initSliders() {
    const sliders = document.querySelectorAll('.ba-slider');

    sliders.forEach(slider => {
      const before = slider.querySelector('.ba-before');
      const handle = slider.querySelector('.ba-handle');
      let isDragging = false;

      function setPosition(clientX) {
        const rect = slider.getBoundingClientRect();
        let percent = (clientX - rect.left) / rect.width;
        percent = Math.max(0.02, Math.min(0.98, percent));
        const pct = percent * 100;
        before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        handle.style.left = `${pct}%`;
      }

      // Mouse
      slider.addEventListener('mousedown', e => {
        isDragging = true;
        setPosition(e.clientX);
        e.preventDefault();
      });

      window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        setPosition(e.clientX);
      });

      window.addEventListener('mouseup', () => { isDragging = false; });

      // Touch
      slider.addEventListener('touchstart', e => {
        isDragging = true;
        setPosition(e.touches[0].clientX);
      }, { passive: true });

      window.addEventListener('touchmove', e => {
        if (!isDragging) return;
        setPosition(e.touches[0].clientX);
      }, { passive: true });

      window.addEventListener('touchend', () => { isDragging = false; });
    });
  }

  initSliders();

  /* -----------------------------------------------------------------------
     Contact Form
  ----------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const successMsg  = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Basic validation
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e74c3c';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;
      // Show success message
      contactForm.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';
    });
  }

  /* -----------------------------------------------------------------------
     Subtle parallax on hero background
  ----------------------------------------------------------------------- */
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `translateY(${scrolled * 0.25}px)`;
    }, { passive: true });
  }

})();
