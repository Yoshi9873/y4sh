(function () {
  var text = '@manlikey4sh', n = 0, typing = true;
  function step() {
    var delay = 130;
    if (typing) {
      n++;
      if (n >= text.length) { typing = false; delay = 1800; }
    } else {
      n--;
      delay = 70;
      if (n <= 0) { n = 0; typing = true; delay = 550; }
    }
    document.title = n > 0 ? text.slice(0, n) : '\u00A0';
    setTimeout(step, delay);
  }
  setTimeout(step, 400);
})();
