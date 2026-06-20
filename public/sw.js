self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  self.clients.claim().then(() => {
    self.registration.unregister().then(() => {
      console.log('Service worker self-destructed.');
    });
  });
});
