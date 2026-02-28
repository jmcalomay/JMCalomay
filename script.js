/* ============================================================
   JEAN MAY CALOMAY PORTFOLIO – script.js
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     LOADER
  ───────────────────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
    }, 1800);
  });

  /* ─────────────────────────────────────────────────────────
     THEME TOGGLE (dark / light) with localStorage
  ───────────────────────────────────────────────────────── */
  const html       = document.documentElement;
  const themeBtn   = document.getElementById('themeToggle');
  const themeIcon  = document.getElementById('themeIcon');
  const DARK  = 'dark';
  const LIGHT = 'light';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (theme === DARK) {
      themeIcon.className = 'fas fa-sun';
      themeBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeIcon.className = 'fas fa-moon';
      themeBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
    localStorage.setItem('portfolio-theme', theme);
  }

  // Initialise from stored preference or system preference
  const stored = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (prefersDark ? DARK : LIGHT));

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === DARK ? LIGHT : DARK);
  });

  /* ─────────────────────────────────────────────────────────
     NAVBAR – scroll behaviour & active link
  ───────────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    toggleBackToTop();
    highlightNavLink();
  }, { passive: true });

  /* ─────────────────────────────────────────────────────────
     HAMBURGER MENU (mobile)
  ───────────────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click (mobile)
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* Active nav link on scroll */
  function highlightNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* ─────────────────────────────────────────────────────────
     BACK-TO-TOP BUTTON
  ───────────────────────────────────────────────────────── */
  const btt = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (!btt) return;
    btt.classList.toggle('visible', window.scrollY > 400);
  }

  if (btt) {
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────────────────
     TYPING ANIMATION (hero)
  ───────────────────────────────────────────────────────── */
  const typingEl = document.getElementById('typingText');
  const phrases  = [
    'Power BI Developer',
    'Power Platform Expert',
    'Data Analyst',
    'Azure Solutions Architect',
    'BI Consultant',
  ];
  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let typingTimer;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }
    typingEl.textContent = current.slice(0, charIndex);

    let speed = isDeleting ? 60 : 110;

    if (!isDeleting && charIndex === current.length) {
      speed = 2200; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 350;
    }
    typingTimer = setTimeout(type, speed);
  }

  // Start typing after loader delay
  setTimeout(type, 2000);

  /* ─────────────────────────────────────────────────────────
     SCROLL REVEAL (Intersection Observer)
  ───────────────────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings for grid effect
        const delay = entry.target.closest('.portfolio-grid, .cert-grid, .stats-grid, .tools-grid')
          ? i * 80
          : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ─────────────────────────────────────────────────────────
     COUNTER / STAT ANIMATION
  ───────────────────────────────────────────────────────── */
  const counters = document.querySelectorAll('.count-up');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const dur    = 1800;
      const start  = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ─────────────────────────────────────────────────────────
     SKILL BAR ANIMATION
  ───────────────────────────────────────────────────────── */
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill  = entry.target;
      const width = fill.getAttribute('data-w');
      // Small delay for drama
      setTimeout(() => {
        fill.style.width = width + '%';
      }, 200);
      skillObserver.unobserve(fill);
    });
  }, { threshold: 0.3 });

  skillFills.forEach(f => skillObserver.observe(f));

  /* ─────────────────────────────────────────────────────────
     EXPERIENCE / EDUCATION TABS
  ───────────────────────────────────────────────────────── */
  const tabBtns  = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById('tab-' + target);
      if (pane) {
        pane.classList.add('active');
        // Re-trigger reveal animations inside newly shown tab
        pane.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), 60);
        });
      }
    });
  });

  /* ─────────────────────────────────────────────────────────
     PORTFOLIO FILTER
  ───────────────────────────────────────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.p-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      portfolioCards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          // Re-animate reveal
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ─────────────────────────────────────────────────────────
     TESTIMONIAL SLIDER
  ───────────────────────────────────────────────────────── */
  const sliderTrack = document.getElementById('sliderTrack');
  const slPrev      = document.getElementById('slPrev');
  const slNext      = document.getElementById('slNext');
  const slDotsWrap  = document.getElementById('slDots');

  if (sliderTrack) {
    const slides   = sliderTrack.querySelectorAll('.t-slide');
    let current    = 0;
    let autoTimer;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'sl-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      slDotsWrap.appendChild(dot);
    });

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      sliderTrack.style.transform = `translateX(-${current * 100}%)`;
      slDotsWrap.querySelectorAll('.sl-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    slPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    slNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 6000);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    startAuto();

    // Touch / swipe support
    let touchStartX = 0;
    sliderTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    sliderTrack.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────────────
     CONTACT FORM (graceful submit / demo)
  ───────────────────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function () {
      // Form submits natively to FormSubmit.co — no preventDefault needed
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';
      }
    });
  }

  function showFormMessage(type, text) {
    // Remove old message if any
    const old = document.querySelector('.form-message');
    if (old) old.remove();

    const msg = document.createElement('p');
    msg.className = 'form-message';
    msg.textContent = text;
    msg.style.cssText = `
      padding: .85rem 1rem;
      border-radius: 8px;
      font-size: .875rem;
      font-weight: 600;
      margin-top: .5rem;
      text-align: center;
      background: ${type === 'success' ? 'rgba(63,207,110,.12)' : 'rgba(220,50,50,.12)'};
      color: ${type === 'success' ? '#3fcf6e' : '#e05050'};
      border: 1px solid ${type === 'success' ? 'rgba(63,207,110,.3)' : 'rgba(220,50,50,.3)'};
    `;
    contactForm.appendChild(msg);
    setTimeout(() => msg.remove(), 6000);
  }

  /* ─────────────────────────────────────────────────────────
     SMOOTH SCROLL for all anchor links
  ───────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────────────────────
     PARTICLE / FLOATING SHAPES animation tweak (CSS handles most)
  ───────────────────────────────────────────────────────── */
  // Minor parallax on hero shapes
  const heroShapes = document.querySelectorAll('.shape');
  if (heroShapes.length) {
    window.addEventListener('mousemove', (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const mx = (e.clientX / w - 0.5) * 20;
      const my = (e.clientY / h - 0.5) * 20;
      heroShapes[0].style.transform = `translate(${mx}px,${my}px)`;
      if (heroShapes[1]) heroShapes[1].style.transform = `translate(${-mx * 0.6}px,${-my * 0.6}px)`;
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────────────
     STAGGER reveal inside sections when they enter viewport
  ───────────────────────────────────────────────────────── */
  // Add a brief stagger to grid child reveals
  document.querySelectorAll('.portfolio-grid, .cert-grid').forEach(grid => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  /* ─────────────────────────────────────────────────────────
     PORTFOLIO LIGHTBOX
  ───────────────────────────────────────────────────────── */
  const lbOverlay = document.getElementById('lbOverlay');
  const lbImg     = document.getElementById('lbImg');
  const lbLoader  = document.getElementById('lbLoader');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  const lbTitle   = document.getElementById('lbTitle');
  const lbCounter = document.getElementById('lbCounter');
  const lbDots    = document.getElementById('lbDots');

  if (lbOverlay) {
    let lbImages  = [];
    let lbIndex   = 0;

    function lbOpen(images, title, startIndex) {
      lbImages = images;
      lbIndex  = startIndex || 0;
      lbTitle.textContent = title || '';
      buildDots();
      lbShow(lbIndex);
      lbOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      lbPrev.style.display = lbImages.length > 1 ? 'flex' : 'none';
      lbNext.style.display = lbImages.length > 1 ? 'flex' : 'none';
      lbDots.style.display = lbImages.length > 1 ? 'flex' : 'none';
      setTimeout(() => lbOverlay.classList.add('lb-open'), 10);
    }

    function lbClose_fn() {
      lbOverlay.classList.remove('lb-open');
      setTimeout(() => {
        lbOverlay.style.display = 'none';
        document.body.style.overflow = '';
        lbImg.src = '';
      }, 280);
    }

    function lbShow(index) {
      lbIndex = (index + lbImages.length) % lbImages.length;
      lbLoader.style.display = 'flex';
      lbImg.style.opacity = '0';

      const src = lbImages[lbIndex];
      const tempImg = new Image();
      tempImg.onload = () => {
        lbImg.src = src;
        lbImg.alt = lbTitle.textContent + ' – image ' + (lbIndex + 1);
        lbLoader.style.display = 'none';
        lbImg.style.opacity = '1';
      };
      tempImg.onerror = () => {
        lbImg.src = src;
        lbLoader.style.display = 'none';
        lbImg.style.opacity = '1';
      };
      tempImg.src = src;

      lbCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
      updateDots();
    }

    function buildDots() {
      lbDots.innerHTML = '';
      lbImages.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'lb-dot';
        d.setAttribute('aria-label', 'Go to image ' + (i + 1));
        d.addEventListener('click', () => lbShow(i));
        lbDots.appendChild(d);
      });
    }

    function updateDots() {
      lbDots.querySelectorAll('.lb-dot').forEach((d, i) => {
        d.classList.toggle('active', i === lbIndex);
      });
    }

    // Click on any portfolio card
    document.querySelectorAll('.p-card').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const raw    = card.getAttribute('data-images');
        const title  = card.getAttribute('data-title') || '';
        let images   = [];
        try { images = JSON.parse(raw); } catch (e) { return; }
        if (!images.length) return;
        lbOpen(images, title, 0);
      });
    });

    // Close
    lbClose.addEventListener('click', lbClose_fn);
    lbOverlay.addEventListener('click', e => {
      if (e.target === lbOverlay) lbClose_fn();
    });

    // Prev / Next buttons
    lbPrev.addEventListener('click', e => { e.stopPropagation(); lbShow(lbIndex - 1); });
    lbNext.addEventListener('click', e => { e.stopPropagation(); lbShow(lbIndex + 1); });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
      if (lbOverlay.style.display === 'none') return;
      if (e.key === 'Escape')      lbClose_fn();
      if (e.key === 'ArrowLeft')   lbShow(lbIndex - 1);
      if (e.key === 'ArrowRight')  lbShow(lbIndex + 1);
    });

    // Touch / swipe support
    let lbTouchStartX = 0;
    lbOverlay.addEventListener('touchstart', e => {
      lbTouchStartX = e.touches[0].clientX;
    }, { passive: true });
    lbOverlay.addEventListener('touchend', e => {
      const diff = lbTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? lbShow(lbIndex + 1) : lbShow(lbIndex - 1);
      }
    }, { passive: true });
  }

})();
