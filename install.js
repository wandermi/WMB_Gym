// ===========================================
// INSTALL HELPER - Detecta plataforma e ajuda na instalação
// ===========================================

const INSTALL = {
  isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
  isStandalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
  isSafari: false, // determinado abaixo
  isChrome: false,
  dismissedKey: "wmb_install_dismissed_v2"
};

// Detectar navegador
const ua = navigator.userAgent.toLowerCase();
INSTALL.isChrome = /crios/i.test(ua); // CriOS = Chrome iOS
INSTALL.isSafari = !INSTALL.isChrome && /safari/.test(ua) && !/chrome/.test(ua);

// No iOS, todos navegadores não-Safari (Chrome, Firefox, Edge) usam WebKit
// Mas só Safari pode instalar PWA
if (INSTALL.isIOS && !INSTALL.isStandalone) {
  // Verificar se é Safari nativo ou outro navegador
  const isAnyWebKit = /AppleWebKit/.test(navigator.userAgent);
  const isChromeIOS = /CriOS/.test(navigator.userAgent);
  const isFirefoxIOS = /FxiOS/.test(navigator.userAgent);
  const isEdgeIOS = /EdgiOS/.test(navigator.userAgent);
  
  INSTALL.isOtherBrowser = isChromeIOS || isFirefoxIOS || isEdgeIOS;
  INSTALL.isSafari = isAnyWebKit && !INSTALL.isOtherBrowser;
}

function shouldShowInstallBanner() {
  // Não mostrar se já instalado
  if (INSTALL.isStandalone) return false;
  // Não mostrar se dispensou recentemente (24h)
  const dismissed = localStorage.getItem(INSTALL.dismissedKey);
  if (dismissed) {
    const time = parseInt(dismissed);
    if (Date.now() - time < 24 * 60 * 60 * 1000) return false;
  }
  return INSTALL.isIOS;
}

function dismissInstallBanner() {
  localStorage.setItem(INSTALL.dismissedKey, Date.now().toString());
  document.getElementById("install-banner")?.remove();
  document.getElementById("install-modal")?.remove();
}

function renderInstallBanner() {
  // Remove se já existir
  document.getElementById("install-banner")?.remove();
  
  if (!shouldShowInstallBanner()) return;
  
  const banner = document.createElement("div");
  banner.id = "install-banner";
  banner.className = "install-banner";
  
  if (INSTALL.isOtherBrowser) {
    // Chrome/Firefox/Edge no iOS - precisa do Safari
    banner.innerHTML = `
      <div class="ib-icon">⚠️</div>
      <div class="ib-content">
        <div class="ib-title">Use o Safari pra instalar</div>
        <div class="ib-desc">No iPhone, só o Safari permite instalar como app</div>
      </div>
      <button class="ib-action" data-act="showinstall">Ver como</button>
      <button class="ib-close" data-act="dismissinstall">✕</button>
    `;
  } else if (INSTALL.isSafari) {
    // Safari no iOS - pode instalar
    banner.innerHTML = `
      <div class="ib-icon">📱</div>
      <div class="ib-content">
        <div class="ib-title">Instale o WMB GYM</div>
        <div class="ib-desc">Toque em ⎙ e "Adicionar à Tela de Início"</div>
      </div>
      <button class="ib-action" data-act="showinstall">Como?</button>
      <button class="ib-close" data-act="dismissinstall">✕</button>
    `;
  }
  
  document.body.appendChild(banner);
}

function showInstallInstructions() {
  document.getElementById("install-modal")?.remove();
  
  const modal = document.createElement("div");
  modal.id = "install-modal";
  modal.className = "modal-overlay";
  modal.dataset.act = "dismissinstall";
  
  let content = "";
  
  if (INSTALL.isOtherBrowser) {
    content = `
      <div class="modal-sheet" onclick="event.stopPropagation()">
        <div class="modal-handle"></div>
        <div class="modal-title">📱 Como instalar no iPhone</div>
        <div class="install-step-list">
          <div class="install-step">
            <div class="is-num">1</div>
            <div class="is-content">
              <div class="is-title">Copie este link</div>
              <div class="is-url" data-act="copyurl">${location.origin}${location.pathname}</div>
              <button class="copy-btn" data-act="copyurl">📋 Copiar link</button>
            </div>
          </div>
          <div class="install-step">
            <div class="is-num">2</div>
            <div class="is-content">
              <div class="is-title">Abra o Safari</div>
              <div class="is-desc">O navegador padrão do iPhone (ícone azul de bússola)</div>
            </div>
          </div>
          <div class="install-step">
            <div class="is-num">3</div>
            <div class="is-content">
              <div class="is-title">Cole o link e abra</div>
              <div class="is-desc">No Safari, cole o link na barra de endereço</div>
            </div>
          </div>
          <div class="install-step">
            <div class="is-num">4</div>
            <div class="is-content">
              <div class="is-title">Toque no botão Compartilhar ⎙</div>
              <div class="is-desc">Quadrado com seta pra cima (barra inferior do Safari)</div>
            </div>
          </div>
          <div class="install-step">
            <div class="is-num">5</div>
            <div class="is-content">
              <div class="is-title">"Adicionar à Tela de Início"</div>
              <div class="is-desc">Role a lista de opções e toque nessa, depois em "Adicionar"</div>
            </div>
          </div>
        </div>
        <button class="auth-btn" data-act="dismissinstall" style="margin-top:14px">Entendi</button>
      </div>
    `;
  } else {
    content = `
      <div class="modal-sheet" onclick="event.stopPropagation()">
        <div class="modal-handle"></div>
        <div class="modal-title">📱 Instalar como app</div>
        <div class="install-step-list">
          <div class="install-step">
            <div class="is-num">1</div>
            <div class="is-content">
              <div class="is-title">Toque no botão Compartilhar</div>
              <div class="is-desc">Quadradinho com seta pra cima (⎙) na barra inferior do Safari</div>
            </div>
          </div>
          <div class="install-step">
            <div class="is-num">2</div>
            <div class="is-content">
              <div class="is-title">Role pra baixo na lista</div>
              <div class="is-desc">Procure "Adicionar à Tela de Início"</div>
            </div>
          </div>
          <div class="install-step">
            <div class="is-num">3</div>
            <div class="is-content">
              <div class="is-title">Toque em "Adicionar"</div>
              <div class="is-desc">No canto superior direito da tela</div>
            </div>
          </div>
          <div class="install-step">
            <div class="is-num">4</div>
            <div class="is-content">
              <div class="is-title">Pronto!</div>
              <div class="is-desc">O ícone do WMB GYM aparece na tela inicial</div>
            </div>
          </div>
        </div>
        <button class="auth-btn" data-act="dismissinstall" style="margin-top:14px">Entendi</button>
      </div>
    `;
  }
  
  modal.innerHTML = content;
  document.body.appendChild(modal);
}

function copyAppURL() {
  const url = `${location.origin}${location.pathname}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast("Link copiado! Agora cole no Safari", "success");
  }).catch(() => {
    showToast("Erro ao copiar. Link: " + url, "warn");
  });
}

// Adicionar listeners aos eventos de instalação
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const act = el.dataset.act;
  
  if (act === "showinstall") {
    e.stopPropagation();
    showInstallInstructions();
  } else if (act === "dismissinstall") {
    dismissInstallBanner();
  } else if (act === "copyurl") {
    e.stopPropagation();
    copyAppURL();
  }
});

// Mostrar banner após carregar
window.addEventListener("load", () => {
  setTimeout(renderInstallBanner, 1500); // Aguarda 1.5s pra não ser intrusivo
});
