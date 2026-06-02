const CACHE = 'wmb-v5-1';
const ASSETS = ['./', './index.html', './app.js', './config.js', './seed.js', './workout.js', './history.js', './profile.js', './settings.js', './manifest.json', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith('http')) return;
  // Não cachear chamadas Supabase ou CDN externa
  const url = new URL(e.request.url);
  if (url.hostname.includes('supabase.co') || url.hostname.includes('jsdelivr.net') || url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) {
    return; // deixa o browser cuidar normalmente
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
