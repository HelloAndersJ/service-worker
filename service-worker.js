
// Service worker - This is going to work its magic

importScripts('node_modules/sw-toolbox/sw-toolbox.js');

const swCaches = {
  'static': 'static-cache',
  'dynamic': 'dynamic-cache'
};

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(swCaches.static)
    .then(function (cache) {
      return cache.addAll([
        '/offline-content/main.css',
        '/offline-content/cathat.jpg',
        '/offline-content/index.html',
      ])
    })
  )
})

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys()
    .then(function(keys) {
      return Promise.all(keys.filter(function(key) {
        return !Object.values(swCaches).includes(key)
      }).map(function(key) {
        return caches.delete(key)
      }))
    })
  )
})

toolbox.router.get('/offline-content/*', toolbox.cacheFirst, {
  cache: {
    name: swCaches.static,
    maxAgeSeconds: 60 * 60 * 24 * 365
  }
})

toolbox.router.get('/*', function(request, values, options) {
  return toolbox.networkFirst(request, values, options)
  .catch(function(err) {
    return caches.match(new Request('offline-content/index.html'))
  })
},
{
  networkTimeoutSeconds: 1,
  cache: {  
    name: swCaches.dynamic,
    maxEntries: 5
  }
})

// self.addEventListener('fetch', function(e) {
//   e.respondWith(
//     caches.match(e.request)
//     .then(function (res) {
//       if(res) {
//         return res
//       }
      
//       if(!navigator.onLine) {
//         return caches.match(new Request('/offline-content/index.html'))
//       }
//       return fetchAndUpdate(e.request)
//     })
//   )
// })

// function fetchAndUpdate(request) {
//   return fetch(request)
//   .then(function(res) {
//     if(res) {
//       return caches.open(version)
//       .then(function(cache) {
//         return cache.put(request, res.clone())
//         .then(function() {
//           return res
//         })
//       })
//     }
//   })
// }