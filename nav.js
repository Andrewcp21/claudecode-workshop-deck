(() => {
  const SLIDES = [
    'dvd-bounce.html',
    'comparison.html',
    'chatgpt.html',
    'claudecode.html',
    'slide1.html',
    'slide2.html',
    'slide3.html',
    'slide4.html',
    'slide5.html',
    'slide6.html',
  ];

  const current = location.pathname.split('/').pop() || 'index.html';
  const idx = SLIDES.indexOf(current);
  if (idx === -1) return; // not a slide page

  const prev = idx > 0 ? SLIDES[idx - 1] : null;
  const next = idx < SLIDES.length - 1 ? SLIDES[idx + 1] : null;

  // ── Inject styles ──────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #slide-nav {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-radius: 999px;
      padding: 8px 16px;
      z-index: 99999;
      font-family: 'IBM Plex Mono', 'Red Hat Display', monospace, sans-serif;
      user-select: none;
      transition: opacity 0.3s;
    }
    #slide-nav.hidden { opacity: 0; pointer-events: none; }
    #slide-nav button {
      background: none;
      border: none;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      padding: 4px 10px;
      border-radius: 6px;
      transition: background 0.15s;
      line-height: 1;
    }
    #slide-nav button:hover { background: rgba(255,255,255,0.15); }
    #slide-nav button:disabled { opacity: 0.25; cursor: default; }
    #slide-nav button:disabled:hover { background: none; }
    #slide-nav .nav-counter {
      font-size: 11px;
      letter-spacing: 0.12em;
      color: rgba(255,255,255,0.7);
      min-width: 48px;
      text-align: center;
    }
    #slide-nav .nav-home {
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      text-decoration: none;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background 0.15s, color 0.15s;
    }
    #slide-nav .nav-home:hover {
      background: rgba(255,255,255,0.15);
      color: #fff;
    }
  `;
  document.head.appendChild(style);

  // ── Inject HTML ────────────────────────────────────────────────────────────
  const nav = document.createElement('div');
  nav.id = 'slide-nav';
  nav.innerHTML = `
    <a class="nav-home" href="index.html" title="All slides">⊞</a>
    <button id="nav-prev" title="Previous (←)" ${!prev ? 'disabled' : ''}>←</button>
    <span class="nav-counter">${idx + 1} / ${SLIDES.length}</span>
    <button id="nav-next" title="Next (→)" ${!next ? 'disabled' : ''}>→</button>
  `;
  document.body.appendChild(nav);

  // ── Navigation ─────────────────────────────────────────────────────────────
  function go(url) { if (url) location.href = url; }

  document.getElementById('nav-prev').addEventListener('click', () => go(prev));
  document.getElementById('nav-next').addEventListener('click', () => go(next));

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(next);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   go(prev);
  });

  // Touch swipe
  let touchStartX = 0;
  document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 50) return; // too short
    if (dx < 0) go(next);  // swipe left → next
    if (dx > 0) go(prev);  // swipe right → prev
  }, { passive: true });

  // Auto-hide after 3s of no mouse movement, show on move
  let hideTimer = null;
  function showNav() {
    nav.classList.remove('hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => nav.classList.add('hidden'), 3000);
  }
  document.addEventListener('mousemove', showNav);
  document.addEventListener('touchstart', showNav, { passive: true });
  showNav();
})();
