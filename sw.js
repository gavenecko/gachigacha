// GachiGacha service worker: network-first so updates are never stuck; cache only as offline fallback.
const C="gg-cache-v3";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==C)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET"||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
let T=null;
self.addEventListener("message",e=>{const d=e.data||{};if(d.type==="schedule"){clearTimeout(T);if(d.ms>=0&&d.ms<6*3600e3)T=setTimeout(()=>self.registration.showNotification(d.title,{body:d.body,tag:d.tag||"need",icon:"icon-192.png",badge:"icon-192.png",renotify:true}),d.ms)}else if(d.type==="cancel")clearTimeout(T)});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>l.length?l[0].focus():self.clients.openWindow("./")))});
