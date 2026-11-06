(function () {
  const bar = document.createElement('div');
  bar.id = 'scroll-bar';
  document.body.appendChild(bar);
  let ticking = false;
  function paintBar() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(paintBar); }
  }, { passive: true });
  paintBar();

  const sel = '.glass-card, .link-row, .problem-card';
  let active = null, pending = null, raf = 0;
  function apply() {
    raf = 0;
    if (!pending) return;
    const r = pending.card.getBoundingClientRect();
    pending.card.style.setProperty('--mx', (pending.x - r.left) + 'px');
    pending.card.style.setProperty('--my', (pending.y - r.top) + 'px');
    pending = null;
  }
  document.addEventListener('pointermove', function (e) {
    const card = e.target.closest ? e.target.closest(sel) : null;
    if (card !== active) {
      if (active) active.style.setProperty('--g', '0');
      active = card;
      if (active) active.style.setProperty('--g', '1');
    }
    if (card) {
      pending = { card: card, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    }
  }, { passive: true });
  document.addEventListener('pointerleave', function () {
    if (active) active.style.setProperty('--g', '0');
    active = null;
  });

  const container = document.getElementById('links-container');
  if (container) {
    new IntersectionObserver(function (entries, io) {
      if (entries.some(function (en) { return en.isIntersecting; })) { container.classList.add('rows-in'); io.disconnect(); }
    }, { threshold: 0.05 }).observe(container);
    new MutationObserver(function () {
      Array.prototype.forEach.call(container.children, function (el, i) {
        el.style.setProperty('--i', i);
        el.style.transitionDelay = '0s, 0s, 0s, 0s, 0s';
      });
    }).observe(container, { childList: true });
  }
})();
