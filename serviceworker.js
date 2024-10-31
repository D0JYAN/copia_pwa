const currentCache = 'cache-v1.0';

const files =
    [
        'img/logo.png',
        'index.html'
    ];


//Instalar el Service Worker y cachear los recursos
self.addEventListener('install', (event) => {
    console.log('Instalando...');
    event.waitUntil(
        caches.open(currentCache)
            .then((cache) => {
                console.log('Archivos en caché');
                return cache.addAll(files);
            })
    );
});

//Interceptar solicitudes y responder con caché o red: monitorea cuando el usuario pide un recurso.
self.addEventListener('fetch', (event) => {
    console.log('solicitudes...');
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si hay una respuesta en caché, la devuelve, de lo contrario, busca en la red
                return response || fetch(event.request).then((response) => {
                    return caches.open(currentCache).then((cache) => {
                        console.log('respuesta de cache');
                        cache.put(event.request, response.clone()); // Guarda la respuesta en caché para futuras solicitudes
                        return response;
                    });
                });
            }).catch(() => {
                // Si no tiene caché ni acceso a la red, podrías servir una página o recurso por defecto
                return caches.match('/offline.html');
            })
    );
});
