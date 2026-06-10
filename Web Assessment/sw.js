const CACHE_NAME = 'travelnest-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './explorer.html',
  './budget.html',
  './generator.html',
  './mood.html',
  './feedback.html',
  './css/style.css',
  './css/index.css',
  './css/explorer.css',
  './css/budget.css',
  './css/generator.css',
  './css/mood.css',
  './css/feedback.css',
  './js/data.js',
  './js/app.js',
  './js/index.js',
  './js/explorer.js',
  './js/budget.js',
  './js/generator.js',
  './js/mood.js',
  './js/feedback.js',
  './assets/logo.png',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching shell assets offline');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Evicting old cache key', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, toCache));
        return response;
      }).catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
