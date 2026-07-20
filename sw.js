const CACHE_NAME = 'feamcrj-cache-v1.4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/painel.html',
  '/sobre.html',
  '/contato.html',
  '/cursos.html',
  '/torneios.html',
  '/cadastro-atleta.html',
  '/cadastro-professor.html',
  '/academias.html',
  '/documentos.html',
  '/loja.html',
  '/login.html',
  '/style.css',
  '/components.js',
  '/firebase-config.js',
  '/assets/icon.svg',
  '/manifest.json'
];

// Install Event - Caches essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching essential assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network First with Cache Fallback for maximum flexibility & live sync
self.addEventListener('fetch', (event) => {
  // Ignore Firestore / Auth / non-http requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle local application assets
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If successful, clone and put in cache
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If request is for a document, return root index.html
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});
