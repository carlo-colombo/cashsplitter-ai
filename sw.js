const CACHE_NAME = 'vsa-1-cache';
const urlsToCache = [
    '/',
    '/index.html',
    'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css',
    'https://unpkg.com/htmx.org@1.9.10',
    'https://unpkg.com/dexie@3.2.4/dist/dexie.js',
    '/asp.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
