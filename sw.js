const CACHE = 'wmb-v8-0';
const ASSETS = ['./', './index.html', './app.js', './config.js', './seed.js', './exercise_steps.js', './workout.js', './history.js', './profile.js', './settings.js', './install.js', './manifest.json', './icon.svg', './icon-maskable.svg', './splash.svg'];

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
  const url = new URL(e.request.url);

  // APIs e CDNs: deixa o browser cuidar (nunca cachear chamadas de dados)
  if (url.hostname.includes('supabase.co') || url.hostname.includes('jsdelivr.net') || url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) {
    return;
  }

  // Same-origin: NETWORK-FIRST — atualizações chegam na hora; cache é só fallback offline.
  // Resolve o problema crônico de versão antiga presa no iPhone.
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => {});
        return res;
      }).catch(() =>
        caches.match(e.request).then(r => r || caches.match('./index.html'))
      )
    );
    return;
  }

  // Outros domínios: cache-first
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => {});
      return res;
    }))
  );
});
