/* ============================================================
   The Hot Chocolate Co. — script.js
   Vanilla JavaScript for: nav, carousel, modal, accordion,
   FAQ, scroll reveal, contact form.
   ============================================================ */

/* ----------------------------------------------------------
   1. Helpers
   ---------------------------------------------------------- */

/** Returns the first element matching the selector, or null. */
function $(selector, parent) {
  return (parent || document).querySelector(selector);
}

/** Returns all elements matching the selector as an array. */
function $$(selector, parent) {
  return Array.from((parent || document).querySelectorAll(selector));
}

/* ----------------------------------------------------------
   2. Navigation — Dropdown & Hamburger
   ---------------------------------------------------------- */
function initNav() {
  /* Dropdown */
  const dropdown = $('.nav-dropdown');
  const toggle   = dropdown && $('.dropdown-toggle', dropdown);

  if (toggle) {
    /* Open/close on click */
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    /* Close when clicking anywhere outside */
    document.addEventListener('click', function() {
      dropdown.classList.remove('open');
    });

    /* Prevent closing when clicking inside the menu */
    const menu = $('.dropdown-menu', dropdown);
    if (menu) {
      menu.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  }

  /* Hamburger mobile menu */
  const hamburger = $('.hamburger');
  const mobileNav = $('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  /* Highlight active link based on current page */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-nav a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) {
      link.classList.add('active');
    }
  });
}

/* ----------------------------------------------------------
   3. Image Carousel
   ---------------------------------------------------------- */
function initCarousel() {
  const wrap  = $('.carousel-wrap');
  if (!wrap) return;

  const track = $('.carousel-track', wrap);
  const slides = $$('.carousel-slide', track);
  const prevBtn = $('.carousel-prev', wrap);
  const nextBtn = $('.carousel-next', wrap);
  const dotsContainer = $('.carousel-dots', wrap);

  let current  = 0;
  let autoplayTimer;
  const total  = slides.length;

  /* Build dot buttons */
  const dots = [];
  if (dotsContainer) {
    slides.forEach(function(_, i) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function() { goTo(i); });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  /* Move to a specific slide */
  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + current * 100 + '%)';
    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  /* Advance one slide */
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* Autoplay */
  function startAutoplay() {
    autoplayTimer = setInterval(next, 4500);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  /* Arrow controls */
  if (prevBtn) prevBtn.addEventListener('click', function() { stopAutoplay(); prev(); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function() { stopAutoplay(); next(); startAutoplay(); });

  /* Pause on hover */
  wrap.addEventListener('mouseenter', stopAutoplay);
  wrap.addEventListener('mouseleave', startAutoplay);

  /* Keyboard support */
  wrap.setAttribute('tabindex', '0');
  wrap.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft')  { stopAutoplay(); prev(); startAutoplay(); }
    if (e.key === 'ArrowRight') { stopAutoplay(); next(); startAutoplay(); }
  });

  /* Touch / swipe support */
  let touchStartX = 0;
  wrap.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  wrap.addEventListener('touchend', function(e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      stopAutoplay();
      diff > 0 ? next() : prev();
      startAutoplay();
    }
  }, { passive: true });

  /* Start */
  goTo(0);
  startAutoplay();
}

/* ----------------------------------------------------------
   4. Modal / Popup ("Today's Special")
   ---------------------------------------------------------- */
function initModal() {
  const overlay  = $('#specialModal');
  const openBtns = $$('[data-modal-open]');
  const closeBtn = $('#modalClose');

  if (!overlay) return;

  /* Open */
  function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /* Close */
  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(function(btn) {
    btn.addEventListener('click', openModal);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  /* Close on overlay click */
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeModal();
  });

  /* Close on Escape key */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  /* Auto-open on homepage after 3 seconds */
  if (document.body.dataset.page === 'home') {
    setTimeout(openModal, 3000);
  }
}

/* ----------------------------------------------------------
   5. Menu Collapsible Sections
   ---------------------------------------------------------- */
function initMenuSections() {
  const sections = $$('.menu-section');

  sections.forEach(function(section) {
    const header = $('.menu-section-header', section);
    if (!header) return;

    header.addEventListener('click', function() {
      section.classList.toggle('collapsed');
    });
  });
}

/* ----------------------------------------------------------
   6. FAQ Accordion
   ---------------------------------------------------------- */
function initFAQ() {
  const items = $$('.faq-item');

  items.forEach(function(item) {
    const btn = $('.faq-question', item);
    if (!btn) return;

    btn.addEventListener('click', function() {
      const isOpen = item.classList.contains('open');

      /* Close all others */
      items.forEach(function(other) {
        other.classList.remove('open');
      });

      /* Toggle current */
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ----------------------------------------------------------
   7. Contact Form (frontend-only simulation)
   ---------------------------------------------------------- */
function initContactForm() {
  const form    = $('#contactForm');
  const success = $('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault(); /* Form is not functional — no backend */

    /* Simulate brief loading */
    const btn = $('[type="submit"]', form);
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(function() {
      form.reset();
      btn.textContent = original;
      btn.disabled = false;
      if (success) success.classList.add('show');

      /* Hide success after 5 seconds */
      setTimeout(function() {
        success.classList.remove('show');
      }, 5000);
    }, 1200);
  });
}

/* ----------------------------------------------------------
   8. Scroll Reveal Animation
   ---------------------------------------------------------- */
function initScrollReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  /* Use IntersectionObserver if available */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(function(el) { observer.observe(el); });
  } else {
    /* Fallback: show all */
    elements.forEach(function(el) { el.classList.add('visible'); });
  }
}

/* ----------------------------------------------------------
   9. Stagger reveal delay for grid children
   ---------------------------------------------------------- */
function initStaggerDelay() {
  $$('.features-grid, .values-grid, .menu-items-grid').forEach(function(grid) {
    $$('.feature-card, .value-card, .menu-item-card', grid).forEach(function(card, i) {
      card.style.transitionDelay = (i * 0.06) + 's';
    });
  });
}

/* ----------------------------------------------------------
   10. Init — run everything on DOMContentLoaded
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {
  initNav();
  initCarousel();
  initModal();
  initMenuSections();
  initFAQ();
  initContactForm();
  initScrollReveal();
  initStaggerDelay();
});
