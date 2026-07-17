/**
 * FEAMCRJ - Componentes Globais Compartilhados (Header e Footer)
 * Este arquivo injeta o Header e o Footer dinamicamente em todas as páginas do site.
 * Permite manter o código limpo, fácil de editar e 100% portátil para pen drives ou Google Drive.
 */

document.addEventListener('DOMContentLoaded', async () => {
  renderHeader();
  renderFooter();
  setupNavigationEvents();
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
