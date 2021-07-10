// Installing service worker
const CACHE_NAME = 'tracker-poznan';

/* Add relative URL of all the static content you want to store in
 * cache storage (this will help us use our app offline)*/
const resourcesToCache = ['./images/', './data/', './files/', './favicon.ico', './index.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(resourcesToCache))
  );
});

// Cache and return requests
self.addEventListener('fetch', (ev) => {
  ev.respondWith(
    caches.match(ev.request).then((response) => response || fetch(ev.request))
  );
});

// Update a service worker
const cacheWhitelist = ['tracker-poznan'];

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      })
    ))
  );
});
