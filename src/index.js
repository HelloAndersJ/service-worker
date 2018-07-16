import "./scss/main.scss";

if('serviceWorker' in navigator) {
  navigator.serviceWorker
  .register('../../service-worker.js')
  .then(r => console.log('SW registered'))
  .catch(err => console.error('There is a problem', err))
}