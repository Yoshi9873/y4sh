(function () {
  if (!window.XM_ON) return;
  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var snowCv = document.getElementById('xm-snow');
  var fxCv = document.getElementById('xm-fx');
  if (!snowCv || !fxCv) return;
  var sc = snowCv.getContext('2d');
  var fc = fxCv.getContext('2d');
  var W = 0, H = 0, sdpr = 1, fdpr = 1, fxDirty = false, slow = 0;
  var coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  var flakes = [], parts = [];
  var boostUntil = 0, wind = 0, pointerWind = 0, rudolphUntil = 0;
  var mouse = { x: -100, y: -100, on: false };
  var lastSpawn = 0, lastPos = { x: 0, y: 0 }, zTick = 0;
  var ASSETS = {"gbA": ["....xxxxx....", "...xooooox...", "..xooooooox..", "..xoeoooeox..", "..xooommoox..", ".xxxoooooxxx.", "xwooooooooowx", "xwooooooooowx", ".xxoooooooxx.", "..xooorooox..", "..xooogooox..", "..xooorooox..", ".xoooxxxooox.", "xooox...xooox", "xwwwx...xwwwx", ".xxx.....xxx."], "gbB": ["....xxxxx....", "...xooooox...", "..xooooooox..", "..xoeoooeox..", "..xooommoox..", ".xxxoooooxxx.", "xwooooooooowx", "xwooooooooowx", ".xxoooooooxx.", "..xooorooox..", "..xooogooox..", "..xooorooox..", "..xoooxooox..", "..xoooxooox..", "..xwwwxwwwx..", "...xxx.xxx..."], "gbPal": {"o": "#C98A45", "e": "#2B1A10", "m": "#FFFFFF", "w": "#FFFFFF", "r": "#E5484D", "g": "#4CC38A", "x": "#6B3F1B"}};

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function isLight() { return root.getAttribute('data-theme') === 'light'; }
  function toast(msg, ms) { if (typeof showToast === 'function') showToast(msg, ms || 3200); }
  function play(name) { try { if (typeof sfx !== 'undefined') sfx.play(name); } catch (e) {} }
  function confetti(x, y) { try { if (typeof burstConfetti === 'function') burstConfetti(x, y); } catch (e) {} }

  function makeFlake(fromTop, temporary) {
    var r = 0.9 + Math.pow(Math.random(), 2.2) * 3.5;
    return {
      x: rnd(0, W), y: fromTop ? rnd(-30, -4) : rnd(0, H), r: r,
      vy: 20 + r * 13 + rnd(0, 12), sway: 5 + r * 4.5, freq: rnd(0.45, 1.15), ph: rnd(0, 6.28),
      a: rnd(0.55, 0.95), rot: rnd(0, 6.28), vr: rnd(-0.6, 0.6), tmp: !!temporary
    };
  }
  function wanted() { return coarse ? Math.max(36, Math.min(80, Math.round(W * H / 14000))) : Math.max(55, Math.min(130, Math.round(W * H / 15000))); }

  function resize() {
    var raw = window.devicePixelRatio || 1;
    sdpr = coarse ? 1 : Math.min(raw, 1.5);
    fdpr = 1;
    W = window.innerWidth;
    H = window.innerHeight;
    snowCv.width = Math.round(W * sdpr);
    snowCv.height = Math.round(H * sdpr);
    fxCv.width = Math.round(W * fdpr);
    fxCv.height = Math.round(H * fdpr);
    sc.setTransform(sdpr, 0, 0, sdpr, 0, 0);
    fc.setTransform(fdpr, 0, 0, fdpr, 0, 0);
    var n = wanted();
    while (flakes.length < n) flakes.push(makeFlake(false));
    if (flakes.length > n && boostUntil < performance.now()) flakes.length = n;
    if (reduce) drawSnow(0, 0);
  }

  function drawFlake(f, light) {
    var a = f.a;
    if (f.r > 3.4) {
      sc.save();
      sc.translate(f.x, f.y);
      sc.rotate(f.rot);
      sc.strokeStyle = light ? 'rgba(66,118,158,' + (a * 0.95) + ')' : 'rgba(255,255,255,' + a + ')';
      sc.lineWidth = light ? 1.5 : 1.3;
      sc.lineCap = 'round';
      var L = f.r * 2.1;
      sc.beginPath();
      for (var k = 0; k < 3; k++) {
        var ang = k * Math.PI / 3, cx = Math.cos(ang) * L, cy = Math.sin(ang) * L;
        var bx = Math.cos(ang) * L * 0.55, by = Math.sin(ang) * L * 0.55;
        var px = -Math.sin(ang) * L * 0.28, py = Math.cos(ang) * L * 0.28;
        sc.moveTo(-cx, -cy); sc.lineTo(cx, cy);
        sc.moveTo(bx - px, by - py); sc.lineTo(bx + px, by + py);
        sc.moveTo(-bx - px, -by - py); sc.lineTo(-bx + px, -by + py);
      }
      sc.stroke();
      sc.restore();
      return;
    }
    sc.beginPath();
    sc.arc(f.x, f.y, f.r, 0, 6.2832);
    sc.fillStyle = 'rgba(255,255,255,' + a + ')';
    sc.fill();
    if (light && f.r > 1.2) {
      sc.strokeStyle = 'rgba(66,118,158,' + (a * 0.75) + ')';
      sc.lineWidth = 1;
      sc.stroke();
    }
  }

  function drawSnow(dt, t) {
    sc.clearRect(0, 0, W, H);
    var light = isLight();
    var speed = boostUntil > t ? 3 : 1;
    for (var i = flakes.length - 1; i >= 0; i--) {
      var f = flakes[i];
      if (dt) {
        f.ph += f.freq * dt;
        f.rot += f.vr * dt;
        f.x += (wind * (0.25 + f.r * 0.12) + Math.cos(f.ph) * f.sway) * dt;
        f.y += f.vy * speed * dt;
        if (f.y > H + 12) {
          if (f.tmp && boostUntil <= t) { flakes.splice(i, 1); continue; }
          f.y = -12;
          f.x = rnd(0, W);
        }
        if (f.x < -24) f.x = W + 24;
        else if (f.x > W + 24) f.x = -24;
      }
      drawFlake(f, light);
    }
  }

  function spark(x, y, colour) {
    var cols = isLight() ? ['#E5484D', '#D9A21B', '#2E9E6B', '#4D8FD1'] : ['#FFFFFF', '#F2C14E', '#FF7A7A', '#7FD6A3'];
    parts.push({ x: x, y: y, vx: rnd(-18, 18), vy: rnd(-26, -4), life: 0, max: rnd(0.5, 0.95), s: rnd(2, 4), c: colour || cols[(Math.random() * cols.length) | 0] });
    if (parts.length > 80) parts.shift();
  }

  function drawParts(dt) {
    var rud = rudolphUntil > performance.now() && mouse.on;
    if (!parts.length && !rud) {
      if (fxDirty) { fc.clearRect(0, 0, W, H); fxDirty = false; }
      return;
    }
    fc.clearRect(0, 0, W, H);
    fxDirty = true;
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.life += dt;
      if (p.life >= p.max) { parts.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 38 * dt;
      fc.globalAlpha = 1 - p.life / p.max;
      fc.fillStyle = p.c;
      var s = Math.round(p.s);
      fc.fillRect(Math.round(p.x - s / 2), Math.round(p.y - s * 1.5), s, s * 3);
      fc.fillRect(Math.round(p.x - s * 1.5), Math.round(p.y - s / 2), s * 3, s);
    }
    fc.globalAlpha = 1;
    if (rud) {
      var nx = mouse.x + 4, ny = mouse.y + 4;
      var g = fc.createRadialGradient(nx, ny, 1, nx, ny, 24);
      g.addColorStop(0, 'rgba(255,70,70,.95)');
      g.addColorStop(0.35, 'rgba(255,60,60,.5)');
      g.addColorStop(1, 'rgba(255,60,60,0)');
      fc.fillStyle = g;
      fc.beginPath(); fc.arc(nx, ny, 24, 0, 6.2832); fc.fill();
      fc.fillStyle = '#FF3B3B';
      fc.beginPath(); fc.arc(nx, ny, 6, 0, 6.2832); fc.fill();
      fc.fillStyle = 'rgba(255,255,255,.75)';
      fc.fillRect(nx - 3, ny - 3, 3, 3);
    }
  }

  var last = 0;
  function frame(t) {
    if (coarse && last && t - last < 30) { requestAnimationFrame(frame); return; }
    var dt = Math.min(0.05, last ? (t - last) / 1000 : 0.016);
    if (last && t - last > 45) slow++; else slow = Math.max(0, slow - 1);
    if (slow > 30 && flakes.length > 24) { flakes.length = Math.max(24, Math.floor(flakes.length * 0.7)); slow = 0; }
    last = t;
    if (!document.hidden) {
      var tw = Math.sin(t / 5200) * 12 + pointerWind + (boostUntil > t ? 55 : 0);
      wind += (tw - wind) * Math.min(1, dt * 1.6);
      pointerWind *= Math.pow(0.05, dt);
      if (++zTick % 20 === 0) snowCv.style.zIndex = document.getElementById('enter-gate') ? '60' : '3';
      drawSnow(dt, t);
      drawParts(dt);
    }
    requestAnimationFrame(frame);
  }

  resize();
  snowCv.style.zIndex = document.getElementById('enter-gate') ? '60' : '3';
  window.addEventListener('resize', resize);
  if (!reduce) requestAnimationFrame(frame);

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    var dx = e.clientX - mouse.x;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.on = true;
    pointerWind = Math.max(-90, Math.min(90, pointerWind + dx * 0.9));
    if (reduce) return;
    var now = performance.now();
    if (now - lastSpawn > 38 && Math.abs(e.clientX - lastPos.x) + Math.abs(e.clientY - lastPos.y) > 10) {
      spark(e.clientX + 2, e.clientY + 5);
      lastSpawn = now;
      lastPos.x = e.clientX;
      lastPos.y = e.clientY;
    }
  }, { passive: true });
  document.addEventListener('mouseleave', function () { mouse.on = false; });

  function blizzard(ms) {
    if (reduce) return;
    boostUntil = performance.now() + ms;
    for (var i = 0; i < 110; i++) flakes.push(makeFlake(false, true));
  }

  function rect(x, y, w, h, c) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c + '"/>';
  }
  function rows(grid, pal) {
    var out = '';
    for (var y = 0; y < grid.length; y++) {
      var row = grid[y], x = 0;
      while (x < row.length) {
        var ch = row.charAt(x);
        if (ch === '.') { x++; continue; }
        var x0 = x;
        while (x < row.length && row.charAt(x) === ch) x++;
        out += rect(x0, y, x - x0, 1, pal[ch]);
      }
    }
    return out;
  }

  function sleighSVG() {
    var s = '';
    s += rect(2, 36, 46, 3, '#C98A1B') + rect(46, 31, 4, 6, '#C98A1B') + rect(48, 29, 3, 3, '#C98A1B');
    s += rect(6, 22, 38, 13, '#E5484D') + rect(6, 22, 38, 3, '#9B2335') + rect(4, 16, 8, 19, '#E5484D') + rect(4, 16, 8, 3, '#9B2335');
    s += rect(30, 13, 11, 11, '#8B5A2B') + rect(33, 10, 5, 4, '#8B5A2B') + rect(34, 12, 3, 2, '#C98A1B');
    s += rect(15, 5, 9, 5, '#E5484D') + rect(12, 4, 4, 4, '#FFFFFF') + rect(14, 9, 11, 3, '#FFFFFF') + rect(16, 12, 8, 5, '#F5C9A0') + rect(18, 13, 2, 2, '#1A0B10') + rect(15, 16, 10, 7, '#FFFFFF') + rect(14, 22, 12, 4, '#E5484D');
    s += rect(50, 28, 12, 2, '#7A1520');
    s += rect(60, 20, 27, 10, '#8B5A2B') + rect(62, 28, 22, 2, '#C99A62');
    s += rect(85, 13, 6, 10, '#8B5A2B') + rect(89, 9, 10, 8, '#8B5A2B') + rect(97, 12, 5, 4, '#A5733F') + rect(101, 12, 4, 4, '#FF4040') + rect(93, 11, 2, 2, '#1A0B10') + rect(88, 6, 3, 4, '#8B5A2B');
    s += rect(91, 1, 2, 8, '#E8D2A6') + rect(87, 1, 6, 2, '#E8D2A6') + rect(95, 2, 2, 7, '#E8D2A6') + rect(95, 2, 5, 2, '#E8D2A6');
    s += '<g class="la">' + rect(62, 30, 3, 9, '#6B4423') + rect(81, 30, 3, 9, '#6B4423') + '</g>';
    s += '<g class="lb">' + rect(67, 30, 3, 7, '#6B4423') + rect(75, 30, 3, 7, '#6B4423') + '</g>';
    return '<svg viewBox="0 0 108 42" shape-rendering="crispEdges" aria-hidden="true">' + s + '</svg>';
  }

  function flySleigh() {
    if (document.getElementById('xm-sleigh-live')) return;
    var el = document.createElement('div');
    el.className = 'xm-sleigh';
    el.id = 'xm-sleigh-live';
    el.innerHTML = sleighSVG();
    document.body.appendChild(el);
    var w = el.offsetWidth || 162;
    var y0 = H * rnd(0.22, 0.4);
    var y1 = y0 - H * rnd(0.08, 0.2);
    var dur = reduce ? 3200 : 9500;
    var anim = el.animate([
      { transform: 'translate(' + (-w - 20) + 'px,' + y0 + 'px)' },
      { transform: 'translate(' + (W + 20) + 'px,' + y1 + 'px)' }
    ], { duration: dur, easing: 'ease-in-out' });
    var timer = null;
    if (!reduce) {
      timer = setInterval(function () {
        var r = el.getBoundingClientRect();
        spark(r.left + 6, r.top + r.height * 0.78, '#F2C14E');
        spark(r.left + 2, r.top + r.height * 0.7, '#FFFFFF');
      }, 70);
    }
    anim.onfinish = function () {
      if (timer) clearInterval(timer);
      el.remove();
    };
  }

  function ginger() {
    if (document.getElementById('xm-ginger-live') || document.getElementById('enter-gate') || document.hidden) return false;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'xm-ginger';
    btn.id = 'xm-ginger-live';
    btn.setAttribute('aria-label', 'Catch the gingerbread man');
    var w = ASSETS.gbA[0].length, h = ASSETS.gbA.length;
    btn.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" shape-rendering="crispEdges" aria-hidden="true"><g class="ga">' + rows(ASSETS.gbA, ASSETS.gbPal) + '</g><g class="gb">' + rows(ASSETS.gbB, ASSETS.gbPal) + '</g></svg>';
    document.body.appendChild(btn);
    var dir = Math.random() < 0.5 ? 1 : -1;
    var from = dir > 0 ? -70 : W + 70;
    var to = dir > 0 ? W + 70 : -70;
    var flip = dir > 0 ? '' : ' scaleX(-1)';
    var anim = btn.animate([
      { transform: 'translateX(' + from + 'px)' + flip },
      { transform: 'translateX(' + to + 'px)' + flip }
    ], { duration: reduce ? 6000 : 8500, easing: 'linear' });
    anim.onfinish = function () { btn.remove(); };
    btn.addEventListener('click', function () {
      var r = btn.getBoundingClientRect();
      anim.cancel();
      btn.remove();
      confetti(r.left + r.width / 2, r.top);
      play('jingle');
      var quips = [
        'You caught the gingerbread man! He was faster than he looked.',
        'Nom nom. Delicious maths.',
        'You caught me! Be gentle with the icing.',
        'Run, run, as fast as you can. Apparently you can.'
      ];
      toast(quips[(Math.random() * quips.length) | 0], 4200);
    });
    return true;
  }

  var lights = document.querySelector('.xm-lights');
  function chase() {
    if (!lights) return;
    lights.classList.remove('chase');
    void lights.offsetWidth;
    lights.classList.add('chase');
    play('jingle');
    setTimeout(function () { lights.classList.remove('chase'); }, 5700);
  }
  if (lights) lights.addEventListener('click', chase);

  var star = document.getElementById('xm-star');
  if (star) {
    var wishes = 0, wishTimer = null;
    star.addEventListener('click', function () {
      wishes++;
      clearTimeout(wishTimer);
      wishTimer = setTimeout(function () { wishes = 0; }, 3200);
      if (wishes === 1) toast('Make a wish.', 2400);
      if (wishes >= 4) {
        wishes = 0;
        flySleigh();
        play('jingle');
        toast('Your wish was heard. Here comes Santa!', 3600);
      }
    });
  }

  var FACTS = [
    'The Twelve Days of Christmas gives you 364 gifts in total, one for almost every day of the year.',
    'Snowflakes have six arms because ice crystals grow on a hexagonal lattice.',
    'Christmas Day is 11001 in binary.',
    'Christmas Day is also the sum of the first five odd numbers: 1 + 3 + 5 + 7 + 9 = 25.',
    'An advent calendar has 24 doors, and 24 is 4 factorial.',
    'The stripes on a candy cane spiral around it in a helix.',
    'Pine cones show Fibonacci numbers in their spirals, typically 8 one way and 13 the other.',
    'A cone-shaped Christmas tree has exactly one third of the volume of the cylinder that would hold it.',
    'Oct 31 equals Dec 25, if you read 31 as an octal number.',
    'The running totals of gifts in The Twelve Days of Christmas are the tetrahedral numbers: 1, 4, 10, 20, and so on up to 364.',
    'A cube-shaped box that is 10cm on each side needs 600 square centimetres of wrapping paper before any overlap.'
  ];
  var lastFact = -1;
  var hero = document.querySelector('.nl-hero');
  if (hero) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var days = Math.round((new Date(now.getFullYear(), 11, 25) - today) / 86400000);
    if (days >= 0) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'xm-chip';
      var label = days === 0 ? 'Merry Christmas!' : days === 1 ? '1 sleep until Christmas' : days + ' sleeps until Christmas';
      chip.innerHTML = '<i aria-hidden="true"></i><span>' + label + '</span>';
      chip.setAttribute('aria-label', label + '. Press for a festive fact.');
      chip.addEventListener('click', function () {
        var i;
        do { i = (Math.random() * FACTS.length) | 0; } while (i === lastFact);
        lastFact = i;
        play('jingle');
        toast('Fun fact: ' + FACTS[i], 7000);
        var r = chip.getBoundingClientRect();
        if (Math.random() < 0.35) confetti(r.left + r.width / 2, r.top + r.height);
      });
      hero.appendChild(chip);
    }
  }

  var buffer = '';
  var WORDS = {
    santa: function () { flySleigh(); play('jingle'); toast('Ho ho ho! Santa is on his way.', 3600); },
    hohoho: function () { flySleigh(); play('jingle'); toast('Ho ho ho! Merry Christmas!', 3600); },
    snow: function () { blizzard(9000); toast('Snow day! It is snowing harder.', 3200); },
    jingle: function () { chase(); toast('Jingle bells, jingle bells!', 3200); },
    rudolph: function () { rudolphUntil = performance.now() + 14000; toast('Rudolph mode: your cursor now has a glowing red nose.', 4200); }
  };
  window.addEventListener('keydown', function (e) {
    var tg = e.target;
    if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable)) return;
    if (e.ctrlKey || e.metaKey || e.altKey || !e.key || e.key.length !== 1) return;
    var ch = e.key.toLowerCase();
    if (ch < 'a' || ch > 'z') return;
    buffer = (buffer + ch).slice(-8);
    for (var w in WORDS) {
      if (buffer.slice(-w.length) === w) { buffer = ''; WORDS[w](); break; }
    }
  });

  if (!reduce) {
    var autoSleigh = function () {
      if (!document.hidden && !document.getElementById('enter-gate')) flySleigh();
      setTimeout(autoSleigh, rnd(240, 420) * 1000);
    };
    setTimeout(autoSleigh, rnd(50, 90) * 1000);
    var autoGinger = function () {
      var ran = ginger();
      setTimeout(autoGinger, ran ? rnd(80, 150) * 1000 : 12000);
    };
    setTimeout(autoGinger, rnd(25, 50) * 1000);
  }

  try {
    console.log(
      '%c        *\n       /|\\\n      /_|_\\\n     /  |  \\\n    /___|___\\\n       |_|\n%cMerry Christmas from y4sh.xyz\nType santa, snow, jingle or rudolph anywhere on the page.',
      'color:#2E9E6B;font:bold 14px monospace',
      'color:#E5484D;font:bold 12px monospace'
    );
  } catch (e) {}
})();
