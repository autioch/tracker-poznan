// Installing service worker
const CACHE_NAME = 'tracker-poznan-v1';

/* Add relative URL of all the static content you want to store in
 * cache storage (this will help us use our app offline)*/
const resourcesToCache = [
  // './data/',
  // './files/',
  './images/256.png',
  './images/512.png',
  './images/about.png',
  './favicon.ico',
  './index.html'
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(resourcesToCache))
  );
});

// Cache and return requests
self.addEventListener('fetch', (ev) => {
  ev.respondWith(
    caches.match(ev.request).then((response) => response || fetch(ev.request))
  );
});

self.addEventListener('fetch', (ev) => {
  ev.respondWith(
    caches
      .match(ev.request)
      .then((resp) => {
        return resp || fetch(ev.request)
          .then((response) => {
            caches.open(CACHE_NAME).then((cache) => cache.put(ev.request, response.clone()));

            return response;
          })
          .catch(() => caches.match('./images/about.png'))
      })
  );
});

// Update a service worker
const cacheWhitelist = [CACHE_NAME];

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
