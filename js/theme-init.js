  (function () {
    try {
      var root = document.documentElement;
      var theme = localStorage.getItem('site-theme');
      var shade = JSON.parse(localStorage.getItem('site-shade') || 'null');
      if (shade && shade.p) {
        root.style.setProperty('--paper', shade.p);
        root.style.setProperty('--paper-2', shade.p2);
        root.setAttribute('data-theme', shade.t);
      } else if (theme) {
        root.setAttribute('data-theme', theme);
      }
    } catch (e) {}
  })();
