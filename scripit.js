// 🔗 SOSTITUISCI questo con il TUO URL della WebApp GAS:
const API_URL = "https://script.google.com/macros/s/AKfycbzfSWu-5kEGYGvX9bgqxAziGX374P4uvHgvi5N433e8F16OjWXUW8mWUDmWE777spnnGQ/exec";


// ====== FIRMA DIGITALE ======
let canvas, ctx, drawing = false;

function setupCanvas() {
  canvas = document.getElementById("pad");

  // se non c'è canvas (es. index.html o uscita.html) → non fare nulla
  if (!canvas) return;

  ctx = canvas.getContext("2d");
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  // ------ Mouse ------
  canvas.addEventListener("mousedown", () => drawing = true);
  canvas.addEventListener("mouseup", () => drawing = false);
  canvas.addEventListener("mousemove", e => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });

  // ------ Touch (telefono/tablet) ------
  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  });

  canvas.addEventListener("touchend", () => drawing = false);

  canvas.addEventListener("touchmove", e => {
    if (!drawing) return;

    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];

    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
  });
}

// Pulisci firma
function clearSignature() {
  if (canvas && ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}


// ====== INVIA ENTRATA ======
async function submitEntrata() {

  const nome = document.getElementById("nome").value;
  const cognome = document.getElementById("cognome").value;
  const email = document.getElementById("email").value;

  if (!nome || !cognome || !email) {
    alert("⚠ Inserisci nome, cognome ed email.");
    return;
  }

  if (!canvas) {
    alert("⚠ Errore: canvas firma non trovato.");
    return;
  }

  const firmaDataUrl = canvas.toDataURL();

  const payload = {
    type: "entrata",
    nome,
    cognome,
    email,
    firma: firmaDataUrl
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors"
  });

  alert("✔ Entrata registrata con successo!");
  window.location.href = "index.html";
}



// ====== INVIA USCITA ======
async function submitUscita() {

  const email = document.getElementById("emailUscita").value;

  if (!email) {
    alert("⚠ Inserisci l'email.");
    return;
  }

  const payload = {
    type: "uscita",
    email
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors"
  });

  alert("✔ Uscita registrata!");
  window.location.href = "index.html";
}


// ====== ATTIVA FIRMA SOLO SU PAGINA ENTRATA ======
document.addEventListener("DOMContentLoaded", setupCanvas);
