/* ============================================================
   InAmigos Foundation — script.js
   Features: Navbar scroll, mobile menu, animated counters,
             scroll reveal, back-to-top, form toast
   ============================================================ */

/* ── NAVBAR SCROLL EFFECT ─────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ── MOBILE HAMBURGER MENU ────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Prevent page scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when any nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ── SMOOTH SCROLL (fallback for older browsers) ──────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── SCROLL REVEAL ────────────────────────────────────────── */
// Add .reveal class to elements we want to animate in
const revealSelectors = [
  '.initiative-card',
  '.stat-card',
  '.gallery-item',
  '.testimonial-card',
  '.about-content',
  '.about-visual',
  '.volunteer-content',
  '.volunteer-form-wrap',
  '.mvv-card',
  '.value-chip',
];

revealSelectors.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger children within a grid
    el.style.transitionDelay = `${i * 0.07}s`;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── ANIMATED COUNTERS ────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800; // ms
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(ease * target);
    el.textContent = current.toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ── BACK TO TOP ──────────────────────────────────────────── */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── VOLUNTEER FORM TOAST ─────────────────────────────────── */
// Create toast element
const toast = document.createElement('div');
toast.className = 'toast';
toast.setAttribute('role', 'status');
toast.setAttribute('aria-live', 'polite');
document.body.appendChild(toast);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function handleVolunteerSubmit() {
  const name      = document.getElementById('vol-name').value.trim();
  const email     = document.getElementById('vol-email').value.trim();
  const interest  = document.getElementById('vol-initiative').value;
  const message   = document.getElementById('vol-message').value.trim();

  // Basic validation
  if (!name) {
    showToast('Please enter your full name.');
    document.getElementById('vol-name').focus();
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.');
    document.getElementById('vol-email').focus();
    return;
  }
  if (!interest) {
    showToast('Please select an area of interest.');
    document.getElementById('vol-initiative').focus();
    return;
  }

  // Simulate submission
  showToast(`🎉 Thank you, ${name}! We'll be in touch within 48 hours.`);

  // Reset form
  ['vol-name', 'vol-email', 'vol-message'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('vol-initiative').value = '';
}

/* ── ACTIVE NAV LINK ON SCROLL ────────────────────────────── */
const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-links a').forEach(a => a.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');
      }
    }
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
