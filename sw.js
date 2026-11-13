self.options = {
    "domain": "5gvci.com",
    "zoneId": 12249343
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')

self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => self.clients.claim());
self.addEventListener("fetch", e => e.respondWith(fetch(e.request)));
