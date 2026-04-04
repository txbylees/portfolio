/* ============================================
   QA PORTFOLIO — script.js
   Animations, interactions, scroll effects
   ============================================ */

'use strict';

// ── Custom Cursor ──────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorFollower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorFollower.style.opacity = '0.6';
});

// ── Navbar Scroll Effect ───────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Scroll Reveal ──────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('[data-reveal]')];
      const index = siblings.indexOf(entry.target);
      const delay = index * 80;

      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});

// ── Animated Counter ──────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const startVal = 0;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    el.textContent = Math.floor(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
  counterObserver.observe(el);
});

// ── Hero Title Stagger Animation ──────────────
function initHeroAnimation() {
  const lines = document.querySelectorAll('.hero-title .line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(60px)';
    line.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.2 + i * 0.15}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.2 + i * 0.15}s`;

    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 100);
  });

  // Hero badge reveal
  const badge = document.querySelector('.hero-badge');
  if (badge) {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(-20px)';
    badge.style.transition = 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s';
    setTimeout(() => {
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(0)';
    }, 100);
  }
}

// ── Terminal Typewriter Effect ─────────────────
function initTerminal() {
  const lines = document.querySelectorAll('.terminal-body .t-line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-8px)';
    line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, 800 + i * 180);
  });
}

// ── Process Steps Animation ────────────────────
function initProcessSteps() {
  const steps = document.querySelectorAll('.process-step');
  let current = 0;

  setInterval(() => {
    steps.forEach(s => s.classList.remove('active'));
    current = (current + 1) % steps.length;
    steps[current].classList.add('active');
  }, 2000);
}

// ── Mobile Nav Toggle ──────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  let navOpen = false;

  navToggle.addEventListener('click', () => {
    navOpen = !navOpen;

    if (navOpen) {
      navLinks.style.cssText = `
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 70px; left: 0; right: 0;
        background: rgba(255,255,255,0.97);
        backdrop-filter: blur(20px);
        padding: 2rem;
        gap: 1.5rem;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        z-index: 999;
        animation: slideDown 0.3s ease;
      `;

      const style = document.createElement('style');
      style.id = 'navAnimation';
      style.textContent = `
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      if (!document.getElementById('navAnimation')) document.head.appendChild(style);
    } else {
      navLinks.style.display = 'none';
    }

    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    if (navOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navOpen = false;
      navLinks.style.display = 'none';
      navToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '';
      });
    });
  });
}

// ── Smooth Scroll ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Skill Card Hover Glow ──────────────────────
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(124, 58, 237, 0.04) 0%, white 60%)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ── Project Card Tilt ──────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Active Nav Link on Scroll ──────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(item => {
        item.style.color = '';
        if (item.getAttribute('href') === '#' + entry.target.id) {
          item.style.color = 'var(--purple)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Parallax on Hero Orbs ──────────────────────
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');

  if (orb1) orb1.style.transform = `translateY(${scrollY * 0.3}px)`;
  if (orb2) orb2.style.transform = `translateY(${scrollY * -0.15}px)`;
  if (orb3) orb3.style.transform = `translateY(${scrollY * 0.2}px)`;
}, { passive: true });

// ── Testimonial Hover Reveal ───────────────────
document.querySelectorAll('.testimonial-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// ── Init ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimation();
  initTerminal();
  initProcessSteps();

  // Trigger hero reveal items
  setTimeout(() => {
    document.querySelectorAll('.hero [data-reveal]').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), 600 + i * 150);
    });
  }, 400);
});
