const CACHE_NAME = "cache-2";

self.addEventListener("install", (event) => {
  // TODO: Cache relevant resources
  // event.waitUntil(
  //   caches.open(CACHE_NAME).then((cache) => {
  //     return cache.addAll(["/"]);
  //   })
  // );
});

// TODO: Intercept requests and respond from either the cache or allow the request to continue
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });