(function () {
  if (!document.documentElement.classList.contains('hw')) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function webSVG(withSpider) {
    var N = 5, R = 78, cx = 80, cy = 0, rays = [], d = '', i, k;
    for (i = 0; i < N; i++) {
      var a = Math.PI / 2 + i * (Math.PI / 2) / (N - 1);
      rays.push(a);
      d += 'M' + cx + ' ' + cy + 'L' + (cx + R * Math.cos(a)).toFixed(1) + ' ' + (cy + R * Math.sin(a)).toFixed(1);
    }
    [16, 30, 45, 60, 74].forEach(function (r) {
      for (k = 0; k < N - 1; k++) {
        var a1 = rays[k], a2 = rays[k + 1], am = (a1 + a2) / 2, rc = r * 0.8;
        d += 'M' + (cx + r * Math.cos(a1)).toFixed(1) + ' ' + (cy + r * Math.sin(a1)).toFixed(1) +
             'Q' + (cx + rc * Math.cos(am)).toFixed(1) + ' ' + (cy + rc * Math.sin(am)).toFixed(1) + ' ' +
             (cx + r * Math.cos(a2)).toFixed(1) + ' ' + (cy + r * Math.sin(a2)).toFixed(1);
      }
    });
    var spider = withSpider
      ? '<path d="M56 0V36" stroke-width=".6"/><g class="spider"><circle cx="56" cy="39" r="2.6"/><circle cx="56" cy="35.6" r="1.5"/>' +
        '<path d="M54 38l-4 -2M54 40l-4 3M58 38l4 -2M58 40l4 3M54.4 37l-3 -4M57.6 37l3 -4" fill="none" stroke="currentColor" stroke-width=".7" stroke-linecap="round"/></g>'
      : '';
    return '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width=".75" stroke-linecap="round" aria-hidden="true"><path d="' + d + '"/>' + spider + '</svg>';
  }
  [['.glass-card', 'r', false], ['.problem-card', 'l', false], ['.prob-card', 'r', true]].forEach(function (c) {
    var el = document.querySelector(c[0]);
    if (!el) return;
    var w = document.createElement('div');
    w.className = 'hw-web ' + c[1];
    w.setAttribute('aria-hidden', 'true');
    w.innerHTML = webSVG(c[2]);
    el.appendChild(w);
  });

  var btn = document.getElementById('hw-moon-btn');
  var hero = document.querySelector('.nl-hero');
  var layer = document.getElementById('hw-bats');
  if (!btn || !hero || !layer) return;

  function placeMoon() {
    var w = hero.clientWidth, h = hero.clientHeight;
    if (!w || !h) return;
    var s = Math.max(w / 1000, h / 400);
    var ox = (w - 1000 * s) / 2, oy = (h - 400 * s) / 2;
    var cx = 842 * s + ox, cy = 110 * s + oy, r = 58 * s;
    btn.style.left = (cx - r) + 'px';
    btn.style.top = (cy - r) + 'px';
    btn.style.width = (2 * r) + 'px';
    btn.style.height = (2 * r) + 'px';
  }
  placeMoon();
  window.addEventListener('resize', placeMoon);
  window.addEventListener('load', placeMoon);
  if (window.ResizeObserver) new ResizeObserver(placeMoon).observe(hero);

  var busy = false;
  btn.addEventListener('click', function () {
    if (busy) return;
    busy = true;
    try { if (typeof sfx !== 'undefined') sfx.play('bats'); } catch (e) {}
    var r = btn.getBoundingClientRect();
    var x0 = r.left + r.width / 2, y0 = r.top + r.height / 2;
    var W = window.innerWidth, H = window.innerHeight;
    var count = 9, longest = 0;
    for (var i = 0; i < count; i++) {
      var size = 26 + Math.random() * 30;
      var el = document.createElement('div');
      el.className = 'hw-bat-fly';
      el.innerHTML = '<svg viewBox="-38 -16 76 24" width="' + size.toFixed(0) + '" height="' + (size * 24 / 76).toFixed(0) + '"><use href="#hw-bat"/></svg>';
      layer.appendChild(el);
      var delay = Math.random() * 650;
      var dur = reduce ? 1400 : 3800 + Math.random() * 2200;
      longest = Math.max(longest, delay + dur);
      var dir = Math.random() < 0.8 ? -1 : 1;
      var endX = dir < 0 ? -140 : W + 140;
      var endY = y0 - (H * 0.15) - Math.random() * (H * 0.45);
      var wob = 30 + Math.random() * 60, ph = Math.random() * 6.28, steps = 10, frames = [];
      for (var k = 0; k <= steps; k++) {
        var t = k / steps;
        var x = x0 + (endX - x0) * t;
        var y = y0 + (endY - y0) * t + Math.sin(t * 9 + ph) * wob * Math.min(1, t * 3);
        var tilt = Math.cos(t * 9 + ph) * 14;
        var op = t < 0.06 ? t / 0.06 : (t > 0.92 ? (1 - t) / 0.08 : 1);
        frames.push(reduce
          ? { transform: 'translate(' + (x0 - size / 2) + 'px,' + (y0 - size / 4) + 'px)', opacity: Math.sin(t * Math.PI) }
          : { transform: 'translate(' + (x - size / 2).toFixed(1) + 'px,' + (y - size / 4).toFixed(1) + 'px) rotate(' + tilt.toFixed(1) + 'deg)', opacity: op });
      }
      var anim = el.animate(frames, { duration: dur, delay: delay, easing: 'linear', fill: 'both' });
      (function (node) { anim.onfinish = function () { node.remove(); }; })(el);
    }
    setTimeout(function () { busy = false; }, Math.min(longest, 2600));
  });
})();
