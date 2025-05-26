self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("legalbot-cache").then(cache => {
      return cache.addAll(["/", "/index.html", "/style.css", "/config.js"]);
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});