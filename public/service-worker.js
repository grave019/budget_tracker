const STATIC_CACHE = "static-cache-v1";
const RUNTIME_CACHE = "runtime-cache";

self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('static').then( cache => {
        return cache.addAll([
            '/',
            '/index.html',
            '/manifest.json',
            '/styles.css',
            '/index.js',
            '/db.js',
            '/images/icons/icon-192x192.png',
            '/images/icons/icon-512x512.png'
        ]);
      })
    );
    console.log('Install');
    self.skipWaiting();
});

self.addEventListener("fetch", event => {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
        caches.open(RUNTIME_CACHE).then(cache => {
            return fetch(event.request)
            .then(response => {
                cache.put(event.request, response.clone());
                return response;
            })
            .catch(() => caches.match(event.request));
        })
        );
        return;
    }