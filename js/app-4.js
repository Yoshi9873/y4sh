(function () {
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var spot = '.countdown,.problem-card,.prob-card,.link-row,.now-playing,.nl-mo';
  var spotEv = null, spotRaf = 0;
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    spotEv = e;
    if (spotRaf) return;
    spotRaf = requestAnimationFrame(function () {
      spotRaf = 0;
      var ev = spotEv;
      var c = ev && ev.target.closest && ev.target.closest(spot);
      if (c) { var r = c.getBoundingClientRect(); c.style.setProperty('--px', (ev.clientX - r.left) + 'px'); c.style.setProperty('--py', (ev.clientY - r.top) + 'px'); }
    });
  }, { passive: true });
  var up = document.createElement('button'); up.className = 'nl-top'; up.type = 'button'; up.setAttribute('aria-label', 'Back to top');
  up.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(up);
  up.addEventListener('click', function () { scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }); });
  var pend = false;
  addEventListener('scroll', function () {
    if (pend) return; pend = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - innerHeight;
      up.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max) : 0);
      up.classList.toggle('show', scrollY > 600);
      pend = false;
    });
  }, { passive: true });
})();
