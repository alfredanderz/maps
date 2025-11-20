// Referencias a elementos del DOM
const $ = (selector) => document.querySelector(selector);

const permisoSpan = $("#permiso");
const latSpan = $("#lat");
const lngSpan = $("#lng");
const accSpan = $("#acc");
const timestampSpan = $("#timestamp");
const mensajeP = $("#mensaje");
const linkMaps = $("#link-maps");
const btnUbicacion = $("#btn-ubicacion");
const btnDetener = $("#btn-detener");

let watchId = null;

// Verificar permisos
if ("permissions" in navigator && navigator.permissions.query) {
  navigator.permissions
    .query({ name: "geolocation" })
    .then((result) => {
      permisoSpan.textContent = result.state;
      result.onchange = () => {
        permisoSpan.textContent = result.state;
      };
    })
    .catch(() => {
      permisoSpan.textContent = "no disponible";
    });
} else {
  permisoSpan.textContent = "desconocido";
}

// Formatear fecha
function formatTimestamp(ts) {
  const date = new Date(ts);
  return date.toLocaleString();
}

// Éxito al obtener ubicación
function onPositionSuccess(position) {
  const { latitude, longitude, accuracy } = position.coords;

  latSpan.textContent = latitude.toFixed(6);
  lngSpan.textContent = longitude.toFixed(6);
  accSpan.textContent = accuracy.toFixed(2);
  timestampSpan.textContent = formatTimestamp(position.timestamp);

  mensajeP.textContent = "✅ Ubicación actualizada correctamente.";
  mensajeP.style.color = "#059669";

  const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
  linkMaps.href = url;
  linkMaps.style.display = "inline-block";
}

// Error al obtener ubicación
function onPositionError(error) {
  console.error(error);
  mensajeP.style.color = "#dc2626";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      mensajeP.textContent =
        "❌ Permiso denegado. Revisa la configuración del navegador.";
      break;
    case error.POSITION_UNAVAILABLE:
      mensajeP.textContent = "❌ La ubicación no está disponible.";
      break;
    case error.TIMEOUT:
      mensajeP.textContent = "❌ La solicitud tardó demasiado.";
      break;
    default:
      mensajeP.textContent = "❌ Error al obtener la ubicación.";
  }
}

// Opciones de geolocalización
const geoOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

// Botón: Obtener ubicación
btnUbicacion.addEventListener("click", () => {
  if (!("geolocation" in navigator)) {
    mensajeP.textContent = "❌ Este navegador no soporta Geolocation API.";
    mensajeP.style.color = "#dc2626";
    return;
  }

  mensajeP.textContent = "📍 Obteniendo ubicación...";
  mensajeP.style.color = "#6b7280";

  navigator.geolocation.getCurrentPosition(
    onPositionSuccess,
    onPositionError,
    geoOptions
  );

  if (watchId === null) {
    watchId = navigator.geolocation.watchPosition(
      onPositionSuccess,
      onPositionError,
      geoOptions
    );
    btnDetener.disabled = false;
    mensajeP.textContent = "🔄 Seguimiento iniciado.";
  }
});

// Botón: Detener seguimiento
btnDetener.addEventListener("click", () => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    mensajeP.textContent = "🛑 Seguimiento detenido.";
    mensajeP.style.color = "#6b7280";
    btnDetener.disabled = true;
  }
});

// Registro del Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("✅ Service Worker registrado:", reg.scope))
      .catch((err) => console.error("❌ Error al registrar SW:", err));
  });
}
