(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas');
  c.id = 'fx';
  document.body.insertBefore(c, document.body.firstChild);
  const spot = document.createElement('div');
  spot.id = 'spot';
  document.body.insertBefore(spot, c.nextSibling);
  const ctx = c.getContext('2d');
  const LINK = 135, MLINK = 170, BUCKETS = 8;
  let w = 0, h = 0, dpr = 1, pts = [], mx = -9999, my = -9999, sx = -9999, sy = -9999, last = 0, frame = 0;
  let rgb = '130,164,245', light = false, sprite = null, spriteKey = '';
  function makePoint(x, y) {
    const z = Math.random(), s = 0.35 + 0.65 * z;
    return { x: x, y: y, z: z, vx: (Math.random() - 0.5) * 0.34 * s, vy: (Math.random() - 0.5) * 0.34 * s, r: 0.6 + z * 1.5, ph: Math.random() * 6.2832, ts: 0.0006 + Math.random() * 0.0012 };
  }
  function buildSprite() {
    const s = document.createElement('canvas');
    s.width = 64; s.height = 64;
    const g = s.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, light ? 'rgba(' + rgb + ',1)' : 'rgba(255,255,255,1)');
    grad.addColorStop(0.16, 'rgba(' + rgb + ',0.9)');
    grad.addColorStop(0.38, 'rgba(' + rgb + ',0.26)');
    grad.addColorStop(0.68, 'rgba(' + rgb + ',0.06)');
    grad.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    sprite = s;
    spriteKey = rgb + light;
  }
  function refreshStyle() {
    light = document.documentElement.getAttribute('data-theme') === 'light';
    const v = getComputedStyle(document.documentElement).getPropertyValue('--indigo').trim();
    const m = /^#([0-9a-f]{6})$/i.exec(v);
    if (m) rgb = parseInt(m[1].slice(0, 2), 16) + ',' + parseInt(m[1].slice(2, 4), 16) + ',' + parseInt(m[1].slice(4), 16);
    if (!sprite || spriteKey !== rgb + light) buildSprite();
  }
  function size() {
    const nw = window.innerWidth, nh = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(nw * dpr);
    c.height = Math.round(nh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, (nw * nh) / 16000));
    if (w && h) {
      const fx = nw / w, fy = nh / h;
      for (let i = 0; i < pts.length; i++) { pts[i].x *= fx; pts[i].y *= fy; }
    }
    while (pts.length > n) pts.pop();
    while (pts.length < n) pts.push(makePoint(Math.random() * nw, Math.random() * nh));
    w = nw;
    h = nh;
  }
  let rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 150); });
  window.addEventListener('pointermove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    if (sx < -9000) { sx = mx; sy = my; spot.classList.add('on'); }
  }, { passive: true });
  document.addEventListener('pointerleave', function () { mx = -9999; my = -9999; spot.classList.remove('on'); sx = -9999; });
  function spotLoop() {
    requestAnimationFrame(spotLoop);
    if (sx < -9000) return;
    sx += (mx - sx) * 0.1;
    sy += (my - sy) * 0.1;
    spot.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,0)';
  }
  function loop(t) {
    requestAnimationFrame(loop);
    if (t - last < 14) return;
    const dt = Math.min(48, t - last) / 16.7;
    last = t;
    frame++;
    if (frame % 90 === 1) refreshStyle();
    const k = light ? 1.9 : 1;
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 0.9;
    const paths = [];
    for (let i = 0; i < BUCKETS; i++) paths.push(new Path2D());
    const hit = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < -12) p.x = w + 12; else if (p.x > w + 12) p.x = -12;
      if (p.y < -12) p.y = h + 12; else if (p.y > h + 12) p.y = -12;
      const dx = mx - p.x, dy = my - p.y, dm = Math.sqrt(dx * dx + dy * dy);
      if (dm < MLINK) { p.x += dx * 0.006 * dt; p.y += dy * 0.006 * dt; hit.push([p, dm]); }
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], ex = p.x - q.x, ey = p.y - q.y, d2 = ex * ex + ey * ey;
        if (d2 < LINK * LINK) {
          const f = Math.pow(1 - Math.sqrt(d2) / LINK, 1.4) * (0.5 + 0.25 * (p.z + q.z));
          if (f < 0.02) continue;
          const path = paths[Math.min(BUCKETS - 1, Math.floor(f * BUCKETS))];
          path.moveTo(p.x, p.y);
          path.lineTo(q.x, q.y);
        }
      }
    }
    for (let i = 0; i < BUCKETS; i++) {
      ctx.strokeStyle = 'rgba(' + rgb + ',' + (((i + 0.5) / BUCKETS) * 0.3 * k).toFixed(3) + ')';
      ctx.stroke(paths[i]);
    }
    for (let i = 0; i < hit.length; i++) {
      const f = 1 - hit[i][1] / MLINK;
      ctx.strokeStyle = 'rgba(' + rgb + ',' + (f * f * 0.5 * (light ? 1.5 : 1)).toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(hit[i][0].x, hit[i][0].y);
      ctx.lineTo(mx, my);
      ctx.stroke();
    }
    const base = light ? 0.95 : 0.8;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], d = p.r * 8;
      ctx.globalAlpha = base * (0.4 + 0.6 * p.z) * (0.72 + 0.28 * Math.sin(t * p.ts + p.ph));
      ctx.drawImage(sprite, p.x - d / 2, p.y - d / 2, d, d);
    }
    ctx.globalAlpha = 1;
  }
  refreshStyle();
  size();
  requestAnimationFrame(loop);
  requestAnimationFrame(spotLoop);
})();
