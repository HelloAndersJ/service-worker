import "./scss/main.scss";

if('serviceWorker' in navigator) {
  navigator.serviceWorker
  .register('../../service-worker.js')
  .then(r => console.log('SW registered'))
  .catch(err => console.error('There is a problem', err))
}

if(!navigator.onLine){
  console.log('Status: OFFLINE!')
  let navList = document.querySelector('.nav')
  navList.classList.add('offline')

  caches.open('dynamic-cache')
    .then(c => c.keys())
    .then(keys => keys.map(key => {
      let urlParser = document.createElement('a')
      urlParser.href = key.url
      return urlParser.pathname
    }))
    .then(urls => urls.forEach(url => {
      let element = document.querySelector(`.nav a[href='${url}'`);
      
      if(element) {
        element.classList.add('visited');
      }
    }));
} else {
  console.log('Status: ONLINE!')
}

