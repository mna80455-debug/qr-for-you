const CACHE_NAME = 'qruniverse-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icons.svg',
  '/manifest.json'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then((networkResponse) => {
        // Cache successful requests dynamically
        if (
          networkResponse.status === 200 &&
          event.request.method === 'GET' &&
          (event.request.url.includes('/assets/') || event.request.url.includes('.svg'))
        ) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheCopy);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for offline pages
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Background Sync Listener
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-qrs') {
    event.waitUntil(
      // Perform background sync mock
      Promise.resolve(console.log('Background sync triggered: Syncing pending offline actions...'))
    );
  }
});
