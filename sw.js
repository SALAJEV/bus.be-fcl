const CACHE_NAME = "busbe-filmcodes-v6";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./logo.svg",
  "./logo.jpg",
  "./achtergrond-pc.jpg",
  "./achtergrond-gsm.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.toLowerCase().endsWith(".pdf")) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  const isStaticAsset = ["style", "script", "image", "font"].includes(event.request.destination);
  if (isStaticAsset || APP_SHELL.some((path) => url.pathname.endsWith(path.replace("./", "/")))) {
    event.respondWith(cacheFirstWithBackgroundUpdate(event.request));
  }
});

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (_error) {
    const cachedPage = await caches.match(request);
    if (cachedPage) {
      return cachedPage;
    }
    const fallbackPage = await caches.match("./index.html");
    if (fallbackPage) {
      return fallbackPage;
    }
    throw _error;
  }
}

async function cacheFirstWithBackgroundUpdate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cached);

  return cached || networkPromise;
}
