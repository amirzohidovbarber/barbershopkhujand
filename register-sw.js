// sw/register-sw.js - registers service worker for PWA installability
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw/sw.js').then(()=>console.log('SW registered')).catch(()=>{});
}
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});
installBtn.addEventListener('click', async ()=>{
  if(deferredPrompt){
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
  } else {
    alert('Установка доступна только при размещении на HTTPS / реальном сервере.');
  }
});
