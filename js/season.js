(function () {
  var forced = null;
  try {
    var m = /[?&]halloween=([^&#]*)/i.exec(location.search);
    if (m) {
      var v = m[1].toLowerCase();
      if (v === 'on' || v === '1' || v === 'true') forced = true;
      else if (v === 'off' || v === '0' || v === 'false') forced = false;
    }
  } catch (e) {}
  var d = new Date();
  var inSeason = d.getMonth() === 9 || (d.getMonth() === 10 && d.getDate() === 1);
  var on = forced === null ? inSeason : forced;
  window.HW_ON = on;
  var xmForced = null;
  try {
    var xmm = /[?&]christmas=([^&#]*)/i.exec(location.search);
    if (xmm) {
      var xv = xmm[1].toLowerCase();
      if (xv === 'on' || xv === '1' || xv === 'true') xmForced = true;
      else if (xv === 'off' || xv === '0' || xv === 'false') xmForced = false;
    }
  } catch (e) {}
  var xm = xmForced === null ? d.getMonth() === 11 : xmForced;
  if (on) xm = false;
  window.XM_ON = xm;
  var mo = d.getMonth() === 10;
  try {
    var mm = /[?&]movember=([^&#]*)/i.exec(location.search);
    if (mm) { var mv = mm[1].toLowerCase(); if (mv === 'on' || mv === '1' || mv === 'true') mo = true; else if (mv === 'off' || mv === '0' || mv === 'false') mo = false; }
  } catch (e) {}
  if (mo) document.documentElement.classList.add('mo');
  window.hwFlame = function () { return on ? '&#127875;' : xm ? '&#127876;' : '&#128293;'; };
  function loadCss(href) {
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href;
    var a = document.getElementById('late-css');
    if (a && a.parentNode) a.parentNode.insertBefore(l, a); else document.head.appendChild(l);
  }
  var root = document.documentElement;
  if (on) {
    root.classList.add('hw');
    loadCss('css/halloween.css');
    var icons = document.querySelectorAll('link[rel="icon"]');
    for (var i = 0; i < icons.length; i++) {
      if (icons[i].type === 'image/svg+xml') icons[i].href = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 shape-rendering=%22crispEdges%22%3E%3Crect width=%22100%22 height=%22100%22 rx=%2222%22 fill=%22%230F0A14%22/%3E%3Crect x=%2240%22 y=%2215%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2245%22 y=%2215%22 width=%2210%22 height=%225%22 fill=%22%236FBF2E%22/%3E%3Crect x=%2255%22 y=%2215%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2245%22 y=%2220%22 width=%2210%22 height=%225%22 fill=%22%236FBF2E%22/%3E%3Crect x=%2225%22 y=%2225%22 width=%2220%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2245%22 y=%2225%22 width=%2210%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2255%22 y=%2225%22 width=%2220%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2215%22 y=%2230%22 width=%2210%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2225%22 y=%2230%22 width=%2210%22 height=%225%22 fill=%22%23FFB23F%22/%3E%3Crect x=%2235%22 y=%2230%22 width=%2230%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2265%22 y=%2230%22 width=%2210%22 height=%225%22 fill=%22%23FFB23F%22/%3E%3Crect x=%2275%22 y=%2230%22 width=%2210%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2215%22 y=%2235%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2220%22 y=%2235%22 width=%2210%22 height=%225%22 fill=%22%23FFB23F%22/%3E%3Crect x=%2230%22 y=%2235%22 width=%2240%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2270%22 y=%2235%22 width=%2210%22 height=%225%22 fill=%22%23FFB23F%22/%3E%3Crect x=%2280%22 y=%2235%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2210%22 y=%2240%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2215%22 y=%2240%22 width=%2225%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2240%22 y=%2240%22 width=%225%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2245%22 y=%2240%22 width=%2210%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2255%22 y=%2240%22 width=%225%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2260%22 y=%2240%22 width=%2225%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2285%22 y=%2240%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2210%22 y=%2245%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2215%22 y=%2245%22 width=%2215%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2230%22 y=%2245%22 width=%2210%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2240%22 y=%2245%22 width=%2220%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2260%22 y=%2245%22 width=%2210%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2270%22 y=%2245%22 width=%2215%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2285%22 y=%2245%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2210%22 y=%2250%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2215%22 y=%2250%22 width=%2225%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2240%22 y=%2250%22 width=%225%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2245%22 y=%2250%22 width=%2210%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2255%22 y=%2250%22 width=%225%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2260%22 y=%2250%22 width=%2225%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2285%22 y=%2250%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2210%22 y=%2255%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2215%22 y=%2255%22 width=%2230%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2245%22 y=%2255%22 width=%2210%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2255%22 y=%2255%22 width=%2230%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2285%22 y=%2255%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2210%22 y=%2260%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2215%22 y=%2260%22 width=%2210%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2225%22 y=%2260%22 width=%2250%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2275%22 y=%2260%22 width=%2210%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2285%22 y=%2260%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2210%22 y=%2265%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2215%22 y=%2265%22 width=%2215%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2230%22 y=%2265%22 width=%225%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2235%22 y=%2265%22 width=%225%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2240%22 y=%2265%22 width=%225%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2245%22 y=%2265%22 width=%2210%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2255%22 y=%2265%22 width=%225%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2260%22 y=%2265%22 width=%225%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2265%22 y=%2265%22 width=%225%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2270%22 y=%2265%22 width=%2215%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2285%22 y=%2265%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2210%22 y=%2270%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2215%22 y=%2270%22 width=%2225%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2240%22 y=%2270%22 width=%225%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2245%22 y=%2270%22 width=%2210%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2255%22 y=%2270%22 width=%225%22 height=%225%22 fill=%22%231A0B10%22/%3E%3Crect x=%2260%22 y=%2270%22 width=%2225%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2285%22 y=%2270%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2210%22 y=%2275%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2215%22 y=%2275%22 width=%2210%22 height=%225%22 fill=%22%23C2470A%22/%3E%3Crect x=%2225%22 y=%2275%22 width=%2250%22 height=%225%22 fill=%22%23FF7A1A%22/%3E%3Crect x=%2275%22 y=%2275%22 width=%2210%22 height=%225%22 fill=%22%23C2470A%22/%3E%3Crect x=%2285%22 y=%2275%22 width=%225%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2215%22 y=%2280%22 width=%2210%22 height=%225%22 fill=%22%235A1E05%22/%3E%3Crect x=%2225%22 y=%2280%22 width=%2250%22 height=%225%22 fill=%22%23C2470A%22/%3E%3Crect x=%2275%22 y=%2280%22 width=%2210%22 height=%225%22 fill=%22%235A1E05%22/%3E%3C/svg%3E";
      else icons[i].parentNode.removeChild(icons[i]);
    }
  } else if (xm) {
    root.classList.add('xm');
    loadCss('css/halloween.css');
    loadCss('css/christmas.css');
    var xicons = document.querySelectorAll('link[rel="icon"]');
    for (var j = 0; j < xicons.length; j++) {
      if (xicons[j].type === 'image/svg+xml') xicons[j].href = 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M16 3l9 11h-5l7 9H5l7-9H7z' fill='#1F7A4D'/><rect x='14' y='23' width='4' height='5' fill='#5C3A24'/><circle cx='12' cy='19' r='1.6' fill='#E5484D'/><circle cx='19' cy='15' r='1.6' fill='#F2C14E'/><circle cx='20' cy='21' r='1.6' fill='#E5484D'/><path d='M16 1.2l.9 1.8 2 .3-1.4 1.4.3 2L16 5.7l-1.8.9.3-2-1.4-1.4 2-.3z' fill='#F2C14E'/></svg>");
      else xicons[j].parentNode.removeChild(xicons[j]);
    }
  } else {
    var f = document.createElement('link');
    f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@800&display=swap';
    document.head.appendChild(f);
  }
  var tag = on ? 'halloween' : xm ? 'christmas' : null;
  if (tag) {
    var themeColour = on ? '#0F0A14' : '#0A1814';
    var ti = document.querySelector('link[rel="apple-touch-icon"]');
    if (ti) {
      ti.setAttribute('sizes', '180x180');
      ti.href = 'icons/apple-touch-icon-' + tag + '.png?v=2';
    }
    var tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.content = themeColour;
    var mf = document.querySelector('link[rel="manifest"]');
    if (mf && /^https?:$/.test(location.protocol)) {
      try {
      var mfBase = new URL(mf.getAttribute('href'), location.href);
      var absolute = function (p) { return new URL(p, mfBase).href; };
      var seasonal = function (m) {
        m = m && typeof m === 'object' ? m : {};
        m.name = m.name || 'manlikey4sh';
        m.short_name = m.short_name || 'y4sh';
        m.start_url = absolute(m.start_url || './');
        m.scope = absolute(m.scope || './');
        if (m.id) m.id = absolute(m.id);
        m.display = m.display || 'standalone';
        m.background_color = themeColour;
        m.theme_color = themeColour;
        var i192 = absolute('icons/icon-' + tag + '-192.png?v=2');
        var i512 = absolute('icons/icon-' + tag + '-512.png?v=2');
        m.icons = [
          { src: i192, sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: i512, sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: i192, sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: i512, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ];
        if (Array.isArray(m.shortcuts)) {
          m.shortcuts.forEach(function (s) {
            if (s.url) s.url = absolute(s.url);
            if (Array.isArray(s.icons)) s.icons.forEach(function (ic) { if (ic.src) ic.src = absolute(ic.src); });
          });
        }
        return m;
      };
      var applyManifest = function (m) {
        try {
          var blob = new Blob([JSON.stringify(seasonal(m))], { type: 'application/manifest+json' });
          mf.setAttribute('href', URL.createObjectURL(blob));
        } catch (e) {}
      };
      fetch(mfBase.href, { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; })
        .then(applyManifest);
      } catch (e) {}
    }
  }
})();
