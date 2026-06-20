self.addEventListener('install', (event) => {
  // Force activation immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clear any cached assets from older service workers on start
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Pass-through strategy: satisfy PWA installation requirements
  // without caching assets, preventing version cache-locking bugs.
  event.respondWith(fetch(event.request));
});
