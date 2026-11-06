(function () {
  var stone = document.getElementById('rip-stone');
  var text = document.getElementById('rip-text');
  if (!stone || !text) return;
  var LINES = [
    'Here lies my free time. Cause of death: A-levels.',
    'R.I.P. the last digit of \u03C0. Nobody ever found it.',
    'Here lies x. We finally found out why.',
    'R.I.P. my sleep schedule. Gone but not forgotten.',
    'Here lies 0.999\u2026 It was never really less than 1.',
    'Here lies the square root of -1. Too imaginary to survive.',
    'R.I.P. my motivation. Last seen on a Sunday evening.',
    'Here lies a student who divided by zero.',
    'Here lies a negative number. It was always a bit down.',
    'R.I.P. the Earth timeline slider. It had a good run.'
  ];
  var i = 0, reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ghost = document.querySelector('.hw-rip .rip-ghost');
  stone.addEventListener('click', function () {
    i = (i + 1) % LINES.length;
    if (reduce) { text.textContent = LINES[i]; return; }
    text.classList.add('swap');
    setTimeout(function () { text.textContent = LINES[i]; text.classList.remove('swap'); }, 160);
    if (ghost) { ghost.classList.remove('hop'); void ghost.getBoundingClientRect(); ghost.classList.add('hop'); }
  });
})();
