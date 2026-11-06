  function localParts(date) {
    const d = date || new Date();
    return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate(), h: d.getHours(), mi: d.getMinutes(), s: d.getSeconds() };
  }

  function localCalendarDay(offset) {
    const p = localParts();
    const d = new Date(Date.UTC(p.y, p.m - 1, p.d + (offset || 0)));
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
  }

  function localDateKey(offset) {
    const c = localCalendarDay(offset);
    return c.y + '-' + String(c.m).padStart(2, '0') + '-' + String(c.d).padStart(2, '0');
  }

  function localDayOfYear(offset) {
    const c = localCalendarDay(offset);
    return Math.floor((Date.UTC(c.y, c.m - 1, c.d) - Date.UTC(c.y, 0, 0)) / 86400000);
  }

  function msUntilLocalMidnight() {
    const now = Date.now();
    const p = localParts(new Date(now));
    let t = now - (now % 1000) + (86400 - (p.h * 3600 + p.mi * 60 + p.s)) * 1000;
    for (let i = 0; i < 3; i++) {
      const q = localParts(new Date(t));
      const sod = q.h * 3600 + q.mi * 60 + q.s;
      const sameDay = q.y === p.y && q.m === p.m && q.d === p.d;
      if (sameDay) t += (86400 - sod) * 1000;
      else if (sod > 0) t -= sod * 1000;
      else break;
    }
    return Math.max(0, t - now);
  }

  const LOADED_LOCAL_DAY = localDateKey();

  const LINKS = [
    {
      label: "Instagram", sub: "@manlikey4sh", href: "https://instagram.com/manlikey4sh",
      symbol: "&phi;",
      title: "φ ≈ 1.618, the golden ratio."
    },
    {
      label: "TikTok", sub: "@y4s.h", href: "https://tiktok.com/@y4s.h",
      symbol: "sin&thinsp;&theta;",
      title: "A sine wave: the simplest periodic function."
    },
    {
      label: "Snapchat", sub: "@manlikey4sh", href: "https://snapchat.com/add/manlikey4sh",
      symbol: "lim",
      title: "The limit as t tends to 0."
    },
    {
      label: "Discord", sub: "y4s.h", href: "https://discord.com/users/y4s.h",
      symbol: "(r,&thinsp;&theta;)",
      title: "Never argue with a polar coordinate, they always have a point and an angle."
    },
  ];

  const container = document.getElementById('links-container');
  LINKS.forEach((link, i) => {
    const a = document.createElement('a');
    a.className = 'link-row reveal-on-scroll';
    a.style.transitionDelay = `${i * 70}ms`;
    a.href = link.href;
    a.target = link.href.startsWith('http') ? '_blank' : '_self';
    a.rel = 'noopener noreferrer';
    a.title = link.title;
    a.innerHTML = `
      <span class="link-tag">${link.symbol}</span>
      <span class="link-body">
        <div class="link-label">${link.label}</div>
        <div class="link-sub">${link.sub}</div>
      </span>
      <span class="link-arrow">&rarr;</span>
    `;
    container.appendChild(a);
  });

  let ytPlayer = null;
  let userInteracted = false;
  let musicStarted = false;
  let everPlayed = false;
  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isIOS) document.documentElement.classList.add('is-ios');
  let lastVolume = 55;

  function attemptMusicStart() {
    if (musicStarted || !ytPlayer || !userInteracted) return;
    musicStarted = true;
    ytPlayer.setVolume(0);
    ytPlayer.playVideo();

    const target = lastVolume;
    const steps = 32;
    const stepTime = 1600 / steps;
    let i = 0;
    const fadeIn = setInterval(() => {
      i++;
      const v = Math.round((target * i) / steps);
      ytPlayer.setVolume(v);
      if (volumeSlider) volumeSlider.value = v;
      if (i >= steps) clearInterval(fadeIn);
    }, stepTime);
  }

  (function typeGateHandle() {
    const handleEl = document.getElementById('gate-handle');
    if (!handleEl) return;
    const fullText = '@manlikey4sh';
    let i = 0;
    const typeInterval = setInterval(() => {
      i++;
      handleEl.textContent = fullText.slice(0, i);
      if (i >= fullText.length) {
        clearInterval(typeInterval);
        const cursor = document.getElementById('gate-cursor');
        if (cursor) cursor.style.display = 'none';
        typeSub();
      }
    }, 85);
    function typeSub() {
      const subEl = document.getElementById('gate-sub');
      const subCursor = document.getElementById('gate-sub-cursor');
      if (!subEl) return;
      const subText = window.XM_ON ? (window.matchMedia('(pointer: coarse)').matches ? 'Tap anywhere to unwrap' : 'Click anywhere to unwrap') : 'Click anywhere to enter';
      let k = 0;
      if (subCursor) subCursor.style.display = '';
      const subInterval = setInterval(() => {
        k++;
        subEl.textContent = subText.slice(0, k);
        if (k >= subText.length) {
          clearInterval(subInterval);
          if (subCursor) subCursor.style.display = 'none';
        }
      }, 55);
    }
  })();

  let gateHidden = false;
  function hideEnterGate() {
    if (gateHidden) return;
    gateHidden = true;
    const gate = document.getElementById('enter-gate');
    const wrap = document.querySelector('.wrap');
    if (wrap) wrap.classList.add('revealed');

    const nameText = document.getElementById('name-text');
    if (nameText) {
      const fullText = 'y4s.h';
      let i = 0;
      nameText.textContent = '';
      const typeInterval = setInterval(() => {
        i++;
        nameText.textContent = fullText.slice(0, i);
        if (i >= fullText.length) {
          clearInterval(typeInterval);
          const cursor = document.getElementById('name-cursor');
          if (cursor) cursor.style.display = 'none';
        }
      }, 85);
    }

    if (!gate) return;
    gate.classList.add('hidden');
    setTimeout(() => gate.remove(), 1150);

    const heroItems = document.querySelectorAll('.hero-stagger');
    heroItems.forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 260 + i * 130);
    });
  }

  window.onYouTubeIframeAPIReady = () => {
    ytPlayer = new YT.Player('youtube-embed', {
      height: '166',
      width: '300',
      videoId: 'BD3ge5nBXWY',
      playerVars: Object.assign(
        { autoplay: 0, controls: 0, disablekb: 1, modestbranding: 1, fs: 0, playsinline: 1, rel: 0 },
        location.protocol.startsWith('http') ? { origin: location.origin } : {}
      ),
      events: {
        onReady: () => {
          try {
            const d = ytPlayer.getVideoData();
            if (d && d.title) document.getElementById('np-title').textContent = d.title;
            if (d && d.author) document.getElementById('np-artist').textContent = d.author;
          } catch (e) {}
          attemptMusicStart();
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) everPlayed = true;
          updatePlayPauseIcon(e.data === YT.PlayerState.PLAYING);
          try {
            const d = ytPlayer.getVideoData();
            if (d && d.title) document.getElementById('np-title').textContent = d.title;
            if (d && d.author) document.getElementById('np-artist').textContent = d.author;
          } catch (e2) {}
        },
        onError: (event) => {
          console.error('YouTube player error, code:', event.data);
          const t = document.getElementById('np-title');
          const a = document.getElementById('np-artist');
          if (t) t.textContent = "Couldn't play this track";
          if (a) a.innerHTML = '<a href="https://www.youtube.com/watch?v=BD3ge5nBXWY" target="_blank" rel="noopener noreferrer" style="color:inherit">Open on YouTube</a>';
        },
      },
    });
  };

  const npPlayPause = document.getElementById('np-playpause');
  const npPlayIcon = document.getElementById('np-play-icon');
  const npPauseIcon = document.getElementById('np-pause-icon');
  const npProgressFill = document.getElementById('np-progress-fill');

  function updatePlayPauseIcon(isPlaying) {
    npPlayIcon.style.display = isPlaying ? 'none' : 'block';
    npPauseIcon.style.display = isPlaying ? 'block' : 'none';
  }

  npPlayPause.addEventListener('click', () => {
    if (!ytPlayer) return;
    const state = ytPlayer.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
    }
  });

  setInterval(() => {
    if (!ytPlayer || !musicStarted) return;
    const duration = ytPlayer.getDuration();
    const current = ytPlayer.getCurrentTime();
    if (duration > 0) {
      npProgressFill.style.transform = `scaleX(${Math.min(1, current / duration)})`;
    }
  }, 250);

  const volumeSlider = document.getElementById('volume-slider');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeWave = document.getElementById('volume-wave');
  let muted = false;
  function paintVolume() {
    volumeWave.style.opacity = muted ? '0.25' : '1';
    volumeIcon.setAttribute('aria-pressed', String(muted));
  }
  volumeSlider.addEventListener('input', (e) => {
    lastVolume = Number(e.target.value);
    muted = lastVolume === 0;
    if (ytPlayer) {
      try {
        if (muted) ytPlayer.mute();
        else { ytPlayer.unMute(); ytPlayer.setVolume(lastVolume); }
      } catch (err) {}
    }
    paintVolume();
  });
  volumeIcon.addEventListener('click', () => {
    if (!muted) {
      muted = true;
      volumeSlider.dataset.prevVolume = lastVolume || 55;
      volumeSlider.value = 0;
    } else {
      muted = false;
      lastVolume = Number(volumeSlider.dataset.prevVolume) || 55;
      volumeSlider.value = lastVolume;
    }
    if (ytPlayer) {
      try {
        if (muted) ytPlayer.mute();
        else { ytPlayer.unMute(); ytPlayer.setVolume(lastVolume); }
      } catch (err) {}
    }
    paintVolume();
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sfx = (function () {
    const KEY = 'y4sh_sfx';
    const btn = document.getElementById('sfx-toggle');
    let on = false, actx = null, master = null, lastTick = 0;
    try { on = localStorage.getItem(KEY) === '1'; } catch (e) {}
    function level() {
      const v = Number(document.getElementById('volume-slider').value) / 100;
      return v * v * 0.6;
    }
    function ready() {
      if (!actx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        actx = new AC();
        master = actx.createGain();
        master.connect(actx.destination);
        try {
          const silent = actx.createBufferSource();
          silent.buffer = actx.createBuffer(1, 1, 22050);
          silent.connect(actx.destination);
          silent.start(0);
        } catch (err) {}
      }
      if (actx.state === 'suspended') actx.resume();
      return true;
    }
    function tone(freq, start, dur, type, peak, endFreq) {
      const t0 = actx.currentTime + start;
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t0);
      if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g);
      g.connect(master);
      o.start(t0);
      o.stop(t0 + dur + 0.03);
    }
    const CLEAN = {
      hover: () => tone(1500, 0, 0.035, 'sine', 0.05),
      click: () => tone(560, 0, 0.07, 'sine', 0.16, 330),
      key: () => tone(900, 0, 0.04, 'triangle', 0.1),
      hint: () => { tone(520, 0, 0.12, 'sine', 0.14, 780); tone(780, 0.09, 0.16, 'sine', 0.1); },
      success: () => { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.3, 'sine', 0.14)); },
      wrong: () => tone(200, 0, 0.2, 'triangle', 0.16, 140),
      badge: () => { [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568].forEach((f, i) => tone(f, i * 0.07, 0.3, 'triangle', 0.12)); [523.25, 783.99, 1046.5].forEach((f) => tone(f, 0.45, 0.8, 'sine', 0.07)); }
    };

    const SPOOKY = {
      hover: () => tone(1244.5, 0, 0.04, 'sine', 0.04),
      click: () => { tone(311.1, 0, 0.1, 'triangle', 0.16, 196); tone(293.7, 0.01, 0.1, 'sine', 0.06, 185); },
      key: () => tone(622.25, 0, 0.05, 'triangle', 0.1, 587.3),
      hint: () => { tone(440, 0, 0.14, 'sine', 0.13, 466.2); tone(523.25, 0.1, 0.2, 'sine', 0.1, 554.4); },
      success: () => { [440, 523.25, 659.25, 880].forEach((f, i) => tone(f, i * 0.1, 0.34, 'triangle', 0.13)); tone(830.6, 0.42, 0.5, 'sine', 0.05); },
      wrong: () => { tone(196, 0, 0.2, 'triangle', 0.15, 146.8); tone(138.6, 0.14, 0.32, 'triangle', 0.12, 110); },
      bats: () => { [1200, 1500, 1100, 1700, 1300].forEach((f, i) => tone(f, i * 0.055, 0.07, 'sine', 0.05, f * 0.7)); },
      badge: () => { [440, 523.25, 659.25, 880, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.08, 0.32, 'triangle', 0.12)); [440, 659.25, 880].forEach((f) => tone(f, 0.5, 0.9, 'sine', 0.07)); }
    };
    const XMAS = {
      hover: () => tone(1760, 0, 0.03, 'sine', 0.04),
      click: () => { tone(880, 0, 0.09, 'sine', 0.14, 988); tone(1318.5, 0.02, 0.12, 'sine', 0.06); },
      key: () => tone(1046.5, 0, 0.045, 'triangle', 0.09, 1174.7),
      hint: () => { tone(784, 0, 0.12, 'sine', 0.13, 880); tone(988, 0.1, 0.18, 'sine', 0.1); },
      success: () => { [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.08, 0.34, 'sine', 0.13)); tone(2093, 0.4, 0.4, 'sine', 0.04); },
      wrong: () => tone(220, 0, 0.2, 'triangle', 0.14, 170),
      jingle: () => { [2093, 2637, 2349, 3136, 2793, 3520, 3136].forEach((f, i) => tone(f, i * 0.07, 0.22, 'sine', 0.05)); tone(1568, 0, 0.5, 'triangle', 0.03); },
      badge: () => { [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568, 2093].forEach((f, i) => tone(f, i * 0.07, 0.34, 'sine', 0.11)); [2093, 2637, 3136].forEach((f, i) => tone(f, 0.5 + i * 0.06, 0.4, 'sine', 0.04)); }
    };
    const SOUNDS = new Proxy({}, { get: (_, k) => { const c = document.documentElement.classList; return c.contains('hw') ? (SPOOKY[k] || CLEAN[k]) : c.contains('xm') ? (XMAS[k] || CLEAN[k]) : CLEAN[k]; } });
    function play(name) {
      if (!on || !SOUNDS[name]) return;
      const lv = level();
      if (lv <= 0.001 || !ready()) return;
      if (name === 'hover') {
        const now = performance.now();
        if (now - lastTick < 70) return;
        lastTick = now;
      }
      master.gain.value = lv;
      SOUNDS[name]();
    }
    function render() {
      btn.setAttribute('aria-pressed', String(on));
      btn.classList.toggle('on', on);
      btn.title = on ? 'Interface sounds: on' : 'Interface sounds: off';
    }
    btn.addEventListener('click', () => {
      on = !on;
      try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
      render();
      play('click');
    });
    document.addEventListener('pointerover', (e) => {
      if (e.pointerType !== 'mouse') return;
      const t = e.target.closest && e.target.closest('a.link-row, .prob-choice, .prob-btn, .theme-toggle, .volume-icon, .sfx-toggle, .calc-toggle-btn, .give-up-link, .hint-btn, .yday-toggle');
      if (t && !t.contains(e.relatedTarget)) play('hover');
    });
    document.addEventListener('click', (e) => {
      const t = e.target.closest && e.target.closest('button, a.link-row');
      if (!t || t.dataset.sfx === 'own') return;
      play(t.classList.contains('calc-btn') ? 'key' : 'click');
    });
    render();
    return { play };
  })();

  function swapText(el, text) {
    if (el.textContent === text) return;
    if (reducedMotion) { el.textContent = text; return; }
    clearTimeout(el._swap);
    el.classList.add('txt-out');
    el._swap = setTimeout(() => { el.textContent = text; el.classList.remove('txt-out'); }, 130);
  }

  function showToast(msg, ms) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => el.classList.remove('show'), ms || 2200);
  }

  function copyText(text) {
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      ta.remove();
      showToast(ok ? 'Copied ' + text : 'Could not copy.');
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => showToast('Copied ' + text), fallback);
    } else {
      fallback();
    }
  }

  (function setupCopyUsername() {
    const el = document.querySelector('.glass-username.copyable');
    const go = () => { copyText('y4s.h'); sfx.play('click'); };
    el.addEventListener('click', go);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  })();

  function swapView(from, to, display, done) {
    const finish = () => {
      from.style.display = 'none';
      from.classList.remove('view-out');
      to.style.display = display;
      if (!reducedMotion) {
        to.classList.add('view-in');
        void to.offsetWidth;
        to.classList.add('view-run');
        to.classList.remove('view-in');
        setTimeout(() => to.classList.remove('view-run'), 400);
      }
      if (done) done();
    };
    if (reducedMotion || from.style.display === 'none') { finish(); return; }
    from.classList.add('view-out');
    setTimeout(finish, 200);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash) || reducedMotion) return;
    e.preventDefault();
    document.documentElement.classList.add('page-leaving');
    setTimeout(() => { location.href = a.href; }, 240);
  });
  window.addEventListener('pageshow', () => document.documentElement.classList.remove('page-leaving'));

  function fxCanvas() {
    const c = document.createElement('canvas');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9998';
    c.width = Math.round(window.innerWidth * dpr);
    c.height = Math.round(window.innerHeight * dpr);
    document.body.appendChild(c);
    const g = c.getContext('2d');
    g.scale(dpr, dpr);
    return { c, g };
  }

  function themeColours() {
    const cs = getComputedStyle(document.documentElement);
    return [cs.getPropertyValue('--indigo').trim() || '#82A4F5', cs.getPropertyValue('--accent2').trim() || '#59DDCB', '#A06EFF', cs.getPropertyValue('--amber').trim() || '#E3A94B', cs.getPropertyValue('--danger').trim() || '#D9645A'];
  }

  const HW_BAT_PATH = (typeof Path2D === 'function') ? new Path2D("M0 -4 C-3 -10 -8 -12 -12 -8 C-18 -14 -30 -12 -36 -2 C-30 -5 -24 -3 -20 3 C-16 -1 -10 0 -7 5 C-5 3 -2 3 0 6 C2 3 5 3 7 5 C10 0 16 -1 20 3 C24 -3 30 -5 36 -2 C30 -12 18 -14 12 -8 C8 -12 3 -10 0 -4 Z") : null;

  function burstConfetti(ox, oy) {
    if (reducedMotion) return;
    const hw = document.documentElement.classList.contains('hw') && HW_BAT_PATH;
    const { c, g } = fxCanvas();
    const cols = themeColours();
    const x0 = ox == null ? window.innerWidth / 2 : ox;
    const y0 = oy == null ? window.innerHeight * 0.35 : oy;
    const BAT_COLS = ['#A878FF', '#C9A6FF', '#8A5CE0'];
    const PUMP_COLS = ['#FF7A1A', '#FFB23F', '#F26B10'];
    const ps = [];
    const n = hw ? 64 : 110;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9;
      const p = { x: x0, y: y0, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 5, w: 5 + Math.random() * 5, h: 3 + Math.random() * 4, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, col: cols[i % cols.length] };
      if (hw) {
        p.kind = i % 3 === 0 ? 'pump' : 'bat';
        p.s = 0.3 + Math.random() * 0.3;
        p.ph = Math.random() * 6.28;
        p.vr *= 0.4;
        p.col = p.kind === 'pump' ? PUMP_COLS[i % PUMP_COLS.length] : BAT_COLS[i % BAT_COLS.length];
      }
      ps.push(p);
    }
    const t0 = performance.now();
    let last = t0;
    (function frame(t) {
      const dt = Math.min(40, t - last) / 16.7, age = t - t0;
      last = t;
      g.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ps.forEach((p) => {
        p.vy += (hw ? 0.2 : 0.28) * dt;
        p.vx *= 0.992;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += p.vr * dt;
        g.save();
        g.globalAlpha = Math.max(0, Math.min(1, 1 - (age - 1600) / 900));
        g.translate(p.x, p.y);
        g.fillStyle = p.col;
        if (p.kind === 'bat') {
          g.rotate(Math.sin(p.r) * 0.4);
          const flap = 0.5 + 0.5 * Math.abs(Math.sin(age / 90 + p.ph));
          g.scale(p.s * 1.3, p.s * 1.3 * flap);
          g.fill(HW_BAT_PATH);
        } else if (p.kind === 'pump') {
          g.rotate(p.r);
          const rr = p.w * 0.95;
          g.beginPath(); g.ellipse(0, 0, rr * 1.15, rr, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = '#4E8F1F';
          g.fillRect(-1, -rr - 3, 2.2, 4);
          g.fillStyle = '#2A0F05';
          g.fillRect(-rr * 0.5, -rr * 0.2, 1.8, 1.8);
          g.fillRect(rr * 0.5 - 1.8, -rr * 0.2, 1.8, 1.8);
        } else {
          g.rotate(p.r);
          g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        g.restore();
      });
      if (age < 2500) requestAnimationFrame(frame); else c.remove();
    })(t0);
  }

  (function setupSpecialDays() {
    const now = new Date();
    const day = (now.getMonth() + 1) + '-' + now.getDate();
    const DAYS = { '3-14': 'Happy \u03c0 day! 3.14159265358979\u2026', '6-28': 'Happy tau day! \u03c4 = 2\u03c0 \u2248 6.28318\u2026', '2-7': 'Happy e day! e \u2248 2.71828\u2026' };
    if (!DAYS[day]) return;
    const key = 'y4sh_special_' + now.getFullYear() + '_' + day;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, '1');
    } catch (e) {}
    setTimeout(() => { showToast(DAYS[day], 4200); burstConfetti(); }, 1800);
  })();

  (function setupScrollReveal() {
    const targets = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window) || targets.length === 0) {
      targets.forEach((el) => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((el) => io.observe(el));
  })();

  (function setupCardTilt() {
    const card = document.querySelector('.glass-card');
    if (!card) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReduced || !canHover) return;

    const MAX_TILT = 6;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, hovering = false;

    function step() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      const settled = Math.abs(tx - cx) < 0.01 && Math.abs(ty - cy) < 0.01;
      if (!hovering && settled) {
        card.style.transform = '';
        raf = 0;
        return;
      }
      card.style.transform =
        `perspective(700px) rotateY(${(cx * MAX_TILT).toFixed(2)}deg) rotateX(${(-cy * MAX_TILT).toFixed(2)}deg) translateY(-2px)`;
      raf = requestAnimationFrame(step);
    }

    card.addEventListener('mouseenter', () => {
      hovering = true;
      card.style.transition = 'box-shadow 0.4s var(--ease)';
      if (!raf) raf = requestAnimationFrame(step);
    });
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      tx = (e.clientX - rect.left) / rect.width - 0.5;
      ty = (e.clientY - rect.top) / rect.height - 0.5;
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
      hovering = false;
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(step);
    });
  })();

  (function setupProblemStreak() {
    const el = document.getElementById('problem-streak');
    if (!el) return;
    try {
      const todayKey = localDateKey();
      const raw = localStorage.getItem('y4sh_problem_streak');
      let data = raw ? JSON.parse(raw) : { lastDate: null, streak: 0, totalDays: 0 };

      if (data.lastDate !== todayKey) {
        const wasYesterday = data.lastDate === localDateKey(-1);
        data = {
          lastDate: todayKey,
          streak: wasYesterday ? data.streak + 1 : 1,
          totalDays: data.totalDays + 1,
        };
        localStorage.setItem('y4sh_problem_streak', JSON.stringify(data));
      }

      const dayWord = data.totalDays === 1 ? 'day' : 'days';
      el.innerHTML = `<span class="flame">${hwFlame()} ${data.streak}-day streak</span> &middot; ${data.totalDays} ${dayWord} solved`;
    } catch (err) {

      el.remove();
    }
  })();

  (function setupKonami() {
    const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let pos = 0;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SYMBOLS = window.XM_ON ? ['\u2744', '\u2745', '\u2746', '\u2605', '\u03c0', '\u221e'] : ['\u03c0', '\u221e', '\u221a', '\u03a3', '\u222b', '\u0398', 'e'];

    function spawnSymbols() {
      if (prefersReduced) return;
      for (let i = 0; i < 32; i++) {
        setTimeout(() => {
          const s = document.createElement('div');
          s.className = 'konami-symbol';
          s.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          s.style.left = `${Math.random() * 100}vw`;
          s.style.fontSize = `${18 + Math.random() * 22}px`;
          const duration = 3.5 + Math.random() * 2.5;
          s.style.animationDuration = `${duration}s`;
          document.body.appendChild(s);
          setTimeout(() => s.remove(), duration * 1000 + 100);
        }, i * 60);
      }
    }

    function showToast() {
      const toast = document.createElement('div');
      toast.className = 'konami-toast';
      toast.textContent = window.XM_ON ? '\u2744 Easter egg found. Merry Christmas!' : '\u2211 Easter egg found. Don\u2019t fool yourself.';
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      }, 3200);
    }

    window.addEventListener('keydown', (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === CODE[pos] ? pos + 1 : (key === CODE[0] ? 1 : 0);
      if (pos === CODE.length) {
        pos = 0;
        spawnSymbols();
        showToast();
      }
    });
  })();

  function retryMusicStart() {
    if (everPlayed || !ytPlayer || !userInteracted) return;
    try {
      const st = ytPlayer.getPlayerState();
      if (st !== YT.PlayerState.PLAYING && st !== YT.PlayerState.BUFFERING) ytPlayer.playVideo();
    } catch (err) {}
  }
  ['click', 'touchend'].forEach((evt) => document.addEventListener(evt, retryMusicStart, { passive: true }));

  function handleFirstInteraction() {
    userInteracted = true;
    attemptMusicStart();
    hideEnterGate();
  }

  ['pointerdown', 'click', 'touchstart', 'keydown'].forEach((evt) => {
    document.addEventListener(evt, handleFirstInteraction, { once: true, passive: true });
  });

  const DISCORD_USER_ID = '690269705596174337';

  const STATUS_COLORS = {
    online: '#3BA55C',
    idle: '#FAA61A',
    dnd: '#ED4245',
    offline: '#6B6E76',
  };

  const BADGES = [
    {
      kind: 'tag',
      icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%230B1220'/%3E%3Ctext x='50' y='70' font-family='Georgia, serif' font-style='italic' font-size='62' fill='%2382A4F5' text-anchor='middle'%3EY%3C/text%3E%3C/svg%3E",
      text: 'Y4SH',
    },
  ];

  function renderBadges() {
    const el = document.getElementById('glass-badges');
    if (!el) return;
    el.innerHTML = BADGES.map((b) => {
      if (b.kind === 'tag') {
        return `<span class="glass-tag-chip"><img class="glass-tag-icon" src="${b.icon}" alt=""><span class="glass-tag-text">${b.text}</span></span>`;
      }
      return `<span class="glass-badge"><span>${b.icon}</span><span>${b.label}</span></span>`;
    }).join('');
  }
  renderBadges();

  let lastAvatarUrl = null;

  const SEEN_KEY = 'y4sh_discord_seen';
  const LAST_KEY = 'y4sh_discord_last';
  const STATUS_LABELS = { online: 'Online', idle: 'Idle', dnd: 'Do not disturb', offline: 'Offline' };
  const FALLBACK_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230B1220'/%3E%3Ctext x='50' y='70' font-family='Georgia, serif' font-style='italic' font-size='62' fill='%238FA9F2' text-anchor='middle'%3EY%3C/text%3E%3C/svg%3E";
  const seenEl = document.getElementById('discord-seen');
  const avatarEl = document.getElementById('discord-avatar');
  const dotEl = document.getElementById('discord-status-dot');
  const discord = { status: null, live: false, lastOnline: 0, checkedAt: 0, avatar: null };

  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || 'null');
    if (seen && Number.isFinite(seen.at)) discord.lastOnline = seen.at;
    const last = JSON.parse(localStorage.getItem(LAST_KEY) || 'null');
    if (last && last.status && Number.isFinite(last.at)) {
      discord.status = last.status;
      discord.checkedAt = last.at;
      discord.avatar = last.avatar || null;
    }
  } catch (e) {}

  function ago(ms) {
    const m = Math.floor((Date.now() - ms) / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h ago';
    const d = Math.floor(h / 24);
    if (d < 7) return d + 'd ago';
    return 'on ' + new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  const AVATAR_OK = /^https:\/\/cdn\.discordapp\.com\/(avatars\/\d{5,25}\/[A-Za-z0-9_]{1,64}\.png\?size=160|embed\/avatars\/\d\.png)$/;
  function setAvatar(url) {
    if (!url || url === lastAvatarUrl || typeof url !== 'string' || !AVATAR_OK.test(url)) return;
    lastAvatarUrl = url;
    avatarEl.src = url;
    document.documentElement.style.setProperty('--glass-glow-img', `url("${url}")`);
  }

  avatarEl.addEventListener('error', () => {
    if (avatarEl.src !== FALLBACK_AVATAR) avatarEl.src = FALLBACK_AVATAR;
  });

  function setDiscordTitle(st) {
    const card = document.querySelector('.glass-card');
    if (!card) return;
    const word = st === 'online' || st === 'idle' ? 'online' : st === 'dnd' ? 'busy' : st === 'offline' ? 'offline' : null;
    card.dataset.title = word ? 'Well, it looks like I am currently ' + word : 'Checking my status\u2026';
  }

  function renderDiscord() {
    const st = discord.status;
    setDiscordTitle(st);
    if (!st) {
      dotEl.style.background = STATUS_COLORS.offline;
      dotEl.classList.add('stale');
      seenEl.className = 'glass-seen stale';
      seenEl.textContent = 'Status unavailable';
      return;
    }
    dotEl.style.background = STATUS_COLORS[st] || STATUS_COLORS.offline;
    dotEl.classList.toggle('stale', !discord.live);
    const text = STATUS_LABELS[st] || 'Offline';
    seenEl.className = 'glass-seen' + (st === 'online' && discord.live ? ' online' : '') + (discord.live ? '' : ' stale');
    seenEl.textContent = text;
  }

  function saveDiscord() {
    try {
      localStorage.setItem(LAST_KEY, JSON.stringify({ status: discord.status, at: discord.checkedAt, avatar: discord.avatar }));
      if (discord.lastOnline) localStorage.setItem(SEEN_KEY, JSON.stringify({ at: discord.lastOnline }));
    } catch (e) {}
  }

  async function updateDiscordStatus() {
    if (!navigator.onLine) { discord.live = false; renderDiscord(); return; }
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 8000);
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, { signal: ctl.signal });
      const json = await res.json();
      if (!json.success) throw new Error('lanyard lookup failed');
      const d = json.data;
      const status = d.discord_status || 'offline';
      const avatarHash = d.discord_user.avatar;
      const uid = d.discord_user.id;
      const avatarUrl = avatarHash
        ? `https://cdn.discordapp.com/avatars/${uid}/${avatarHash}.png?size=160`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;
      const now = Date.now();
      discord.status = status;
      discord.live = true;
      discord.checkedAt = now;
      discord.avatar = avatarUrl;
      if (status !== 'offline') discord.lastOnline = now;
      setAvatar(avatarUrl);
      saveDiscord();
    } catch (err) {
      discord.live = false;
    } finally {
      clearTimeout(timer);
      renderDiscord();
    }
  }

  if (discord.avatar) setAvatar(discord.avatar);
  else avatarEl.src = FALLBACK_AVATAR;
  renderDiscord();
  updateDiscordStatus();
  setInterval(() => { if (!document.hidden) updateDiscordStatus(); }, 20000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateDiscordStatus(); });
  setInterval(renderDiscord, 30000);
  window.addEventListener('online', updateDiscordStatus);
  window.addEventListener('offline', () => { discord.live = false; renderDiscord(); });

  (function setupPwa() {
    const secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if ('serviceWorker' in navigator && secure) {
      const hadController = Boolean(navigator.serviceWorker.controller);
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (hadController) showToast('Updated. Refresh for the latest version.', 6000);
      });
      window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}); });
    }
    const btn = document.getElementById('install-btn');
    let deferred = null;
    const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    if ((/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && !standalone) {
      btn.textContent = 'Add to home screen';
      btn.hidden = false;
    }
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferred = e;
    });
    btn.addEventListener('click', async () => {
      if (!deferred) { showToast('Tap the Share button, then \u201CAdd to Home Screen\u201D.', 6000); return; }
      deferred.prompt();
      try { await deferred.userChoice; } catch (e) {}
      deferred = null;
      btn.hidden = true;
    });
    window.addEventListener('appinstalled', () => {
      btn.hidden = true;
      showToast('Installed. Find it on your home screen.', 4000);
    });
    window.addEventListener('offline', () => showToast("You're offline, but the site still works.", 3500));
    window.addEventListener('online', () => showToast('Back online.', 2200));
    if (!navigator.onLine) setTimeout(() => showToast("You're offline. Showing the saved version.", 3500), 1500);
  })();

  const CD_KEY = 'y4sh_cd_mode';
  const CD_NAMES = { w: 'weeks', d: 'days', h: 'hours', m: 'min', s: 'sec' };
  let cdMode = 0;
  try { cdMode = Number(localStorage.getItem(CD_KEY)) || 0; } catch (e) {}

  const cdPad = (n) => String(n).padStart(2, '0');

  function cdParts(diff) {
    const days = Math.floor(diff / 86400000);
    return { days: days, hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) };
  }

  function cdValues(diff, mode) {
    const p = cdParts(diff);
    if (mode === 1) return { w: String(Math.floor(p.days / 7)), d: String(p.days % 7), h: cdPad(p.hours), m: cdPad(p.minutes) };
    if (mode === 2) return { h: (p.days * 24 + p.hours).toLocaleString('en-GB'), m: cdPad(p.minutes), s: cdPad(p.seconds) };
    return { d: String(p.days), h: cdPad(p.hours), m: cdPad(p.minutes), s: cdPad(p.seconds) };
  }

  function cdSet(tile, text) {
    if (tile.text === text) return;
    const first = tile.text === null;
    tile.text = text;
    const n = document.createElement('span');
    n.className = 'cd-n';
    n.textContent = text;
    if (first || reducedMotion) {
      tile.val.textContent = '';
      tile.val.appendChild(n);
      return;
    }
    const old = Array.from(tile.val.children);
    n.classList.add('in');
    tile.val.appendChild(n);
    void n.offsetWidth;
    n.classList.remove('in');
    old.forEach((o) => o.classList.add('out'));
    setTimeout(() => old.forEach((o) => o.remove()), 450);
  }

  function celebrateOnce(key, target) {
    if (Date.now() - target > 86400000) return;
    try {
      if (localStorage.getItem('y4sh_done_' + key)) return;
      localStorage.setItem('y4sh_done_' + key, '1');
    } catch (e) {}
    burstConfetti();
    showToast("It's here!", 3000);
    sfx.play('success');
  }

  function showNewYear(year) {
    const ov = document.getElementById('ny');
    if (!ov || !ov.hidden) return;
    const prev = String(year - 1), cur = String(year);
    const yearEl = document.getElementById('ny-year');
    yearEl.innerHTML = cur.split('').map((c, i) => '<span class="ny-d"><span class="ny-r"><i>' + (prev[i] || c) + '</i><i>' + c + '</i></span></span>').join('');
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    document.getElementById('ny-line').textContent = (leap ? 366 : 365) + ' fresh days ahead. Make them count.';
    ov.hidden = false;
    ov.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      ov.classList.add('on');
      yearEl.querySelectorAll('.ny-d').forEach((d, i) => { if (prev[i] !== cur[i]) setTimeout(() => d.classList.add('go'), 700 + i * 160); });
    }));
    try { sfx.play('success'); } catch (e) {}
    const cv = document.getElementById('ny-fx');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, timer = 0, onResize = null;
    const ps = [];
    if (!reduce && cv.getContext) {
      const g = cv.getContext('2d');
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      onResize = () => { cv.width = window.innerWidth * dpr; cv.height = window.innerHeight * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
      onResize();
      window.addEventListener('resize', onResize);
      const COLS = ['#FFD36E', '#FFFFFF', '#FF7BAC', '#7CE7FF', '#B58CFF', '#8DE04A'];
      const burst = (x, y) => {
        const col = COLS[(Math.random() * COLS.length) | 0], n = 70 + ((Math.random() * 40) | 0);
        for (let i = 0; i < n; i++) {
          const a = Math.random() * 6.283, sp = 1 + Math.random() * 4.6;
          ps.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, dec: 0.008 + Math.random() * 0.012, col: Math.random() < 0.25 ? '#FFFFFF' : col });
        }
      };
      const frame = () => {
        g.globalCompositeOperation = 'destination-out';
        g.fillStyle = 'rgba(0,0,0,0.22)';
        g.fillRect(0, 0, window.innerWidth, window.innerHeight);
        g.globalCompositeOperation = 'lighter';
        for (let i = ps.length - 1; i >= 0; i--) {
          const p = ps[i];
          p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.045; p.x += p.vx; p.y += p.vy; p.life -= p.dec;
          if (p.life <= 0) { ps.splice(i, 1); continue; }
          g.globalAlpha = Math.max(0, p.life);
          g.fillStyle = p.col;
          g.beginPath(); g.arc(p.x, p.y, 1.8, 0, 6.283); g.fill();
        }
        g.globalAlpha = 1;
        raf = requestAnimationFrame(frame);
      };
      burst(window.innerWidth * 0.3, window.innerHeight * 0.32);
      setTimeout(() => burst(window.innerWidth * 0.7, window.innerHeight * 0.26), 350);
      setTimeout(() => burst(window.innerWidth * 0.5, window.innerHeight * 0.2), 700);
      timer = setInterval(() => burst(window.innerWidth * (0.12 + Math.random() * 0.76), window.innerHeight * (0.12 + Math.random() * 0.4)), 800);
      frame();
    }
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    function close() {
      cancelAnimationFrame(raf);
      clearInterval(timer);
      if (onResize) window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKey);
      ov.classList.remove('on');
      document.body.style.overflow = '';
      try { localStorage.setItem('ny_seen_' + year, '1'); } catch (e) {}
      setTimeout(() => { ov.hidden = true; ov.setAttribute('aria-hidden', 'true'); }, 700);
    }
    document.addEventListener('keydown', onKey);
    document.getElementById('ny-close').onclick = close;
    ov.onclick = (e) => { if (e.target === ov) close(); };
  }

  function makeCountdown(el, cfg) {
    let built = -1, tiles = [], bar = null, cap = null, dots = [], finished = false;
    function build(mode) {
      const units = mode === 1 ? ['w', 'd', 'h', 'm'] : mode === 2 ? ['h', 'm', 's'] : ['d', 'h', 'm', 's'];
      el.innerHTML =
        '<div class="cd-label">' + cfg.label + '</div>' +
        '<div class="cd-tiles">' + units.map((u) => '<div class="cd-tile" data-u="' + u + '"><span class="cd-val"></span><span class="cd-u">' + CD_NAMES[u] + '</span></div>').join('') + '</div>' +
        '<div class="cd-bar"><i></i></div>' +
        '<div class="cd-foot"><span class="cd-cap"></span><span class="cd-dots" aria-hidden="true"><b></b><b></b><b></b></span></div>';
      tiles = units.map((u) => ({ u: u, text: null, val: el.querySelector('.cd-tile[data-u="' + u + '"] .cd-val') }));
      bar = el.querySelector('.cd-bar i');
      cap = el.querySelector('.cd-cap');
      dots = Array.from(el.querySelectorAll('.cd-dots b'));
      built = mode;
    }
    function update() {
      if (cfg.roll && Date.now() >= cfg.target) { cfg.roll(cfg); finished = false; built = -1; }
      const now = Date.now(), diff = cfg.target - now;
      if (diff <= 0) {
        if (finished) return;
        finished = true;
        built = -1;
        el.classList.remove('urgent');
        el.innerHTML = '<div class="cd-label">' + cfg.label + '</div><div class="cd-done">It\'s here!</div>';
        el.setAttribute('aria-label', cfg.label + ': it\'s here!');
        celebrateOnce(cfg.key, cfg.target);
        return;
      }
      if (built !== cdMode) build(cdMode);
      const vals = cdValues(diff, cdMode);
      tiles.forEach((t) => cdSet(t, vals[t.u]));
      const frac = Math.max(0, Math.min(1, (now - cfg.start) / (cfg.target - cfg.start)));
      bar.style.transform = 'scaleX(' + frac.toFixed(5) + ')';
      cap.textContent = (frac * 100).toFixed(1) + '% ' + cfg.caption;
      dots.forEach((d, i) => d.classList.toggle('on', i === cdMode));
      el.classList.toggle('urgent', diff < 86400000);
      const p = cdParts(diff);
      el.setAttribute('aria-label', p.days + ' days, ' + p.hours + ' hours, ' + p.minutes + ' minutes ' + cfg.label + '. Press to change units.');
    }
    update();
    setInterval(update, 1000);
    return { update: update };
  }

  const cdNewYearEl = document.getElementById('countdown');
  const nyYear = new Date().getFullYear();
  cdNewYearEl.setAttribute('data-title', 'Until ' + (nyYear + 1) + ' there are');
  const cdNewYear = makeCountdown(cdNewYearEl, {
    target: new Date(nyYear + 1, 0, 1, 0, 0, 0).getTime(), start: new Date(nyYear, 0, 1, 0, 0, 0).getTime(),
    label: 'until ' + (nyYear + 1), caption: 'of ' + nyYear + ' gone', key: 'new-year',
    roll: function (c) {
      const prevTarget = c.target;
      const y = new Date().getFullYear();
      c.target = new Date(y + 1, 0, 1, 0, 0, 0).getTime();
      c.start = new Date(y, 0, 1, 0, 0, 0).getTime();
      c.label = 'until ' + (y + 1);
      c.caption = 'of ' + y + ' gone';
      cdNewYearEl.setAttribute('data-title', 'Until ' + (y + 1) + ' there are');
      if (Date.now() - prevTarget < 86400000) showNewYear(y);
    }
  });
  const cdAlevels = makeCountdown(document.getElementById('countdown-alevels'), {
    target: new Date(2027, 5, 18, 0, 0, 0).getTime(), start: new Date(2026, 8, 1, 0, 0, 0).getTime(),
    label: 'until A-levels finish', caption: 'of the way there', key: 'alevels'
  });

  (function () {
    const t = new Date();
    const forced = /[?&]newyear=(on|1|true)/i.test(location.search);
    if (!forced && !(t.getMonth() === 0 && t.getDate() === 1)) return;
    const y = forced ? Math.max(t.getFullYear(), 2027) : t.getFullYear();
    try { if (!forced && localStorage.getItem('ny_seen_' + y)) return; } catch (e) {}
    let tries = 0;
    const wait = setInterval(() => {
      if (!document.getElementById('enter-gate') || ++tries > 150) { clearInterval(wait); setTimeout(() => showNewYear(y), 500); }
    }, 400);
  })();
  (function () {
    const star = document.getElementById('xm-star');
    if (!star || !window.XM_ON) return;
    star.addEventListener('click', () => {
      const r = star.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
      sfx.play('success');
    });
  })();

  function cycleCountdown() {
    cdMode = (cdMode + 1) % 3;
    try { localStorage.setItem(CD_KEY, String(cdMode)); } catch (e) {}
    cdNewYear.update();
    cdAlevels.update();
    sfx.play('click');
  }
  ['countdown', 'countdown-alevels'].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener('click', cycleCountdown);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cycleCountdown(); }
    });
  });

  function updateNextQuestionCountdown() {
    const el = document.getElementById('nq-time');
    if (localDateKey() !== LOADED_LOCAL_DAY && !document.hidden) { location.reload(); return; }
    if (!el) return;
    const diff = msUntilLocalMidnight();

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    el.textContent =
      `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }
  updateNextQuestionCountdown();
  setInterval(updateNextQuestionCountdown, 1000);
  document.addEventListener('visibilitychange', updateNextQuestionCountdown);

  const root = document.documentElement;
  const $ = (id) => document.getElementById(id);
  const themeIconDark = $('theme-icon-dark');
  const themeIconLight = $('theme-icon-light');
  const SHADE_KEY = 'site-shade';
  const HW_SHADES = [
    ['#0F0A14', 'Witching hour (default)'],
    ['#1A0B26', 'Haunted violet'],
    ['#1E0A0C', 'Blood moon'],
    ['#2A1408', 'Burnt pumpkin'],
    ['#0A120D', 'Graveyard'],
    ['#14180B', 'Swamp'],
    ['#0C1420', 'Midnight mist'],
    ['#221416', 'Crypt'],
    ['#2B1646', 'Amethyst'],
    ['#000000', 'Pitch black'],
    ['#F3E7D3', 'Parchment'],
    ['#E9E2F3', 'Ghost'],
  ];
  const XM_SHADES = [
    ['#0A1814', 'Spruce night (default)'], ['#08160F', 'Pine'], ['#1A0B0E', 'Cranberry'], ['#0B1624', 'Frost navy'],
    ['#1B1410', 'Gingerbread'], ['#111B22', 'Winter sky'], ['#0F1A16', 'Evergreen'], ['#16101F', 'Plum'],
    ['#1E2A24', 'Mistletoe'], ['#000000', 'Pitch black'], ['#F7F1E6', 'Cream'], ['#EAF2F6', 'Snow'],
  ];
  const BASE_SHADES = [
    ['#0B1220', 'Midnight navy (default)'], ['#050810', 'Deep space'], ['#0A0A0F', 'Obsidian'], ['#101827', 'Dusk blue'],
    ['#0A1A24', 'Deep ocean'], ['#0C1A17', 'Pine night'], ['#161027', 'Ultraviolet'], ['#1E1230', 'Amethyst'],
    ['#1A0E16', 'Wine'], ['#1C1B22', 'Graphite'], ['#F7F7F2', 'Paper'], ['#EAF0FB', 'Ice'],
  ];
  const SHADE_PRESETS = window.HW_ON ? HW_SHADES : window.XM_ON ? XM_SHADES : BASE_SHADES;
  const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

  const store = {
    get: (key) => { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set: (key, value) => { try { localStorage.setItem(key, value); } catch (e) {} },
    remove: (key) => { try { localStorage.removeItem(key); } catch (e) {} },
  };

  const currentTheme = () => root.getAttribute('data-theme') || 'dark';

  function setTheme(theme) {
    if (theme === 'dark') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    themeIconDark.style.display = theme === 'light' ? 'none' : 'block';
    themeIconLight.style.display = theme === 'light' ? 'block' : 'none';
    document.dispatchEvent(new Event('themechange'));
  }

  function normalizeHex(value) {
    const match = HEX_RE.exec(value.trim());
    if (!match) return null;
    const h = match[1].length === 3 ? [...match[1]].map((c) => c + c).join('') : match[1];
    return '#' + h.toLowerCase();
  }

  const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const toHex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const mixWithWhite = (hex, amount) => toHex(toRgb(hex).map((v) => v + (255 - v) * amount));
  const isLightColour = (hex) => {
    const [r, g, b] = toRgb(hex);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.55;
  };

  const shadePanel = $('shade-panel');
  const shadeToggle = $('shade-toggle');
  const shadePicker = $('shade-picker');
  const shadeHex = $('shade-hex');

  function syncShadeInputs(hex) {
    shadePicker.value = hex;
    shadeHex.value = hex;
    shadeHex.classList.remove('invalid');
  }

  function applyShade(hex, { save = true } = {}) {
    const light = isLightColour(hex);
    const paper2 = mixWithWhite(hex, light ? 0.6 : 0.06);
    root.style.setProperty('--paper', hex);
    root.style.setProperty('--paper-2', paper2);
    setTheme(light ? 'light' : 'dark');
    syncShadeInputs(hex);
    if (save) store.set(SHADE_KEY, JSON.stringify({ p: hex, p2: paper2, t: light ? 'light' : 'dark' }));
  }

  function resetShade() {
    root.style.removeProperty('--paper');
    root.style.removeProperty('--paper-2');
    store.remove(SHADE_KEY);
    setTheme(store.get('site-theme') === 'light' ? 'light' : 'dark');
    syncShadeInputs(getComputedStyle(root).getPropertyValue('--paper').trim());
  }

  const hasCustomShade = () => root.style.getPropertyValue('--paper') !== '';

  setTheme(currentTheme());
  if (hasCustomShade()) syncShadeInputs(normalizeHex(root.style.getPropertyValue('--paper')) || '#0F0A14');

  $('theme-toggle').addEventListener('click', () => {
    const next = currentTheme() === 'light' ? 'dark' : 'light';
    if (hasCustomShade()) {
      root.style.removeProperty('--paper');
      root.style.removeProperty('--paper-2');
      store.remove(SHADE_KEY);
    }
    store.set('site-theme', next);
    root.classList.add('theme-anim');
    clearTimeout(root._themeAnim);
    root._themeAnim = setTimeout(() => root.classList.remove('theme-anim'), 700);
    setTheme(next);
    syncShadeInputs(getComputedStyle(root).getPropertyValue('--paper').trim());
  });

  SHADE_PRESETS.forEach(([hex, name]) => {
    const swatch = document.createElement('button');
    swatch.className = 'shade-swatch';
    swatch.style.background = hex;
    swatch.title = name + ' ' + hex;
    swatch.setAttribute('aria-label', 'Use ' + name + ' ' + hex);
    swatch.addEventListener('click', () => applyShade(hex));
    $('shade-swatches').appendChild(swatch);
  });

  shadePicker.addEventListener('input', () => applyShade(shadePicker.value));
  shadeHex.addEventListener('input', () => {
    const hex = normalizeHex(shadeHex.value);
    shadeHex.classList.toggle('invalid', !hex);
    if (hex) applyShade(hex);
  });
  shadeHex.addEventListener('blur', () => {
    if (!normalizeHex(shadeHex.value)) syncShadeInputs(getComputedStyle(root).getPropertyValue('--paper').trim());
  });
  $('shade-reset').addEventListener('click', resetShade);

  const setPanel = (open) => {
    shadePanel.classList.toggle('open', open);
    shadeToggle.setAttribute('aria-expanded', String(open));
  };
  shadeToggle.addEventListener('click', (e) => { e.stopPropagation(); setPanel(!shadePanel.classList.contains('open')); });
  document.addEventListener('click', (e) => { if (!shadePanel.contains(e.target)) setPanel(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setPanel(false); });

  const { PROBLEMS, HW_PROBLEMS, XM_PROBLEMS } = window.SITE_QUESTIONS;
  const hwSpecial = (offset) => {
    if (!document.documentElement.classList.contains('hw')) return null;
    const c = localCalendarDay(offset);
    return c.m === 10 && HW_PROBLEMS[c.d] ? HW_PROBLEMS[c.d] : null;
  };

  const xmDayForced = (() => { const m = /[?&]xmday=(\d{1,2})/i.exec(location.search); return m ? parseInt(m[1], 10) : null; })();
  const xmSpecial = (offset) => {
    if (!document.documentElement.classList.contains('xm')) return null;
    let day;
    if (xmDayForced !== null) day = xmDayForced + (offset || 0);
    else {
      const c = localCalendarDay(offset);
      if (c.m !== 12) return null;
      day = c.d;
    }
    return XM_PROBLEMS[day] || null;
  };

  const doy = localDayOfYear();
  const problemIndex = doy % PROBLEMS.length;
  const hwToday = hwSpecial(0);
  const xmToday = xmSpecial(0);
  window.XM_PN = xmToday ? xmToday.n : 0;
  const problem = hwToday || xmToday || PROBLEMS[problemIndex];
  const todayKey = localDateKey();

  const SUP_DIGITS = { '\u2070': '0', '\u00B9': '1', '\u00B2': '2', '\u00B3': '3', '\u2074': '4', '\u2075': '5', '\u2076': '6', '\u2077': '7', '\u2078': '8', '\u2079': '9' };
const MATH_RE = /(^|[^A-Za-z0-9.\/])(?:([A-Za-z]|\d+)([\u2070\u00B9\u00B2\u00B3\u2074-\u2079]+)|(\d+|n)\/(\d+|n|\([^()]+\))(?![A-Za-z0-9\/]))/g;
function splitMath(text) {
  const parts = [];
  let last = 0, m;
  MATH_RE.lastIndex = 0;
  while ((m = MATH_RE.exec(text)) !== null) {
    const start = m.index + m[1].length;
    if (start > last) parts.push({ text: text.slice(last, start) });
    const raw = text.slice(start, m.index + m[0].length);
    let tex;
    if (m[2] !== undefined) {
      const exp = m[3].split('').map((c) => SUP_DIGITS[c]).join('');
      tex = m[2] + '^{' + exp + '}';
    } else {
      const den = m[5].charAt(0) === '(' ? m[5].slice(1, -1) : m[5];
      tex = '\\dfrac{' + m[4] + '}{' + den + '}';
    }
    parts.push({ text: raw, tex: tex });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
  function typesetMath(root) {
    if (!root || root.dataset.math === '1' || !window.katex) return;
    root.dataset.math = '1';
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const parts = splitMath(node.nodeValue);
      if (!parts.some((x) => x.tex !== undefined)) return;
      const frag = document.createDocumentFragment();
      parts.forEach((x) => {
        if (x.tex === undefined) { frag.appendChild(document.createTextNode(x.text)); return; }
        const span = document.createElement('span');
        span.className = 'math-inline';
        try { window.katex.render(x.tex, span, { throwOnError: true }); } catch (err) { span.className = ''; span.textContent = x.text; }
        frag.appendChild(span);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }
  function typesetAll() {
    ['problem-q', 'problem-a', 'yday-q', 'yday-a', 'hint-text'].forEach((id) => typesetMath(document.getElementById(id)));
  }

  document.getElementById('problem-q').innerHTML = problem.q;
  document.getElementById('problem-a').innerHTML = problem.a;
  document.getElementById('problem-modline').innerHTML =
    hwToday ? `Day ${doy} &middot; <span>halloween special</span>` : xmToday ? `${xmToday.tag} &middot; <span>${xmToday.lab}</span>` : `Day ${doy} mod ${PROBLEMS.length} = <span>${problemIndex}</span>`;
  const diffEl = document.getElementById('problem-diff');
  diffEl.textContent = problem.d;
  diffEl.className = 'diff-tag ' + problem.d;
  diffEl.title = 'difficulty: ' + problem.d;

  const ydayProblem = hwSpecial(-1) || xmSpecial(-1) || PROBLEMS[localDayOfYear(-1) % PROBLEMS.length];
  document.getElementById('yday-q').innerHTML = ydayProblem.q;
  document.getElementById('yday-a').innerHTML = ydayProblem.a;
  typesetAll();
  window.addEventListener('load', typesetAll);
  const ydayBtn = document.getElementById('yday-toggle');
  const ydayBox = document.getElementById('yday-box');
  ydayBtn.addEventListener('click', () => {
    const open = !ydayBox.classList.contains('open');
    ydayBox.classList.toggle('open', open);
    ydayBtn.setAttribute('aria-expanded', String(open));
  });

  (function setupDailyChallenge() {
    const STORE_KEY = 'y4sh_daily_challenge';
    const COOLDOWN_MS = 5 * 1000;

    const streakEl = document.getElementById('problem-streak');
    const feedbackEl = document.getElementById('daily-feedback');
    const attemptView = document.getElementById('daily-attempt-view');
    const solvedView = document.getElementById('daily-solved-view');
    const solvedBadge = document.getElementById('daily-solved-badge');
    const answerBox = document.getElementById('problem-answer');
    const giveUpBtn = document.getElementById('give-up-btn');
    const submitBtn = document.getElementById('calc-submit');
    const display = document.getElementById('calc-display');
    const memIndicator = document.getElementById('calc-mem-indicator');

    let storageOK = true;
    let data = { lastSolvedDate: null, streak: 0, totalSolved: 0, attempt: null, history: null, best: 0, hintDate: null, hinted: 0 };
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) data = Object.assign(data, JSON.parse(raw));
    } catch (err) {
      storageOK = false;
    }

    const DAY_MS = 86400000;
    const keyOf = (ms) => new Date(ms).toISOString().slice(0, 10);
    if (!data.history || typeof data.history !== 'object') {
      data.history = {};
      if (data.lastSolvedDate && data.streak > 0) {
        const end = Date.parse(data.lastSolvedDate + 'T00:00:00Z');
        for (let i = 0; i < data.streak; i++) data.history[keyOf(end - i * DAY_MS)] = 's';
      }
    }
    data.best = Math.max(data.best || 0, data.streak || 0);
    if (typeof data.badgesSeen !== 'number') data.badgesSeen = window.STREAK_BADGES.count(data.best);
    function pruneHistory() {
      const cutoff = keyOf(Date.parse(todayKey + 'T00:00:00Z') - 400 * DAY_MS);
      Object.keys(data.history).forEach((k) => { if (k < cutoff) delete data.history[k]; });
    }

    function save() {
      if (!storageOK) return;
      try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (err) {  }
    }

    if (streakEl) streakEl.addEventListener('click', (e) => {
      if (!e.target.closest || !e.target.closest('.share-streak')) return;
      if (window.openStreakCard) { window.openStreakCard({ streak: data.streak, total: data.totalSolved, best: data.best || data.streak }); return; }
      copyText(String.fromCodePoint(window.HW_ON ? 127875 : window.XM_ON ? 127876 : 128293) + ' ' + data.streak + '-day streak on the daily problem at y4sh.xyz');
    });

    function renderStreak(pops) {
      if (!streakEl) return;
      if (!storageOK) { streakEl.remove(); return; }
      const dayWord = data.totalSolved === 1 ? 'day' : 'days';
      const best = data.best > data.streak ? ` &middot; best ${data.best}` : '';
      const clean = data.hinted > 0 ? ` (${Math.max(0, data.totalSolved - data.hinted)} clean)` : '';
      const share = data.streak > 0 ? '<button type="button" class="share-streak" data-sfx="own" aria-label="Copy my streak to share">Share</button>' : '';
      streakEl.innerHTML = `<span class="flame">${hwFlame()} ${data.streak}-day streak</span> &middot; ${data.totalSolved} ${dayWord} solved${clean}${best}${share}`;
      renderHistory();
      renderBadges(pops || []);
    }

    function renderBadges(pops) {
      const box = document.getElementById('streak-badges');
      if (!box) return;
      if (!storageOK) { box.remove(); return; }
      const B = window.STREAK_BADGES;
      const earned = B.count(data.best);
      let html = `<div class="sb-head"><span>Badges</span><span>${earned} of ${B.tiers.length}</span></div><div class="sb-row">`;
      B.tiers.forEach((t, i) => {
        const ok = data.best >= t.n;
        const label = ok ? `${t.name}: ${t.blurb} Earned.` : `Locked. Reach a ${t.n}-day streak to earn this badge.`;
        html += `<button type="button" class="sb-badge${ok ? ' on' : ''}${pops.indexOf(i) >= 0 ? ' pop' : ''}" data-i="${i}" style="--bc:${t.pal.f}" aria-label="${label}" title="${label}">${B.svg(i, ok, 2)}</button>`;
      });
      html += '</div>';
      const next = B.tiers.find((t) => data.best < t.n);
      if (next) {
        const left = Math.max(1, next.n - data.streak);
        html += `<div class="sb-next">Next badge: ${next.name}, ${left} ${left === 1 ? 'day' : 'days'} to go.</div>`;
      } else {
        html += '<div class="sb-next">Every badge earned. Legend.</div>';
      }
      box.innerHTML = html;
    }

    const badgeBox = document.getElementById('streak-badges');
    if (badgeBox) badgeBox.addEventListener('click', (e) => {
      const b = e.target.closest && e.target.closest('.sb-badge');
      if (!b) return;
      showToast(b.getAttribute('aria-label'), 4200);
    });

    function renderHistory() {
      const box = document.getElementById('streak-history');
      if (!box) return;
      if (!storageOK) { box.remove(); return; }
      const WEEKS = 2;
      const todayMs = Date.parse(todayKey + 'T00:00:00Z');
      const dow = (new Date(todayMs).getUTCDay() + 6) % 7;
      const startMs = todayMs - (dow + (WEEKS - 1) * 7) * DAY_MS;
      let cells = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => `<span class="sh-day" aria-hidden="true">${d}</span>`).join(''), solved = 0;
      for (let i = 0; i < WEEKS * 7; i++) {
        const ms = startMs + i * DAY_MS, k = keyOf(ms), v = data.history[k];
        let cls = 'sh-cell', label = k;
        if (ms > todayMs) cls += ' future';
        else if (v === 's') { cls += ' s'; label += ': solved'; solved++; }
        else if (v === 'h') { cls += ' h'; label += ': solved with a hint'; solved++; }
        else if (v === 'g') { cls += ' g'; label += ': gave up'; }
        else label += ': no solve';
        if (k === todayKey) cls += ' today';
        cells += `<span class="${cls}" title="${label}"></span>`;
      }
      box.innerHTML =
        `<div class="sh-grid" role="img" aria-label="Last ${WEEKS} weeks: ${solved} days solved">${cells}</div>` +
        `<div class="sh-legend"><span><i style="background:var(--accent2)"></i>Solved</span>` +
        `<span><i style="background:var(--amber)"></i>Hint</span>` +
        `<span><i style="background:var(--danger);opacity:.85"></i>Gave up</span>` +
        `<span><i style="background:var(--graphite);opacity:.3"></i>Missed</span><span>Last ${WEEKS} weeks</span></div>`;
    }

    function showSolvedView(animate) {
      const hinted = data.hintDate === todayKey;
      solvedBadge.textContent = '\u2713 Solved for today' + (hinted ? ' (with a hint)' : '') + '. Come back tomorrow for a new one.';
      answerBox.classList.add('open');
      if (animate) swapView(attemptView, solvedView, 'block');
      else { attemptView.style.display = 'none'; solvedView.style.display = 'block'; }
    }

    function showGaveUpView(animate) {
      solvedBadge.textContent = 'Solution revealed. Your streak has been reset. Come back tomorrow for a new one.';
      answerBox.classList.add('open');
      if (animate) swapView(attemptView, solvedView, 'block');
      else { attemptView.style.display = 'none'; solvedView.style.display = 'block'; }
    }

    let entry = '0';
    let touched = false;
    let stored = null;
    let pendingOp = null;
    let overwrite = false;
    let memory = 0;

    const OP_SYMBOLS = { add: '+', subtract: '-', multiply: '&times;', divide: '&divide;' };

    function compute(a, op, b) {
      switch (op) {
        case 'add': return a + b;
        case 'subtract': return a - b;
        case 'multiply': return a * b;
        case 'divide': return b === 0 ? NaN : a / b;
        default: return b;
      }
    }

    function formatNumber(n) {
      if (!Number.isFinite(n)) return 'Error';

      const rounded = Math.round(n * 1e9) / 1e9;
      return String(rounded);
    }

    function renderCalc() {
      display.value = touched ? entry : '';
      memIndicator.classList.toggle('active', memory !== 0);
      const opIndicatorEl = document.getElementById('calc-op-indicator');
      opIndicatorEl.innerHTML = pendingOp ? OP_SYMBOLS[pendingOp] : '';
    }

    function pressDigit(d) {
      touched = true;
      if (overwrite || entry === '0') {
        entry = d;
        overwrite = false;
      } else {
        entry = entry + d;
      }
      if (entry.length > 14) entry = entry.slice(0, 14);
      renderCalc();
    }

    function pressDecimal() {
      touched = true;
      if (overwrite) {
        entry = '0.';
        overwrite = false;
      } else if (!entry.includes('.')) {
        entry = entry + '.';
      }
      renderCalc();
    }

    function pressOperator(op) {
      touched = true;
      const current = parseFloat(entry) || 0;
      if (stored !== null && pendingOp && !overwrite) {
        stored = compute(stored, pendingOp, current);
        entry = formatNumber(stored);
      } else {
        stored = current;
      }
      pendingOp = op;
      overwrite = true;
      renderCalc();
    }

    function pressEquals() {
      touched = true;
      if (pendingOp === null || stored === null) return;
      const current = parseFloat(entry) || 0;
      const result = compute(stored, pendingOp, current);
      entry = formatNumber(result);
      stored = null;
      pendingOp = null;
      overwrite = true;
      renderCalc();
    }

    function pressAction(action) {
      touched = true;
      const current = parseFloat(entry) || 0;
      if (action === 'sqrt') {
        entry = current < 0 ? 'Error' : formatNumber(Math.sqrt(current));
        overwrite = true;
      } else if (action === 'percent') {
        entry = formatNumber(current / 100);
        overwrite = true;
      } else if (action === 'sign') {
        entry = formatNumber(current * -1);
      } else if (action === 'mplus') {
        memory += current;
        overwrite = true;
      } else if (action === 'mminus') {
        memory -= current;
        overwrite = true;
      } else if (action === 'mr') {
        entry = formatNumber(memory);
        overwrite = true;
      } else if (action === 'mc') {
        memory = 0;
      } else if (action === 'c') {
        entry = '0';
        touched = false;
        overwrite = false;
      } else if (action === 'ac') {
        entry = '0';
        touched = false;
        stored = null;
        pendingOp = null;
        overwrite = false;
        memory = 0;
      }
      renderCalc();
    }

    function pressBackspace() {
      if (overwrite) return;
      entry = entry.length > 1 ? entry.slice(0, -1) : '0';
      if (entry === '-') entry = '0';
      touched = entry !== '0';
      renderCalc();
    }

    document.getElementById('calc-widget').addEventListener('click', (e) => {
      const btn = e.target.closest('.calc-btn');
      if (!btn) return;
      const action = btn.dataset.action;
      if (btn.dataset.digit !== undefined) {
        pressDigit(btn.dataset.digit);
      } else if (action === 'decimal') {
        pressDecimal();
      } else if (action === 'equals') {
        pressEquals();
      } else if (action === 'submit') {
        handleSubmit();
      } else if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
        pressOperator(action);
      } else if (action) {
        pressAction(action);
      }
    });

    const calcToggleBtn = document.getElementById('calc-toggle-btn');
    const calcGridWrap = document.getElementById('calc-grid-wrap');
    const calcToggleLabel = document.getElementById('calc-toggle-label');
    calcToggleBtn.addEventListener('click', () => {
      const isOpen = calcGridWrap.classList.toggle('open');
      calcToggleBtn.setAttribute('aria-expanded', String(isOpen));
      calcToggleLabel.textContent = isOpen ? 'Close calculator' : 'Open calculator';
      if (isOpen && document.activeElement === display) display.blur();
      if (isOpen) setTimeout(() => calcGridWrap.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 80);
    });

    const KEY_TO_OP = { '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide' };

    display.addEventListener('input', () => {
      let v = display.value.replace(/[^\d.]/g, '');
      const dot = v.indexOf('.');
      if (dot !== -1) v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, '');
      display.value = v;
      entry = v === '' ? '0' : v;
      touched = v !== '';
      overwrite = false;
    });

    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const typing = e.target === display;
      const open = calcGridWrap.classList.contains('open');
      if (!typing && !open) return;

      const key = e.key;
      const isNumKey = /^[0-9.]$/.test(key);

      if (typing && (isNumKey || key === 'Backspace')) {
        if (overwrite && isNumKey) {
          entry = '0';
          overwrite = false;
          display.value = '';
        }
        return;
      }

      if (key === 'Enter' && typing) {
        e.preventDefault();
        if (open && pendingOp !== null) pressEquals();
        else handleSubmit();
        return;
      }
      if (!open) return;

      if (/^[0-9]$/.test(key)) pressDigit(key);
      else if (key === '.') pressDecimal();
      else if (Object.prototype.hasOwnProperty.call(KEY_TO_OP, key)) pressOperator(KEY_TO_OP[key]);
      else if (key === 'Enter' || key === '=') pressEquals();
      else if (key === 'Backspace') pressBackspace();
      else if (key === 'Escape') pressAction('ac');
      else if (key === '%') pressAction('percent');
      else return;
      e.preventDefault();
    });

    function remainingCooldownMs() {
      if (!data.attempt || data.attempt.date !== todayKey || !data.attempt.lastWrongAt) return 0;
      return Math.max(0, COOLDOWN_MS - (Date.now() - data.attempt.lastWrongAt));
    }

    let cooldownTimer = null;
    function updateCooldownUI() {
      const remaining = remainingCooldownMs();
      if (remaining <= 0) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
        if (cooldownTimer) { clearInterval(cooldownTimer); cooldownTimer = null; }
        if (feedbackEl.classList.contains('wrong')) feedbackEl.textContent = 'Not quite. Have another go.';
        return;
      }
      submitBtn.disabled = true;
      const m = Math.floor(remaining / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      submitBtn.textContent = `Wait ${m}:${String(s).padStart(2, '0')}`;
      feedbackEl.className = 'daily-feedback wrong';
      feedbackEl.textContent = `Not quite. Try again in ${m}:${String(s).padStart(2, '0')}.`;
    }

    function handleSubmit() {
      if (remainingCooldownMs() > 0) return;
      const given = parseFloat(entry);
      if (Number.isNaN(given)) return;

      if (given === problem.answer) {
        const hinted = data.hintDate === todayKey;
        const wasYesterday = data.lastSolvedDate === localDateKey(-1);
        data.streak = wasYesterday ? data.streak + 1 : 1;
        data.totalSolved += 1;
        data.lastSolvedDate = todayKey;
        data.attempt = null;
        data.best = Math.max(data.best || 0, data.streak);
        const badgesNow = window.STREAK_BADGES.count(data.best);
        const newBadges = [];
        for (let bi = data.badgesSeen; bi < badgesNow; bi++) newBadges.push(bi);
        data.badgesSeen = Math.max(data.badgesSeen, badgesNow);
        if (hinted) data.hinted = (data.hinted || 0) + 1;
        data.history[todayKey] = hinted ? 'h' : 's';
        pruneHistory();
        save();
        renderStreak(newBadges);
        feedbackEl.className = 'daily-feedback correct';
        feedbackEl.textContent = hinted ? 'Correct (with a hint) \u2713' : 'Correct! \u2713';
        const r = submitBtn.getBoundingClientRect();
        sfx.play('success');
        burstConfetti(r.left + r.width / 2, r.top);
        if (newBadges.length) {
          const names = newBadges.map((bi) => window.STREAK_BADGES.tiers[bi].name).join(' and ');
          setTimeout(() => {
            sfx.play('badge');
            showToast(`Badge unlocked: ${names}!`, 5200);
            const el = document.querySelector('.sb-badge.pop');
            if (el) {
              const br = el.getBoundingClientRect();
              burstConfetti(br.left + br.width / 2, br.top + br.height / 2);
              el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
          }, 650);
        }
        const card = submitBtn.closest('.problem-card');
        if (card) { card.classList.remove('correct-pulse'); void card.offsetWidth; card.classList.add('correct-pulse'); setTimeout(() => card.classList.remove('correct-pulse'), 1500); }
        showSolvedView(true);
      } else {
        sfx.play('wrong');
        data.attempt = { date: todayKey, lastWrongAt: Date.now() };
        save();
        updateCooldownUI();
        if (!cooldownTimer) cooldownTimer = setInterval(updateCooldownUI, 1000);
      }
    }

    giveUpBtn.addEventListener('click', () => {
      data.streak = 0;
      data.attempt = null;
      data.history[todayKey] = 'g';
      pruneHistory();
      save();
      renderStreak();
      sfx.play('wrong');
      showGaveUpView(true);
    });

    const hintBtn = document.getElementById('hint-btn');
    const hintBox = document.getElementById('hint-box');
    const hintNote = document.getElementById('hint-note');
    document.getElementById('hint-text').innerHTML = problem.hint;
    typesetAll();
    function setHint(open) {
      const used = data.hintDate === todayKey;
      hintBox.classList.toggle('open', open);
      hintBtn.setAttribute('aria-expanded', String(open));
      hintBtn.textContent = open ? 'Hide hint' : used ? 'Show hint' : 'Struggling? Click here for a hint';
      hintNote.textContent = used ? 'Hint used. This solve will be marked amber on your streak log.' : 'Using a hint to solve a question marks it amber on your streak log.';
    }
    hintBtn.addEventListener('click', () => {
      const open = !hintBox.classList.contains('open');
      if (open && data.hintDate !== todayKey) { data.hintDate = todayKey; save(); }
      sfx.play(open ? 'hint' : 'click');
      setHint(open);
    });

    renderStreak();
    renderCalc();
    if (data.lastSolvedDate === todayKey) {
      showSolvedView(false);
    } else if (data.history[todayKey] === 'g') {
      showGaveUpView(false);
    } else {
      if (data.hintDate === todayKey) setHint(true);
      updateCooldownUI();
      if (remainingCooldownMs() > 0) cooldownTimer = setInterval(updateCooldownUI, 1000);
    }
  })();

  (function setupProbSim() {
    const questionBlock = document.getElementById('prob-question-block');
    const resultEl = document.getElementById('prob-result');
    const simEl = document.getElementById('prob-sim');
    const canvas = document.getElementById('earth-canvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('earth-slider');
    const playBtn = document.getElementById('earth-play');
    const nameEl = document.getElementById('earth-name');
    const timeEl = document.getElementById('earth-time');
    const descEl = document.getElementById('earth-desc');
    const factsEl = document.getElementById('earth-facts');
    [nameEl, timeEl, descEl, factsEl].forEach((e) => e.classList.add('txt-swap'));

    function todayFacts() {
      const now = new Date();
      const years = (now.getTime() - Date.UTC(2024, 6, 1)) / 31557600000;
      const pop = (8.162 + 0.069 * years).toFixed(2);
      const date = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      return date + ' \u00b7 roughly ' + pop + ' billion people (estimate)';
    }

    const EPOCHS = [
      { n: 'The Big Bang', t: '13.8 billion years ago', d: 'All space, time and energy erupt from a single point and begin to expand.', lava: 0, sea: 0.7, ice: 0, clump: 0, impact: 0, moon: 0, dist: 1.250, ocean: [14, 35, 70], land: [60, 30, 25], atmo: [255, 120, 40], cloud: 0, real: 0 },
      { n: 'Solar nebula', t: '4.6 billion years ago', d: 'A cloud of gas and dust collapses into a spinning disk around the young Sun.', lava: 0, sea: 0.7, ice: 0, clump: 0, impact: 0, moon: 0, dist: 1.250, ocean: [14, 35, 70], land: [60, 30, 25], atmo: [255, 120, 40], cloud: 0, real: 0 },
      { n: 'Molten Earth', t: '4.5 billion years ago', d: 'Rock melts under constant impacts. The whole surface is a glowing ocean of magma.', lava: 1, sea: -1, ice: 0, clump: 0, impact: 0, moon: 0, dist: 1.250, ocean: [14, 35, 70], land: [60, 30, 25], atmo: [255, 120, 40], cloud: 0.1, real: 0 },
      { n: 'Giant impact', t: '4.5 billion years ago', d: 'A Mars-sized planet called Theia smashes into the young Earth and throws out a ring of molten debris.', lava: 1, sea: -1, ice: 0, clump: 0, impact: 1, moon: 0, dist: 1.250, ocean: [14, 35, 70], land: [60, 30, 25], atmo: [255, 120, 40], cloud: 0.1, real: 0 },
      { n: 'The Moon forms', t: '4.4 billion years ago', d: 'The debris pulls together into the Moon, which orbits far closer than it does today.', lava: 0.7, sea: -1, ice: 0, clump: 0, impact: 0, moon: 1, dist: 1.250, ocean: [14, 35, 70], land: [60, 30, 25], atmo: [255, 120, 40], cloud: 0.1, real: 0 },
      { n: 'Late bombardment', t: '4.1 billion years ago', d: 'Asteroids and comets keep pounding the surface, and they may have delivered much of Earth\'s water.', lava: 0.3, sea: -1, ice: 0, clump: 0, impact: 0.6, moon: 1, dist: 1.317, ocean: [14, 35, 70], land: [75, 62, 58], atmo: [200, 125, 85], cloud: 0.25, real: 0 },
      { n: 'First oceans', t: '4.0 billion years ago', d: 'The crust cools, steam rains down for thousands of years, and the first oceans fill the basins.', lava: 0.1, sea: 0.74, ice: 0, clump: 0, impact: 0, moon: 1, dist: 1.373, ocean: [14, 35, 70], land: [75, 62, 58], atmo: [200, 125, 85], cloud: 0.35, real: 0 },
      { n: 'First life', t: '3.5 billion years ago', d: 'Simple microbes appear in the oceans. The air is still toxic and orange-brown.', lava: 0, sea: 0.7, ice: 0, clump: 0.15, impact: 0, moon: 1, dist: 1.429, ocean: [20, 80, 110], land: [112, 86, 60], atmo: [175, 130, 90], cloud: 0.3, real: 0 },
      { n: 'Oxygen revolution', t: '2.4 billion years ago', d: 'Microbes flood the air with oxygen and the sky turns blue for the first time.', lava: 0, sea: 0.64, ice: 0.05, clump: 0.3, impact: 0, moon: 1, dist: 1.474, ocean: [25, 95, 160], land: [112, 86, 60], atmo: [120, 170, 255], cloud: 0.4, real: 0 },
      { n: 'Rodinia', t: '1.1 billion years ago', d: 'The continents gather into the supercontinent Rodinia, with only simple life in the seas.', lava: 0, sea: 0.6, ice: 0.03, clump: 0.9, impact: 0, moon: 1, dist: 1.519, ocean: [22, 100, 170], land: [128, 122, 72], atmo: [120, 170, 255], cloud: 0.4, real: 0 },
      { n: 'Snowball Earth', t: '700 million years ago', d: 'Ice sheets spread to the equator and freeze almost the entire planet.', lava: 0, sea: 0.6, ice: 1, clump: 0.2, impact: 0, moon: 1, dist: 1.553, ocean: [40, 100, 150], land: [205, 215, 225], atmo: [150, 190, 255], cloud: 0.5, real: 0 },
      { n: 'Cambrian explosion', t: '540 million years ago', d: 'Life erupts into countless new forms, and animals with shells, eyes and legs appear.', lava: 0, sea: 0.6, ice: 0.05, clump: 0.35, impact: 0, moon: 1, dist: 1.586, ocean: [20, 105, 182], land: [128, 122, 72], atmo: [120, 170, 255], cloud: 0.4, real: 0 },
      { n: 'Plants reach land', t: '470 million years ago', d: 'The first plants creep out of the water, and the bare continents start to turn green.', lava: 0, sea: 0.6, ice: 0.04, clump: 0.5, impact: 0, moon: 1, dist: 1.598, ocean: [20, 105, 182], land: [96, 126, 70], atmo: [120, 170, 255], cloud: 0.45, real: 0 },
      { n: 'Carboniferous forests', t: '330 million years ago', d: 'Giant swampy forests cover the land, and the air is rich with oxygen. Insects grow enormous.', lava: 0, sea: 0.58, ice: 0, clump: 0.7, impact: 0, moon: 1, dist: 1.609, ocean: [20, 105, 182], land: [58, 120, 56], atmo: [120, 170, 255], cloud: 0.5, real: 0 },
      { n: 'Pangaea', t: '300 million years ago', d: 'All the land joins into one supercontinent surrounded by a single giant ocean.', lava: 0, sea: 0.57, ice: 0, clump: 1, impact: 0, moon: 1, dist: 1.614, ocean: [16, 105, 190], land: [140, 128, 76], atmo: [120, 170, 255], cloud: 0.45, real: 0 },
      { n: 'The Great Dying', t: '252 million years ago', d: 'Huge volcanic eruptions poison the air and oceans, and nearly all species die.', lava: 0.2, sea: 0.57, ice: 0, clump: 1, impact: 0, moon: 1, dist: 1.614, ocean: [16, 105, 190], land: [120, 95, 60], atmo: [205, 150, 70], cloud: 0.35, real: 0 },
      { n: 'Age of dinosaurs', t: '150 million years ago', d: 'Pangaea splits apart. The climate is warm, there are no ice caps, and dinosaurs rule.', lava: 0, sea: 0.57, ice: 0, clump: 0.5, impact: 0, moon: 1, dist: 1.620, ocean: [16, 105, 190], land: [70, 135, 60], atmo: [120, 170, 255], cloud: 0.5, real: 0 },
      { n: 'Dinosaurs end', t: '66 million years ago', d: 'An asteroid slams into the planet and ends the age of the dinosaurs.', lava: 0, sea: 0.57, ice: 0, clump: 0.4, impact: 1, moon: 1, dist: 1.620, ocean: [16, 105, 190], land: [70, 135, 60], atmo: [120, 170, 255], cloud: 0.5, real: 0 },
      { n: 'Ice age', t: '20 thousand years ago', d: 'Ice sheets bury the north, sea levels drop, and early humans spread across the world.', lava: 0, sea: 0.52, ice: 0.55, clump: 0, impact: 0, moon: 1, dist: 1.620, ocean: [16, 105, 190], land: [150, 152, 142], atmo: [120, 170, 255], cloud: 0.45, real: 0 },
      { n: 'Earth today', t: 'now', d: 'Seven continents, deep blue oceans, polar ice, and eight billion people.', lava: 0, sea: 0.55, ice: 0, clump: 0, impact: 0, moon: 1, dist: 1.620, ocean: [12, 84, 170], land: [84, 140, 70], atmo: [120, 170, 255], cloud: 0.3, real: 1 }
    ];
    const KEYS = ['lava', 'sea', 'ice', 'clump', 'impact', 'moon', 'dist', 'cloud', 'real'];
    const CKEYS = ['ocean', 'land', 'atmo'];
    const LAST = EPOCHS.length - 1;

    const MW = 512, MH = 256;
    let hmap = null, cmap = null, wmap = null;

    function hash(x, y, z) {
      let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    }
    function vnoise(x, y, z) {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
      const xf = x - xi, yf = y - yi, zf = z - zi;
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
      const l = (a, b, t) => a + (b - a) * t;
      return l(
        l(l(hash(xi, yi, zi), hash(xi + 1, yi, zi), u), l(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u), v),
        l(l(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u), l(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u), v),
        w
      );
    }
    function fbm(x, y, z, oct) {
      let a = 0.5, s = 0, f = 1;
      for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, y * f, z * f); f *= 2.05; a *= 0.5; }
      return s;
    }
    function buildMaps() {
      if (hmap) return;
      hmap = new Float32Array(MW * MH);
      cmap = new Float32Array(MW * MH);
      wmap = new Float32Array(MW * MH);
      for (let j = 0; j < MH; j++) {
        const lat = (0.5 - (j + 0.5) / MH) * Math.PI;
        const cl = Math.cos(lat), sl = Math.sin(lat);
        for (let i = 0; i < MW; i++) {
          const lon = ((i + 0.5) / MW - 0.5) * Math.PI * 2;
          const x = Math.sin(lon) * cl, y = sl, z = Math.cos(lon) * cl;
          const k = j * MW + i;
          hmap[k] = fbm(x * 1.7 + 11, y * 1.7 + 5, z * 1.7 + 3, 5);
          cmap[k] = Math.abs(fbm(x * 3.2 + 40, y * 3.2 + 7, z * 3.2 + 9, 3) - 0.5);
          wmap[k] = fbm(x * 2.6 + 90, y * 2.6 + 30, z * 2.6 + 70, 4);
        }
      }
      buildReal();
    }

    const GEO_LAND = [[-168,65.6,-166,68.4,-162,70.3,-156.5,71.3,-152,70.8,-146,70.2,-141,69.7,-135,69.2,-130,70.2,-125,69.6,-120,69.5,-115,68,-110,68,-106,68.7,-102,67.5,-98,68,-96,68.3,-94,71.8,-91.5,69.5,-88,68.2,-84,69.5,-82,68,-86,66.5,-86,64.5,-90.7,63.5,-93.5,61,-94.2,59,-92.5,57.2,-88,56.5,-85,55.3,-82.3,55.1,-82.3,53,-80.5,51.5,-79.5,51.3,-79,52.5,-78.8,54.5,-77,56,-76.5,58,-78,60,-77.5,62.3,-74.5,62.2,-72,61.2,-70,61,-69.5,59.5,-68,58.5,-65,60.2,-62,58,-61,56,-58,54,-56,52.2,-57,51.2,-60,50.3,-64,50.2,-66.5,49.3,-68.5,48.5,-67,49,-65,48.8,-64.8,47.5,-64.8,46.2,-63.5,46.2,-61.2,45.8,-60,46.2,-60.3,45.3,-63,44.5,-65.8,43.5,-66,43.7,-67,44.5,-69,44,-70.3,43.6,-70.8,42.8,-70.5,41.8,-71.5,41.4,-73.9,40.6,-74.1,39.7,-75.5,38.3,-75.8,37.2,-75.9,36.9,-75.5,35.3,-77,34.6,-78.5,33.8,-80.5,32.2,-81.4,30.7,-81,29,-80.3,27,-80.1,25.8,-80.5,25.2,-81.2,25.2,-81.9,26.5,-82.7,27.8,-82.7,29,-83.5,29.9,-84.5,30,-85.5,29.7,-87,30.4,-88.5,30.3,-89.5,30.2,-89.3,29,-90.5,29.1,-91.8,29.5,-93.8,29.7,-95.2,28.8,-96.7,28,-97.4,26.8,-97.3,25,-97.8,22.5,-97.3,20.8,-96.2,19.2,-95.2,18.5,-94.5,18.2,-92,18.5,-91,19,-90.4,20,-90.3,21.1,-88,21.5,-86.8,21,-87.5,19.5,-87.7,18.3,-88.2,16.5,-88.7,15.8,-87.5,15.8,-85.5,15.9,-83.5,15.2,-83.3,13,-83.7,11.2,-82.5,9.8,-81,9,-79.5,9.6,-78,9.3,-77.4,8.6,-77.3,7.8,-78,7.5,-79.5,7.3,-80.5,7.3,-81.8,8,-83,8.3,-84,9,-85.5,10,-85.7,11,-87.5,13,-89,13.5,-91.5,14,-92.8,15,-94.5,16.2,-96.5,15.7,-98.5,16.4,-101,17.3,-102.5,18,-104.5,19.2,-105.5,20.5,-105.3,22,-106.5,23.3,-108,25,-109.5,26.5,-111,28,-112.5,29.5,-113.5,31,-114.7,31.7,-114.7,30,-113.5,28.5,-112.3,27,-111,25,-110,23.5,-109.5,23,-110.3,23.2,-111.7,24.5,-112.2,25.5,-113,26.5,-114.2,27.8,-115.2,29,-116.3,30.5,-117.1,32.5,-117.5,33.3,-118.5,34,-120.5,34.5,-121.8,36.6,-122.5,37.7,-123.8,39.5,-124.3,40.5,-124.2,42.5,-124,44.5,-124,46.3,-124.5,48.3,-123,48.3,-123.2,49.2,-124.8,49.9,-126,50.7,-127.5,51,-128.5,52.5,-130,54.3,-131.5,55.5,-133,57,-135.3,58.5,-137.5,59,-140,59.8,-144,60,-147,60.7,-150,59.6,-152.5,59,-154,58.5,-156.5,57,-159.5,55.8,-162.5,55,-164.5,54.6,-163,55.5,-160,56.3,-158.5,57.5,-157.5,58.7,-158.5,58.8,-161.5,58.6,-162,60,-164.5,60.7,-165.5,62.4,-163.5,63.2,-161,63.6,-161,64.5,-165,64.5],
      [-77.3,7.8,-76,9,-75.5,10.8,-72,12,-71.5,10.8,-70,12,-68,10.6,-64,10.6,-62,10.7,-60.5,8.5,-58,6.5,-55,5.8,-52,5,-50,1.5,-50,0,-48,-1,-44.5,-2.5,-40,-2.8,-37,-4.8,-35,-5.5,-34.8,-8,-37,-11.5,-39,-14,-39,-18,-40.5,-21,-42,-23,-45,-23.7,-48,-26,-48.5,-28.5,-51,-31,-53.5,-34.2,-55,-35,-57,-34.5,-58,-34.2,-57,-36.5,-57.5,-38,-62,-39,-62.5,-41,-65,-41,-65,-45,-67.5,-46.5,-66,-48,-69,-51,-68.4,-52.4,-65,-54.8,-68,-55.5,-72,-54,-74,-52,-75.5,-48,-74,-44,-73.6,-40,-73.4,-37,-72,-33,-71.5,-30,-70.3,-25,-70.2,-19,-72,-17,-75,-15,-76.5,-13.5,-78.5,-10,-81,-6,-81,-4.5,-80,-2.5,-80,-1,-80,0.8,-78.8,1.8,-77.5,4,-77.3,6.5],
      [-9,37,-8.8,38.7,-9.4,39.4,-8.8,41.5,-9.2,43,-8,43.7,-4,43.5,-1.8,43.4,-1.3,44.5,-1.2,46,-2.5,47.3,-4.7,48,-4.5,48.7,-1.6,48.6,-1.3,49.6,0.2,49.5,1.6,50.9,3.5,51.4,4.5,52.5,5,53.3,7,53.5,8.6,53.9,8.6,55.5,8.1,56.8,10.5,57.7,10.5,56.5,9.8,55.5,10.9,54.3,13,54.4,14.2,53.9,16.5,54.5,18.7,54.7,19.5,54.4,21,55.2,21.1,56.8,22,57.6,23.5,57,24.4,57.3,24.4,58.4,23.5,59.2,25.5,59.5,28,59.5,30.2,59.9,28,60.5,25,60.3,22.5,60,21.4,61,21.3,62.7,22.5,64,25,65,25.4,65.3,23.5,65.8,21.5,65.2,21,64.2,19,63.1,17.5,62.2,17.3,61,17.2,60.4,18.7,59.8,18.1,58.7,16.7,57.5,16.4,56.5,14.3,55.5,13,55.4,12.8,56.2,12.2,57.2,11.7,58.4,11.2,59,10.5,59.3,9,58.7,7.2,58.1,5.7,58.6,5.2,59.5,5,61,5.2,62,7,62.9,8.5,63.5,11,64.8,12.5,66,14,67.3,15,68.2,17.5,69.4,19.5,70,23,70.6,26,71,28.5,71,31.2,70.3,33,69.6,36,69,41,67.2,43,66.5,44.5,68.3,46,68,49,68.2,53,68.5,57,68.7,60,69,63,69.5,66,69.3,67.5,70.5,68.5,72.2,71,73,72.5,72.8,73.5,71,75,72,79,72.2,81,73.4,86,74,88,75,95,76,100,76.2,104,77.6,107,77,111,76.3,113,75.5,112.5,74.3,118,73.5,123,73,128,72.5,130,71,133,71.5,140,72.8,145,72.4,150,71.5,156,71,160,70,165,69.7,170,70,175,69.8,180,69.2,185,69,190,66.5,187,64.3,182,64.6,179.5,62.7,177,62.4,174,61.7,170,60,166,60,164,59.3,163,57.8,162.5,56,163,55,160,53,158.5,52,156.8,51,155.7,54,156.3,57,158,58.5,160,61.5,157,61.7,154,59.5,150,59.3,143,59.3,140,57.5,137.5,54.5,140.5,53.5,141.5,52,141.2,49.5,140,47.5,138,46,135.5,43.7,133,42.7,131,42.5,130.5,42,129.5,40.8,127.5,39.5,128.5,38.2,129.4,36.5,129.2,35.2,127.5,34.6,126.4,34.5,126.5,36.5,126.8,37.6,125.2,37.7,125.3,39.5,124.5,39.8,122,39,121.2,38.8,121.6,40.5,120,40,118.5,39.2,117.7,38.5,118.8,37.4,120.8,37.8,122.5,37.2,120.8,36.5,119.5,35.2,120.5,34,121.8,31.8,121.8,30.8,122,29.5,121,28,120,26.5,119,25,117,23.5,115,22.7,113.5,22.2,111,21.5,110.5,20.3,109.8,21.3,108,21.5,106.7,20.3,105.7,19,106.5,18,108,16,108.8,15,109.3,12.5,109,11.5,107.5,10.5,106.5,9.8,105,8.7,104.8,10.2,103.5,10.7,102.5,12,101,12.7,100.5,13.4,99.8,12.2,99.2,10.5,100,8.5,100.5,7,101.5,6.5,102.6,5.2,103.5,3.5,103.8,2,103.3,1.4,102,2.3,101,3.3,100.5,5,100.2,6.3,99.5,7.5,98.5,8.5,98.2,10.2,98.7,12.5,98,14.5,97.5,16.5,96.2,16.8,95.2,15.8,94.4,16.5,94.2,18.5,93.5,19.8,92.3,21,91.8,22.3,90.5,22.2,89,21.8,87,21.5,86.5,20,85,19.5,83.5,18,82,16.8,81,15.8,80.2,15,80.2,13,79.9,11.5,79.8,10.3,79,9.3,78.2,8.8,77.5,8.1,76.5,9.5,75.7,11.5,74.8,13,74.2,15,73.4,17,72.8,19.5,72.7,21.5,72,21,70.8,20.8,69.2,22.2,70.2,22.9,68.5,23.7,67.2,24.5,66.5,25.3,64,25.2,61.6,25.2,59.5,25.4,57.4,25.8,56.8,27,54.5,26.6,52.5,27.5,51,28.8,50,30,48.8,30.1,48,29.8,48.4,28.5,49.6,27,50.5,26,50.8,24.8,51.6,24.2,51.5,25.3,52,24,54,24.2,55.5,25.5,56.3,26.3,56.6,24.8,57.5,23.8,58.8,23.5,59.8,22.3,58.7,20.5,57.8,19,55.5,17.6,52.3,16.3,49,14.4,45.5,13,43.5,12.7,42.8,14.8,42,16.5,40.8,19,39.2,21.4,37.5,24.3,35.3,27.5,35,28.5,34.9,29.5,34.3,31.2,35,33,35.9,35,36.2,36.6,35.5,36.7,34.7,36.8,33,36.1,32,36.2,30.6,36.6,29.3,36.3,28,36.7,27.3,37.1,26.4,38.3,26.8,39.4,26.2,40,26,40.8,24.7,40.9,23.8,40.3,23.2,40.2,22.7,40.3,22.9,39.4,23.6,38.4,24,38,23.1,37.6,23.2,36.5,22.4,36.6,21.7,37,21.1,38.4,20.3,39.5,19.4,40.4,19.5,41.7,18.7,42.4,17.5,43,15.8,43.7,15,44.5,14.3,45.2,13.7,45.6,12.3,45.3,12.3,44.5,13.6,43.5,14.5,42.2,16,41.9,16.8,41.2,18.4,40.3,18.5,40.1,17.3,40.4,16.7,39.7,17.1,38.95,16.5,38.4,16,37.95,15.7,38.4,16,39.5,15.7,40,14.9,40.2,14.2,40.8,13.2,41.2,12,42,11,42.6,10.3,43.5,9,44.3,8,43.8,7,43.5,5.5,43.2,4,43.5,3.1,43,3.2,42,2.3,41.5,0.8,41,0,40,-0.3,39.3,0.2,38.7,-0.7,37.8,-1.7,36.8,-2.5,36.7,-4.4,36.6,-5.3,36,-6.3,36.7,-7.4,37.2],
      [32.6,29.9,33.6,27.8,34.8,25.5,36,23,37.2,21,37.5,18.8,38.6,17.8,39.5,15.5,41,14,42.7,13,43.3,11.8,45,10.7,47.5,11.2,49.5,11.5,51.2,11.8,51,10.4,50.8,8.5,49.8,6.5,48.5,5,47.5,4,46,2.5,44,1,42.5,-0.5,41.5,-1.8,40.3,-2.7,39.2,-4.6,39.3,-6.3,39.6,-8.5,40.5,-10.5,40.6,-12.5,40.7,-14.5,39.2,-16.5,37,-17.8,35,-19.5,34.8,-20.5,35.5,-22.5,35.5,-24,33,-25.5,32.9,-26.8,32.8,-28.5,31.5,-29.8,30,-31.2,28.5,-32.5,26.5,-33.7,25.3,-34,23,-34,21,-34.5,20,-34.8,18.6,-34.2,18.3,-33,17.8,-31.5,16.8,-29,15.5,-27.2,14.8,-25,14.5,-22.8,13.2,-20.5,12,-18,11.8,-16.5,12.5,-14,13.6,-11.5,13.2,-9,12.4,-6.5,12.2,-5,11.8,-4,10,-2.2,9.2,-0.5,9.5,1.5,9.8,3.3,9.5,4,8.3,4.5,7,4.4,6,4.3,5,5.3,4.5,6.2,2.5,6.3,0.5,5.8,-1.5,5,-3,5.1,-5,5.1,-7.5,4.4,-8.5,4.8,-10,5.8,-11.5,6.9,-13,8.4,-13.5,9.5,-14.7,10.8,-16.5,12.2,-16.8,13.6,-17.5,14.7,-16.8,16,-16.2,18,-16.3,19.8,-17,21,-16,23.7,-14.8,25.3,-13.2,27.3,-11.5,28.3,-10,29.8,-9.7,31,-9.2,32.3,-8,33.3,-6.8,34,-5.9,35.6,-3,35.3,-1,35.5,1,36.5,3,36.8,5,36.8,7.5,37,9.7,37.3,10.7,37,11,36.5,10.3,35.5,10.1,34.4,11,33.2,12.5,32.8,15,32.4,15.8,31.5,18.5,30.3,19.5,30.3,20.2,31.8,21.5,32.8,23,32.6,25,31.8,27,31.3,29,30.9,31,31.6,32.3,31.3,34.2,31.3,34.9,29.5,34.6,28,34.2,27.8,33.6,28.5,32.9,29.8],
      [113.5,-22,114,-26,115,-34.3,117.5,-35.1,121,-33.9,124,-33.8,126.5,-32.3,129,-31.6,131.5,-31.5,134,-32.7,135.5,-34.7,137.8,-33,138.5,-35.5,139.8,-37.3,141.5,-38.3,144,-38.3,146.3,-39.1,148.2,-37.8,150,-37.3,151.2,-34,153,-31,153.6,-28.5,153,-25.5,150.8,-22.8,149,-20.2,146.3,-18.8,145.3,-15,143.5,-14,142.5,-10.7,141.5,-13,141.5,-16,139.5,-17.5,137,-15.8,135.5,-15,136.8,-12.2,132.5,-11.5,130,-13,129.3,-14.9,127,-14,125,-15,123,-17,121.5,-19.5,119,-20,116.5,-20.8,114,-22],
      [-180,-90,-180,-78,-160,-77.5,-150,-76,-130,-74,-110,-74.5,-100,-73,-80,-73.5,-76,-72,-72,-70,-68,-66,-62,-64,-57,-63.3,-58,-64.7,-61,-66,-62,-69,-61,-72,-60,-75,-50,-77.5,-40,-78,-30,-77,-20,-73,-5,-70.5,10,-69.5,25,-70,40,-68,55,-67,68,-67.5,72,-69.5,78,-68,90,-66,110,-66.5,130,-66,145,-67.5,160,-70.5,165,-74,170,-77,180,-78.5,180,-90],
      [-73,78,-58,82,-30,83.5,-20,81,-18,77,-20,72,-22,70,-27,68,-35,66,-40,65,-43,60,-48,61,-51,64,-53,67,-55,70,-58,75.5,-68,76.5],
      [-59,47.7,-56,51.5,-55.5,51.3,-53,47,-53,46.7,-57,47.5],
      [-85,22,-82,23.2,-77,21.8,-74.2,20.3,-77.5,19.9,-80,21.8],
      [-74.4,19.8,-72,19.9,-68.4,18.6,-71,17.8,-74.4,18.4],
      [-90,73,-80,73.8,-72,71.5,-67,69,-62,66.5,-64,63,-68,62.5,-72,64,-78,64.8,-73,67.5,-80,69.5,-88,70.5],
      [-118,70,-105,69.5,-101,70,-104,73,-113,73,-118,72],
      [-90,77,-80,76,-75,79,-65,82,-80,83,-95,81],
      [-92,75,-82,74.5,-80,76,-90,76.5],
      [-125,72,-117,72,-117,74.5,-124,74.5],
      [-24,65.5,-22,66.4,-16,66.5,-13.5,65,-18,63.4,-22,63.8],
      [-5.7,50,1.3,51.2,1.7,52.7,0,53.5,-1.5,55,-2,57,-3,58.6,-5,58.6,-6,57,-5.5,56,-4.8,55,-3,54.8,-3,53.4,-4.5,53.3,-4.2,52,-5.2,51.7,-3,51.4,-4.5,51],
      [-10,51.7,-6,52.2,-6,54,-5.5,54.7,-7.5,55.3,-10,54,-9.5,53,-10.3,52.3],
      [12.4,38,15.6,38.3,15.1,36.7,12.5,37.6],
      [8.2,41,9.7,41,9.6,39.2,8.5,39],
      [8.6,42.3,9.5,43,9.4,41.4],
      [23.5,35.4,26.2,35.2,24,35],
      [32.3,35,34.5,35.6,33.5,34.7],
      [11,79,20,80.5,27,80,18,77.5],
      [51.5,71,57,70.7,68,76.8,60,76.5],
      [142,54,143.5,53,143,50,142.5,47,142,46,141.8,49,142,52],
      [130.9,34,132,35.5,135,35.7,137,37,139.5,38,140,40.5,141.5,41.4,142,39.5,141,37,140.8,35.7,139.8,35,138,34.6,136.8,34.3,135.2,33.6,135,34.6,133,34.2,131,33.9],
      [140,41.5,140.5,43,141.7,45.4,145.5,43.5,143.2,42,141,42.5],
      [129.7,33,131,34,132,33,131.3,31.3,130.2,31.2],
      [132.5,33.5,134.5,34.2,134.2,33.2,133,32.8],
      [120.2,22.5,121,25.2,122,25,121.5,22],
      [108.7,19.2,110,20,111,19.6,109.5,18.2],
      [79.8,9.5,80.8,9,81.8,7.5,81,6,80,6.2,79.7,8],
      [120,18.5,122.2,18.3,122,16,124,13.5,122,13.8,120.6,14.2,120,16],
      [122,7.5,123.5,8.5,126,9,126.5,7,125.5,5.8,124,6.5],
      [121,13,123,13.2,123.5,10.5,122.5,9.5,121.5,11],
      [124.5,12.5,125.7,11.5,125,10,124.3,11],
      [95.3,5.5,98,4,100,2,104,-1,106,-3,105.8,-5.8,104.5,-5.8,101,-3,99,-0.5,97,2.5],
      [105.2,-6.8,106.5,-6,108.5,-6.5,111,-6.5,114.5,-7.8,114.4,-8.7,110,-8.2,106,-7.4],
      [109,2,111,1.5,113,3.2,115.5,5.2,117,7,119,5.2,118,2,117.8,1,116.5,-1.5,116.2,-3.8,114.5,-4,111.5,-3.3,110.2,-2.5,109,-0.5],
      [119.8,0.8,121,1.3,124.8,1.5,125,1,123,0.7,121.5,0.3,122,-1,123.3,-0.8,121.8,-2.2,122.3,-4.5,121,-4.8,120.4,-5.5,120.3,-3,119.5,-3.5,118.8,-2.5,119.5,0],
      [131,-0.8,133,-0.7,134.5,-1.3,135.5,-3.3,137.5,-1.5,141,-2.6,144.5,-3.8,146,-5.5,147.5,-6.2,148.5,-8.2,150.5,-10.4,147.5,-10.2,145,-8,143.5,-8.5,141.5,-9.2,139,-8.2,138,-7.5,138.2,-5.5,135.5,-4.4,133,-4,132,-2.7],
      [144.7,-40.8,148.3,-40.9,148,-43,146.2,-43.6,145.2,-42],
      [172.7,-34.5,174.5,-36.5,176,-37.5,178.5,-37.7,177,-39.5,175.2,-41.5,174.8,-41,174.7,-39.5,173.8,-39.3,174.5,-37.2],
      [172.7,-40.5,174.3,-41.5,173,-43.5,171,-44.5,169,-46.6,166.5,-46,168.5,-44,170.8,-42.5,172,-41],
      [49.3,-12.1,50.4,-15.4,49.4,-18,47.3,-24.5,45,-25.5,43.6,-22.5,44.4,-19,44,-16.5,46,-15.7,48,-13.5]];
    const GEO_WATER = [[28,41.5,28.5,43.8,30,45.3,31.5,46.5,33.5,46,32.7,45.4,33.6,44.4,35.5,45.1,36.6,45.3,37.8,47,39,47,38.5,45,40,43.5,41.6,41.6,38,41,35,42,31,41.2,29.2,41.2],
      [47.5,43,47,45,49,46.5,51.5,47,53,46.5,53,45,50.8,44.5,50.2,43.2,51.3,41.5,53,40,53.8,38,54,37,51,36.7,49,37.5,49.5,40.5,48.5,42],
      [-92,46.8,-89,48,-85,48.7,-84.5,47,-87,46.5],
      [-88,42.5,-87.5,45.8,-86,46,-85,45,-86.5,43],
      [-84.5,46,-82,46,-80,44.5,-81.7,43.2,-83.5,43.7,-84,45]];
    let rmap = null, bmap = null, imap = null;
    const BIOME_STOPS = [
      [0, [30, 104, 48]], [10, [58, 120, 52]], [18, [110, 140, 62]], [28, [148, 146, 84]],
      [38, [86, 132, 62]], [50, [60, 112, 62]], [60, [44, 94, 62]], [67, [92, 112, 88]],
      [74, [150, 160, 160]], [90, [178, 186, 188]]
    ];

    function smooth(a, b, x) { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
    function boxw(lon, lat, l0, l1, b0, b1, s) {
      return smooth(l0 - s, l0 + s, lon) * (1 - smooth(l1 - s, l1 + s, lon)) * smooth(b0 - s, b0 + s, lat) * (1 - smooth(b1 - s, b1 + s, lat));
    }

    function buildReal() {
      const c = document.createElement('canvas');
      c.width = MW; c.height = MH;
      const g = c.getContext('2d');
      g.fillStyle = '#000'; g.fillRect(0, 0, MW, MH);
      const X = (lon) => (lon + 180) / 360 * MW, Y = (lat) => (90 - lat) / 180 * MH;
      const poly = (p, dx) => {
        g.beginPath();
        for (let i = 0; i < p.length; i += 2) {
          const x = X(p[i] + dx), y = Y(p[i + 1]);
          if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.closePath(); g.fill();
      };
      g.fillStyle = '#fff';
      GEO_LAND.forEach((p) => { poly(p, 0); poly(p, -360); });
      g.fillStyle = '#000';
      GEO_WATER.forEach((p) => poly(p, 0));
      const d = g.getImageData(0, 0, MW, MH).data;
      let a = new Float32Array(MW * MH), b = new Float32Array(MW * MH);
      for (let i = 0; i < a.length; i++) a[i] = d[i * 4] / 255;
      for (let pass = 0; pass < 2; pass++) {
        for (let j = 0; j < MH; j++) for (let i = 0; i < MW; i++) {
          const l = (i + MW - 1) % MW, r = (i + 1) % MW;
          b[j * MW + i] = (a[j * MW + l] + a[j * MW + i] * 2 + a[j * MW + r]) / 4;
        }
        for (let j = 0; j < MH; j++) for (let i = 0; i < MW; i++) {
          const u = Math.max(0, j - 1), w = Math.min(MH - 1, j + 1);
          a[j * MW + i] = (b[u * MW + i] + b[j * MW + i] * 2 + b[w * MW + i]) / 4;
        }
      }
      rmap = new Float32Array(MW * MH);
      bmap = new Uint8Array(MW * MH * 3);
      imap = new Float32Array(MW * MH);
      for (let j = 0; j < MH; j++) {
        const lat = 90 - (j + 0.5) / MH * 180, alat = Math.abs(lat);
        for (let i = 0; i < MW; i++) {
          const lon = (i + 0.5) / MW * 360 - 180;
          const k = j * MW + i;
          const m = a[k];
          rmap[k] = 0.55 + (m - 0.5) * 0.7 + (hmap[k] - 0.5) * 0.1;
          const la = Math.max(0, Math.min(90, alat + (wmap[k] - 0.5) * 10));
          let col = BIOME_STOPS[BIOME_STOPS.length - 1][1];
          for (let q = 0; q < BIOME_STOPS.length - 1; q++) {
            const s0 = BIOME_STOPS[q], s1 = BIOME_STOPS[q + 1];
            if (la <= s1[0]) {
              const t = (la - s0[0]) / (s1[0] - s0[0]);
              col = [s0[1][0] + (s1[1][0] - s0[1][0]) * t, s0[1][1] + (s1[1][1] - s0[1][1]) * t, s0[1][2] + (s1[1][2] - s0[1][2]) * t];
              break;
            }
          }
          const mixc = (t, c2) => { col = [col[0] + (c2[0] - col[0]) * t, col[1] + (c2[1] - col[1]) * t, col[2] + (c2[2] - col[2]) * t]; };
          const nz = wmap[k], nz2 = cmap[k];
          const sand = [216, 184, 124], red = [196, 138, 84], dry = [176, 158, 112];
          mixc(boxw(lon, lat, -17, 36, 14.5, 31, 3) * (0.8 + 0.4 * nz), sand);
          mixc(boxw(lon, lat, 36, 58, 15.5, 30, 3) * (0.85 + 0.3 * nz), sand);
          mixc(boxw(lon, lat, 38, 51.5, -1, 12, 2.5) * 0.7, dry);
          mixc(boxw(lon, lat, 14, 26, -29, -17, 2.5) * 0.8, red);
          mixc(boxw(lon, lat, 118, 141, -31, -19, 3) * (0.8 + 0.4 * nz), red);
          mixc(boxw(lon, lat, -118, -105, 29, 37, 2.5) * 0.75, dry);
          mixc(boxw(lon, lat, -71.5, -68, -28, -18, 1.5) * 0.9, dry);
          mixc(boxw(lon, lat, -72, -65, -50, -38, 2.5) * 0.55, dry);
          mixc(boxw(lon, lat, 52, 66, 28, 41, 3) * 0.65, dry);
          mixc(boxw(lon, lat, 68, 75, 24, 30, 2) * 0.7, dry);
          mixc(boxw(lon, lat, 78, 90, 37.5, 41.5, 2) * 0.8, dry);
          mixc(boxw(lon, lat, 90, 113, 38, 46.5, 3) * 0.75, dry);
          mixc(boxw(lon, lat, 78, 100, 28, 36, 2.5) * 0.85, [150, 138, 120]);
          mixc(boxw(lon, lat, -114, -104, 36, 52, 3) * 0.35, [112, 112, 90]);
          mixc(boxw(lon, lat, -80, -66, -35, 8, 1.5) * 0.25 * boxw(lon, lat, -80, -68, -35, 8, 1), [130, 118, 100]);
          mixc(boxw(lon, lat, -73, -50, -11, 3, 3) * 0.9, [22, 88, 44]);
          mixc(boxw(lon, lat, 12, 29, -5, 4.5, 3) * 0.9, [22, 88, 44]);
          mixc(boxw(lon, lat, 95, 141, -9, 8, 2.5) * 0.9, [24, 96, 46]);
          const v = 0.9 + 0.2 * nz2 * 2;
          bmap[k * 3] = Math.min(255, col[0] * v); bmap[k * 3 + 1] = Math.min(255, col[1] * v); bmap[k * 3 + 2] = Math.min(255, col[2] * v);
          let ice = 0;
          if (m > 0.5) {
            if (lat < -64) ice = 1;
            else if (lat > 66.5 && lon > -75 && lon < -11) ice = 1;
            else if (lat > 59 && lat <= 66.5 && lon > -55 && lon < -35) ice = 1;
            else if (lat > 76) ice = 0.55;
            else if (lat > 66 && lat <= 76) ice = 0.12 * nz;
          } else {
            if (lat < 0) ice = 0.85 * smooth(63, 70, alat);
            else ice = 0.9 * smooth(75, 82, alat);
          }
          imap[k] = ice;
        }
      }
    }

    const RES = 216;
    const off = document.createElement('canvas');
    off.width = RES; off.height = RES;
    const octx = off.getContext('2d');
    const img = octx.createImageData(RES, RES);
    const px = img.data;
    const LX = -0.5, LY = 0.4, LZ = 0.76;
    const LN = Math.sqrt(LX * LX + LY * LY + LZ * LZ);
    const PDX = Math.sin(0.9), PDZ = Math.cos(0.9);

    const stars = [];
    for (let i = 0; i < 90; i++) stars.push([Math.random(), Math.random(), Math.random() * 1.2 + 0.3, Math.random()]);
    const dust = [];
    for (let i = 0; i < 320; i++) dust.push({ a: Math.random() * 6.2832, r: Math.pow(Math.random(), 0.7), s: Math.random() * 1.6 + 0.4, o: Math.random() });

    let u = 0, rotY = 0.6, tilt = 0.35, dragging = false, lx = 0, ly = 0;
    let target = null, running = false, raf = 0, last = 0, playing = false, W = 0, H = 0, shown = -1;

    function sm(a, b, x) { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
    function mix(a, b, t) { return a + (b - a) * t; }
    function mixv(A, B, t) { return [mix(A[0], B[0], t), mix(A[1], B[1], t), mix(A[2], B[2], t)]; }

    function size() {
      const r = canvas.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.max(2, Math.round(W * d));
      canvas.height = Math.max(2, Math.round(H * d));
      ctx.setTransform(d, 0, 0, d, 0, 0);
    }

    function state() {
      const i = Math.min(LAST - 1, Math.floor(u));
      const f = u - i;
      const t = f * f * (3 - 2 * f);
      const A = EPOCHS[i], B = EPOCHS[i + 1], st = {};
      KEYS.forEach((k) => { st[k] = mix(A[k], B[k], t); });
      CKEYS.forEach((k) => { st[k] = mixv(A[k], B[k], t); });
      return st;
    }

    function drawPlanet(st, cx, cy, R, time) {
      const lava = st.lava, sea = st.sea, ice = st.ice, clump = st.clump;
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt), cosR = Math.cos(rotY), sinR = Math.sin(rotY);
      const oc = st.ocean, ld = st.land, at = st.atmo, cloudAmt = st.cloud, real = st.real;
      const half = RES / 2;
      for (let j = 0; j < RES; j++) {
        const y = (half - j - 0.5) / half;
        for (let i = 0; i < RES; i++) {
          const x = (i + 0.5 - half) / half;
          const rr = x * x + y * y;
          const o = (j * RES + i) * 4;
          if (rr >= 1) { px[o + 3] = 0; continue; }
          const z = Math.sqrt(1 - rr);
          const y1 = y * cosT + z * sinT, z1 = -y * sinT + z * cosT;
          const x2 = x * cosR - z1 * sinR, z2 = x * sinR + z1 * cosR;
          const lon = Math.atan2(x2, z2), lat = Math.asin(y1);
          let ti = Math.floor((lon / 6.2832 + 0.5) * MW); if (ti < 0) ti += MW; if (ti >= MW) ti -= MW;
          const tj = Math.min(MH - 1, Math.max(0, Math.floor((0.5 - lat / Math.PI) * MH)));
          const k = tj * MW + ti;
          const cl = Math.sqrt(1 - y1 * y1);
          const dot = (x2 / (cl || 1)) * PDX + (z2 / (cl || 1)) * PDZ;
          let h = hmap[k] + clump * 0.34 * Math.exp(-(1 - dot * cl - y1 * 0.15) * 3.2) - (lat * lat) * 0.04;
          if (real > 0.001) h = h * (1 - real) + rmap[k] * real;
          const lit = Math.max(0, (x * LX + y * LY + z * LZ) / LN);
          const shade = 0.07 + 0.93 * lit;
          let r, g, b;
          const isLand = h > sea;
          if (isLand) {
            let e = Math.min(1, (h - sea) * 4);
            let lr = ld[0], lg = ld[1], lb = ld[2];
            if (real > 0.001) {
              e = e * (1 - real) + Math.max(0, Math.min(1, (hmap[k] - 0.38) * 2.4)) * 0.55 * real;
              lr = mix(lr, bmap[k * 3], real); lg = mix(lg, bmap[k * 3 + 1], real); lb = mix(lb, bmap[k * 3 + 2], real);
            }
            r = lr * (0.78 + 0.4 * e); g = lg * (0.78 + 0.4 * e); b = lb * (0.78 + 0.4 * e);
          } else {
            const dpt = Math.min(1, (sea - h) * 3.2);
            r = oc[0] * (1.15 - 0.55 * dpt); g = oc[1] * (1.15 - 0.55 * dpt); b = oc[2] * (1.15 - 0.55 * dpt);
          }
          const alat = Math.abs(y1);
          const iceM = sm(1 - ice * 1.12 - 0.02, 1 - ice * 1.12 + 0.12, alat + (h - 0.5) * 0.18);
          let iceF = iceM;
          if (real > 0.001) iceF = Math.max(iceF, imap[k] * real);
          if (iceF > 0) { r = mix(r, 236, iceF); g = mix(g, 244, iceF); b = mix(b, 250, iceF); }
          r *= shade; g *= shade; b *= shade;
          if (!isLand && iceF < 0.5 && lit > 0.2) {
            const sp = Math.pow(lit, 26) * 70 * (1 - iceF);
            r += sp; g += sp; b += sp;
          }
          if (cloudAmt > 0.01) {
            let wi = ti + Math.floor(time * 6); wi %= MW;
            const wv = wmap[tj * MW + wi];
            const cv = sm(0.5, 0.78, wv) * cloudAmt * 1.2;
            if (cv > 0) { const c = 255 * (0.12 + 0.88 * lit); r = mix(r, c, cv); g = mix(g, c, cv); b = mix(b, c, cv); }
          }
          if (lava > 0.01) {
            const cr = cmap[k];
            const glow = (1 - sm(0.0, 0.07 + 0.05 * lava, cr)) * lava;
            const base = 0.35 + 0.65 * glow;
            r = mix(r, 255 * base, glow); g = mix(g, 110 * base + 30 * glow, glow); b = mix(b, 20 * glow, glow);
            r += 40 * lava * (1 - lit); g += 6 * lava * (1 - lit);
          }
          const rim = Math.pow(1 - z, 2.4);
          const ar = rim * (0.35 + 0.65 * Math.max(lit, 0.25));
          r += at[0] * ar * 0.9; g += at[1] * ar * 0.9; b += at[2] * ar * 0.9;
          px[o] = r > 255 ? 255 : r; px[o + 1] = g > 255 ? 255 : g; px[o + 2] = b > 255 ? 255 : b; px[o + 3] = 255;
        }
      }
      octx.putImageData(img, 0, 0);
      const halo = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.28);
      halo.addColorStop(0, 'rgba(' + (at[0] | 0) + ',' + (at[1] | 0) + ',' + (at[2] | 0) + ',0.42)');
      halo.addColorStop(1, 'rgba(' + (at[0] | 0) + ',' + (at[1] | 0) + ',' + (at[2] | 0) + ',0)');
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.28, 0, 6.2832); ctx.fill();
      ctx.drawImage(off, cx - R, cy - R, R * 2, R * 2);
    }

    function drawCosmic(cx, cy, R, alpha, time) {
      const burst = Math.min(1, u * 2.2);
      const flat = sm(0.5, 1, u);
      const spin = time * 0.25;
      const flash = Math.max(0, 1 - u * 2.6);
      if (flash > 0) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * (0.4 + 2.2 * burst));
        g.addColorStop(0, 'rgba(255,250,235,' + (0.95 * flash) + ')');
        g.addColorStop(0.4, 'rgba(255,170,80,' + (0.4 * flash) + ')');
        g.addColorStop(1, 'rgba(255,90,20,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.55);
      core.addColorStop(0, 'rgba(255,225,160,' + (0.9 * alpha * sm(0.3, 1, u)) + ')');
      core.addColorStop(1, 'rgba(255,150,60,0)');
      ctx.fillStyle = core; ctx.beginPath(); ctx.arc(cx, cy, R * 0.55, 0, 6.2832); ctx.fill();
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        const rad = d.r * R * (0.12 + 1.9 * burst) * (1 - 0.35 * flat);
        const a = d.a + spin * (1.4 - d.r) * flat + d.r * 3 * flat;
        const x = cx + Math.cos(a) * rad;
        const y = cy + Math.sin(a) * rad * mix(1, 0.32, flat);
        const c = d.o > 0.5 ? '255,205,150' : '170,200,255';
        ctx.fillStyle = 'rgba(' + c + ',' + (alpha * (0.35 + 0.5 * d.o)) + ')';
        ctx.beginPath(); ctx.arc(x, y, d.s, 0, 6.2832); ctx.fill();
      }
    }

    function drawImpact(st, cx, cy, R, time) {
      const k = st.impact;
      if (k <= 0.02) return;
      for (let n = 0; n < 3; n++) {
        const tt = (time * 0.55 + n * 0.33) % 1;
        const sx = cx + R * (1.9 + n * 0.25) - tt * R * 1.2, sy = cy - R * (1.5 - n * 0.35) + tt * R * 0.95;
        const g = ctx.createLinearGradient(sx + R * 0.8, sy - R * 0.6, sx, sy);
        g.addColorStop(0, 'rgba(255,140,40,0)');
        g.addColorStop(1, 'rgba(255,220,160,' + k + ')');
        ctx.strokeStyle = g; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(sx + R * 0.8, sy - R * 0.6); ctx.lineTo(sx, sy); ctx.stroke();
        ctx.fillStyle = 'rgba(255,230,190,' + k + ')';
        ctx.beginPath(); ctx.arc(sx, sy, 4, 0, 6.2832); ctx.fill();
      }
    }

    function moonPos(st, cx, cy, R, time) {
      const a = time * 0.3;
      return { x: cx + Math.cos(a) * st.dist * R, y: cy - Math.sin(a) * st.dist * R * 0.2 - R * 0.12, z: Math.sin(a) };
    }

    function drawMoon(st, m, R) {
      const r = R * (0.25 - 0.13 * sm(1.25, 1.62, st.dist));
      const g = ctx.createRadialGradient(m.x - r * 0.4, m.y - r * 0.4, r * 0.1, m.x, m.y, r);
      g.addColorStop(0, 'rgb(215,210,200)');
      g.addColorStop(1, 'rgb(70,68,66)');
      ctx.globalAlpha = Math.min(1, st.moon);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(m.x, m.y, r, 0, 6.2832); ctx.fill();
      ctx.fillStyle = 'rgba(40,38,36,0.28)';
      ctx.beginPath(); ctx.arc(m.x - r * 0.3, m.y + r * 0.25, r * 0.22, 0, 6.2832); ctx.fill();
      ctx.beginPath(); ctx.arc(m.x + r * 0.35, m.y - r * 0.2, r * 0.15, 0, 6.2832); ctx.fill();
      ctx.beginPath(); ctx.arc(m.x + r * 0.1, m.y + r * 0.5, r * 0.12, 0, 6.2832); ctx.fill();
      if (st.lava > 0.05) {
        ctx.fillStyle = 'rgba(255,100,25,' + Math.min(0.55, st.lava * 0.7) + ')';
        ctx.beginPath(); ctx.arc(m.x, m.y, r, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function frame(t) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      const dtms = Math.min(64, t - last);
      if (dtms < 30) return;
      last = t;
      const dt = dtms / 1000;
      if (playing) {
        u += dt * (LAST / 75);
        if (u >= LAST) { u = LAST; playing = false; playBtn.textContent = 'replay'; }
        slider.value = Math.round((u / LAST) * 1000);
      }
      if (target !== null) {
        u += (target - u) * Math.min(1, dt * 4.5);
        if (Math.abs(target - u) < 0.003) { u = target; target = null; }
        slider.value = Math.round((u / LAST) * 1000);
      }
      if (!dragging) rotY += dt * 0.28;
      const time = t / 1000;
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      bg.addColorStop(0, '#0d1428'); bg.addColorStop(1, '#03050b');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        ctx.fillStyle = 'rgba(255,255,255,' + (0.25 + 0.5 * Math.abs(Math.sin(time * 0.8 + s[3] * 9))) + ')';
        ctx.fillRect(s[0] * W, s[1] * H, s[2], s[2]);
      }
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.36;
      if (u < 2) drawCosmic(cx, cy, R, 1 - sm(1, 2, u), time);
      if (u > 1) {
        const sc = sm(1, 2, u);
        const st = state();
        const m = st.moon > 0.01 ? moonPos(st, cx, cy, R, time) : null;
        if (m && m.z < 0) drawMoon(st, m, R);
        drawPlanet(st, cx, cy, R * (0.15 + 0.85 * sc), time);
        if (m && m.z >= 0) drawMoon(st, m, R);
        drawImpact(st, cx, cy, R, time);
      }
      const idx = Math.min(LAST, Math.round(u));
      if (idx !== shown) {
        shown = idx;
        swapText(nameEl, EPOCHS[idx].n);
        swapText(timeEl, EPOCHS[idx].t);
        swapText(descEl, EPOCHS[idx].d);
        swapText(factsEl, idx === LAST ? todayFacts() : '');
        slider.setAttribute('aria-valuetext', EPOCHS[idx].n + ', ' + EPOCHS[idx].t);
      }
    }

    function start() {
      if (running) return;
      buildMaps();
      running = true; last = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    slider.addEventListener('input', () => { u = (slider.value / 1000) * LAST; target = null; playing = false; playBtn.textContent = 'play'; });
    function step(dir) {
      playing = false;
      playBtn.textContent = 'play';
      const base = target !== null ? target : Math.round(u);
      target = Math.max(0, Math.min(LAST, base + dir));
    }
    document.getElementById('earth-today').addEventListener('click', () => {
      playing = false; playBtn.textContent = 'play';
      target = LAST;
    });
    canvas.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { step(1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { step(-1); e.preventDefault(); }
      else if (e.key === 'Home') { playing = false; playBtn.textContent = 'play'; target = 0; e.preventDefault(); }
      else if (e.key === 'End') { playing = false; playBtn.textContent = 'play'; target = LAST; e.preventDefault(); }
    });
    let wantRun = false, inView = true;
    function sync() { if (wantRun && inView && !document.hidden) start(); else stop(); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { inView = en[0].isIntersecting; sync(); }).observe(canvas);
    }
    document.addEventListener('visibilitychange', sync);
    document.getElementById('earth-prev').addEventListener('click', () => step(-1));
    document.getElementById('earth-next').addEventListener('click', () => step(1));
    playBtn.addEventListener('click', () => {
      if (u >= LAST - 0.01) { u = 0; slider.value = 0; }
      target = null;
      playing = !playing;
      playBtn.textContent = playing ? 'pause' : 'play';
    });
    canvas.addEventListener('pointerdown', (e) => { dragging = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      rotY -= (e.clientX - lx) * 0.01;
      tilt = Math.max(-0.7, Math.min(0.7, tilt + (e.clientY - ly) * 0.006));
      lx = e.clientX; ly = e.clientY;
    });
    const endDrag = () => { dragging = false; };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', () => { if (running) size(); });

    document.getElementById('prob-yes').addEventListener('click', () => {
      swapView(questionBlock, simEl, 'block', () => { size(); wantRun = true; start(); });
    });
    document.getElementById('prob-no').addEventListener('click', () => {
      swapView(questionBlock, resultEl, 'block');
    });
    document.getElementById('prob-close').addEventListener('click', () => {
      wantRun = false;
      stop();
      playing = false; playBtn.textContent = 'play';
      u = 0; target = null; slider.value = 0; shown = -1;
      resultEl.style.display = 'none';
      swapView(simEl, questionBlock, '');
    });
  })();

  function drawDoodle() {
    const dCanvas = document.getElementById('problem-doodle');
    const dctx = dCanvas.getContext('2d');
    const size = 40;
    dCanvas.width = size * devicePixelRatio;
    dCanvas.height = size * devicePixelRatio;
    dCanvas.style.width = size + 'px';
    dCanvas.style.height = size + 'px';
    dctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    const petalSeed = (doy % 7) + 2;
    const k = petalSeed;
    const cx = size / 2, cy = size / 2;
    const R = size * 0.42;

    dctx.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.02) {
      const r = R * Math.cos(k * a);
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (a === 0) dctx.moveTo(x, y); else dctx.lineTo(x, y);
    }
    const roseColor = getComputedStyle(document.documentElement).getPropertyValue('--accent2').trim() || '#59DDCB';
    dctx.strokeStyle = roseColor;
    dctx.lineWidth = 1.4;
    dctx.stroke();
  }
  drawDoodle();
  window.addEventListener('resize', drawDoodle);

  const COUNTER_KEY = "manlikey4sh-math-profile";

  function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  }

  function isFibonacci(n) {
    const isPerfectSquareCheck = (x) => Number.isInteger(Math.sqrt(x));
    return isPerfectSquareCheck(5 * n * n + 4) || isPerfectSquareCheck(5 * n * n - 4);
  }

  function isPerfectSquare(n) {
    return Number.isInteger(Math.sqrt(n));
  }

  function isTriangular(n) {
    const k = (Math.sqrt(8 * n + 1) - 1) / 2;
    return Number.isInteger(k);
  }

  const SUPERSCRIPT_DIGITS = {
    '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074',
    '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079',
  };
  function toSuperscript(n) {
    return String(n).split('').map((d) => SUPERSCRIPT_DIGITS[d] || d).join('');
  }

  function primeFactorization(n) {
    let num = n;
    const factors = {};
    for (let p = 2; p * p <= num; p++) {
      while (num % p === 0) {
        factors[p] = (factors[p] || 0) + 1;
        num /= p;
      }
    }
    if (num > 1) factors[num] = (factors[num] || 0) + 1;
    return Object.entries(factors)
      .map(([base, exp]) => (exp > 1 ? `${base}${toSuperscript(exp)}` : base))
      .join(" &times; ");
  }

  function describeNumber(n) {
    if (n < 2) return "the beginning";
    if (isPrime(n)) return "prime";
    if (isFibonacci(n)) return "a Fibonacci number";
    if (isPerfectSquare(n)) return `a perfect square (${Math.sqrt(n)}${toSuperscript(2)})`;
    if (isTriangular(n)) return "a triangular number";
    return `= ${primeFactorization(n)}`;
  }

  const VISIT_CACHE_KEY = 'y4sh_visit_cache';
  const VISIT_SESSION_KEY = 'y4sh_visit_counted';
  const visitLineEl = document.getElementById('visit-line');

  function renderVisit(n, stale) {
    visitLineEl.dataset.state = stale ? 'stale' : 'ok';
    visitLineEl.classList.remove('loading');
    const num = `<span class="n">#${n.toLocaleString()}</span>`;
    visitLineEl.innerHTML = stale
      ? `The last count I saw was ${num}, but the live counter is unavailable. <button class="visit-retry" type="button">Retry</button>`
      : `Visitor ${num}${describeNumber(n).charAt(0) === '=' ? ' ' : ': '}<span class="property">${describeNumber(n)}</span>`;
  }

  async function fetchWithTimeout(url, ms) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), ms);
    try { return await fetch(url, { signal: ctl.signal, cache: 'no-store' }); }
    finally { clearTimeout(t); }
  }

  async function loadVisitCount(manual) {
    let cached = null, counted = false;
    try { cached = JSON.parse(localStorage.getItem(VISIT_CACHE_KEY) || 'null'); } catch (e) {}
    try { counted = sessionStorage.getItem(VISIT_SESSION_KEY) === '1'; } catch (e) {}

    if (!manual && counted && cached && Number.isFinite(cached.n)) { renderVisit(cached.n, false); return; }

    visitLineEl.dataset.state = 'loading';
    visitLineEl.classList.add('loading');
    visitLineEl.textContent = 'Counting visitors\u2026';

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetchWithTimeout(`https://countapi.mileshilliard.com/api/v1/hit/${COUNTER_KEY}`, 6000);
        if (!res.ok) throw new Error('counter request failed');
        const data = await res.json();
        const n = Number(data?.value ?? data?.count);
        if (!Number.isFinite(n)) throw new Error('unexpected response shape');
        try { localStorage.setItem(VISIT_CACHE_KEY, JSON.stringify({ n, at: Date.now() })); } catch (e) {}
        try { sessionStorage.setItem(VISIT_SESSION_KEY, '1'); } catch (e) {}
        renderVisit(n, false);
        return;
      } catch (err) {
        if (attempt === 0) await new Promise((r) => setTimeout(r, 1500));
      }
    }

    visitLineEl.classList.remove('loading');
    if (cached && Number.isFinite(cached.n)) {
      renderVisit(cached.n, true);
    } else {
      visitLineEl.dataset.state = 'offline';
      visitLineEl.innerHTML = 'The visitor counter is offline right now. <button class="visit-retry" type="button">Retry</button>';
    }
  }
  visitLineEl.addEventListener('click', (e) => {
    if (e.target.closest('.visit-retry')) loadVisitCount(true);
  });
  window.addEventListener('online', () => {
    const st = visitLineEl.dataset.state;
    if (st === 'offline' || st === 'stale') loadVisitCount(true);
  });
  loadVisitCount();

  const canvas = document.getElementById('curve-field');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const U_SEG = 56, V_SEG = 8;
  const MOBIUS_R = 1.0, MOBIUS_HALF_W = 0.42;

  function mobiusPoint(u, v) {
    const cu2 = Math.cos(u / 2), su2 = Math.sin(u / 2);
    return [
      (MOBIUS_R + v * cu2) * Math.cos(u),
      (MOBIUS_R + v * cu2) * Math.sin(u),
      v * su2,
    ];
  }

  const mobiusGrid = [];
  for (let i = 0; i < U_SEG; i++) {
    const u = (i / U_SEG) * Math.PI * 2;
    const row = [];
    for (let j = 0; j <= V_SEG; j++) {
      const v = -MOBIUS_HALF_W + (2 * MOBIUS_HALF_W) * (j / V_SEG);
      row.push(mobiusPoint(u, v));
    }
    mobiusGrid.push(row);
  }

  const MOBIUS_TRIS = [];
  for (let i = 0; i < U_SEG; i++) {
    const iNext = (i + 1) % U_SEG;
    for (let j = 0; j < V_SEG; j++) {
      const a = mobiusGrid[i][j];
      const b = mobiusGrid[iNext][j];
      const c = mobiusGrid[iNext][j + 1];
      const d = mobiusGrid[i][j + 1];
      MOBIUS_TRIS.push([a, b, c]);
      MOBIUS_TRIS.push([a, c, d]);
    }
  }

  const LIGHT_DIR = normalize3([0.5, 0.65, 0.85]);

  function normalize3(v) {
    const len = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / len, v[1] / len, v[2] / len];
  }
  function cross3(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }
  function sub3(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function dot3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

  function hexToRgb(hex) {
    const h = hex.trim().replace('#', '');
    const n = h.length === 3
      ? h.split('').map((c) => c + c).join('')
      : h;
    const num = parseInt(n, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  let mobiusRgb = [143, 169, 242];
  let mobiusPaper = '#0B1220';
  function updateMobiusColors() {
    const style = getComputedStyle(document.documentElement);
    mobiusRgb = hexToRgb(style.getPropertyValue('--indigo').trim() || '#8FA9F2');
    mobiusPaper = style.getPropertyValue('--paper').trim() || '#0B1220';
  }
  updateMobiusColors();

  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  function resize() {
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    updateMobiusColors();
  }
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); if (reduceMotion) drawMobius(); }, 120);
  });
  document.addEventListener('themechange', () => {
    updateMobiusColors();
    if (reduceMotion) drawMobius();
  });
  document.addEventListener('visibilitychange', () => {
    if (reduceMotion) return;
    cancelAnimationFrame(frameId);
    lastT = 0;
    if (!document.hidden) frameId = requestAnimationFrame(drawMobius);
  });
  resize();

  let rx = 0.55, ry = 0, frameId = 0, lastT = 0;
  function drawMobius(t) {
    if (canvas.hidden) return;
    const dtMs = lastT ? Math.min(50, (t || 0) - lastT) : 16.7;
    lastT = t || 0;
    if (!reduceMotion) { rx += 0.0026 * dtMs / 16.7; ry += 0.0041 * dtMs / 16.7; }
    const w = window.innerWidth, h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2, cy = h * 0.38;
    const scale = Math.min(w, h) * 0.34;

    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const cosY = Math.cos(ry), sinY = Math.sin(ry);

    const rotatePoint = ([x, y, z]) => {
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      return [x1, y2, z2];
    };

    const camDist = 4.4;
    const project = (v) => {
      const zf = camDist / (camDist - v[2]);
      return { x: cx + v[0] * zf * scale, y: cy + v[1] * zf * scale };
    };

    const tris = MOBIUS_TRIS.map(([a, b, c]) => {
      const va = rotatePoint(a), vb = rotatePoint(b), vc = rotatePoint(c);
      const normal = normalize3(cross3(sub3(vb, va), sub3(vc, va)));
      const avgZ = (va[2] + vb[2] + vc[2]) / 3;

      const brightness = Math.abs(dot3(normal, LIGHT_DIR));
      return { va, vb, vc, avgZ, brightness };
    });
    tris.sort((t1, t2) => t1.avgZ - t2.avgZ);

    tris.forEach((t) => {
      const pa = project(t.va), pb = project(t.vb), pc = project(t.vc);

      const alpha = 0.10 + t.brightness * 0.30;
      ctx.fillStyle = `rgba(${mobiusRgb[0]}, ${mobiusRgb[1]}, ${mobiusRgb[2]}, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.lineTo(pc.x, pc.y);
      ctx.closePath();
      ctx.fill();
    });

    const vignette = ctx.createRadialGradient(cx, cy, scale * 0.4, cx, cy, Math.max(w, h) * 0.75);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, mobiusPaper);
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    if (!reduceMotion) {
      frameId = requestAnimationFrame(drawMobius);
    }
  }
  drawMobius();
