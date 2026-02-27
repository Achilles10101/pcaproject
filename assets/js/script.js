document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initCarousel();
  initMenuSections();
  initFAQ();
  initScrollReveal();
  initStaggerDelay();
});

function $(sel, parent) { return (parent || document).querySelector(sel); }
function $$(sel, parent) { return Array.from((parent || document).querySelectorAll(sel)); }

/* Navigation */
function initNav() {
  var dropdown = $('.nav-dropdown');
  var toggle   = dropdown && $('.dropdown-toggle', dropdown);

  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
    });
    var menu = $('.dropdown-menu', dropdown);
    if (menu) menu.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  var hamburger = $('.hamburger');
  var mobileNav = $('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-nav a').forEach(function (link) {
    if (link.getAttribute('href') && link.getAttribute('href').includes(currentPage)) {
      link.classList.add('active');
    }
  });
}

/* Carousel */
function initCarousel() {
  var wrap  = $('.carousel-wrap');
  if (!wrap) return;

  var track   = $('.carousel-track', wrap);
  var slides  = $$('.carousel-slide', track);
  var prevBtn = $('.carousel-prev', wrap);
  var nextBtn = $('.carousel-next', wrap);
  var dotsContainer = $('.carousel-dots', wrap);
  var total   = slides.length;
  var current = 0;
  var timer;
  var dots    = [];

  if (dotsContainer) {
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + current * 100 + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function start() { timer = setInterval(next, 4500); }
  function stop()  { clearInterval(timer); }

  if (prevBtn) prevBtn.addEventListener('click', function () { stop(); prev(); start(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { stop(); next(); start(); });

  wrap.addEventListener('mouseenter', stop);
  wrap.addEventListener('mouseleave', start);

  wrap.setAttribute('tabindex', '0');
  wrap.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { stop(); prev(); start(); }
    if (e.key === 'ArrowRight') { stop(); next(); start(); }
  });

  var touchStartX = 0;
  wrap.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  wrap.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { stop(); diff > 0 ? next() : prev(); start(); }
  }, { passive: true });

  goTo(0);
  start();
}

/* Menu collapsible sections */
function initMenuSections() {
  $$('.menu-section').forEach(function (section) {
    var header = $('.menu-section-header', section);
    if (header) header.addEventListener('click', function () { section.classList.toggle('collapsed'); });
  });
}

/* FAQ accordion */
function initFAQ() {
  var items = $$('.faq-item');
  items.forEach(function (item) {
    var btn = $('.faq-question', item);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      items.forEach(function (other) { other.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* Scroll reveal */
function initScrollReveal() {
  var elements = $$('.reveal');
  if (!elements.length) return;
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    elements.forEach(function (el) { obs.observe(el); });
  } else {
    elements.forEach(function (el) { el.classList.add('visible'); });
  }
}

/* Stagger delay for grid children */
function initStaggerDelay() {
  $$('.features-grid, .values-grid').forEach(function (grid) {
    $$('.feature-card, .value-card', grid).forEach(function (card, i) {
      card.style.transitionDelay = (i * 0.06) + 's';
    });
  });
}
