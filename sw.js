self.addEventListener("install", (event) => {
  console.log("SW instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("SW activado");
  return self.clients.claim();
});
