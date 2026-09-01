(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initGreeting();
    initTypewriter();
    initScrollProgress();
    initReveal();
    initCounters();
    initHeatmap();
    initRoleFilters();
    initCommandPalette();
    initCursorRing();
    initSpotlight();
    initBackgroundCanvas();
  });

  /* ---------------- Theme toggle ---------------- */
  function initThemeToggle() {
    var root = document.documentElement;
    var btn = document.getElementById('themeToggle');
    var moon = document.getElementById('themeIconMoon');
    var sun = document.getElementById('themeIconSun');
    if (!btn) return;

    function currentIsDark() {
      var explicit = root.getAttribute('data-theme');
      if (explicit === 'light') return false;
      if (explicit === 'dark') return true;
      return !window.matchMedia('(prefers-color-scheme: light)').matches;
    }

    function sync() {
      var dark = currentIsDark();
      moon.hidden = !dark;
      sun.hidden = dark;
    }

    btn.addEventListener('click', function () {
      var goingDark = !currentIsDark();
      root.setAttribute('data-theme', goingDark ? 'dark' : 'light');
      sync();
    });

    sync();
  }

  /* ---------------- Time-of-day greeting ---------------- */
  function initGreeting() {
    var el = document.getElementById('greeting');
    if (!el) return;
    var hour = new Date().getHours();
    var word = 'Hello';
    if (hour < 5) word = 'Still up';
    else if (hour < 12) word = 'Good morning';
    else if (hour < 17) word = 'Good afternoon';
    else if (hour < 22) word = 'Good evening';
    else word = 'Late night';
    el.textContent = word + ' · Melbourne, VIC';
  }

  /* ---------------- Typewriter role rotator ---------------- */
  function initTypewriter() {
    var el = document.getElementById('typewriter');
    if (!el) return;
    var roles = ['Data Engineer', 'Data Analyst', 'Machine Learning Engineer', 'Data Scientist'];

    if (reduceMotion) {
      el.textContent = roles.join(' · ');
      var caret = document.querySelector('.caret');
      if (caret) caret.style.display = 'none';
      return;
    }

    var roleIndex = 0, charIndex = 0, deleting = false;
    var typeSpeed = 55, deleteSpeed = 30, holdTime = 1400, betweenTime = 350;

    function tick() {
      var word = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          setTimeout(tick, holdTime);
          return;
        }
        setTimeout(tick, typeSpeed);
      } else {
        charIndex--;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, betweenTime);
          return;
        }
        setTimeout(tick, deleteSpeed);
      }
    }
    tick();
  }

  /* ---------------- Scroll progress bar ---------------- */
  function initScrollProgress() {
    var bar = document.getElementById('scrollProgressBar');
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var scrollTop = h.scrollTop || document.body.scrollTop;
      var height = h.scrollHeight - h.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    var targets = document.querySelectorAll('.bento-card, .entry, .case, .about, .skill-groups > div, .edu-item');
    targets.forEach(function (t) { t.classList.add('reveal'); });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------------- Animated stat counters ---------------- */
  function initCounters() {
    var counters = document.querySelectorAll('.v[data-target]');
    if (!counters.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-target'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      if (reduceMotion) {
        el.textContent = format(target, decimals);
        return;
      }
      var duration = 1100;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = target * eased;
        el.textContent = format(value, decimals);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = format(target, decimals);
      }
      requestAnimationFrame(step);
    }

    function format(value, decimals) {
      if (decimals > 0) return value.toFixed(decimals);
      return Math.round(value).toLocaleString('en-AU');
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---------------- Placeholder activity heatmap ---------------- */
  /* Swap this for a real GitHub calendar once your repo is public:
     e.g. embed https://ghchart.rshah.org/E8A33D/<your-github-username>
     or pull the GitHub GraphQL contributions calendar server-side. */
  function initHeatmap() {
    var grid = document.getElementById('heatmap');
    if (!grid) return;
    var weeks = 24, days = 7;
    var seed = 42;
    function rand() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }
    for (var w = 0; w < weeks; w++) {
      for (var d = 0; d < days; d++) {
        var r = rand();
        var level = r > 0.82 ? 4 : r > 0.62 ? 3 : r > 0.42 ? 2 : r > 0.24 ? 1 : 0;
        var cell = document.createElement('div');
        cell.className = 'cell l' + level;
        cell.style.background = level === 0 ? 'var(--chip-bg)' :
          level === 1 ? 'color-mix(in srgb, var(--accent) 25%, var(--chip-bg))' :
          level === 2 ? 'color-mix(in srgb, var(--accent) 50%, var(--chip-bg))' :
          level === 3 ? 'color-mix(in srgb, var(--accent) 75%, var(--chip-bg))' : 'var(--accent)';
        cell.title = 'Week ' + (w + 1) + ' · activity level ' + level;
        grid.appendChild(cell);
      }
    }
  }

  /* ---------------- Case study role filters ---------------- */
  function initRoleFilters() {
    var buttons = document.querySelectorAll('.role-filters button');
    var cases = document.querySelectorAll('.case');
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var role = btn.getAttribute('data-role');
        cases.forEach(function (c) {
          c.classList.remove('match', 'dim');
          if (role === 'all') return;
          var roles = (c.getAttribute('data-roles') || '').split(' ');
          if (roles.indexOf(role) !== -1) c.classList.add('match');
          else c.classList.add('dim');
        });
        if (role !== 'all') {
          var first = document.querySelector('.case.match');
          if (first) first.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
      });
    });
  }

  /* ---------------- Command palette (Cmd/Ctrl+K) ---------------- */
  function initCommandPalette() {
    var overlay = document.getElementById('cmdkOverlay');
    var input = document.getElementById('cmdkInput');
    var list = document.getElementById('cmdkList');
    var openBtn = document.getElementById('paletteBtn');
    var wordmarkBtn = document.getElementById('paletteOpenWordmark');
    if (!overlay || !input || !list) return;

    var commands = [
      { name: 'Home', hint: 'Section', action: function () { jump('#top'); } },
      { name: 'Experience', hint: 'Section', action: function () { jump('#work'); } },
      { name: 'Case studies', hint: 'Section', action: function () { jump('#projects'); } },
      { name: 'Skills', hint: 'Section', action: function () { jump('#skills'); } },
      { name: 'Education', hint: 'Section', action: function () { jump('#education'); } },
      { name: 'Contact', hint: 'Section', action: function () { jump('#contact'); } },
      { name: 'Email Ganesh', hint: 'mailto', action: function () { window.location.href = 'mailto:gkreddyavula@gmail.com'; } },
      { name: 'Open LinkedIn', hint: 'External link', action: function () { window.open('https://www.linkedin.com/in/ganeshkumarreddyavula', '_blank', 'noopener'); } },
      { name: 'Toggle theme', hint: 'Light / dark', action: function () { document.getElementById('themeToggle').click(); } }
    ];

    var filtered = commands.slice();
    var activeIndex = 0;

    function jump(hash) {
      close();
      var el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }

    function render() {
      list.innerHTML = '';
      if (!filtered.length) {
        var empty = document.createElement('li');
        empty.className = 'cmdk-empty';
        empty.textContent = 'No matches';
        list.appendChild(empty);
        return;
      }
      filtered.forEach(function (cmd, i) {
        var li = document.createElement('li');
        li.className = i === activeIndex ? 'active' : '';
        var nameSpan = document.createElement('span');
        nameSpan.className = 'name';
        nameSpan.textContent = cmd.name;
        var hintSpan = document.createElement('span');
        hintSpan.className = 'hint';
        hintSpan.textContent = cmd.hint;
        li.appendChild(nameSpan);
        li.appendChild(hintSpan);
        li.addEventListener('mouseenter', function () { activeIndex = i; render(); });
        li.addEventListener('click', function () { cmd.action(); });
        list.appendChild(li);
      });
    }

    function open() {
      overlay.hidden = false;
      input.value = '';
      filtered = commands.slice();
      activeIndex = 0;
      render();
      setTimeout(function () { input.focus(); }, 0);
    }
    function close() {
      overlay.hidden = true;
    }

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      filtered = commands.filter(function (c) { return c.name.toLowerCase().indexOf(q) !== -1; });
      activeIndex = 0;
      render();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIndex]) filtered[activeIndex].action(); }
      else if (e.key === 'Escape') { close(); }
    });

    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    if (openBtn) openBtn.addEventListener('click', open);
    if (wordmarkBtn) wordmarkBtn.addEventListener('click', open);

    document.addEventListener('keydown', function (e) {
      var isK = e.key === 'k' || e.key === 'K';
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        overlay.hidden ? open() : close();
      }
    });
  }

  /* ---------------- Custom cursor ring ---------------- */
  function initCursorRing() {
    var ring = document.getElementById('cursorRing');
    var label = document.getElementById('cursorLabel');
    if (!ring) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var x = 0, y = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      ring.classList.add('live');
      var el = document.elementFromPoint(x, y);
      var labelled = el && el.closest && el.closest('[data-cursor]');
      var interactive = labelled || (el && el.closest && el.closest('a, button'));
      ring.classList.toggle('hovering', !!interactive);
      if (label) label.textContent = labelled ? labelled.getAttribute('data-cursor') : '';
    });
    window.addEventListener('mouseleave', function () { ring.classList.remove('live'); });

    function loop() {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---------------- Card spotlight (cursor-tracked glow) ---------------- */
  function initSpotlight() {
    var cards = document.querySelectorAll('[data-spot]');
    if (!cards.length || !window.matchMedia('(pointer: fine)').matches) return;
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var mx = ((e.clientX - rect.left) / rect.width) * 100;
        var my = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', mx + '%');
        card.style.setProperty('--my', my + '%');
      });
    });
  }

  /* ---------------- Background canvas: transaction network pulse ---------------- */
  /* Twinkling starfield with the occasional shooting star, in the spirit of
     the reference sites' dark night-sky hero backgrounds. A small fraction
     of stars twinkle in the accent color instead of white, as a nod to
     Ganesh's payments/transaction theme (little "pings" in the sky). */
  function initBackgroundCanvas() {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var stars = [];
    var shootingStars = [];
    var w, h, dpr, t = 0;

    function styleVar(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.round((w * h) / 6500);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.3 + 0.4,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.8,
          drift: (Math.random() - 0.5) * 0.05,
          accent: Math.random() < 0.08
        });
      }
    }

    function maybeSpawnShootingStar() {
      if (Math.random() > 0.006 || shootingStars.length > 2) return;
      var startX = Math.random() * w * 0.6;
      var startY = Math.random() * h * 0.4;
      var angle = (Math.random() * 20 + 25) * (Math.PI / 180);
      shootingStars.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * 9,
        vy: Math.sin(angle) * 9,
        life: 0, maxLife: 40
      });
    }

    function frame(ts) {
      ctx.clearRect(0, 0, w, h);
      var starRgb = styleVar('--star-color') || '255,255,255';
      var accentRgb = styleVar('--star-accent') || '232,163,61';
      t = ts || 0;

      stars.forEach(function (s) {
        var twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.001 * s.speed + s.phase));
        s.y += s.drift;
        if (s.y < 0) s.y = h; else if (s.y > h) s.y = 0;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + (s.accent ? accentRgb : starRgb) + ',' + twinkle.toFixed(2) + ')';
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      maybeSpawnShootingStar();
      shootingStars = shootingStars.filter(function (s) { return s.life < s.maxLife; });
      shootingStars.forEach(function (s) {
        s.life++;
        s.x += s.vx; s.y += s.vy;
        var alpha = 1 - s.life / s.maxLife;
        var tailX = s.x - s.vx * 3.2, tailY = s.y - s.vy * 3.2;
        var grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, 'rgba(' + starRgb + ',' + alpha + ')');
        grad.addColorStop(1, 'rgba(' + starRgb + ',0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      });

      if (!reduceMotion) requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    frame(0); // always draw at least one frame; loops on its own unless reduced motion is set
  }

})();
