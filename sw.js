// vsa-2: Implement a client-side server in the service worker.

const CACHE_NAME = 'vsa-2-cache';
const urlsToCache = [
    '/',
    '/index.html',
    'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css',
    'https://unpkg.com/htmx.org@1.9.10',
    'https://unpkg.com/dexie@3.2.4/dist/dexie.js',
    '/asp.js'
];

// Use importScripts to make Dexie available in the service worker
self.importScripts('https://unpkg.com/dexie@3.2.4/dist/dexie.js');
let db;

self.addEventListener('install', event => {
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    // Initialize the database when the service worker activates.
    db = new Dexie('LedgerDB');
    db.version(1).stores({
        events: '++event_id,timestamp,eventType,aggregateId',
        projections: 'projection_key'
    });
    console.log('Service Worker: LedgerDB initialized');

    // Take control of all open clients (pages) as soon as the service worker activates.
    event.waitUntil(self.clients.claim());
});

// --- HTML Generation ---

function renderHomeScreen() {
    return `
        <section class="section">
            <div class="container">
                <h1 class="title">Ledger Groups</h1>
                <p class="subtitle">Available expense groups.</p>
                <div id="group-list" hx-get="/components/group-list" hx-trigger="load, update-groups from:body" hx-swap="innerHTML">
                    <!-- Group list will be loaded here -->
                </div>
            </div>
        </section>
        <button class="button is-primary is-fab" onclick="App.openModal('new-group-modal')">+</button>
        <style>
            .is-fab {
                position: fixed;
                bottom: 20px;
                right: 20px;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 24px;
            }
        </style>
    `;
}

async function renderGroupList() {
    if (!db) {
        console.error("Database not initialized yet.");
        return '<p>Error: Database connection not available.</p>';
    }
    try {
        const projection = await db.projections.get('group_list');
        if (!projection || !projection.groups || Object.keys(projection.groups).length === 0) {
            return '<p>No groups found. Create one!</p>';
        }

        let groupCards = '';
        for (const groupId in projection.groups) {
            const group = projection.groups[groupId];
            groupCards += `
                <div class="card" style="margin-bottom: 1rem;">
                    <div class="card-content">
                        <p class="title is-4">${group.name}</p>
                        <p class="subtitle is-6">Members: ${group.members.join(', ')}</p>
                    </div>
                </div>
            `;
        }
        return groupCards;
    } catch (error) {
        console.error("Error fetching group list projection:", error);
        return '<p>Could not load groups.</p>';
    }
}


self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Routing logic for dynamic content
    if (url.pathname === '/') {
        event.respondWith(new Response(renderHomeScreen(), { headers: { 'Content-Type': 'text/html' } }));
        return;
    }

    if (url.pathname === '/components/group-list') {
        event.respondWith(
            renderGroupList().then(listHtml => {
                return new Response(listHtml, { headers: { 'Content-Type': 'text/html' } });
            })
        );
        return;
    }

    // Default cache-first strategy for other assets
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
