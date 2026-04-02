const WHATSAPP_NUMERO = "5493513868459";

function formatoPrecio(n) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

function mensajeWhatsApp(titulo) {
  return `quiero ${titulo}`;
}

function urlWhatsApp(titulo) {
  const text = encodeURIComponent(mensajeWhatsApp(titulo));
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${text}`;
}

function abrirModal(producto) {
  const overlay = document.getElementById("modal-overlay");
  const img = document.getElementById("modal-img");
  const titulo = document.getElementById("modal-titulo");
  const precio = document.getElementById("modal-precio");
  const desc = document.getElementById("modal-desc");
  const wa = document.getElementById("modal-wa");

  img.src = producto.imagen;
  img.alt = producto.titulo;
  titulo.textContent = producto.titulo;
  precio.textContent = formatoPrecio(producto.precio);
  desc.textContent = producto.descripcion;
  wa.href = urlWhatsApp(producto.titulo);

  overlay.classList.add("abierto");
  overlay.setAttribute("aria-hidden", "false");
  document.getElementById("modal-cerrar").focus();
}

function cerrarModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("abierto");
  overlay.setAttribute("aria-hidden", "true");
}

function renderCatalogo() {
  const lista = window.PRODUCTOS || [];
  const root = document.getElementById("catalogo");
  root.innerHTML = "";

  lista.forEach((p) => {
    const article = document.createElement("article");
    article.className = "card";
    article.tabIndex = 0;
    article.setAttribute("role", "button");
    article.setAttribute(
      "aria-label",
      `Ver detalle de ${p.titulo}`
    );

    article.innerHTML = `
      <div class="card-img-wrap">
        <img src="${escapeAttr(p.imagen)}" alt="" loading="lazy" width="600" height="450" />
      </div>
      <div class="card-body">
        <h2>${escapeHtml(p.titulo)}</h2>
        <span class="precio">${formatoPrecio(p.precio)}</span>
        <a class="btn-wa" href="${escapeAttr(urlWhatsApp(p.titulo))}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
    `;

    const abrir = (e) => {
      if (e.target.closest(".btn-wa")) return;
      abrirModal(p);
    };

    article.addEventListener("click", abrir);
    article.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrir(e);
      }
    });

    const btnWa = article.querySelector(".btn-wa");
    btnWa.addEventListener("click", (e) => e.stopPropagation());

    root.appendChild(article);
  });
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalogo();

  document.getElementById("modal-cerrar").addEventListener("click", cerrarModal);
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "modal-overlay") cerrarModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModal();
  });
});
