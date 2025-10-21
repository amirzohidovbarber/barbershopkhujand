// sw/sw.js - minimal service worker to cache core files (simple offline support)
const CACHE_NAME = 'barber-prestige-v2';
const toCache = [
  '/','/index.html','/css/style.css','/css/responsive.css','/js/scroll-anim.js','/js/booking.js'
];
self.addEventListener('install', event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(toCache)));
});
self.addEventListener('fetch', event=>{
  event.respondWith(caches.match(event.request).then(resp=>resp || fetch(event.request)));
});
