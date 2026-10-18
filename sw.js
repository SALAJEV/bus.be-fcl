const CACHE_NAME = "busbe-filmcodes-v40";
const APP_SHELL = [
  "./index.html",
  "./manifest.webmanifest",
  "./media/favicon.ico",
  "./media/busbe-logo.svg",
  "./media/app-icon.jpg",
  "./media/route-search-data.csv",
  "./media/background-desktop.jpg",
  "./media/background-mobile.jpg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
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
    event.respondWith(cacheFirstWithBackgroundUpdate(event.request, event));
    return;
  }

  const isStaticAsset = ["style", "script", "image", "font"].includes(event.request.destination);
  if (isStaticAsset || APP_SHELL.some((path) => url.pathname.endsWith(path.replace("./", "/")))) {
    event.respondWith(cacheFirstWithBackgroundUpdate(event.request, event));
  }
});

function cacheFirstWithBackgroundUpdate(request, event) {
  const cachePromise = caches.open(CACHE_NAME).catch((error) => {
    console.error("Service worker could not open the cache.", error);
    return null;
  });

  const networkPromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse.ok) {
        const cache = await cachePromise;
        if (cache) {
          try {
            await cache.put(request, networkResponse.clone());
          } catch (error) {
            console.error("Service worker could not update the cache.", error);
          }
        }
      }
      return networkResponse;
    })
    .catch(async (error) => {
      const cache = await cachePromise;
      const cached = cache && (await cache.match(request) || (request.mode === 'navigate' ? await cache.match('./index.html') : null));
      if (cached) {
        return cached;
      }
      throw error;
    });

  event.waitUntil(networkPromise.then(() => undefined, () => undefined));
  return cachePromise.then(async (cache) => {
    const cached = cache && (await cache.match(request) || (request.mode === 'navigate' ? await cache.match('./index.html') : null));
    return cached || networkPromise;
  });
}
