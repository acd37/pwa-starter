var CACHE_STATIC = "static-v7";
var CACHE_DYNAMIC = "dynamic-v5";

self.addEventListener("install", function(event) {
  console.log("[Service Worker] Installing Service Worker ...", event);
  event.waitUntil(
    caches.open(CACHE_STATIC).then(function(cache) {
      console.log("[Service Worker] Precaching App Shell");
      cache.add("/");
      cache.add("/index.html");
      cache.add("/src/js/app.js");
      cache.add("/src/js/feed.js");
      cache.add("/src/js/promise.js");
      cache.add("/src/js/material.min.js");
      cache.add("/src/css/app.css");
      cache.add("/src/css/feed.css");
      cache.add("/src/images/main-image.jpg");
      cache.add("https://fonts.googleapis.com/css?family=Roboto:400,700");
      cache.add("https://fonts.googleapis.com/icon?family=Material+Icons");
      cache.add(
        "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css"
      );
    })
  );
});

self.addEventListener("activate", function(event) {
  console.log("[Service Worker] Activating Service Worker ....", event);
  event.waitUntil(
    // .keys() gives you back an array with all the keys of our caches
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== CACHE_STATIC && key !== CACHE_DYNAMIC) {
            console.log("[SERVICE WORKER] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request)
          .then(function(res) {
            caches.open(CACHE_DYNAMIC).then(function(cache) {
              // cache.put(event.request.url, res.clone());
              return res;
            });
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    })
  );
});
