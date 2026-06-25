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
    'slide7.html',
  ];

  const current = location.pathname.split('/').pop() || '';
  const idx = SLIDES.indexOf(current);
  if (idx === -1) return;

  const next = idx < SLIDES.length - 1 ? SLIDES[idx + 1] : null;
  const prev = idx > 0 ? SLIDES[idx - 1] : null;

  function goNext() { if (next) location.href = next; }
  function goPrev() { if (prev) location.href = prev; }

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev();
  });

  // Touch swipe (ignore pinch/multi-touch)
  let touchStartX = null;
  document.addEventListener('touchstart', e => {
    if (e.touches.length > 1) { touchStartX = null; return; } // pinch — ignore
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    if (e.touches.length > 0) return; // still multi-touch
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) goNext();
    if (dx > 0) goPrev();
  }, { passive: true });

  // ── Lanjut CTA ──────────────────────────────────────────────────────────────
  if (!next) return; // last slide — no button needed

  const style = document.createElement('style');
  style.textContent = `
    #lanjut-btn {
      position: fixed;
      bottom: 32px;
      right: 32px;
      background: #fede3e;
      color: #000;
      font-family: 'Red Hat Display', 'IBM Plex Sans', 'Segoe UI', sans-serif;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 0.2px;
      padding: 14px 32px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      z-index: 99999;
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      opacity: 0;
      pointer-events: none;
      transform: translateY(16px);
      transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    #lanjut-btn.show {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    #lanjut-btn:hover  { background: #f5d200; transform: translateY(0) scale(1.04); }
    #lanjut-btn:active { transform: translateY(0) scale(0.97); }
    body.lanjut-visible { padding-bottom: 88px !important; }
    @media (max-width: 480px) {
      #lanjut-btn {
        bottom: 80px;
        right: 50%;
        transform: translateX(50%) translateY(16px);
        width: calc(100% - 48px);
        text-align: center;
      }
      #lanjut-btn.show {
        transform: translateX(50%) translateY(0);
      }
      #lanjut-btn:hover  { transform: translateX(50%) translateY(0) scale(1.04); }
      #lanjut-btn:active { transform: translateX(50%) translateY(0) scale(0.97); }
      body.lanjut-visible { padding-bottom: 160px !important; }
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'lanjut-btn';
  btn.textContent = 'Lanjut!';
  btn.addEventListener('click', goNext);
  btn.addEventListener('touchend', e => { e.preventDefault(); goNext(); }, { passive: false });
  document.body.appendChild(btn);

  window.showLanjut = function () {
    btn.classList.add('show');
    document.body.classList.add('lanjut-visible');
  };
})();
