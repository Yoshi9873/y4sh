(function () {
  var PUMP = ["......bg", ".......g", "...bbbbo", ".bbllooo", ".blloooo", "boooooko", "boookkoo", "boooooko", "booooook", "bookkkkk", "boookoko", "boooooko", "bddooooo", ".bbddddd"];
  var PUMP_PAL = { b: '#5A1E05', o: '#FF7A1A', l: '#FFB23F', d: '#C2470A', g: '#6FBF2E', k: '#1A0B10' };
  var BAT = ["......b.", "......bb", "b....ebb", "bb..bbbb", "bbbbbbbb", "bbbbbbbb", ".bb.bbbb", "..b..bb."];
  var BAT_PAL = { b: '#C9A6FF', e: '#FF7A1A' };
  var FLAME = [".......r", "......rr", "......rr", ".....rrr", "....rrrr", "....rorr", "...rroor", "..rrooor", "..rooooo", ".rrooooy", ".rooooyy", ".rooooyy", ".rooooyy", ".rrooooy", "..rroooo", "...rrrrr"];
  var FLAME_PAL = { r: '#E8501A', o: '#FF9A1F', y: '#FFE27A' };

  function mirror(rows) { return rows.map(function (r) { return r + r.split('').reverse().join(''); }); }
  function grid(g, rows, pal, x, y, s) {
    for (var r = 0; r < rows.length; r++) for (var c = 0; c < rows[r].length; c++) {
      var ch = rows[r][c];
      if (ch !== '.') { g.fillStyle = pal[ch]; g.fillRect(x + c * s, y + r * s, s, s); }
    }
  }
  function sparkle(g, x, y, s, col) {
    g.fillStyle = col;
    g.fillRect(x - s / 2, y - s * 2.5, s, s * 5);
    g.fillRect(x - s * 2.5, y - s / 2, s * 5, s);
  }
  function spaced(g, px) { try { g.letterSpacing = px + 'px'; } catch (e) {} }

  var XM_TREE = [".................", ".......xsx.......", "......xsssx......", ".......xsx.......", ".......xdx.......", "......xdggx......", ".....xdrgggx.....", "......xdggx......", ".....xydggux.....", "....xdgyggggx....", "...xdggggggggx...", "....xxdgrgrxx....", "....xdggguggx....", "...xdggggggggx...", "..xdggggggggggx..", ".xdggggggggggggx.", "..xxxxxbbbxxxxx..", "......xbbbx......", "................."];
  var XM_TREE_PAL = {"x": "#06261A", "s": "#F2C14E", "g": "#2E9E6B", "d": "#1F7A4D", "b": "#6B4423", "r": "#E5484D", "y": "#FFE08A", "u": "#78BEFF"};

  function rgbaOf(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function sparkKeep(o) {
    var B = window.STREAK_BADGES;
    var has = !!B && B.top(o.best || o.streak) >= 0;
    return function (s) { return !has || !(s[0] > 770 && s[1] > 230 && s[1] < 520); };
  }
  function drawBadge(g, o, cx, top, sub, font) {
    var B = window.STREAK_BADGES;
    if (!B) return;
    var idx = B.top(o.best || o.streak);
    if (idx < 0) return;
    var t = B.tiers[idx], sp = B.sprite(idx, true), s = 10;
    var glow = g.createRadialGradient(cx, top + 90, 8, cx, top + 90, 170);
    glow.addColorStop(0, rgbaOf(t.pal.f, 0.4)); glow.addColorStop(1, rgbaOf(t.pal.f, 0));
    g.fillStyle = glow; g.fillRect(cx - 180, top - 90, 360, 360);
    grid(g, sp.rows, sp.pal, cx - (sp.rows[0].length * s) / 2, top, s);
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.font = '700 22px ' + font; spaced(g, 2); g.fillStyle = t.pal.f;
    g.fillText(t.n + '-DAY BADGE', cx, top + sp.rows.length * s + 38);
    g.font = '500 20px ' + font; spaced(g, 0); g.fillStyle = sub;
    g.fillText(t.name, cx, top + sp.rows.length * s + 68);
  }
  function xmCard(o, font) {
    var c = document.createElement('canvas');
    c.width = c.height = 1080;
    var g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    var bg = g.createLinearGradient(0, 0, 0, 1080);
    bg.addColorStop(0, '#0C2E21'); bg.addColorStop(1, '#050F0B');
    g.fillStyle = bg; g.fillRect(0, 0, 1080, 1080);
    var gl = g.createRadialGradient(900, 130, 10, 900, 130, 520);
    gl.addColorStop(0, 'rgba(242,193,78,.22)'); gl.addColorStop(1, 'rgba(242,193,78,0)');
    g.fillStyle = gl; g.fillRect(0, 0, 1080, 1080);
    g.fillStyle = '#FFFFFF';
    for (var i = 0; i < 110; i++) {
      g.globalAlpha = 0.18 + (i % 5) * 0.1;
      var ss = [4, 4, 6, 8][i % 4];
      g.fillRect((i * 977) % 1080, (i * 613) % 1000, ss, ss);
    }
    g.globalAlpha = 1;
    var cols = ['#E5484D', '#F2C14E', '#4CC38A', '#78BEFF'];
    g.strokeStyle = '#0B2A1C'; g.lineWidth = 6; g.beginPath();
    for (var x = 0; x <= 1080; x += 8) {
      var yy = 34 + Math.sin(x / 1080 * Math.PI * 6) * 10;
      if (x === 0) g.moveTo(x, yy); else g.lineTo(x, yy);
    }
    g.stroke();
    for (var b = 0; b < 12; b++) {
      var bx = 45 + b * 90, by = 34 + Math.sin(bx / 1080 * Math.PI * 6) * 10 + 6;
      g.shadowColor = cols[b % 4]; g.shadowBlur = 24; g.fillStyle = cols[b % 4];
      g.fillRect(bx - 9, by + 4, 18, 22);
      g.shadowBlur = 0; g.fillStyle = '#0B2A1C'; g.fillRect(bx - 6, by - 4, 12, 9);
    }
    g.shadowBlur = 0;
    g.fillStyle = '#16402F';
    g.beginPath(); g.moveTo(0, 1080);
    for (var hx = 0; hx <= 1080; hx += 10) g.lineTo(hx, 1020 - 20 * Math.sin(hx / 170) - 8 * Math.sin(hx / 53));
    g.lineTo(1080, 1080); g.closePath(); g.fill();
    g.fillStyle = '#E9F3F8';
    g.beginPath(); g.moveTo(0, 1080);
    for (var sx = 0; sx <= 1080; sx += 10) g.lineTo(sx, 1052 - 10 * Math.sin(sx / 120 + 1));
    g.lineTo(1080, 1080); g.closePath(); g.fill();
    grid(g, XM_TREE, XM_TREE_PAL, 10, 940, 4);
    grid(g, XM_TREE, XM_TREE_PAL, 1012, 940, 4);

    var X = 90, Y = 100, W = 900, H = 880, BAR = 88;
    g.fillStyle = '#0F4A35'; g.fillRect(X + 24, Y + 24, W, H);
    g.fillStyle = '#10261E'; g.fillRect(X, Y, W, H);
    g.fillStyle = '#E5484D'; g.fillRect(X, Y, W, BAR);
    g.save();
    g.beginPath(); g.rect(X, Y, W, BAR); g.clip();
    g.fillStyle = 'rgba(255,255,255,.14)';
    for (var st = X - 100; st < X + W + 100; st += 56) {
      g.beginPath(); g.moveTo(st, Y + BAR); g.lineTo(st + 28, Y + BAR); g.lineTo(st + 28 + BAR, Y); g.lineTo(st + BAR, Y); g.closePath(); g.fill();
    }
    g.restore();
    g.fillStyle = '#FFFFFF'; g.fillRect(X + 28, Y + 31, 26, 26);
    g.textBaseline = 'middle'; g.textAlign = 'left';
    g.font = '700 42px ' + font; spaced(g, 1);
    g.fillText('Daily Problem', X + 76, Y + BAR / 2 + 3);
    if (window.XM_PN) {
      g.textAlign = 'right'; g.font = '700 30px ' + font; spaced(g, 0);
      g.fillText(window.XM_PN <= 12 ? 'Day ' + window.XM_PN + ' of 12' : 'Christmas Day', X + W - 30, Y + BAR / 2 + 3);
    }
    g.strokeStyle = '#F6F1E7'; g.lineWidth = 8; g.strokeRect(X + 4, Y + 4, W - 8, H - 8);
    g.fillStyle = '#F4F9FC';
    for (var cp = X - 6; cp < X + W + 6; cp += 34) {
      g.beginPath(); g.arc(cp + 17, Y - 2, 14 + ((cp * 7) % 9), Math.PI, 0); g.fill();
    }
    g.fillRect(X - 6, Y - 4, W + 12, 8);

    var cx = 540;
    var glow = g.createRadialGradient(cx, 380, 10, cx, 380, 290);
    glow.addColorStop(0, 'rgba(242,193,78,.30)'); glow.addColorStop(1, 'rgba(242,193,78,0)');
    g.fillStyle = glow; g.fillRect(X + 8, Y + BAR, W - 16, 520);
    grid(g, XM_TREE, XM_TREE_PAL, cx - 136, 214, 16);
    function gift(gx, gy, gw, gh, body, rib) {
      g.fillStyle = body; g.fillRect(gx, gy, gw, gh);
      g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(gx + gw - 8, gy, 8, gh);
      g.fillStyle = rib; g.fillRect(gx + gw / 2 - 6, gy, 12, gh); g.fillRect(gx, gy + gh / 2 - 5, gw, 10);
      g.fillRect(gx + gw / 2 - 16, gy - 12, 14, 12); g.fillRect(gx + gw / 2 + 2, gy - 12, 14, 12);
    }
    gift(cx - 236, 494, 76, 62, '#E5484D', '#F2C14E');
    gift(cx - 132, 522, 50, 34, '#78BEFF', '#FFFFFF');
    gift(cx + 128, 488, 84, 68, '#2E9E6B', '#F2C14E');
    gift(cx + 66, 524, 50, 32, '#F2C14E', '#E5484D');
    [[300, 300, 8, 1], [780, 330, 10, 0], [250, 420, 7, 0], [830, 440, 8, 1], [400, 236, 6, 0], [690, 240, 6, 1]].filter(sparkKeep(o)).forEach(function (s) {
      sparkle(g, s[0], s[1], s[2], s[3] ? '#F2C14E' : '#FFFFFF');
    });
    drawBadge(g, o, 868, 226, '#A7B8AE', font);

    var num = String(o.streak);
    var nsize = num.length >= 3 ? 190 : 240;
    g.textAlign = 'center'; g.textBaseline = 'alphabetic'; spaced(g, 0);
    g.font = '700 ' + nsize + 'px ' + font;
    g.fillStyle = '#0F4A35'; g.fillText(num, cx + 10, 762);
    g.fillStyle = '#F6F1E7'; g.fillText(num, cx, 752);
    g.font = '700 54px ' + font; spaced(g, 6);
    g.fillStyle = '#F2C14E'; g.fillText('DAY STREAK', cx, 822);
    spaced(g, 0);
    g.font = '500 34px ' + font; g.fillStyle = '#A7B8AE';
    g.fillText(o.total + (o.total === 1 ? ' day' : ' days') + ' solved' + (o.best > o.streak ? '  \u00B7  best ' + o.best : ''), cx, 880);
    g.fillStyle = '#F6F1E7'; g.globalAlpha = 0.25; g.fillRect(X + 60, 912, W - 120, 4); g.globalAlpha = 1;
    g.font = '700 36px ' + font; g.fillStyle = '#E5484D'; spaced(g, 2);
    g.fillText('y4sh.xyz', cx, 958);
    return c;
  }

  function buildCard(o) {
    var hw = !!window.HW_ON;
    var P = window.XM_ON
      ? { bg1: '#0A1814', bg2: '#11261F', accent: '#E5484D', ink: '#F6F1E7', sub: '#A7B8AE', spark: '#F2C14E', shadow: '#0F4A35', on: '#FFFFFF', line: '#F6F1E7' }
      : hw
      ? { bg1: '#0F0A14', bg2: '#1A1224', accent: '#FF7A1A', ink: '#F1E9DA', sub: '#A99DB8', spark: '#A878FF', shadow: '#3E2270', on: '#140A00', line: '#F1E9DA' }
      : { bg1: '#0B1220', bg2: '#131C2E', accent: '#82A4F5', ink: '#ECECF0', sub: '#9A9AA6', spark: '#59DDCB', shadow: '#1E2A4A', on: '#0B1220', line: '#ECECF0' };
    var font = (getComputedStyle(document.documentElement).getPropertyValue('--display') || '').trim() || 'monospace';
    var ready = Promise.resolve();
    try { ready = document.fonts.load('700 120px ' + font); } catch (e) {}
    return ready.catch(function () {}).then(function () {
      if (window.XM_ON) return xmCard(o, font);
      var c = document.createElement('canvas');
      c.width = c.height = 1080;
      var g = c.getContext('2d');
      g.imageSmoothingEnabled = false;

      var bg = g.createLinearGradient(0, 0, 0, 1080);
      bg.addColorStop(0, P.bg1); bg.addColorStop(1, P.bg2);
      g.fillStyle = bg; g.fillRect(0, 0, 1080, 1080);
      g.globalAlpha = 0.22; g.fillStyle = P.ink;
      for (var i = 0; i < 70; i++) g.fillRect((i * 977) % 1080, (i * 613) % 1080, 4, 4);
      g.globalAlpha = 1;

      var X = 90, Y = 100, W = 900, H = 880, BAR = 88;
      g.fillStyle = P.shadow; g.fillRect(X + 24, Y + 24, W, H);
      g.fillStyle = P.bg2; g.fillRect(X, Y, W, H);
      g.fillStyle = P.accent; g.fillRect(X, Y, W, BAR);
      g.fillStyle = P.on; g.fillRect(X + 28, Y + 31, 26, 26);
      g.fillStyle = P.on; g.textBaseline = 'middle'; g.textAlign = 'left';
      g.font = '700 42px ' + font; spaced(g, 1);
      g.fillText(hw ? 'Daily Problem (cursed)' : 'Daily Problem', X + 76, Y + BAR / 2 + 3);
      g.strokeStyle = P.line; g.lineWidth = 8; g.strokeRect(X + 4, Y + 4, W - 8, H - 8);

      var cx = 540, cy = 395;
      var glow = g.createRadialGradient(cx, cy, 10, cx, cy, 270);
      glow.addColorStop(0, hw ? 'rgba(255,122,26,.32)' : 'rgba(130,164,245,.28)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = glow; g.fillRect(X + 8, Y + BAR, W - 16, 520);

      if (hw) grid(g, mirror(PUMP), PUMP_PAL, cx - 160, 255, 20);
      else grid(g, mirror(FLAME), FLAME_PAL, cx - 144, 250, 18);

      [[330, 300, 8, 0], [752, 330, 10, 1], [292, 470, 7, 1], [790, 485, 8, 0], [420, 230, 6, 1], [660, 238, 6, 0]].filter(sparkKeep(o)).forEach(function (s) {
        sparkle(g, s[0], s[1], s[2], s[3] ? P.spark : P.accent);
      });
      drawBadge(g, o, 868, 226, P.sub, font);
      if (hw) {
        grid(g, mirror(BAT), BAT_PAL, 60, 22, 6);
        grid(g, mirror(BAT), BAT_PAL, 880, 40, 5);
        sparkle(g, 990, 1030, 6, P.spark); sparkle(g, 90, 1034, 6, P.accent);
      } else {
        sparkle(g, 60, 50, 6, P.spark); sparkle(g, 1010, 60, 6, P.accent); sparkle(g, 990, 1030, 6, P.spark); sparkle(g, 90, 1034, 6, P.accent);
      }

      var num = String(o.streak);
      var nsize = num.length >= 3 ? 190 : 240;
      g.textAlign = 'center'; g.textBaseline = 'alphabetic'; spaced(g, 0);
      g.font = '700 ' + nsize + 'px ' + font;
      g.fillStyle = P.shadow; g.fillText(num, cx + 10, 752 + 10);
      g.fillStyle = P.ink; g.fillText(num, cx, 752);
      g.font = '700 54px ' + font; spaced(g, 6);
      g.fillStyle = P.accent; g.fillText('DAY STREAK', cx, 822);
      spaced(g, 0);
      g.font = '500 34px ' + font; g.fillStyle = P.sub;
      var stats = o.total + (o.total === 1 ? ' day' : ' days') + ' solved' + (o.best > o.streak ? '  \u00B7  best ' + o.best : '');
      g.fillText(stats, cx, 880);
      g.fillStyle = P.line; g.globalAlpha = 0.25; g.fillRect(X + 60, 912, W - 120, 4); g.globalAlpha = 1;
      g.font = '700 36px ' + font; g.fillStyle = P.accent; spaced(g, 2);
      g.fillText('y4sh.xyz', cx, 958);
      return c;
    });
  }

  var openEl = null, openUrl = null, lastFocus = null;
  function close() {
    if (!openEl) return;
    document.removeEventListener('keydown', onKey, true);
    openEl.remove(); openEl = null;
    if (openUrl) { URL.revokeObjectURL(openUrl); openUrl = null; }
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }
  function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }
  function toast(msg) { if (typeof showToast === 'function') showToast(msg); }

  window.openStreakCard = function (o) {
    if (openEl) return;
    lastFocus = document.activeElement;
    var text = String.fromCodePoint(window.HW_ON ? 127875 : window.XM_ON ? 127876 : 128293) + ' ' + o.streak + '-day streak on the daily problem at y4sh.xyz';
    buildCard(o).then(function (canvas) {
      canvas.toBlob(function (blob) {
        if (!blob) { if (typeof copyText === 'function') copyText(text); return; }
        openUrl = URL.createObjectURL(blob);
        var name = 'y4sh-streak-' + o.streak + '.png';
        var file = null;
        try { file = new File([blob], name, { type: 'image/png' }); } catch (e) {}
        var ov = document.createElement('div');
        ov.className = 'sc-overlay';
        ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Your streak card');
        var box = document.createElement('div'); box.className = 'sc-box';
        var img = document.createElement('img'); img.src = openUrl; img.alt = 'Streak card: ' + o.streak + '-day streak';
        var row = document.createElement('div'); row.className = 'sc-actions';
        function btn(label, primary, fn) { var b = document.createElement('button'); b.type = 'button'; b.className = 'sc-btn' + (primary ? ' primary' : ''); b.textContent = label; b.setAttribute('data-sfx', 'own'); b.addEventListener('click', fn); row.appendChild(b); return b; }
        var first = null;
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          first = btn('Share', true, function () { navigator.share({ files: [file], text: text }).catch(function () {}); });
        }
        var save = document.createElement('a'); save.className = 'sc-btn' + (first ? '' : ' primary'); save.href = openUrl; save.download = name; save.textContent = 'Save image';
        save.setAttribute('data-sfx', 'own'); row.appendChild(save); if (!first) first = save;
        if (navigator.clipboard && window.ClipboardItem && window.isSecureContext) {
          btn('Copy image', false, function () {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(function () { toast('Image copied.'); }, function () { toast('Could not copy the image.'); });
          });
        }
        btn('Close', false, close);
        box.appendChild(img); box.appendChild(row); ov.appendChild(box);
        ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
        document.body.appendChild(ov); openEl = ov;
        document.addEventListener('keydown', onKey, true);
        if (first && first.focus) first.focus();
      }, 'image/png');
    });
  };
})();
