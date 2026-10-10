const VERSION = 'v1';
const SHELL = 'y4sh-shell-' + VERSION;
const RUNTIME = 'y4sh-runtime-' + VERSION;
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];
const CACHEABLE_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.discordapp.com'];
const RUNTIME_LIMIT = 60;
const NAV_TIMEOUT = 4000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL)
      .then((cache) => Promise.allSettled(SHELL_FILES.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('y4sh-') && k !== SHELL && k !== RUNTIME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function trim(cache, max) {
  return cache.keys().then((keys) => {
    if (keys.length <= max) return null;
    return Promise.all(keys.slice(0, keys.length - max).map((k) => cache.delete(k)));
  });
}

function networkFirst(request) {
  return new Promise((resolve) => {
    let settled = false;
    const fromCache = () => caches.match(request, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html')).then((hit) => hit || caches.match('./'));
    const timer = setTimeout(() => {
      fromCache().then((hit) => { if (hit && !settled) { settled = true; resolve(hit); } });
    }, NAV_TIMEOUT);
    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(SHELL).then((cache) => { cache.put('./index.html', copy.clone()); cache.put(request, copy); });
        }
        if (!settled) { settled = true; resolve(response); }
      })
      .catch(() => {
        clearTimeout(timer);
        fromCache().then((hit) => { if (!settled) { settled = true; resolve(hit || Response.error()); } });
      });
  });
}

function staleWhileRevalidate(event, cacheName) {
  const request = event.request;
  return caches.open(cacheName).then((cache) =>
    cache.match(request).then((hit) => {
      const refresh = fetch(request)
        .then((response) => {
          if (response && (response.ok || response.type === 'opaque')) {
            cache.put(request, response.clone()).then(() => trim(cache, RUNTIME_LIMIT));
          }
          return response;
        })
        .catch(() => hit);
      event.waitUntil(refresh.catch(() => null));
      return hit || refresh;
    })
  );
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(event, SHELL));
    return;
  }
  if (CACHEABLE_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(event, RUNTIME));
  }
});
