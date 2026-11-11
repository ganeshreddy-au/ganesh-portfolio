(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  initTheme();
  initMarquee();
  initNav();
  initScrollEffects();
  initReveal();
  initCounters();
  initRoleRotator();
  initImbalanceGrid();
  initBars();
  initCardHover();
  initMagnetic();
  initCursor();
  initCopyEmail();
  initBackground();

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Theme (dark by default, remembers choice) ---------- */
  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- Nav: blur on scroll, hide on scroll down, mobile menu, active link ---------- */
  function initNav() {
    var nav = document.getElementById('nav');
    var menuBtn = document.getElementById('menu-btn');
    var links = document.querySelectorAll('.nav-links a');

    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        var open = body.classList.toggle('menu-open');
        menuBtn.setAttribute('aria-expanded', open);
      });
      links.forEach(function (a) {
        a.addEventListener('click', function () {
          body.classList.remove('menu-open');
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      nav.classList.toggle('scrolled', y > 20);
      if (!body.classList.contains('menu-open')) {
        nav.classList.toggle('hidden', y > lastY && y > 400);
      }
      lastY = y;
    }, { passive: true });

    if (!('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); });
        if (map[e.target.id]) map[e.target.id].classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ---------- Scroll progress + timeline fill ---------- */
  function initScrollEffects() {
    var bar = document.getElementById('scroll-bar');
    var timeline = document.getElementById('timeline');
    var fill = document.getElementById('timeline-fill');
    var ticking = false;

    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';

      if (timeline && fill) {
        var r = timeline.getBoundingClientRect();
        var start = window.innerHeight * 0.7;
        var p = (start - r.top) / r.height;
        fill.style.transform = 'scaleY(' + Math.max(0, Math.min(1, p)) + ')';
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Helper: run once when element scrolls into view ---------- */
  function onVisible(els, fn, threshold) {
    if (!('IntersectionObserver' in window)) { els.forEach(fn); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); }
      });
    }, { threshold: threshold || 0.15, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

    // stagger the experience bullets so they slide in one after another
    document.querySelectorAll('.tl-body li').forEach(function (li) {
      var idx = Array.prototype.indexOf.call(li.parentNode.children, li);
      li.style.transitionDelay = (0.45 + idx * 0.08) + 's';
    });

    if (reduceMotion) { els.forEach(function (el) { el.classList.add('in', 'shown'); }); return; }
    onVisible(els, function (el) {
      // 'shown' stays forever (drives side lines, dots, staggered lines);
      // 'reveal'/'in' are removed afterwards so hover/tilt transitions feel instant
      el.classList.add('in', 'shown');
      var delay = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
      setTimeout(function () { el.classList.remove('reveal', 'in'); }, 1200 + delay * 120);
    }, 0.12);
  }

  /* ---------- Count-up numbers ---------- */
  function initCounters() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.count'));
    onVisible(els, function (el) {
      var target = parseFloat(el.getAttribute('data-target'));
      if (reduceMotion) { el.textContent = target.toLocaleString('en-AU'); return; }
      var dur = 1800, start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * eased).toLocaleString('en-AU');
        if (p < 1) requestAnimationFrame(step);
      }
      setTimeout(function () { requestAnimationFrame(step); }, 900);
    }, 0.5);
  }

  /* ---------- Rotating role word ---------- */
  function initRoleRotator() {
    var wrap = document.getElementById('role-rotator');
    if (!wrap || reduceMotion) return;
    var words = wrap.querySelectorAll('span');
    var i = 0;

    // size the box to the widest word so the line doesn't jump
    // (re-measured once web fonts load, and on resize)
    function size() {
      var w = 0;
      words.forEach(function (s) { w = Math.max(w, s.scrollWidth); });
      wrap.style.width = Math.min(w, wrap.parentNode.clientWidth) + 'px';
    }
    size();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(size);
    window.addEventListener('resize', size);

    setInterval(function () {
      var cur = words[i];
      i = (i + 1) % words.length;
      var next = words[i];
      cur.classList.remove('is-active');
      cur.classList.add('is-leaving');
      next.classList.remove('is-leaving');
      next.classList.add('is-active');
      setTimeout(function () { cur.classList.remove('is-leaving'); }, 700);
    }, 2400);
  }

  /* ---------- Class imbalance waffle chart ---------- */
  function initImbalanceGrid() {
    var grid = document.getElementById('imbalance-grid');
    if (!grid) return;
    var cols = window.innerWidth <= 720 ? 20 : 30;
    var total = cols * 20;
    var fraudIndex = Math.floor(total * 0.62) + 7;
    var frag = document.createDocumentFragment();

    for (var n = 0; n < total; n++) {
      var cell = document.createElement('i');
      var row = Math.floor(n / cols), col = n % cols;
      cell.style.transitionDelay = ((row + col) * 18) + 'ms';
      if (n === fraudIndex) cell.className = 'fraud';
      frag.appendChild(cell);
    }
    grid.appendChild(frag);
    onVisible([grid], function (el) { el.classList.add('in'); }, 0.3);
  }

  /* ---------- Metric bars ---------- */
  function initBars() {
    var bars = Array.prototype.slice.call(document.querySelectorAll('.track i[data-w]'));
    onVisible(bars, function (el) { el.style.width = el.getAttribute('data-w') + '%'; }, 0.5);
  }

  /* ---------- Card spotlight + 3D tilt ---------- */
  function initCardHover() {
    if (!finePointer) return;
    document.querySelectorAll('.card, .portrait').forEach(function (card) {
      // big project cards only get the glow, not tilt (tilt looks odd on wide cards)
      var tilt = card.classList.contains('tilt') && !reduceMotion;
      var max = card.classList.contains('portrait') ? 8 : 4;

      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (x * 100) + '%');
        card.style.setProperty('--my', (y * 100) + '%');
        if (tilt) {
          card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * max) + 'deg) rotateY(' + ((x - 0.5) * max) + 'deg) translateY(-4px)';
        }
      });
      card.addEventListener('mouseleave', function () {
        if (tilt) card.style.transform = '';
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.35 + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 600);
      });
    });
  }

  /* ---------- Tools marquee: clone the list once so the loop is seamless ---------- */
  function initMarquee() {
    var track = document.getElementById('marquee-track');
    if (!track) return;
    Array.prototype.slice.call(track.children).forEach(function (li) {
      var clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  /* ---------- Custom cursor: inverting blob that stretches with speed ---------- */
  function initCursor() {
    if (!finePointer || reduceMotion) return;
    var cursor = document.querySelector('.cursor');
    if (!cursor) return;
    var blob = cursor.querySelector('.cursor-blob');
    var label = cursor.querySelector('.cursor-label');

    function labelFor(el) {
      if (el.hasAttribute('data-cursor')) return el.getAttribute('data-cursor');
      if (el.tagName === 'SUMMARY') return el.parentNode.open ? 'Close' : 'Expand';
      var href = el.getAttribute('href') || '';
      if (href.indexOf('mailto:') === 0) return 'Email';
      if (href.indexOf('tel:') === 0) return 'Call';
      if (href.indexOf('resume') !== -1) return 'CV';
      if (el.getAttribute('target') === '_blank') return 'Open';
      return '';
    }

    var mx = -100, my = -100, x = -100, y = -100, down = false;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      body.classList.add('has-cursor');
      var t = e.target.closest && e.target.closest('[data-cursor], a, button, summary, .chips span, .stack span, .mq-icon');
      var text = t ? labelFor(t) : '';
      body.classList.toggle('cursor-hover', !!t);
      body.classList.toggle('cursor-labelled', !!text);
      if (text && label.textContent !== text) label.textContent = text;
    });
    document.addEventListener('mouseleave', function () { body.classList.remove('has-cursor'); });
    window.addEventListener('mousedown', function () { down = true; });
    window.addEventListener('mouseup', function () { down = false; });

    (function loop() {
      var dx = mx - x, dy = my - y;
      x += dx * 0.2;
      y += dy * 0.2;
      // stretch along the direction of travel, squash across it
      var speed = Math.min(Math.sqrt(dx * dx + dy * dy) / 120, 0.5);
      var angle = Math.atan2(dy, dx) * 180 / Math.PI;
      var hovering = body.classList.contains('cursor-hover');
      var s = down ? 0.75 : 1;
      cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      blob.style.transform = hovering
        ? 'scale(' + s + ')'
        : 'rotate(' + angle + 'deg) scale(' + (s * (1 + speed)) + ',' + (s * (1 - speed * 0.5)) + ')';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Copy email ---------- */
  function initCopyEmail() {
    var btn = document.getElementById('copy-email');
    var toast = document.getElementById('toast');
    if (!btn) return;
    var timer;

    function show(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
    }

    btn.addEventListener('click', function () {
      var email = btn.getAttribute('data-email');
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () { show('Email copied ✓'); }, function () { show(email); });
      } else {
        show(email);
      }
    });
  }

  /* ---------- Background: drifting data points that connect when close ---------- */
  function initBackground() {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var pts = [], w, h, dpr;
    var mouse = { x: -9999, y: -9999 };
    var LINK = 130;

    function rgb() {
      return getComputedStyle(root).getPropertyValue('--particle').trim() || '242,193,78';
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(90, Math.round((w * h) / 16000));
      pts = [];
      for (var i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }

    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var c = rgb();

      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (!reduceMotion) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;

          var dx = mouse.x - p.x, dy = mouse.y - p.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) { p.x -= dx * 0.008; p.y -= dy * 0.008; }
        }

        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + c + ',.55)';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j];
          var ddx = p.x - q.x, ddy = p.y - q.y;
          var dist = ddx * ddx + ddy * ddy;
          if (dist < LINK * LINK) {
            ctx.strokeStyle = 'rgba(' + c + ',' + (0.14 * (1 - Math.sqrt(dist) / LINK)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', function () { resize(); if (reduceMotion) draw(); });
    draw();
  }
})();
