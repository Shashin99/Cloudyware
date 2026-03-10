/* ============================================================
   CLOUDYWARE - Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // 1. DOM References
  // ============================================================
  const html        = document.documentElement;
  const navbar      = document.getElementById('navbar');
  const navLinks    = document.getElementById('nav-links');
  const hamburger   = document.getElementById('hamburger');
  const themeToggle = document.getElementById('theme-toggle');
  const footerYear  = document.getElementById('footer-year');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const sections    = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const revealEls   = document.querySelectorAll('.reveal');

  // ============================================================
  // 2. Set Footer Year
  // ============================================================
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // ============================================================
  // 3. Theme Management (Light / Dark)
  // ============================================================
  const THEME_KEY = 'cloudyware-theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function getInitialTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    // Respect OS preference if no stored value
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Apply on load
  applyTheme(getInitialTheme());

  themeToggle.addEventListener('click', function () {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Listen to OS preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ============================================================
  // 4. Navbar — Scroll Shadow
  // ============================================================
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
    revealOnScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ============================================================
  // 5. Active NavLink on Scroll
  // ============================================================
  function updateActiveNavLink() {
    const scrollY = window.scrollY;
    const viewportH = window.innerHeight;

    let currentSection = '';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - (viewportH * 0.35);
      if (scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  // ============================================================
  // 6. Smooth Scroll for nav links
  // ============================================================
  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href.length > 1 && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.slice(1);
        smoothScrollTo(targetId);

        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  // ============================================================
  // 7. Hamburger Menu (Mobile)
  // ============================================================
  function closeMobileMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function openMobileMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // ============================================================
  // 8. Scroll Reveal Animation
  // ============================================================
  function revealOnScroll() {
    const viewportH = window.innerHeight;
    revealEls.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportH - 60) {
        el.classList.add('active');
      }
    });
  }

  // Initial check (elements already in view on page load)
  revealOnScroll();

  // ============================================================
  // 9. Contact Form Validation
  // ============================================================
  function getFieldValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function showError(inputId, errorId, show) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (!input || !error) return;
    if (show) {
      input.classList.add('error');
      error.classList.add('show');
    } else {
      input.classList.remove('error');
      error.classList.remove('show');
    }
  }

  function isValidEmail(email) {
    // RFC-5322 simplified regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm() {
    let valid = true;

    const name    = getFieldValue('form-name');
    const email   = getFieldValue('form-email');
    const subject = getFieldValue('form-subject');
    const message = getFieldValue('form-message');

    // Name
    if (!name) {
      showError('form-name', 'name-error', true);
      valid = false;
    } else {
      showError('form-name', 'name-error', false);
    }

    // Email
    if (!email || !isValidEmail(email)) {
      showError('form-email', 'email-error', true);
      valid = false;
    } else {
      showError('form-email', 'email-error', false);
    }

    // Subject
    if (!subject) {
      showError('form-subject', 'subject-error', true);
      valid = false;
    } else {
      showError('form-subject', 'subject-error', false);
    }

    // Message
    if (!message || message.length < 10) {
      const errEl = document.getElementById('message-error');
      if (errEl) errEl.textContent = message.length > 0 ? 'Message must be at least 10 characters.' : 'Please enter a message.';
      showError('form-message', 'message-error', true);
      valid = false;
    } else {
      showError('form-message', 'message-error', false);
    }

    return valid;
  }

  // Clear single field error on input
  ['form-name', 'form-email', 'form-subject', 'form-message'].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () {
      el.classList.remove('error');
      // Hide associated error
      const errMap = {
        'form-name': 'name-error',
        'form-email': 'email-error',
        'form-subject': 'subject-error',
        'form-message': 'message-error',
      };
      const errEl = document.getElementById(errMap[id]);
      if (errEl) errEl.classList.remove('show');
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      // Show loading state
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width:18px;height:18px;stroke:white;fill:none;stroke-width:2;" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          Sending...`;
      }

      // Simulate async send (replace with real API call as needed)
      setTimeout(function () {
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('show');
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `Send Message <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
        }
      }, 1400);
    });
  }

  // Add CSS keyframe for spinner via JS (no hacks needed)
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
  document.head.appendChild(style);

  // ============================================================
  // 10. Intersection Observer — Enhanced reveal (fallback)
  // ============================================================
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) {
      if (!el.classList.contains('active')) {
        observer.observe(el);
      }
    });
  }

})();
