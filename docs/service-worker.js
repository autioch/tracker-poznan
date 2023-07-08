// Installing service worker
const CACHE_NAME = 'tracker-poznan-v15';

/* Add relative URL of all the static content you want to store in
 * cache storage (this will help us use our app offline)*/
const resourcesToCache = [
  './',
  './favicon.ico',
  './index.html',
  './files/main.js',
  './files/main.css',
  './files/modules.js',
  './files/modules.css',

  './data/atm.json',
  './data/biedronka.json',
  './data/bus.json',
  './data/busLines.json',
  './data/busRanges.json',
  './data/chatapolska.json',
  './data/inpost.json',
  './data/lidl.json',
  './data/netto.json',
  './data/night.json',
  './data/nightLines.json',
  './data/nightRanges.json',
  './data/otherBus.json',
  './data/otherBusLines.json',
  './data/otherBusRanges.json',
  './data/pharmacy.json',
  './data/tram.json',
  './data/tramLines.json',
  './data/tramRanges.json',
  './data/zabka.json',

  './images/256.png',
  './images/512.png',
  './images/about.png',
  './images/atm.png',
  './images/biedronka.png',
  './images/bus.png',
  './images/center.png',
  './images/chatapolska.png',
  './images/close.png',
  './images/currentLocation.png',
  './images/custom.png',
  './images/inpost.png',
  './images/layers-2x.png',
  './images/layers.png',
  './images/lidl.png',
  './images/marker-icon.png',
  './images/measure.png',
  './images/minus.png',
  './images/netto.png',
  './images/night.png',
  './images/otherBus.png',
  './images/pharmacy.png',
  './images/plus.png',
  './images/settings.png',
  './images/tram.png',
  './images/zabka.png'
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(resourcesToCache))
  );
});

// Cache and return requests
self.addEventListener('fetch', (ev) => {

  if (!ev.request.url.startsWith('http')) {
    return;
  };
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
