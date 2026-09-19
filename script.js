/* ==========================================================
   KS Gestão e Finanças — comportamento da página
   Tudo que muda com frequência está em CONFIG, DEPOIMENTOS e DICAS.
   ========================================================== */

const CONFIG = {
  // Somente números, com código do país e DDD (55 + 86 + número)
  whatsapp: "5586988164496",
  whatsappExibicao: "(86) 98816-4496",

  // Mensagem que aparece pronta quando a pessoa clica nos botões de WhatsApp
  mensagemPadrao:
    "Olá, Kirally! Vim pelo site da KS Gestão e Finanças e gostaria de saber mais sobre organização financeira para o meu negócio.",

  // Deixe vazio para esconder do site. Exemplo: "@ksgestaoefinancas"
  instagram: "",
  // Deixe vazio para esconder do site. Exemplo: "contato@exemplo.com"
  email: "",
};

/* Para mostrar a seção de depoimentos, adicione itens aqui:
   { texto: "Depoimento do cliente.", nome: "Nome", negocio: "Tipo de negócio" } */
const DEPOIMENTOS = [];

/* Para mostrar a seção de dicas, adicione itens aqui (o mais novo primeiro):
   { titulo: "Título", resumo: "Resumo curto.", data: "2026-09-20", link: "https://..." }
   O campo "link" é opcional. */
const DICAS = [];

/* ---------- WhatsApp ---------- */
function linkWhatsApp(mensagem) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

function iniciarWhatsApp() {
  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.href = linkWhatsApp(CONFIG.mensagemPadrao);
  });
  document.querySelectorAll("[data-wa-display]").forEach((el) => {
    el.textContent = CONFIG.whatsappExibicao;
  });
}

/* ---------- Contatos opcionais ---------- */
function iniciarContatosOpcionais() {
  const instagram = CONFIG.instagram.trim();
  if (instagram) {
    const usuario = instagram.replace(/^@/, "");
    const item = document.querySelector("[data-contact-instagram]");
    item.hidden = false;
    item.querySelector("a").href = `https://instagram.com/${encodeURIComponent(usuario)}`;
    item.querySelector("[data-instagram-display]").textContent = `@${usuario}`;
  }

  const email = CONFIG.email.trim();
  if (email) {
    const item = document.querySelector("[data-contact-email]");
    item.hidden = false;
    item.querySelector("a").href = `mailto:${email}`;
    item.querySelector("[data-email-display]").textContent = email;
  }
}

/* ---------- Cabeçalho e menu ---------- */
function iniciarCabecalho() {
  const header = document.querySelector(".site-header");
  const botao = document.querySelector(".nav-toggle");
  const menu = document.getElementById("menu");

  const atualizarRolagem = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  atualizarRolagem();
  window.addEventListener("scroll", atualizarRolagem, { passive: true });

  const definirAberto = (aberto) => {
    header.classList.toggle("is-open", aberto);
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  };

  botao.addEventListener("click", () => {
    definirAberto(!header.classList.contains("is-open"));
  });

  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) definirAberto(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("is-open")) {
      definirAberto(false);
      botao.focus();
    }
  });

  window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => {
    if (e.matches) definirAberto(false);
  });
}

/* ---------- Formulário: abre o WhatsApp com a mensagem pronta ---------- */
function iniciarFormulario() {
  const form = document.getElementById("form-contato");
  const campos = {
    nome: form.elements.nome,
    mensagem: form.elements.mensagem,
  };

  const mostrarErro = (campo, texto) => {
    const grupo = campo.closest(".field");
    const aviso = grupo.querySelector(".field__error");
    grupo.classList.toggle("has-error", Boolean(texto));
    campo.setAttribute("aria-invalid", texto ? "true" : "false");
    aviso.textContent = texto || "";
    aviso.hidden = !texto;
  };

  Object.values(campos).forEach((campo) => {
    campo.addEventListener("input", () => mostrarErro(campo, ""));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = campos.nome.value.trim();
    const mensagem = campos.mensagem.value.trim();
    const perfil = form.elements.perfil.value.trim();

    mostrarErro(campos.nome, nome ? "" : "Digite o seu nome.");
    mostrarErro(campos.mensagem, mensagem ? "" : "Conte rapidamente como posso ajudar.");

    if (!nome || !mensagem) {
      (nome ? campos.mensagem : campos.nome).focus();
      return;
    }

    const partes = [`Olá, Kirally! Meu nome é ${nome}.`];
    if (perfil) partes.push(`${perfil}.`);
    const texto = `${partes.join(" ")}\n\n${mensagem}\n\n(Mensagem enviada pelo site)`;

    const janela = window.open(linkWhatsApp(texto), "_blank", "noopener");
    if (!janela) window.location.href = linkWhatsApp(texto);
  });
}

/* ---------- Depoimentos (opcional) ---------- */
function criar(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto) el.textContent = texto;
  return el;
}

function iniciarDepoimentos() {
  if (!DEPOIMENTOS.length) return;
  const lista = document.getElementById("depoimentos-lista");

  DEPOIMENTOS.forEach((d) => {
    const bloco = criar("blockquote", "quote");
    bloco.appendChild(criar("p", "quote__text", `“${d.texto}”`));
    bloco.appendChild(criar("p", "quote__author", d.nome));
    if (d.negocio) bloco.appendChild(criar("p", "quote__meta", d.negocio));
    lista.appendChild(bloco);
  });

  document.getElementById("depoimentos").hidden = false;
}

/* ---------- Dicas (opcional) ---------- */
function iniciarDicas() {
  if (!DICAS.length) return;
  const lista = document.getElementById("dicas-lista");

  DICAS.forEach((d) => {
    const card = criar("article", "tip");
    if (d.data) {
      const data = new Date(`${d.data}T12:00:00`);
      const legivel = data.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
      const tempo = criar("time", "tip__date", legivel);
      tempo.dateTime = d.data;
      card.appendChild(tempo);
    }
    card.appendChild(criar("h3", "tip__title", d.titulo));
    card.appendChild(criar("p", "tip__text", d.resumo));
    if (d.link) {
      const link = criar("a", "tip__link", "Ler dica");
      link.href = d.link;
      link.target = "_blank";
      link.rel = "noopener";
      card.appendChild(link);
    }
    lista.appendChild(card);
  });

  document.getElementById("dicas").hidden = false;
  document.querySelector("[data-nav-dicas]").hidden = false;
}

/* ---------- Início ---------- */
document.getElementById("ano").textContent = new Date().getFullYear();
iniciarWhatsApp();
iniciarContatosOpcionais();
iniciarCabecalho();
iniciarFormulario();
iniciarDepoimentos();
iniciarDicas();
