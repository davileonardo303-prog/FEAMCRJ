/**
 * FEAMCRJ - Componentes Globais Compartilhados (Header e Footer)
 * Este arquivo injeta o Header e o Footer dinamicamente em todas as páginas do site.
 * Permite manter o código limpo, fácil de editar e 100% portátil para pen drives ou Google Drive.
 */

document.addEventListener('DOMContentLoaded', async () => {
  renderHeader();
  renderFooter();
  setupNavigationEvents();
  renderWhatsAppChatbox();
  if (typeof getSiteInfo === 'function') {
    await applySiteInfoConfig();
  }
});

function getActivePage() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  return page === '' ? 'index.html' : page;
}

function renderHeader() {
  const container = document.getElementById('header-container');
  if (!container) return;

  const activePage = getActivePage();
  const isLoggedIn = !!localStorage.getItem('feamcrj_logged_user');
  const loggedUser = isLoggedIn ? JSON.parse(localStorage.getItem('feamcrj_logged_user')) : null;

  const headerHTML = `
    <header class="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo Brand -->
          <a href="index.html" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-[1.5px] transition-transform duration-300 group-hover:scale-105">
              <div class="flex items-center justify-center w-full h-full bg-zinc-950 rounded-[9px]">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
            </div>
            <div>
              <span class="font-extrabold text-xl text-white tracking-tight">FEAM</span>
              <span class="font-extrabold text-xl text-amber-500 tracking-tight">CRJ</span>
              <span class="block text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Rio de Janeiro</span>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-1">
            <a href="index.html" class="px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${activePage === 'index.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'}">Início</a>
            <a href="sobre.html" class="px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${activePage === 'sobre.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'}">A Federação</a>
            <a href="torneios.html" class="px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${activePage === 'torneios.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'}">Torneios</a>
            <a href="cadastro-atleta.html" class="px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${activePage === 'cadastro-atleta.html' || activePage === 'cadastro-professor.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'}">Filiação</a>
            <a href="academias.html" class="px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${activePage === 'academias.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'}">Academias</a>
            <a href="loja.html" class="px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${activePage === 'loja.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'}">Loja Oficial</a>
            <a href="documentos.html" class="px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${activePage === 'documentos.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'}">Downloads</a>
            <a href="contato.html" class="px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${activePage === 'contato.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'}">Contato</a>
          </nav>

          <!-- CTAs / User Auth Portal -->
          <div class="hidden lg:flex items-center space-x-4">
            ${isLoggedIn ? `
              <div class="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
                <div class="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-bold uppercase text-sm">
                  ${loggedUser.name ? loggedUser.name.charAt(0) : 'U'}
                </div>
                <div class="text-left">
                  <span class="block text-xs font-bold text-white leading-tight truncate max-w-[100px]">${loggedUser.name}</span>
                  <a href="painel.html" class="text-[10px] text-amber-500 font-bold hover:underline">Ir para o Painel</a>
                </div>
                <button onclick="handleSignOut()" class="p-1 hover:text-red-500 text-zinc-500 transition-colors" title="Sair">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
              </div>
            ` : `
              <a href="login.html" class="text-sm font-bold text-zinc-300 hover:text-white transition-all">Portal do Filiado</a>
              <a href="cadastro-atleta.html" class="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-sm font-bold text-white hover:from-red-500 hover:to-amber-400 shadow-md shadow-amber-950/20 transition-all transform hover:-translate-y-0.5">Filie-se Já</a>
            `}
          </div>

          <!-- Mobile Hamburger Toggle -->
          <button id="mobile-menu-btn" class="lg:hidden p-2 text-zinc-400 hover:text-white focus:outline-none" aria-label="Menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>

        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      <div id="mobile-menu" class="hidden lg:hidden border-b border-zinc-900 bg-zinc-950 px-4 pt-2 pb-6 space-y-2">
        <a href="index.html" class="block px-3 py-2 rounded-lg text-base font-semibold ${activePage === 'index.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:bg-zinc-900'}">Início</a>
        <a href="sobre.html" class="block px-3 py-2 rounded-lg text-base font-semibold ${activePage === 'sobre.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:bg-zinc-900'}">A Federação</a>
        <a href="torneios.html" class="block px-3 py-2 rounded-lg text-base font-semibold ${activePage === 'torneios.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:bg-zinc-900'}">Torneios</a>
        <a href="cadastro-atleta.html" class="block px-3 py-2 rounded-lg text-base font-semibold ${activePage === 'cadastro-atleta.html' || activePage === 'cadastro-professor.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:bg-zinc-900'}">Filiação Atletas</a>
        <a href="cadastro-professor.html" class="block px-3 py-2 rounded-lg text-base font-semibold ${activePage === 'cadastro-professor.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:bg-zinc-900'}">Filiação Academias</a>
        <a href="academias.html" class="block px-3 py-2 rounded-lg text-base font-semibold ${activePage === 'academias.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:bg-zinc-900'}">Academias credenciadas</a>
        <a href="loja.html" class="block px-3 py-2 rounded-lg text-base font-semibold ${activePage === 'loja.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:bg-zinc-900'}">Loja Oficial</a>
        <a href="documentos.html" class="block px-3 py-2 rounded-lg text-base font-semibold ${activePage === 'documentos.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:bg-zinc-900'}">Downloads / Leis</a>
        <a href="contato.html" class="block px-3 py-2 rounded-lg text-base font-semibold ${activePage === 'contato.html' ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-300 hover:bg-zinc-900'}">Contato</a>
        <div class="pt-4 border-t border-zinc-900 flex flex-col space-y-2">
          ${isLoggedIn ? `
            <div class="flex items-center justify-between p-3 bg-zinc-900 rounded-xl">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-bold uppercase text-sm">
                  ${loggedUser.name ? loggedUser.name.charAt(0) : 'U'}
                </div>
                <div>
                  <span class="block text-xs font-bold text-white">${loggedUser.name}</span>
                  <span class="block text-[10px] text-zinc-400">${loggedUser.email}</span>
                </div>
              </div>
              <a href="painel.html" class="text-xs bg-amber-500 text-zinc-950 font-bold px-3 py-1 rounded-lg">Painel</a>
            </div>
            <button onclick="handleSignOut()" class="w-full text-center py-2 border border-red-500/30 text-red-400 font-bold text-sm rounded-xl">Desconectar</button>
          ` : `
            <a href="login.html" class="w-full text-center py-2.5 border border-zinc-800 text-zinc-300 font-bold text-sm rounded-xl hover:bg-zinc-900">Portal do Filiado</a>
            <a href="cadastro-atleta.html" class="w-full text-center py-2.5 bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold text-sm rounded-xl hover:from-red-500 hover:to-amber-400">Filie-se Já</a>
          `}
        </div>
      </div>
    </header>
  `;

  container.innerHTML = headerHTML;
}

function renderFooter(info) {
  const container = document.getElementById('footer-container');
  if (!container) return;

  const currentYear = new Date().getFullYear();

  // Try to load synchronously from localStorage if info isn't supplied
  let siteInfo = info;
  if (!siteInfo) {
    try {
      const local = localStorage.getItem('feam_site_info');
      siteInfo = local ? JSON.parse(local) : null;
    } catch(e) {}
  }

  const desc = siteInfo?.footerDescription || "FEDERAÇÃO ESPORTIVA DE ARTE MARCIAL E COMBATE RIO DE JANEIRO. <br /> Entidade oficial reguladora e fomentadora do desporto de combate e artes marciais no estado do Rio de Janeiro.";
  const pres = siteInfo?.president || "Grão-Mestre Roberto Albuquerque";
  const vice = siteInfo?.vicePresident || "Mestre Alexandre Silva";
  const tech = siteInfo?.techDirector || "Mestre Wellington Santos";
  const rel = siteInfo?.publicRelations || "Dra. Beatriz Ferreira Souza";
  const email = siteInfo?.contactEmail || "secretaria@feamcrj.com.br";
  const phone = siteInfo?.contactPhone || "(21) 2568-9876";
  const address = siteInfo?.contactAddress || "Rua Conde de Bonfim, 342 - Sala 501 - Tijuca";
  const city = siteInfo?.contactCity || "Rio de Janeiro - RJ";
  const cartorio = siteInfo?.cartorioText || "Homologada sob Registro de Cartório Civil de Pessoa Jurídica nº 812.428-RJ";

  const footerHTML = `
    <footer class="bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Main Grid Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          <!-- Col 1: Brand details -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-[1.5px]">
                <div class="flex items-center justify-center w-full h-full bg-zinc-950 rounded-[9px]">
                  <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <span class="font-extrabold text-xl text-white tracking-tight">FEAM</span>
                <span class="font-extrabold text-xl text-amber-500 tracking-tight">CRJ</span>
              </div>
            </div>
            
            <p class="text-xs text-zinc-500 leading-relaxed">
              ${desc}
            </p>
          </div>

          <!-- Col 2: Board / Diretoria -->
          <div class="space-y-3">
            <h4 class="text-xs font-black uppercase tracking-widest text-white">Conselho Executivo</h4>
            <ul class="text-xs space-y-1.5 text-zinc-500">
              <li><strong class="text-zinc-400">Presidente:</strong> ${pres}</li>
              <li><strong class="text-zinc-400">Vice-Presidente:</strong> ${vice}</li>
              <li><strong class="text-zinc-400">Diretor Técnico:</strong> ${tech}</li>
              <li><strong class="text-zinc-400">Relações Públicas:</strong> ${rel}</li>
            </ul>
          </div>

          <!-- Col 3: Useful Links -->
          <div class="space-y-3">
            <h4 class="text-xs font-black uppercase tracking-widest text-white">Links Úteis</h4>
            <ul class="text-xs space-y-2">
              <li>
                <a href="https://www.rj.gov.br/" target="_blank" rel="noopener" class="hover:text-amber-500 flex items-center space-x-1 transition-colors">
                  <span>Secretaria de Esportes RJ</span>
                  <svg class="w-3 h-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              </li>
              <li>
                <a href="torneios.html" class="hover:text-amber-500 flex items-center space-x-1 transition-colors">
                  <span>Inscrição em Torneios</span>
                </a>
              </li>
              <li>
                <a href="documentos.html" class="hover:text-amber-500 flex items-center space-x-1 transition-colors">
                  <span>Código de Ética Esportiva</span>
                </a>
              </li>
              <li>
                <a href="cadastro-professor.html" class="hover:text-amber-500 flex items-center space-x-1 transition-colors">
                  <span>Credenciar Minha Academia</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Col 4: Contacts quick block -->
          <div class="space-y-3">
            <h4 class="text-xs font-black uppercase tracking-widest text-white">Secretaria de Lutas</h4>
            <div class="text-xs space-y-2 text-zinc-500">
              <p class="flex items-center">
                <svg class="w-4 h-4 text-amber-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>${email}</span>
              </p>
              <p class="flex items-center">
                <svg class="w-4 h-4 text-amber-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>${phone}</span>
              </p>
              <p>
                ${address} <br />
                ${city}
              </p>
            </div>
          </div>

        </div>

        <!-- Bottom Bar: Copyright details -->
        <div class="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <p>© ${currentYear} FEAMCRJ - Todos os direitos reservados.</p>
          <p class="font-mono text-[10px]">${cartorio}</p>
        </div>

      </div>
    </footer>
  `;

  container.innerHTML = footerHTML;
}

function setupNavigationEvents() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function handleSignOut() {
  localStorage.removeItem('feamcrj_logged_user');
  window.location.href = 'index.html';
}

async function applySiteInfoConfig() {
  try {
    const info = await getSiteInfo();
    
    // 1. If we are on index.html or empty path, update stats and hero
    const activePage = getActivePage();
    if (activePage === 'index.html' || activePage === '') {
      const heroTitleEl = document.querySelector('h1');
      if (heroTitleEl && info.heroTitle) {
        if (heroTitleEl.textContent.includes("Templo do Combate") || heroTitleEl.innerHTML.includes("Templo do Combate")) {
          heroTitleEl.innerHTML = info.heroTitle;
        }
      }
      // Look for hero subtitle p
      const paragraphs = document.querySelectorAll('p');
      paragraphs.forEach(p => {
        if (p.textContent.includes("A FEAMCRJ é a entidade oficial") || p.textContent.includes("FEAMCRJ é a entidade oficial")) {
          p.innerHTML = info.heroSubtitle;
        }
      });
      
      // Update statistics
      const statsContainers = document.querySelectorAll('section div.text-center');
      if (statsContainers && statsContainers.length > 0) {
        statsContainers.forEach(div => {
          const text = div.textContent;
          if (text.includes("Atletas Federados")) {
            const span = div.querySelector('span:first-child');
            if (span) span.textContent = info.statAtletas || '1.800+';
          } else if (text.includes("Academias Certificadas")) {
            const span = div.querySelector('span:first-child');
            if (span) span.textContent = info.statAcademias || '85+';
          } else if (text.includes("Grandes Torneios / Ano")) {
            const span = div.querySelector('span:first-child');
            if (span) span.textContent = info.statTorneios || '14';
          } else if (text.includes("Oficial e Homologado")) {
            const span = div.querySelector('span:first-child');
            if (span) span.textContent = info.statOficial || '100%';
          }
        });
      }
    }
    
    // 2. Alert message banner at the top of the header if configured!
    if (info.alertMessage && info.alertMessage.trim() !== "") {
      const header = document.querySelector('header');
      if (header && !document.getElementById('feam-alert-banner')) {
        const banner = document.createElement('div');
        banner.id = 'feam-alert-banner';
        banner.className = "bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-zinc-950 font-extrabold text-[11px] text-center py-2.5 px-4 uppercase tracking-widest relative flex items-center justify-center gap-2 border-b border-orange-500/20";
        banner.innerHTML = `
          <svg class="w-3.5 h-3.5 animate-bounce shrink-0 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <span>${info.alertMessage}</span>
        `;
        header.parentNode.insertBefore(banner, header);
      }
    }

    // 3. Update the footer dynamically with any customized text
    renderFooter(info);
  } catch (error) {
    console.warn("Could not apply site configuration: ", error);
  }
}

// MODAL CUSTOMIZADO E SEGURO (Substituto do window.alert para iframes cross-origin)
function showCustomModal(options = {}) {
  const {
    title = 'Notificação',
    message = '',
    onConfirm = null,
    confirmText = 'Entendi',
    type = 'info' // info, success, error
  } = options;

  // Remove qualquer modal existente
  const existing = document.getElementById('feam-custom-modal');
  if (existing) {
    existing.remove();
  }

  // Cria o container do modal
  const modal = document.createElement('div');
  modal.id = 'feam-custom-modal';
  modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300';
  
  let iconHTML = '';
  let btnColor = 'bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400';

  if (type === 'success') {
    iconHTML = `
      <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
        </svg>
      </div>
    `;
    btnColor = 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-450';
  } else if (type === 'error') {
    iconHTML = `
      <div class="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
        </svg>
      </div>
    `;
    btnColor = 'bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-450';
  } else {
    iconHTML = `
      <div class="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path>
        </svg>
      </div>
    `;
  }

  modal.innerHTML = `
    <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden transform scale-95 transition-all duration-300">
      <div class="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="flex flex-col items-center text-center">
        ${iconHTML}
        
        <h3 class="text-xl font-black uppercase tracking-tight text-white mb-2 font-display">${title}</h3>
        <p class="text-zinc-400 text-sm leading-relaxed mb-6 whitespace-pre-line">${message}</p>
        
        <button id="feam-modal-confirm" class="w-full py-3.5 rounded-xl text-white text-xs font-bold uppercase tracking-widest ${btnColor} shadow-md transition-all active:scale-95">
          ${confirmText}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  setTimeout(() => {
    const dialog = modal.querySelector('div');
    if (dialog) dialog.classList.remove('scale-95');
  }, 10);

  const confirmBtn = modal.querySelector('#feam-modal-confirm');
  if (confirmBtn) {
    confirmBtn.focus();
    confirmBtn.addEventListener('click', () => {
      modal.remove();
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    });
  }
}

// Redefine window.alert para usar o modal customizado de forma transparente
window.showCustomModal = showCustomModal;
window.alert = function(msg) {
  console.log("📢 Intercepted alert: ", msg);
  let type = 'info';
  let title = 'FEAMCRJ';
  const lower = String(msg).toLowerCase();
  
  if (lower.includes('sucesso') || lower.includes('enviado') || lower.includes('aprovada') || lower.includes('homologado') || lower.includes('salvo') || lower.includes('chancelado') || lower.includes('copiada')) {
    type = 'success';
    title = 'Sucesso';
  } else if (lower.includes('erro') || lower.includes('falha') || lower.includes('rejeitado') || lower.includes('senha incorreta') || lower.includes('pendente')) {
    type = 'error';
    title = 'Atenção';
  }
  
  showCustomModal({
    title,
    message: msg,
    type,
    confirmText: 'Entendi'
  });
};

// ==========================================
// CHATBOT DE SUPORTE WHATSAPP INTERATIVO
// ==========================================
function renderWhatsAppChatbox() {
  if (document.getElementById('whatsapp-support-widget')) return;

  const widget = document.createElement('div');
  widget.id = 'whatsapp-support-widget';
  widget.className = 'fixed bottom-6 right-6 z-[9999] font-sans flex flex-col items-end';

  widget.innerHTML = `
    <!-- Botão Flutuante (Chamar WhatsApp) -->
    <button id="whatsapp-floating-btn" class="relative group w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-emerald-400 cursor-pointer focus:outline-none">
      <!-- Badge de Notificação -->
      <span id="whatsapp-badge" class="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950 animate-pulse">1</span>
      
      <!-- Ícone SVG Oficial do WhatsApp -->
      <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </button>

    <!-- Painel de Chat Integrado -->
    <div id="whatsapp-chat-panel" class="absolute bottom-20 right-0 w-[360px] max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100vh-120px)] bg-zinc-950 border border-zinc-850 rounded-3xl shadow-2xl flex flex-col overflow-hidden hidden transform translate-y-4 opacity-0 transition-all duration-300">
      
      <!-- Cabeçalho do Chat -->
      <div class="bg-emerald-600 px-4 py-3 flex items-center gap-3 border-b border-emerald-700 shrink-0">
        <!-- Avatar Circular -->
        <div class="w-10 h-10 rounded-full bg-zinc-950/25 border border-white/10 flex items-center justify-center font-extrabold text-white text-sm select-none">
          <span>FM</span>
        </div>
        
        <!-- Identificação e Status -->
        <div>
          <h4 class="text-xs font-black text-white uppercase tracking-wider leading-none mb-1">FEAMCRJ Suporte</h4>
          <span id="whatsapp-status" class="text-[10px] text-emerald-100 flex items-center gap-1 leading-none font-semibold">
            <span class="w-1.5 h-1.5 bg-emerald-300 rounded-full inline-block animate-pulse"></span>
            Online (Assistente)
          </span>
        </div>
        
        <!-- Botão Fechar -->
        <button id="whatsapp-close-btn" class="ml-auto text-white hover:text-emerald-100 p-1.5 hover:bg-emerald-500 rounded-xl transition-all cursor-pointer focus:outline-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Área de Conversação -->
      <div id="whatsapp-messages-container" class="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900 flex flex-col scrollbar-thin" style="background-image: radial-gradient(circle, rgba(16, 185, 129, 0.03) 1px, transparent 1px); background-size: 16px 16px;">
        <!-- Mensagens inseridas aqui dinamicamente -->
      </div>

      <!-- Barra de Mensagem / Entrada -->
      <div class="p-3 bg-zinc-950 border-t border-zinc-900 flex gap-2 items-center shrink-0">
        <input id="whatsapp-input" type="text" placeholder="Escreva sua dúvida..." class="flex-1 bg-zinc-900 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-zinc-500 transition-all font-medium" />
        <button id="whatsapp-send-btn" class="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer flex items-center justify-center focus:outline-none">
          <svg class="w-4 h-4 transform rotate-45 -mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  const floatBtn = document.getElementById('whatsapp-floating-btn');
  const chatPanel = document.getElementById('whatsapp-chat-panel');
  const closeBtn = document.getElementById('whatsapp-close-btn');
  const badge = document.getElementById('whatsapp-badge');
  const messagesContainer = document.getElementById('whatsapp-messages-container');
  const chatInput = document.getElementById('whatsapp-input');
  const sendBtn = document.getElementById('whatsapp-send-btn');
  const statusIndicator = document.getElementById('whatsapp-status');

  let isChatOpen = false;
  let isHumanAgent = false;
  let activeChatId = localStorage.getItem('feamcrj_active_chat_id');
  let chatUnsubscribe = null;

  const welcomeText = `Olá! Seja muito bem-vindo ao suporte virtual da **FEAMCRJ**! 🥋\n\nEstou aqui para tirar suas dúvidas sobre filiações, anuidades ou credenciamento de forma super rápida!\n\n**O que você deseja fazer?** Selecione uma opção abaixo ou digite sua dúvida no campo de texto:`;

  const presetOptions = [
    { text: "🥋 Como se filiar (Atletas)", value: "filiacao_atleta" },
    { text: "🏢 Credenciar Academia (Professores)", value: "filiacao_prof" },
    { text: "💰 Taxa anual e PIX (R$ 70)", value: "taxa_filiacao" },
    { text: "📲 Como enviar o comprovante do PIX", value: "enviar_comprovante" },
    { text: "💬 Falar com um Atendente Humano", value: "falar_atendente" }
  ];

  function addMessage(text, isIncoming = true) {
    const msgBlock = document.createElement('div');
    
    if (isIncoming) {
      msgBlock.className = "bg-zinc-850 text-zinc-200 border border-zinc-800 self-start max-w-[85%] rounded-2xl rounded-tl-none p-3 text-[11px] sm:text-xs leading-relaxed shadow-md relative animate-fade-in shrink-0";
      let htmlContent = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      htmlContent = htmlContent.replace(/\n/g, '<br />');
      msgBlock.innerHTML = htmlContent;
    } else {
      msgBlock.className = "bg-emerald-600 text-white self-end max-w-[85%] rounded-2xl rounded-tr-none p-3 text-[11px] sm:text-xs leading-relaxed shadow-md relative animate-fade-in shrink-0";
      msgBlock.textContent = text;
      
      const ticks = document.createElement('span');
      ticks.className = "block text-right text-[9px] text-emerald-200 mt-1 select-none leading-none";
      ticks.innerHTML = `✓✓`;
      msgBlock.appendChild(ticks);
    }

    messagesContainer.appendChild(msgBlock);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showQuickReplies() {
    if (isHumanAgent) return;
    
    const optionsBlock = document.createElement('div');
    optionsBlock.className = "flex flex-col gap-1.5 pt-1 animate-fade-in shrink-0";
    optionsBlock.id = "chat-quick-replies";

    presetOptions.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = "w-full text-left bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-emerald-500/50 text-zinc-300 hover:text-white transition-all text-[11px] sm:text-xs px-3.5 py-2.5 rounded-xl cursor-pointer font-medium active:scale-98 shadow-sm flex items-center justify-between focus:outline-none";
      btn.innerHTML = `
        <span>${opt.text}</span>
        <svg class="w-3 h-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
      `;
      btn.onclick = () => {
        optionsBlock.remove();
        handleUserMessage(opt.text, opt.value);
      };
      optionsBlock.appendChild(btn);
    });

    messagesContainer.appendChild(optionsBlock);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTypingIndicator(callback, duration = 1200) {
    statusIndicator.innerHTML = `
      <span class="w-1.5 h-1.5 bg-emerald-300 rounded-full inline-block animate-pulse"></span>
      Digitando...
    `;
    
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.className = "bg-zinc-850 border border-zinc-800 self-start rounded-2xl rounded-tl-none p-3 px-4 flex items-center gap-1 shadow-sm shrink-0";
    typingIndicator.innerHTML = `
      <span class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce animate-duration-500" style="animation-delay: 0ms"></span>
      <span class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce animate-duration-500" style="animation-delay: 150ms"></span>
      <span class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce animate-duration-500" style="animation-delay: 300ms"></span>
    `;
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
      const el = document.getElementById('typing-indicator');
      if (el) el.remove();
      
      statusIndicator.innerHTML = isHumanAgent ? `
        <span class="w-1.5 h-1.5 bg-emerald-300 rounded-full inline-block animate-pulse"></span>
        Online (Atendente)
      ` : `
        <span class="w-1.5 h-1.5 bg-emerald-300 rounded-full inline-block animate-pulse"></span>
        Online (Assistente)
      `;
      
      callback();
    }, duration);
  }

  function getBotResponse(intentValue, userText) {
    const textLower = userText.toLowerCase();

    if (intentValue === 'filiacao_atleta' || textLower.includes('atleta') || textLower.includes('filiar atleta')) {
      return `🥋 **Filiação de Atletas (Passo a Passo):**\n\n1. Acesse o formulário de inscrição em **Filiação Atletas** (cadastro-atleta.html).\n2. Preencha seus dados pessoais, graduação (faixa) e escolha sua academia vinculada.\n3. Após preencher, você visualizará os dados do **PIX de R$ 70,00** para pagamento da anuidade.\n4. Realize o PIX e envie o comprovante. Assim que aprovado pelo nosso administrador, você receberá sua carteira digital e acesso ao portal!`;
    }

    if (intentValue === 'filiacao_prof' || textLower.includes('professor') || textLower.includes('credenciar') || textLower.includes('professor')) {
      return `🏢 **Credenciamento de Academias / Professores:**\n\n1. Acesse o formulário em **Credenciar Academia** (cadastro-professor.html).\n2. Preencha as informações do responsável técnico (Professor Faixa Preta homologado) e da academia.\n3. Efetue o pagamento da taxa anual de **R$ 70,00** por meio do PIX.\n4. Após a aprovação da academia por parte do nosso administrador, os seus atletas poderão se filiar escolhendo sua academia no cadastro!`;
    }

    if (intentValue === 'taxa_filiacao' || textLower.includes('pix') || textLower.includes('taxa') || textLower.includes('pagar') || textLower.includes('valor')) {
      return `💰 **Taxa Anual de Filiação / Credenciamento:**\n\nO valor é fixo de **R$ 70,00** por atleta ou por academia/CT credenciado.\n\n**Chave PIX Oficial (Celular):**\n\`21993370397\`\n\n**Favorecido:** Federação Esportiva de Arte Marcial e Combate RJ\n\n*⚠️ Importante: O administrador aprova a conta no painel assim que confirma o recebimento do PIX!*`;
    }

    if (intentValue === 'enviar_comprovante' || textLower.includes('comprovante') || textLower.includes('enviar comprovante')) {
      return `📲 **Como enviar o Comprovante do PIX:**\n\n1. **Após Login:** Faça login no Portal do Filiado (login.html), vá no seu **Painel**, e clique no botão **Enviar Comprovante por WhatsApp**.\n2. **Ou Direto:** Envie a imagem do comprovante para o nosso WhatsApp oficial: **(21) 99337-0397** informando seu nome completo e CPF.\n\nA aprovação é feita de forma extremamente rápida por nossa diretoria técnica!`;
    }

    if (intentValue === 'falar_atendente' || textLower.includes('atendente') || textLower.includes('humano') || textLower.includes('suporte')) {
      isHumanAgent = true;
      return `Perfeito! Estou transferindo agora mesmo a sua conversa para um atendente humano da diretoria da **FEAMCRJ**... 📲\n\nPor favor, aguarde um segundo enquanto o atendente assume o painel.`;
    }

    if (textLower.includes('olá') || textLower.includes('oi') || textLower.includes('bom dia') || textLower.includes('boa tarde') || textLower.includes('boa noite')) {
      return `Olá! Como posso te ajudar hoje? Selecione uma das opções rápidas no painel ou digite sua dúvida sobre nossa federação de lutas.`;
    }

    return `Desculpe, não consegui entender essa dúvida específica de forma automática. 🥋\n\nGostaria de falar diretamente com um **atendente humano** da secretaria da federação para te auxiliar?`;
  }

  function subscribeToChat(chatId) {
    if (typeof isFirebaseActive === 'undefined' || !isFirebaseActive || !db) return;
    
    isHumanAgent = true;
    activeChatId = chatId;
    localStorage.setItem('feamcrj_active_chat_id', chatId);

    if (chatUnsubscribe) chatUnsubscribe();
    
    chatUnsubscribe = db.collection('suporte_chats').doc(chatId).onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        renderChatMessagesFromFirestore(data.messages || []);
        
        if (data.status === 'closed') {
          statusIndicator.innerHTML = `
            <span class="w-1.5 h-1.5 bg-zinc-500 rounded-full inline-block"></span>
            Encerrado (Suporte)
          `;
          chatInput.disabled = true;
          sendBtn.disabled = true;
          chatInput.placeholder = "Atendimento encerrado.";
        } else {
          chatInput.disabled = false;
          sendBtn.disabled = false;
          chatInput.placeholder = "Escreva sua dúvida...";
          
          if (data.typingByAdmin) {
            statusIndicator.innerHTML = `
              <span class="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block animate-pulse"></span>
              Atendente digitando...
            `;
          } else {
            statusIndicator.innerHTML = `
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse"></span>
              Suporte Online Ativo
            `;
          }
        }
      } else {
        localStorage.removeItem('feamcrj_active_chat_id');
        activeChatId = null;
        isHumanAgent = false;
      }
    }, err => {
      console.error("Erro no Listener de Chat:", err);
    });
  }

  function renderChatMessagesFromFirestore(messagesList) {
    messagesContainer.innerHTML = '';
    messagesList.forEach(msg => {
      const msgBlock = document.createElement('div');
      if (msg.sender === 'user') {
        msgBlock.className = "bg-emerald-600 text-white self-end max-w-[85%] rounded-2xl rounded-tr-none p-3 text-[11px] sm:text-xs leading-relaxed shadow-md relative animate-fade-in shrink-0";
        msgBlock.textContent = msg.text;
        
        const ticks = document.createElement('span');
        ticks.className = "block text-right text-[9px] text-emerald-200 mt-1 select-none leading-none";
        ticks.innerHTML = `✓✓`;
        msgBlock.appendChild(ticks);
      } else if (msg.sender === 'system') {
        msgBlock.className = "bg-zinc-950 text-zinc-500 self-center text-center max-w-[90%] rounded-xl px-3 py-1 text-[10px] uppercase font-bold tracking-wider border border-zinc-850 my-1 shrink-0";
        msgBlock.textContent = msg.text;
      } else {
        msgBlock.className = "bg-zinc-850 text-zinc-200 border border-zinc-800 self-start max-w-[85%] rounded-2xl rounded-tl-none p-3 text-[11px] sm:text-xs leading-relaxed shadow-md relative animate-fade-in shrink-0";
        let htmlContent = msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
        htmlContent = htmlContent.replace(/\n/g, '<br />');
        msgBlock.innerHTML = htmlContent;
      }
      messagesContainer.appendChild(msgBlock);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function startAtendenteAtendimento() {
    const loggedUserJson = localStorage.getItem('feamcrj_logged_user');
    if (loggedUserJson) {
      try {
        const u = JSON.parse(loggedUserJson);
        const name = u.name || "Filiado";
        const email = u.email || "";
        criarEConectarChat(name, email);
        return;
      } catch (e) {}
    }

    addMessage("Para te conectar ao atendimento online agora mesmo, por favor informe seus dados para contato:", true);
    
    const formBlock = document.createElement('div');
    formBlock.className = "bg-zinc-850 border border-zinc-800 rounded-2xl p-4 space-y-3 mt-2 animate-fade-in shrink-0 text-xs w-full";
    formBlock.innerHTML = `
      <p class="font-bold text-white mb-2">📋 Dados para Atendimento:</p>
      <div>
        <label class="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Seu Nome Completo</label>
        <input id="chat-form-name" type="text" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="Ex: João Silva">
      </div>
      <div>
        <label class="block text-[10px] text-zinc-400 font-bold uppercase mb-1">E-mail ou Telefone</label>
        <input id="chat-form-contact" type="text" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="Ex: joao@gmail.com">
      </div>
      <button id="chat-form-submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition-all text-[11px] uppercase cursor-pointer">
        🤝 Iniciar Chat Online
      </button>
    `;
    messagesContainer.appendChild(formBlock);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    document.getElementById('chat-form-submit').onclick = () => {
      const name = document.getElementById('chat-form-name').value.trim();
      const contact = document.getElementById('chat-form-contact').value.trim();

      if (!name || !contact) {
        alert("Por favor, preencha seu nome e contato para iniciar o atendimento.");
        return;
      }

      formBlock.remove();
      criarEConectarChat(name, contact);
    };
  }

  async function criarEConectarChat(name, email) {
    if (typeof isFirebaseActive === 'undefined' || !isFirebaseActive || !db) return;

    const newChatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    
    const initialMessages = [
      { sender: 'system', text: 'Atendimento de suporte aberto', time: Date.now() },
      { sender: 'admin', text: `Olá, **${name}**! Seu suporte foi aberto na nossa fila de atendimento. Um de nossos diretores técnicos irá te responder aqui mesmo em breve! Escreva suas dúvidas detalhadamente aqui abaixo. 🥋`, time: Date.now() }
    ];

    const chatDoc = {
      id: newChatId,
      userName: name,
      userEmail: email,
      status: 'active',
      unreadByAdmin: true,
      unreadByUser: false,
      lastMessage: 'Atendimento iniciado',
      lastMessageTime: firebase.firestore.FieldValue.serverTimestamp() || new Date(),
      messages: initialMessages,
      typingByAdmin: false,
      typingByUser: false
    };

    try {
      await db.collection('suporte_chats').doc(newChatId).set(chatDoc);
      subscribeToChat(newChatId);
    } catch (err) {
      console.error("Erro ao iniciar chat no Firestore:", err);
      addMessage("Desculpe, ocorreu uma falha ao conectar ao suporte em tempo real. Você pode nos contatar no WhatsApp comercial oficial da federação:", true);
      addWhatsAppCTA();
    }
  }

  function addWhatsAppCTA() {
    const ctaBlock = document.createElement('div');
    ctaBlock.className = "pt-2 animate-fade-in shrink-0 w-full";
    ctaBlock.innerHTML = `
      <a href="https://wa.me/5521993370397?text=Olá,%20gostaria%20de%20suporte%20com%20meu%20pagamento%20e%20homologação." target="_blank" class="w-full text-center flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer shadow-md no-underline">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span>Falar no WhatsApp Oficial</span>
      </a>
    `;
    messagesContainer.appendChild(ctaBlock);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function addWhatsAppMessageCTA(text, name = "", email = "") {
    const ctaBlock = document.createElement('div');
    ctaBlock.className = "pt-2 animate-fade-in shrink-0 w-full";
    let formattedText = `Olá! Me chamo ${name || 'um filiado'} (${email || ''}) e gostaria de suporte no site da FEAMCRJ com o seguinte:\n\n${text}`;
    let url = "https://wa.me/5521993370397?text=" + encodeURIComponent(formattedText);
    
    ctaBlock.innerHTML = `
      <div class="text-zinc-400 text-[10px] mb-1 font-semibold text-center uppercase tracking-wider">Mandar para o Administrador:</div>
      <a href="${url}" target="_blank" class="w-full text-center flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer shadow-md no-underline">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span>Enviar no WhatsApp do Atendente</span>
      </a>
    `;
    messagesContainer.appendChild(ctaBlock);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Try auto-opening
    try {
      window.open(url, '_blank');
    } catch(e) {
      console.log("Popup blocked or not supported inside iframe");
    }
  }

  async function handleUserMessage(text, intentValue = null) {
    if (!text.trim()) return;

    if (isHumanAgent) {
      chatInput.disabled = true;
      sendBtn.disabled = true;
      
      let name = "";
      let email = "";
      
      if (activeChatId && typeof isFirebaseActive !== 'undefined' && isFirebaseActive && db) {
        try {
          const chatRef = db.collection('suporte_chats').doc(activeChatId);
          const doc = await chatRef.get();
          if (doc.exists) {
            const chatData = doc.data();
            name = chatData.userName || "";
            email = chatData.userEmail || "";
            const currentMessages = chatData.messages || [];
            currentMessages.push({
              sender: 'user',
              text: text,
              time: Date.now()
            });

            await chatRef.update({
              messages: currentMessages,
              lastMessage: text,
              lastMessageTime: firebase.firestore.FieldValue.serverTimestamp() || new Date(),
              unreadByAdmin: true,
              unreadByUser: false
            });
          }
        } catch (err) {
          console.error("Erro ao enviar mensagem para o Firestore:", err);
        }
      } else {
        addMessage(text, false);
      }
      
      // Post system info and WhatsApp redirect
      addWhatsAppMessageCTA(text, name, email);
      
      chatInput.disabled = false;
      sendBtn.disabled = false;
      chatInput.value = '';
      chatInput.focus();
      return;
    }

    addMessage(text, false);

    const oldReplies = document.getElementById('chat-quick-replies');
    if (oldReplies) oldReplies.remove();

    chatInput.disabled = true;
    sendBtn.disabled = true;

    showTypingIndicator(() => {
      chatInput.disabled = false;
      sendBtn.disabled = false;
      chatInput.focus();

      if (intentValue === 'falar_atendente' || text.toLowerCase().includes('atendente') || text.toLowerCase().includes('humano') || text.toLowerCase().includes('suporte')) {
        isHumanAgent = true;
        if (typeof isFirebaseActive !== 'undefined' && isFirebaseActive && db) {
          startAtendenteAtendimento();
        } else {
          addMessage(`Perfeito! Estou transferindo agora mesmo a sua conversa para um atendente humano da diretoria da **FEAMCRJ**... 📲\n\nPor favor, envie o comprovante ou sua dúvida clicando no botão abaixo:`, true);
          addWhatsAppCTA();
        }
      } else {
        const botResponse = getBotResponse(intentValue, text);
        addMessage(botResponse, true);
        showQuickReplies();
      }
    }, 1200);
  }

  function toggleChat() {
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
      chatPanel.classList.remove('hidden');
      setTimeout(() => {
        chatPanel.classList.remove('translate-y-4', 'opacity-0');
      }, 10);

      if (badge) badge.classList.add('hidden');

      if (messagesContainer.children.length === 0) {
        if (activeChatId && typeof isFirebaseActive !== 'undefined' && isFirebaseActive) {
          subscribeToChat(activeChatId);
        } else {
          showTypingIndicator(() => {
            addMessage(welcomeText, true);
            showQuickReplies();
          }, 800);
        }
      }
    } else {
      chatPanel.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => {
        chatPanel.classList.add('hidden');
      }, 300);
    }
  }

  // Real-time typing trigger
  let typingTimeout = null;
  chatInput.addEventListener('input', () => {
    if (isHumanAgent && activeChatId && typeof isFirebaseActive !== 'undefined' && isFirebaseActive && db) {
      db.collection('suporte_chats').doc(activeChatId).update({ typingByUser: true });
      
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        db.collection('suporte_chats').doc(activeChatId).update({ typingByUser: false });
      }, 1500);
    }
  });

  floatBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  sendBtn.addEventListener('click', () => {
    const text = chatInput.value;
    if (text.trim()) {
      chatInput.value = '';
      handleUserMessage(text);
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const text = chatInput.value;
      if (text.trim()) {
        chatInput.value = '';
        handleUserMessage(text);
      }
    }
  });

  // Autoload active chat if open on page reload
  if (activeChatId && typeof isFirebaseActive !== 'undefined' && isFirebaseActive) {
    isHumanAgent = true;
    subscribeToChat(activeChatId);
  }

  // Mostra a notificação após 3.5 segundos
  setTimeout(() => {
    if (!isChatOpen && badge) {
      badge.classList.remove('hidden');
    }
  }, 3500);
}
