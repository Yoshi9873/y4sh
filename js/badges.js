(function () {
  var TIERS = [
    { n: 3, name: 'Triangle', blurb: 'Solve the daily problem 3 days in a row. A triangle has 3 sides.', pal: { o: '#5A2F12', h: '#E7A15B', f: '#CD7F32', g: '#A5601F', n: '#4A2410', r: '#2E9E6B', q: '#1F7A4D' } },
    { n: 7, name: 'Lucky Seven', blurb: 'Solve it 7 days in a row. 7 is a prime number, and a lucky one.', pal: { o: '#4A5262', h: '#F2F5FA', f: '#C3CBD8', g: '#9AA4B4', n: '#2F3644', r: '#4D8FD1', q: '#3562C4' } },
    { n: 14, name: 'Fortnight', blurb: 'Solve it 14 days in a row, a full fortnight.', pal: { o: '#7A4B00', h: '#FFE59A', f: '#F2C14E', g: '#D29A25', n: '#5A3600', r: '#E5484D', q: '#B3262E' } },
    { n: 30, name: 'Month Master', blurb: 'Solve it 30 days in a row, a whole month.', pal: { o: '#0B4B30', h: '#9AF5C8', f: '#2EC27E', g: '#1E9A62', n: '#06301E', r: '#F2C14E', q: '#C98A1B' } },
    { n: 60, name: 'Highly Composite', blurb: 'Solve it 60 days in a row. 60 is the smallest number with 12 divisors.', pal: { o: '#14307A', h: '#B5CEFF', f: '#4F83F0', g: '#3562C4', n: '#0C1F55', r: '#E5484D', q: '#B3262E', w: '#8FB4FF' } },
    { n: 100, name: 'Perfect Square', blurb: 'Solve it 100 days in a row. 100 is 10 squared, a perfect square.', pal: { o: '#5E0F18', h: '#FFA3A8', f: '#E5484D', g: '#B3262E', n: '#3B070D', r: '#F2C14E', q: '#C98A1B', w: '#FF8A90' } },
    { n: 365, name: 'Full Orbit', blurb: 'Solve it 365 days in a row, one full orbit around the Sun.', pal: { o: '#1F5F6B', h: '#FFFFFF', f: '#8BE9F5', g: '#52C1D0', n: '#10414A', r: '#B07CFF', q: '#8A55E0', w: '#6FDDEB' } }
  ];
  var LOCKED = { o: '#59606F', h: '#7A8294', f: '#4A5160', g: '#434A58', n: '#6A7285', r: '#4E5565', q: '#434A58' };
  var DIGITS = {
    '0': ['###', '#.#', '#.#', '#.#', '###'], '1': ['.#.', '##.', '.#.', '.#.', '###'],
    '2': ['###', '..#', '###', '#..', '###'], '3': ['###', '..#', '###', '..#', '###'],
    '4': ['#.#', '#.#', '###', '..#', '..#'], '5': ['###', '#..', '###', '..#', '###'],
    '6': ['###', '#..', '###', '#.#', '###'], '7': ['###', '..#', '.#.', '.#.', '.#.'],
    '8': ['###', '#.#', '###', '#.#', '###'], '9': ['###', '#.#', '###', '..#', '###']
  };
  var W = 18, H = 22;

  function sprite(i, earned) {
    var t = TIERS[i], g = [], x, y;
    for (y = 0; y < H; y++) { g.push([]); for (x = 0; x < W; x++) g[y].push('.'); }
    for (y = 15; y <= 20; y++) {
      for (x = 4; x <= 7; x++) if (y < 20 || x === 4 || x === 7) g[y][x] = x === 7 ? 'q' : 'r';
      for (x = 10; x <= 13; x++) if (y < 20 || x === 10 || x === 13) g[y][x] = x === 13 ? 'q' : 'r';
    }
    for (y = 0; y < 18; y++) {
      for (x = 0; x < W; x++) {
        var dx = x + 0.5 - 9, dy = y + 0.5 - 8.5, d = Math.sqrt(dx * dx + dy * dy);
        if (d > 8.3) continue;
        if (d >= 7.4) g[y][x] = 'o';
        else if (d >= 6.6) g[y][x] = dx + dy < 2 ? 'h' : 'f';
        else g[y][x] = dx + dy > 3.5 ? 'g' : 'f';
      }
    }
    var s = String(t.n), w = s.length * 4 - 1, x0 = Math.floor((W - w) / 2), y0 = 6;
    for (var k = 0; k < s.length; k++) {
      var gl = DIGITS[s.charAt(k)];
      for (var r = 0; r < 5; r++) for (var c = 0; c < 3; c++) if (gl[r].charAt(c) === '#') g[y0 + r][x0 + k * 4 + c] = 'n';
    }
    if (earned && i >= 4) [[16, 0], [15, 1], [16, 1], [17, 1], [16, 2]].forEach(function (p) { g[p[1]][p[0]] = 'w'; });
    if (earned && i >= 6) [[1, 15], [0, 16], [1, 16], [2, 16], [1, 17]].forEach(function (p) { g[p[1]][p[0]] = 'w'; });
    var pal = {};
    var src = earned ? t.pal : LOCKED;
    for (var key in src) pal[key] = src[key];
    if (!pal.w) pal.w = '#FFC93C';
    return { rows: g.map(function (row) { return row.join(''); }), pal: pal };
  }

  function svg(i, earned, scale) {
    var sp = sprite(i, earned), out = '';
    for (var y = 0; y < sp.rows.length; y++) {
      var row = sp.rows[y], x = 0;
      while (x < row.length) {
        var ch = row.charAt(x);
        if (ch === '.') { x++; continue; }
        var x0 = x;
        while (x < row.length && row.charAt(x) === ch) x++;
        out += '<rect x="' + x0 + '" y="' + y + '" width="' + (x - x0) + '" height="1" fill="' + sp.pal[ch] + '"/>';
      }
    }
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + (W * scale) + '" height="' + (H * scale) + '" shape-rendering="crispEdges" aria-hidden="true">' + out + '</svg>';
  }

  window.STREAK_BADGES = {
    tiers: TIERS,
    sprite: sprite,
    svg: svg,
    count: function (best) { return TIERS.filter(function (t) { return best >= t.n; }).length; },
    top: function (best) {
      var idx = -1;
      TIERS.forEach(function (t, i) { if (best >= t.n) idx = i; });
      return idx;
    }
  };
})();
