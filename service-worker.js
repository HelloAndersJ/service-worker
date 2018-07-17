
// Service worker - This is going to work its magic

//Just a random variable to see difference in updates
// let version = Math.floor((Math.random() * 100) + 1);
let version = 'v8'

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(version)
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
        return key !== version
      }).map(function(key) {
        return caches.delete(key)
      }))
    })
  )
})

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request)
    .then(function (res) {
      if(res) {
        return res
      }
      
      if(!navigator.onLine) {
        return caches.match(new Request('/offline-content/index.html'))
      }
      return fetchAndUpdate(e.request)
    })
  )
})

function fetchAndUpdate(request) {
  return fetch(request)
  .then(function(res) {
    if(res) {
      return caches.open(version)
      .then(function(cache) {
        return cache.put(request, res.clone())
        .then(function() {
          return res
        })
      })
    }
  })
}