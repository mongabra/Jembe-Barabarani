/* ======================================================
   script.js - shared across pages
   Features:
   - Mobile navigation toggle (hamburger)
   - Active nav highlighting based on current page
   - Smooth scrolling for same-page anchors (if any)
   - Page-specific: custom contact form validation (contact.html)
   - Small utilities (year injection)
   ====================================================== */

/* -------------------------
   Utility: set current year
---------------------------- */
(function setYear() {
  const y = new Date().getFullYear();
  // assign year to any present year spans across pages
  const yearSpans = document.querySelectorAll('#year, #yearAbout, #yearServices, #yearContact');
  yearSpans.forEach(span => span.textContent = y);
})();

/* -------------------------
   NAV: hamburger toggle (ARIA-aware)
---------------------------- */
function initNavToggle(toggleId, navId) {
  const btn = document.getElementById(toggleId);
  const nav = document.getElementById(navId);
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    // if we open nav, set focus to first link for accessibility
    if (isOpen) {
      const firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });
}

/* initialize nav toggles for pages (IDs used in HTML) */
document.addEventListener('DOMContentLoaded', () => {
  // call initNavToggle for each page's toggle/nav pair (if present)
  initNavToggle('navToggle', 'mainNav');
  initNavToggle('navToggleAbout', 'mainNavAbout');
  initNavToggle('navToggleServices', 'mainNavServices');
  initNavToggle('navToggleContact', 'mainNavContact');

  highlightActiveNav();
  initSmoothScroll();
  initContactValidation(); // safe to call; will be no-op on pages without form
});

/* -------------------------
   Highlight active nav link
   - Checks pathname and marks matching link .active
---------------------------- */
function highlightActiveNav() {
  const navLinks = document.querySelectorAll('.nav-list a');
  if (!navLinks) return;
  const current = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    // normalize both
    const linkPage = href.split('/').pop();
    if (linkPage === current) {
      link.classList.add('active');
      // for screen readers, indicate current page
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/* -------------------------
   Smooth scrolling for same-page anchor links
---------------------------- */
function initSmoothScroll() {
  // Only intercept same-page hash links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ===========================================================
   Contact form: custom validation and user feedback
   - This implements validation using JS (not just HTML attributes)
   - Criteria (example):
     * Full name: at least 2 characters
     * Phone: digits, 7-15 chars
     * Message: at least 10 characters
   - Shows inline error messages and success message.
   =========================================================== */
function initContactValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return; // no-op if contact form not present

  // cache DOM nodes
  const nameEl = document.getElementById('fullName');
  const phoneEl = document.getElementById('phone');
  const messageEl = document.getElementById('messageField');
  const errName = document.getElementById('errName');
  const errPhone = document.getElementById('errPhone');
  const errMessage = document.getElementById('errMessage');
  const formResult = document.getElementById('formResult');

  // helper validators
  function validateName(name) {
    const trimmed = (name || '').trim();
    if (trimmed.length < 2) return 'Please enter your full name (at least 2 characters).';
    return '';
  }
  function validatePhone(phone) {
    const digits = phone.replace(/\s|[-()+]/g, '');
    if (!/^\d{7,15}$/.test(digits)) return 'Enter a valid phone number (7–15 digits).';
    return '';
  }
  function validateMessage(msg) {
    if ((msg || '').trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  }

  // clear errors
  function clearErrors() {
    errName.textContent = '';
    errPhone.textContent = '';
    errMessage.textContent = '';
    formResult.textContent = '';
    formResult.style.color = '';
  }

  // show success
  function showSuccess(msg) {
    formResult.textContent = msg;
    formResult.style.color = 'green';
  }

  // on submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const nameVal = nameEl.value;
    const phoneVal = phoneEl.value;
    const messageVal = messageEl.value;

    const nameErr = validateName(nameVal);
    const phoneErr = validatePhone(phoneVal);
    const msgErr = validateMessage(messageVal);

    let hasError = false;
    if (nameErr) { errName.textContent = nameErr; hasError = true; }
    if (phoneErr) { errPhone.textContent = phoneErr; hasError = true; }
    if (msgErr) { errMessage.textContent = msgErr; hasError = true; }

    if (hasError) {
      formResult.textContent = 'Please fix the errors above and try again.';
      formResult.style.color = '#b91c1c';
      return;
    }

    // Example "submit" behaviour: show success and clear fields
    showSuccess('Thank you! Your message has been received. We will contact you shortly.');
    form.reset();
  });

  // optional: live validation on blur for better UX
  nameEl.addEventListener('blur', () => { errName.textContent = validateName(nameEl.value); });
  phoneEl.addEventListener('blur', () => { errPhone.textContent = validatePhone(phoneEl.value); });
  messageEl.addEventListener('blur', () => { errMessage.textContent = validateMessage(messageEl.value); });
}

/* ===========================================================
   OPTIONAL: Example functions you can reuse across pages
   - getRandomColor(): returns a random hex color string
   - toggleClassById(): toggles a class on an element by id
   =========================================================== */

/** Return a random color string like "#A1B2C3" */
function getRandomColor() {
  const hex = '0123456789ABCDEF';
  let c = '#';
  for (let i = 0; i < 6; i++) c += hex[Math.floor(Math.random() * 16)];
  return c;
}

/** Toggle a CSS class on element with given id */
function toggleClassById(id, className) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle(className);
}

/* You can use toggleClassById and getRandomColor from the console or other handlers.
   Example usage (to change background color on the services page dynamically):
     document.querySelector('.transport-card').style.background = getRandomColor();
*/
