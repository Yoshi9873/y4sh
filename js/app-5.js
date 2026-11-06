(function () {
  var el = document.getElementById('last-updated');
  if (!el || !window.fetch) return;
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function ordinal(n) {
    if (n % 100 >= 11 && n % 100 <= 13) return n + 'th';
    return n + (['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  }
  fetch(location.href, { method: 'HEAD', cache: 'no-store' }).then(function (r) {
    var h = r.headers.get('last-modified');
    var d = h ? new Date(h) : null;
    if (!d || isNaN(d.getTime()) || d.getFullYear() < 2026 || d.getTime() - Date.now() > 864e5) return;
    el.textContent = days[d.getDay()] + ' ' + ordinal(d.getDate()) + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }).catch(function () {});
})();
