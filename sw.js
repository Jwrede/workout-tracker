// Service Worker for Workout Tracker PWA

const CACHE_NAME = 'workout-tracker-v1';
const ASSETS_TO_CACHE = [
  '/workout-tracker/',
  '/workout-tracker/index.html',
  '/workout-tracker/workout-mode.html',
  '/workout-tracker/workout-history.html',
  '/workout-tracker/statistics.html',
  '/workout-tracker/auth.js',
  '/workout-tracker/manifest.json',
  '/workout-tracker/icons/icon-192x192.png',
  '/workout-tracker/icons/icon-512x512.png',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...', event);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('[Service Worker] Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...', event);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Handle requests
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Cache hit
        }

        // Clone the request for the fetch call
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response
            caches.open(CACHE_NAME)
              .then(cache => {
                if (event.request.url.startsWith('http')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch failed:', error);
            // Return a custom offline response
            return new Response('You are offline. Please check your internet connection.', {
              status: 503,
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
}); 