const menuToggle = document.querySelector(".nav-toggle");
const menu = document.querySelector("#primary-menu");
const mobileViewport = window.matchMedia("(max-width: 900px)");
const submenuToggles = document.querySelectorAll(".submenu-toggle");

function closeSubmenus() {
  submenuToggles.forEach((toggle) => {
    toggle.setAttribute("aria-expanded", "false");
    document.getElementById(toggle.getAttribute("aria-controls")).classList.remove("is-open");
  });
}

function setMenuOpen(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("is-open", open);
  if (!open) closeSubmenus();
}

menu.classList.add("is-collapsible");
menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

submenuToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    closeSubmenus();
    toggle.setAttribute("aria-expanded", String(open));
    document.getElementById(toggle.getAttribute("aria-controls")).classList.toggle("is-open", open);
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".primary-nav")) setMenuOpen(false);
  if (event.target.closest(".nav-link, .submenu a")) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const activeSubmenu = [...submenuToggles].find((toggle) => toggle.getAttribute("aria-expanded") === "true");
  if (activeSubmenu) {
    closeSubmenus();
    activeSubmenu.focus();
  } else if (mobileViewport.matches && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

mobileViewport.addEventListener("change", () => setMenuOpen(false));

const searchForm = document.querySelector("#search-form");
const siteRoot = new URL("../../", document.querySelector('script[src$="assets/js/main.js"]').src);
const searchPages = [
  ["Nosotros", "index.html#nosotros", "Equipo misión visión Lonja"],
  ["Servicios de avalúos", "index.html#servicios", "Bienes activos valoración cotización"],
  ["Cómo solicitar un avalúo", "index.html#como-solicitar", "Proceso pasos solicitud visita informe"],
  ["Documentos y datos", "index.html#documentos", "Requisitos escritura planos certificado CHIP inventario"],
  ["Preguntas frecuentes", "index.html#preguntas", "Precio costo plazos ciudades cobertura documentos"],
  ["Cotizar un avalúo", "index.html#cotizar", "Formulario solicitud WhatsApp correo"],
  ["Formación en avalúos", "index.html#formacion", "Capacitación consulta cursos"],
  ["Asesoría inmobiliaria", "index.html#asesoria-inmobiliaria", "Consultoría inmuebles asesoramiento"],
  ["Afiliación", "afiliacion.html", "Miembros código ética actualización"],
  ["Contáctenos", "contactenos.html", "Contacto teléfono correo mensaje ubicación"],
  ["Aviso de privacidad", "aviso-de-privacidad.html", "Protección tratamiento datos personales derechos política"],
  ["Avalúo de inmuebles", "avaluos/avaluo-de-inmuebles.html", "Valor comercial propiedades vivienda"],
  ["Avalúo comercial", "avaluos/avaluo-comercial.html", "Valor mercado bienes"],
  ["Avalúo corporativo", "avaluos/avaluo-corporativo.html", "Colegiado activos equipo multidisciplinario"],
  ["Avalúo de renta de mercado", "avaluos/avaluo-de-renta-de-mercado.html", "Arrendamiento canon alquiler"],
  ["Avalúo de daños y mejoras", "avaluos/avaluo-de-danos-y-mejoras.html", "Diagnóstico reposición visita"],
  ["Avalúo catastral", "avaluos/avaluo-catastral.html", "Catastro terreno construcciones"],
  ["Autoavalúo", "avaluos/autoavaluo.html", "Autoestimación catastral"],
  ["Avalúo fiscal", "avaluos/avaluo-fiscal.html", "Costo fiscal tributario"],
];
const searchResults = document.createElement("section");
searchResults.className = "site-search-results page-wrap";
searchResults.setAttribute("aria-label", "Resultados de búsqueda");
searchResults.tabIndex = -1;
searchResults.hidden = true;
document.querySelector("main").before(searchResults);

function normalizeSearch(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = event.currentTarget.elements.q.value.trim();
  if (!query) {
    searchForm.elements.q.setCustomValidity("Escriba una palabra para buscar en el sitio.");
    searchForm.elements.q.reportValidity();
    return;
  }
  const terms = normalizeSearch(query).split(/\s+/);
  const matches = searchPages.filter(([title, , description]) => terms.every(term => normalizeSearch(`${title} ${description}`).includes(term)));
  const title = document.createElement("h2");
  title.textContent = `Resultados para «${query}»`;
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.textContent = matches.length ? `${matches.length} resultados en este sitio.` : "No encontramos coincidencias. Pruebe con avalúo, documentos, afiliación o contacto.";
  const list = document.createElement("ul");
  matches.forEach(([label, path, description]) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = new URL(path, siteRoot).href;
    link.textContent = label;
    const detail = document.createElement("p");
    detail.textContent = description;
    item.append(link, detail);
    list.append(item);
  });
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Cerrar resultados";
  close.addEventListener("click", () => {
    searchResults.hidden = true;
    searchForm.elements.q.focus();
  });
  searchResults.replaceChildren(title, status, list, close);
  searchResults.hidden = false;
  searchResults.focus();
  searchResults.scrollIntoView({ block: "start" });
});
searchForm.elements.q.addEventListener("input", () => searchForm.elements.q.setCustomValidity(""));
searchResults.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    searchResults.hidden = true;
    searchForm.elements.q.focus();
  }
});

function initializeQuoteForm(quoteForm, contact = false) {
  const formStatus = document.querySelector("#form-status");
  const requiredFields = [...quoteForm.querySelectorAll("[required]")];
  const completion = document.querySelector("#completion");
  const completionText = document.querySelector("#completion-text");
  const delivery = document.querySelector("#quote-delivery");
  const whatsappLink = document.querySelector("#quote-whatsapp");
  const emailLink = document.querySelector("#quote-email");
  const preview = document.querySelector("#quote-preview");
  if (completion) completion.max = requiredFields.length;

  function clearDelivery() {
    delivery.hidden = true;
    whatsappLink.removeAttribute("href");
    emailLink.removeAttribute("href");
    preview.value = "";
  }

  function updateCompletion() {
    if (!completion) return;
    const count = requiredFields.filter((field) => field.value.trim() && field.validity.valid).length;
    completion.value = count;
    completion.textContent = `${count} de ${requiredFields.length} campos`;
    completionText.textContent = completion.textContent;
  }

  quoteForm.addEventListener("input", (event) => {
    if (event.target === preview) return;
    event.target.removeAttribute("aria-invalid");
    formStatus.textContent = "";
    clearDelivery();
    updateCompletion();
  });

  quoteForm.addEventListener("invalid", (event) => {
    event.target.setAttribute("aria-invalid", "true");
  }, true);

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearDelivery();
    formStatus.className = "form-status";
    requiredFields.forEach((field) => field.removeAttribute("aria-invalid"));
    const email = quoteForm.elements.email.value.trim();
    const emailConfirm = contact ? email : quoteForm.elements["email-confirm"].value.trim();
    let invalidField;

    const emptyField = requiredFields.find((field) => !field.value.trim());
    if (emptyField) {
      formStatus.textContent = "Complete todos los campos requeridos antes de preparar la solicitud.";
      invalidField = emptyField;
    } else if (email !== emailConfirm) {
      formStatus.textContent = "Los correos electrónicos no coinciden. Verifique ambos campos.";
      invalidField = quoteForm.elements["email-confirm"];
    } else if (Number(quoteForm.elements["math-answer"].value) !== (contact ? 11 : 7)) {
      formStatus.textContent = "La respuesta de la pregunta matemática no es correcta. Inténtelo de nuevo.";
      invalidField = quoteForm.elements["math-answer"];
    }

    if (invalidField) {
      formStatus.classList.add("error");
      invalidField.setAttribute("aria-invalid", "true");
      invalidField.focus();
      return;
    }

    const fields = contact ? [
      ["Nombre", "name"],
      ["Ciudad o municipio", "city"],
      ["Correo electrónico", "email"],
      ["Teléfono o celular", "phone"],
      ["Asunto", "subject"],
      ["Mensaje", "message"],
    ] : [
      ["Nombre", "name"],
      ["Correo electrónico", "email"],
      ["Teléfono o celular", "phone"],
      ["Ciudad o municipio", "city"],
      ["Dirección", "address"],
      ["Tipo de bienes", "property-type"],
      ["Uso de los bienes", "use"],
      ["Propósito del avalúo", "purpose"],
      ["Destino del avalúo", "destination"],
      ["Detalles y observaciones", "message"],
    ];
    const subject = contact ? quoteForm.elements.subject.value.trim().replace(/[\r\n]/g, " ") : "Solicitud de cotización de avalúo";
    const message = [
      contact ? "Consulta desde el formulario de contacto" : subject,
      "",
      ...fields.map(([label, name]) => `${label}: ${quoteForm.elements[name].value.trim()}`),
    ].join("\r\n");
    whatsappLink.href = `https://wa.me/573192192684?text=${encodeURIComponent(message)}`;
    emailLink.href = `mailto:lonja@lonjadepropiedadraiz.com?cc=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    preview.value = message;
    delivery.hidden = false;
    formStatus.textContent = "Solicitud preparada, aún no enviada. Use las dos opciones siguientes para enviarla por WhatsApp y por correo con copia a su email.";
    formStatus.classList.add("info");
    formStatus.focus();
  });

  quoteForm.addEventListener("reset", () => {
    queueMicrotask(() => {
      requiredFields.forEach((field) => field.removeAttribute("aria-invalid"));
      formStatus.textContent = "";
      clearDelivery();
      updateCompletion();
    });
  });
  updateCompletion();
}

const quoteForm = document.querySelector("#quote-form");
if (quoteForm) initializeQuoteForm(quoteForm);
const contactForm = document.querySelector("#contact-form");
if (contactForm) initializeQuoteForm(contactForm, true);

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !motionPreference.matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    element.classList.add("reveal-ready");
    revealObserver.observe(element);
  });

  motionPreference.addEventListener("change", (event) => {
    if (event.matches) {
      revealObserver.disconnect();
      document.querySelectorAll(".reveal-ready").forEach((element) => element.classList.add("is-visible"));
    }
  });
}
