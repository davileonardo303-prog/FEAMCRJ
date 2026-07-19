/**
 * FEAMCRJ - Configuração de Banco de Dados e Firebase
 * Este arquivo unifica o acesso aos dados da Federação.
 * 
 * Se o Firebase estiver configurado (com chaves válidas no objeto abaixo), ele usará
 * o Firestore e Firebase Authentication do Google Cloud.
 * Caso contrário, ele usa o LOCAL STORAGE de forma automatizada para simular 100% das ações de:
 * - Filiações de Atletas e Professores (com salvamento de dados)
 * - Inscrições em Torneios em tempo real
 * - Login, cadastro e Painel Administrativo
 * 
 * Isso permite que o site funcione PERFEITAMENTE em um Pen Drive ou no Google Drive, mesmo offline!
 */

// Global error reporter to capture and debug runtime errors in the user's browser
window.addEventListener('error', function(event) {
  try {
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: event.message,
        url: event.filename,
        line: event.lineno,
        col: event.colno,
        stack: event.error ? event.error.stack : ''
      })
    }).catch(function(e) {});
  } catch(e) {}
});

window.addEventListener('unhandledrejection', function(event) {
  try {
    var reason = event.reason || {};
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: reason.message || String(reason),
        url: window.location.href,
        line: 0,
        col: 0,
        stack: reason.stack || ''
      })
    }).catch(function(e) {});
  } catch(e) {}
});

// Load Firebase Compat SDK scripts if not already loaded on the page
if (typeof firebase === 'undefined') {
  document.write('<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>');
  document.write('<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>');
  document.write('<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>');
  document.write('<script src="firebase-modular-dist.js"></script>');
}

// === COORDENAÇÃO DE CREDENCIAIS DO FIREBASE ===
let firebaseConfig = {
  apiKey: "AIzaSyBoXqh1dYaCDGVLpPZ8tSZhQIHlQRFlp4U",
  authDomain: "feamcrj-dcfaa.firebaseapp.com",
  projectId: "feamcrj-dcfaa",
  storageBucket: "feamcrj-dcfaa.firebasestorage.app",
  messagingSenderId: "72630680924",
  appId: "1:72630680924:web:726f1e31d436ba5220d599",
  databaseId: "ai-studio-feamcrjfederaoes-91246755-2038-4b5d-a55f-d54783e79085",
  firestoreDatabaseId: "ai-studio-feamcrjfederaoes-91246755-2038-4b5d-a55f-d54783e79085"
};

// Tenta carregar as credenciais reais do sandbox / workspace do usuário de forma síncrona
try {
  const xhr = new XMLHttpRequest();
  // Usamos um cache-buster (?t=...) para garantir que o navegador sempre carregue o arquivo de configuração mais recente e ignore o cache
  xhr.open('GET', '/firebase-applet-config.json?t=' + Date.now(), false); // síncrono
  xhr.send(null);
  if (xhr.status === 200) {
    const appletConfig = JSON.parse(xhr.responseText);
    if (appletConfig && appletConfig.apiKey) {
      firebaseConfig = {
        apiKey: appletConfig.apiKey,
        authDomain: appletConfig.authDomain,
        projectId: appletConfig.projectId,
        storageBucket: appletConfig.storageBucket,
        messagingSenderId: appletConfig.messagingSenderId,
        appId: appletConfig.appId,
        databaseId: appletConfig.firestoreDatabaseId,
        firestoreDatabaseId: appletConfig.firestoreDatabaseId
      };
      console.log("📦 Loaded workspace Firebase configuration successfully. Project ID:", firebaseConfig.projectId, "Database ID:", firebaseConfig.databaseId);
    }
  }
} catch (e) {
  console.warn("Could not load /firebase-applet-config.json, using fallback config:", e);
}

let db = null;
let auth = null;
let isFirebaseActive = false;

function inicializarFirebase() {
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.apiKey !== "SUA_API_KEY_AQUI" && firebaseConfig.apiKey !== "INSIRA_SUA_API_KEY_AQUI") {
    try {
      // Determina o ID do banco de dados (bancos nomeados na AI Studio / Google Cloud)
      let dbId = firebaseConfig.databaseId || firebaseConfig.firestoreDatabaseId;
      
      // Salvaguarda crítica: se o projeto do usuário for feamcrj-dcfaa, o banco de dados é sempre o do workspace
      if (firebaseConfig.projectId === "feamcrj-dcfaa" || (!dbId && firebaseConfig.projectId && firebaseConfig.projectId.includes("feamcrj"))) {
        dbId = "ai-studio-feamcrjfederaoes-91246755-2038-4b5d-a55f-d54783e79085";
      }

      if (dbId) {
        firebaseConfig.databaseId = dbId;
        firebaseConfig.firestoreDatabaseId = dbId;
      }

      // Limpa qualquer app anterior para garantir inicialização limpa com o databaseId correto
      if (firebase.apps.length > 0) {
        try {
          console.log("🔄 Resetando conexões anteriores do Firebase para evitar cache de banco (default)...");
          firebase.app().delete();
        } catch (e) {
          console.warn("⚠️ Não foi possível deletar o app anterior:", e);
        }
      }

      console.log("📦 Inicializando Firebase App com Project ID:", firebaseConfig.projectId, "e Database ID:", dbId);
      firebase.initializeApp(firebaseConfig);
      
      if (dbId) {
        console.log("🔥 Inicializando Firestore com banco nomeado ID:", dbId);
        if (typeof window.initCompatFirestore === 'function') {
          try {
            db = window.initCompatFirestore(firebaseConfig, dbId);
            console.log("✅ Firestore inicializado com sucesso via wrapper modular (initCompatFirestore)!");
          } catch (eInit) {
            console.warn("⚠️ Falha ao inicializar com initCompatFirestore, tentando fallback compat:", eInit);
            try {
              db = firebase.firestore(firebase.app(), dbId);
              console.log("✅ Firestore inicializado com firebase.firestore(app, dbId)");
            } catch (e) {
              console.warn("⚠️ Falha ao inicializar com firebase.firestore(app, dbId), tentando firebase.app().firestore(dbId):", e);
              try {
                db = firebase.app().firestore(dbId);
                console.log("✅ Firestore inicializado com firebase.app().firestore(dbId)");
              } catch (e2) {
                db = firebase.firestore();
                console.log("✅ Firestore inicializado com firebase.firestore() padrão (respeitando databaseId no config)");
              }
            }
          }
        } else {
          try {
            // Tenta usar a função namespace com app e dbId, que é a mais recomendada no compat
            db = firebase.firestore(firebase.app(), dbId);
            console.log("✅ Firestore inicializado com firebase.firestore(app, dbId)");
          } catch (e) {
            console.warn("⚠️ Falha ao inicializar com firebase.firestore(app, dbId), tentando firebase.app().firestore(dbId):", e);
            fetch('/api/log-error', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ error: "Compat init 1 failed: " + e.message, stack: e.stack, url: "firebase-config.js" })
            }).catch(() => {});
            try {
              db = firebase.app().firestore(dbId);
              console.log("✅ Firestore inicializado com firebase.app().firestore(dbId)");
            } catch (e2) {
              console.warn("⚠️ Falha ao inicializar com firebase.app().firestore(dbId), tentando firebase.firestore() padrão com databaseId no config:", e2);
              fetch('/api/log-error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: "Compat init 2 failed: " + e2.message, stack: e2.stack, url: "firebase-config.js" })
              }).catch(() => {});
              db = firebase.firestore();
              console.log("✅ Firestore inicializado com firebase.firestore() padrão (respeitando databaseId no config)");
            }
          }
        }
      } else {
        console.log("🔥 Inicializando Firestore padrão (default)");
        db = firebase.firestore();
      }
      auth = firebase.auth();
      isFirebaseActive = true;
      console.log("🔥 Firebase inicializado com sucesso para FEAMCRJ!");
    } catch (error) {
      console.warn("⚠️ Falha ao carregar Firebase. Executando em modo de Persistência Local (Pen Drive):", error);
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: "Firebase Init Master Error: " + error.message, stack: error.stack, url: "firebase-config.js" })
      }).catch(() => {});
    }
  } else {
    console.log("⚡ Rodando em modo de Demonstração Local (Pen Drive / Google Drive). Os dados estão protegidos no LocalStorage.");
  }
}

// Inicializa imediatamente se já carregado, ou aguarda o DOMContentLoaded imediatamente antes de outros scripts
if (typeof firebase !== 'undefined') {
  inicializarFirebase();
} else {
  window.addEventListener('DOMContentLoaded', () => {
    inicializarFirebase();
  }, { capture: true, once: true });
}

// ==========================================
// MOCK DATA INICIAL PARA O LOCALSTORAGE
// ==========================================
const INITIAL_MARTIAL_ARTS = [
  {
    id: 'bjj',
    name: 'Jiu-Jitsu Brasileiro (BJJ)',
    description: 'Arte marcial focada no combate no solo, utilizando técnicas de imobilização, chaves e estrangulamentos.',
    category: 'Grappling',
    origin: 'Brasil / Rio de Janeiro',
    departmentHead: 'Mestre Robson Albuquerque (Faixa Coral 7º Grau)'
  },
  {
    id: 'kickboxing',
    name: 'Kickboxing',
    description: 'Esporte de combate em pé que combina técnicas de socos do boxe tradicional com chutes potentes.',
    category: 'Percussão',
    origin: 'Japão / EUA',
    departmentHead: 'Mestre Alexandre "Caveira" Silva'
  },
  {
    id: 'muaythai',
    name: 'Muay Thai',
    description: 'Conhecido como a "Arte das Oito Armas", utiliza socos, chutes, joelhadas, cotoveladas e clinche.',
    category: 'Percussão',
    origin: 'Tailândia',
    departmentHead: 'Kru-Yai Wellington Santos'
  }
];

const INITIAL_TOURNAMENTS = [
  {
    id: 't1',
    title: 'Campeonato Estadual de Jiu-Jitsu FEAMCRJ 2026',
    date: '2026-08-15',
    location: 'Arena Carioca 1 - Parque Olímpico',
    city: 'Rio de Janeiro - RJ',
    registrationDeadline: '2026-08-10',
    entryFee: 120,
    status: 'open',
    modalities: ['Jiu-Jitsu Brasileiro (BJJ)'],
    registeredCount: 428,
    description: 'O maior torneio estadual de Jiu-Jitsu do Rio de Janeiro. Categorias do mirim ao master, faixas branca a preta. Medalhas exclusivas e premiação em dinheiro.',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 't2',
    title: 'Copa Carioca de Kickboxing e Muay Thai',
    date: '2026-09-05',
    location: 'Ginásio Caio Martins',
    city: 'Niterói - RJ',
    registrationDeadline: '2026-08-30',
    entryFee: 90,
    status: 'open',
    modalities: ['Kickboxing', 'Muay Thai'],
    registeredCount: 184,
    description: 'Espectáculo de trocas de golpes em pé de alta intensidade! Regras de K1 Rules e Low Kicks.',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 't3',
    title: 'Festival Estadual de Karate e Taekwondo',
    date: '2026-10-12',
    location: 'Ginásio do Tijuca Tênis Clube',
    city: 'Rio de Janeiro - RJ',
    registrationDeadline: '2026-10-05',
    entryFee: 80,
    status: 'upcoming',
    modalities: ['Karate-Do', 'Taekwondo'],
    registeredCount: 120,
    description: 'Focado na tradição e na precisão olímpica. Competições de Kata/Poomsae e Kumite/Kyorugui.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop'
  }
];

const INITIAL_ACADEMIES = [
  {
    id: 'acad-1',
    name: 'Alliance Jiu-Jitsu Copacabana',
    headInstructor: 'Mestre Alexandre "Gigi" Paiva',
    address: 'Avenida Nossa Senhora de Copacabana, 1230 - Sala 401',
    neighborhood: 'Copacabana',
    city: 'Rio de Janeiro',
    phone: '(21) 2256-7890',
    email: 'alliance.copacabana@alliance.com.br',
    modalities: ['Jiu-Jitsu Brasileiro (BJJ)'],
    certifiedUntil: '2027-12-31',
    status: 'active'
  },
  {
    id: 'acad-2',
    name: 'Gracie Barra Jardim Oceânico',
    headInstructor: 'Professor Ricardo "Cachorrão" Almeida',
    address: 'Avenida Armando Lombardi, 450 - Loja B',
    neighborhood: 'Barra da Tijuca',
    city: 'Rio de Janeiro',
    phone: '(21) 2493-4567',
    email: 'contato@gbjardimoceanico.com.br',
    modalities: ['Jiu-Jitsu Brasileiro (BJJ)', 'Artes Marciais Mistas (MMA)'],
    certifiedUntil: '2026-12-31',
    status: 'active'
  },
  {
    id: 'acad-3',
    name: 'Combat Team Tijuca',
    headInstructor: 'Mestre Alexandre Silva',
    address: 'Rua Conde de Bonfim, 342 - 3º Andar',
    neighborhood: 'Tijuca',
    city: 'Rio de Janeiro',
    phone: '(21) 2568-1234',
    email: 'tijuca@combatteam.com.br',
    modalities: ['Kickboxing', 'Muay Thai', 'Artes Marciais Mistas (MMA)'],
    certifiedUntil: '2027-06-30',
    status: 'active'
  }
];

// Inicialização das bases locais caso vazias
if (!localStorage.getItem('feam_atletas')) {
  localStorage.setItem('feam_atletas', JSON.stringify([]));
}
if (!localStorage.getItem('feam_transacoes')) {
  localStorage.setItem('feam_transacoes', JSON.stringify([
    {
      id: 'tr-mock-1',
      ctId: 'acad-1',
      ctName: 'Alliance Jiu-Jitsu Copacabana',
      tipo: 'entrada',
      categoria: 'mensalidade',
      descricao: 'Mensalidade - Carlos Silva (Julho/2026)',
      valor: 150.00,
      formaPagamento: 'pix',
      data: '2026-07-15',
      usuarioEmail: 'alliance.copacabana@alliance.com.br'
    },
    {
      id: 'tr-mock-2',
      ctId: 'acad-1',
      ctName: 'Alliance Jiu-Jitsu Copacabana',
      tipo: 'entrada',
      categoria: 'venda_caixa',
      descricao: 'Venda de Camiseta Oficial FEAM',
      valor: 85.00,
      formaPagamento: 'dinheiro',
      data: '2026-07-16',
      usuarioEmail: 'alliance.copacabana@alliance.com.br'
    },
    {
      id: 'tr-mock-3',
      ctId: 'acad-1',
      ctName: 'Alliance Jiu-Jitsu Copacabana',
      tipo: 'saida',
      categoria: 'despesa',
      descricao: 'Energia Elétrica (Light)',
      valor: 230.00,
      formaPagamento: 'boleto',
      data: '2026-07-10',
      usuarioEmail: 'alliance.copacabana@alliance.com.br'
    },
    {
      id: 'tr-mock-4',
      ctId: 'admin-feam',
      ctName: 'FEAMCRJ Federação',
      tipo: 'entrada',
      categoria: 'federacao',
      descricao: 'Filiação de Nova Academia - Gracie Barra JO',
      valor: 350.00,
      formaPagamento: 'pix',
      data: '2026-07-12',
      usuarioEmail: 'feamcrj@gmail.com'
    }
  ]));
}
if (!localStorage.getItem('feam_mensalidades')) {
  localStorage.setItem('feam_mensalidades', JSON.stringify([
    {
      id: 'mens-mock-1',
      ctId: 'acad-1',
      alunoId: 'ath-mock-1',
      alunoNome: 'Carlos Silva',
      mesReferencia: '2026-07',
      valor: 150.00,
      status: 'pago',
      dataPagamento: '2026-07-15',
      formaPagamento: 'pix'
    },
    {
      id: 'mens-mock-2',
      ctId: 'acad-1',
      alunoId: 'ath-mock-2',
      alunoNome: 'Beatriz Santos',
      mesReferencia: '2026-07',
      valor: 150.00,
      status: 'pendente',
      dataPagamento: null,
      formaPagamento: null
    }
  ]));
}
if (!localStorage.getItem('feam_academias')) {
  localStorage.setItem('feam_academias', JSON.stringify(INITIAL_ACADEMIES));
}
if (!localStorage.getItem('feam_torneios')) {
  localStorage.setItem('feam_torneios', JSON.stringify(INITIAL_TOURNAMENTS));
}
if (!localStorage.getItem('feam_inscricoes_torneios')) {
  localStorage.setItem('feam_inscricoes_torneios', JSON.stringify([]));
}
if (!localStorage.getItem('feam_admins')) {
  localStorage.setItem('feam_admins', JSON.stringify([]));
}
if (!localStorage.getItem('feam_site_info')) {
  localStorage.setItem('feam_site_info', JSON.stringify({
    heroTitle: "O Templo do Combate no <br> <span class=\"bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-orange-500 to-amber-500\">Rio de Janeiro</span>",
    heroSubtitle: "A FEAMCRJ é a entidade oficial responsável por homologar, certificar e gerenciar o circuito esportivo de artes marciais e esportes de combate no Estado do Rio de Janeiro.",
    statAtletas: "1.800+",
    statAcademias: "85+",
    statTorneios: "14",
    statOficial: "100%",
    alertMessage: ""
  }));
}

// ==========================================
// FUNÇÕES DE AGÊNCIAS DE DADOS (DATABASE HANDLERS)
// ==========================================

// Atletas
async function getAtletas() {
  if (isFirebaseActive) {
    const snap = await db.collection('atletas').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return JSON.parse(localStorage.getItem('feam_atletas'));
  }
}

async function cadastrarAtleta(atletaData) {
  // Higieniza os dados de acesso para evitar problemas com espaços ou letras maiúsculas
  atletaData.email = atletaData.email.trim().toLowerCase();
  atletaData.password = atletaData.password.trim();

  // Prevenção de duplicação: verifica e-mail e CPF já cadastrados
  try {
    const allAtletas = await getAtletas() || [];
    const emailExists = allAtletas.some(a => a.email && a.email.trim().toLowerCase() === atletaData.email);
    if (emailExists) {
      throw new Error("Este e-mail já está cadastrado como atleta filiado! Por favor, utilize outro e-mail ou faça login no portal.");
    }

    if (atletaData.cpf && atletaData.cpf.trim()) {
      const cleanCpf = atletaData.cpf.replace(/\D/g, '');
      const cpfExists = allAtletas.some(a => {
        if (!a.cpf) return false;
        return a.cpf.replace(/\D/g, '') === cleanCpf;
      });
      if (cpfExists) {
        throw new Error("Este CPF já está cadastrado em nossa federação!");
      }
    }
  } catch (err) {
    // Repassa o erro específico de validação
    if (err.message.includes("cadastrado")) {
      throw err;
    }
    console.warn("Aviso na verificação de duplicidade:", err);
  }

  const numFiliacao = "FEAM-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
  const { password, ...firestoreData } = atletaData;
  const completo = {
    ...firestoreData,
    registrationNumber: numFiliacao,
    status: 'pending',
    paymentStatus: 'pending',
    pago: false,
    affiliationDate: new Date().toISOString().split('T')[0]
  };

  if (isFirebaseActive) {
    try {
      // Cria usuário no Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(atletaData.email, atletaData.password);
      // Salva os dados do perfil no Firestore usando o UID como ID do documento
      await db.collection('atletas').doc(userCredential.user.uid).set(completo);
      return { id: userCredential.user.uid, ...completo };
    } catch (e) {
      throw new Error(e.message);
    }
  } else {
    const atletas = JSON.parse(localStorage.getItem('feam_atletas')) || [];
    const id = 'ath-' + Math.floor(100000 + Math.random() * 900000);
    const novoAtleta = { id, ...completo, password: atletaData.password };
    atletas.push(novoAtleta);
    localStorage.setItem('feam_atletas', JSON.stringify(atletas));
    
    return novoAtleta;
  }
}

// Academias
async function getAcademias() {
  if (isFirebaseActive) {
    try {
      const snap = await db.collection('academias').get();
      if (snap.empty) {
        console.log("🌱 Seeding Firestore with default academies...");
        for (const acad of INITIAL_ACADEMIES) {
          await db.collection('academias').doc(acad.id).set(acad);
        }
        const freshSnap = await db.collection('academias').get();
        return freshSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn("⚠️ Failed to load academies from Firestore, using LocalStorage fallback:", e);
      return JSON.parse(localStorage.getItem('feam_academias')) || INITIAL_ACADEMIES;
    }
  } else {
    const local = localStorage.getItem('feam_academias');
    if (!local) {
      localStorage.setItem('feam_academias', JSON.stringify(INITIAL_ACADEMIES));
      return INITIAL_ACADEMIES;
    }
    return JSON.parse(local);
  }
}

async function cadastrarAcademia(acadData) {
  // Higieniza os dados de acesso para evitar problemas com espaços ou letras maiúsculas
  acadData.email = acadData.email.trim().toLowerCase();
  acadData.password = acadData.password.trim();

  // Prevenção de duplicação: verifica e-mail e documento já cadastrados
  try {
    const allAcademias = await getAcademias() || [];
    const emailExists = allAcademias.some(a => a.email && a.email.trim().toLowerCase() === acadData.email);
    if (emailExists) {
      throw new Error("Este e-mail de professor/CT já está cadastrado em nossa federação! Por favor, utilize outro e-mail ou faça login.");
    }

    if (acadData.document && acadData.document.trim()) {
      const cleanDoc = acadData.document.replace(/\D/g, '');
      const docExists = allAcademias.some(a => {
        if (!a.document) return false;
        return a.document.replace(/\D/g, '') === cleanDoc;
      });
      if (docExists) {
        throw new Error("Este CNPJ / CPF de Responsável por CT já está cadastrado em nossa federação!");
      }
    }
  } catch (err) {
    // Repassa o erro específico de validação
    if (err.message.includes("cadastrado")) {
      throw err;
    }
    console.warn("Aviso na verificação de duplicidade de academia:", err);
  }

  const { password, ...firestoreData } = acadData;
  const completo = {
    ...firestoreData,
    certifiedUntil: (new Date().getFullYear() + 1) + '-12-31',
    status: 'pending',
    paymentStatus: 'pending',
    pago: false
  };

  if (isFirebaseActive) {
    try {
      // Cria o usuário do professor no Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(acadData.email, acadData.password);
      // Salva os dados do CT no Firestore usando o UID como ID do documento
      await db.collection('academias').doc(userCredential.user.uid).set(completo);
      salvarUsuarioLocal(userCredential.user.uid, completo, 'professor');
      return { id: userCredential.user.uid, ...completo };
    } catch (e) {
      throw new Error(e.message);
    }
  } else {
    const academias = JSON.parse(localStorage.getItem('feam_academias')) || [];
    const id = 'acad-' + Math.floor(100000 + Math.random() * 900000);
    const novaAcad = { id, ...completo, password: acadData.password };
    academias.push(novaAcad);
    localStorage.setItem('feam_academias', JSON.stringify(academias));
    
    salvarUsuarioLocal(id, novaAcad, 'professor');
    return novaAcad;
  }
}

// Torneios e Inscrições
async function getTorneios() {
  if (isFirebaseActive) {
    try {
      const snap = await db.collection('torneios').get();
      if (snap.empty) {
        console.log("🌱 Seeding Firestore with default tournaments...");
        for (const t of INITIAL_TOURNAMENTS) {
          await db.collection('torneios').doc(t.id).set(t);
        }
        const freshSnap = await db.collection('torneios').get();
        return freshSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn("⚠️ Failed to load tournaments from Firestore, using LocalStorage fallback:", e);
      return JSON.parse(localStorage.getItem('feam_torneios')) || INITIAL_TOURNAMENTS;
    }
  } else {
    const local = localStorage.getItem('feam_torneios');
    if (!local) {
      localStorage.setItem('feam_torneios', JSON.stringify(INITIAL_TOURNAMENTS));
      return INITIAL_TOURNAMENTS;
    }
    return JSON.parse(local);
  }
}

async function inscreverNoTorneio(inscricaoData) {
  const completo = {
    ...inscricaoData,
    dataInscricao: new Date().toISOString().split('T')[0],
    pago: true
  };

  if (isFirebaseActive) {
    const docRef = await db.collection('inscricoes').add(completo);
    return { id: docRef.id, ...completo };
  } else {
    const inscricoes = JSON.parse(localStorage.getItem('feam_inscricoes_torneios'));
    const id = 'ins-' + Math.floor(100000 + Math.random() * 900000);
    const novaInscricao = { id, ...completo };
    inscricoes.push(novaInscricao);
    localStorage.setItem('feam_inscricoes_torneios', JSON.stringify(inscricoes));

    // Atualiza a contagem do torneio correspondente
    const torneios = JSON.parse(localStorage.getItem('feam_torneios'));
    const idx = torneios.findIndex(t => t.id === inscricaoData.torneioId);
    if (idx !== -1) {
      torneios[idx].registeredCount = (torneios[idx].registeredCount || 0) + 1;
      localStorage.setItem('feam_torneios', JSON.stringify(torneios));
    }

    return novaInscricao;
  }
}

async function getInscricoesAtleta(atletaEmail) {
  if (isFirebaseActive) {
    const snap = await db.collection('inscricoes').where('email', '==', atletaEmail).get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    const inscricoes = JSON.parse(localStorage.getItem('feam_inscricoes_torneios'));
    return inscricoes.filter(ins => ins.email === atletaEmail);
  }
}

// Auxiliar: Salvar sessão de login local
function salvarUsuarioLocal(id, userData, tipo) {
  localStorage.setItem('feamcrj_logged_user', JSON.stringify({
    id: id,
    name: userData.name || userData.headInstructor || 'Membro FEAM',
    email: userData.email,
    tipo: tipo,
    detalhes: userData
  }));
}

// Recuperar senha unificado
async function recuperarSenha(email) {
  if (!email) throw new Error("E-mail é obrigatório.");
  email = email.trim().toLowerCase();

  if (isFirebaseActive) {
    try {
      await auth.sendPasswordResetEmail(email);
      return { success: true, message: "🔥 E-mail de recuperação enviado com sucesso via Firebase! Verifique sua caixa de entrada." };
    } catch (e) {
      throw new Error("Erro no Firebase: " + e.message);
    }
  } else {
    return { success: true, message: "⚙️ Simulação Local: Um link de redefinição de senha foi enviado com sucesso para o e-mail: " + email };
  }
}

// Login unificado
async function loginFiliado(email, senha) {
  if (!email || !senha) {
    throw new Error('E-mail e senha são obrigatórios.');
  }
  
  email = email.trim().toLowerCase();
  senha = senha.trim();

  // ADMINISTRADOR MASTER FEAMCRJ
  if (email === 'feamcrj@gmail.com') {
    if (senha !== 'Master582@') {
      throw new Error('Senha incorreta para a conta de administrador master.');
    }
    
    if (isFirebaseActive) {
      try {
        await auth.signInWithEmailAndPassword(email, senha);
        localStorage.removeItem('firebase_auth_provider_warning');
      } catch (authErr) {
        if (authErr.code === 'auth/operation-not-allowed' || authErr.message.includes('operation-not-allowed') || authErr.message.includes('disabled')) {
          console.warn("⚠️ Firebase Auth: Provedor de E-mail/Senha desativado no Console do Firebase. Permitindo login local...");
          localStorage.setItem('firebase_auth_provider_warning', 'true');
        } else {
          // Se falhar o login com a senha nova, pode ser que a conta no Firebase Auth ainda esteja com a senha antiga 'Perfumaria20'
          try {
            console.log("🔄 Tentando autenticar com a senha antiga para migração automática...");
            const userCredential = await auth.signInWithEmailAndPassword(email, 'Perfumaria20');
            if (userCredential.user) {
              console.log("🔄 Autenticado com sucesso usando a senha antiga! Atualizando senha no Firebase Auth para a nova senha...");
              await userCredential.user.updatePassword('Master582@');
              console.log("🚀 Senha do administrador master atualizada com sucesso no Firebase Auth!");
              localStorage.removeItem('firebase_auth_provider_warning');
            }
          } catch (oldAuthErr) {
            if (oldAuthErr.code === 'auth/operation-not-allowed' || oldAuthErr.message.includes('operation-not-allowed') || oldAuthErr.message.includes('disabled')) {
              localStorage.setItem('firebase_auth_provider_warning', 'true');
            } else {
              // Se também falhar com a senha antiga, tentamos criar a conta se ela não existir
              try {
                await auth.createUserWithEmailAndPassword(email, senha);
                console.log("🚀 Administrador master criado automaticamente no Firebase Auth!");
                localStorage.removeItem('firebase_auth_provider_warning');
              } catch (createErr) {
                if (createErr.code === 'auth/operation-not-allowed' || createErr.message.includes('operation-not-allowed') || createErr.message.includes('disabled')) {
                  localStorage.setItem('firebase_auth_provider_warning', 'true');
                } else if (createErr.code === 'auth/email-already-in-use' || createErr.message.includes('email-already-in-use')) {
                  // Se já existe, significa que a senha digitada está incorreta tanto em relação à nova quanto à antiga
                  throw new Error("Senha incorreta para a conta de administrador master.");
                } else {
                  throw authErr;
                }
              }
            }
          }
        }
      }
    }
    
    const adminUser = {
      name: "Presidente FEAMCRJ",
      email: email,
      tipo: "admin"
    };
    salvarUsuarioLocal('admin-feam', adminUser, 'admin');
    return { success: true, user: adminUser };
  }

  if (isFirebaseActive) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, senha);
      
      // 1. Busca dados no firestore correspondente a administradores secundários
      const adminSnap = await db.collection('admins').where('email', '==', email).get();
      if (!adminSnap.empty) {
        const d = adminSnap.docs[0];
        salvarUsuarioLocal(d.id, d.data(), 'admin');
        return { success: true, user: { id: d.id, ...d.data(), tipo: 'admin' } };
      }

      // 2. Busca dados no firestore correspondente a academias/professores
      const acadSnap = await db.collection('academias').where('email', '==', email).get();
      if (!acadSnap.empty) {
        const d = acadSnap.docs[0];
        salvarUsuarioLocal(d.id, d.data(), 'professor');
        return { success: true, user: { id: d.id, ...d.data(), tipo: 'professor' } };
      }
      
      // 3. Busca dados no firestore correspondente a atletas
      const atletaSnap = await db.collection('atletas').where('email', '==', email).get();
      if (!atletaSnap.empty) {
        const d = atletaSnap.docs[0];
        const data = d.data();
        if (data.status === 'pending') {
          throw new Error('Sua filiação está pendente de aprovação pela diretoria da FEAMCRJ. Por favor, aguarde a homologação para acessar seu painel.');
        }
        salvarUsuarioLocal(d.id, data, 'atleta');
        return { success: true, user: { id: d.id, ...data, tipo: 'atleta' } };
      }
      
      // Se não achar perfil mas autenticou
      const dummy = { name: "Usuário Cadastrado", email: email };
      salvarUsuarioLocal(userCredential.user.uid, dummy, 'atleta');
      return { success: true, user: dummy };
    } catch (e) {
      if (e.code === 'auth/operation-not-allowed' || e.message.includes('operation-not-allowed') || e.message.includes('disabled')) {
        throw new Error("Erro no login: O provedor de login 'E-mail/Senha' está desativado no seu Console do Firebase. Para resolver isso: 1) Acesse o Console do Firebase; 2) Vá em 'Authentication' > 'Sign-in method'; 3) Ative o provedor 'Email/Password' e salve.");
      }
      throw new Error(e.message);
    }
  } else {
    // Busca na base local de administradores secundários
    const admins = JSON.parse(localStorage.getItem('feam_admins')) || [];
    const admin = admins.find(a => a.email === email);
    if (admin) {
      if (admin.password && admin.password !== senha) {
        throw new Error('Senha incorreta para esta conta de administrador.');
      }
      salvarUsuarioLocal(admin.id, admin, 'admin');
      return { success: true, user: { ...admin, tipo: 'admin' } };
    }

    // Busca na base local de atletas
    const atletas = JSON.parse(localStorage.getItem('feam_atletas')) || [];
    const atleta = atletas.find(a => a.email === email);
    if (atleta) {
      if (atleta.password && atleta.password !== senha) {
        throw new Error('Senha incorreta para esta conta de atleta.');
      }
      if (atleta.status === 'pending') {
        throw new Error('Sua filiação está pendente de aprovação pela diretoria da FEAMCRJ. Por favor, aguarde a homologação para acessar seu painel.');
      }
      salvarUsuarioLocal(atleta.id, atleta, 'atleta');
      return { success: true, user: { ...atleta, tipo: 'atleta' } };
    }

    // Busca na base local de academias
    const acads = JSON.parse(localStorage.getItem('feam_academias')) || [];
    const acad = acads.find(a => a.email === email);
    if (acad) {
      if (acad.password && acad.password !== senha) {
        throw new Error('Senha incorreta para este credenciamento.');
      }
      salvarUsuarioLocal(acad.id, acad, 'professor');
      return { success: true, user: { ...acad, tipo: 'professor' } };
    }

    // Se e-mail não estiver cadastrado, para demonstração do pen drive, gera um perfil rápido de visitante!
    const visitante = {
      name: email.split('@')[0].toUpperCase(),
      email: email,
      phone: '(21) 99999-9999',
      rank: 'Faixa Branca',
      modality: 'Jiu-Jitsu Brasileiro (BJJ)',
      academyName: 'Academia Provisória',
      registrationNumber: 'FEAM-VISITANTE',
      status: 'active',
      affiliationDate: new Date().toISOString().split('T')[0],
      password: senha
    };
    salvarUsuarioLocal('ath-vis', visitante, 'atleta');
    return { success: true, user: { ...visitante, tipo: 'atleta' } };
  }
}

// ==========================================
// FUNÇÕES EXCLUSIVAS DE ADMINISTRAÇÃO (FEAMCRJ@GMAIL.COM)
// ==========================================

async function getInscricoesTodas() {
  if (isFirebaseActive) {
    const snap = await db.collection('inscricoes').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return JSON.parse(localStorage.getItem('feam_inscricoes_torneios')) || [];
  }
}

async function excluirInscricao(inscricaoId) {
  if (isFirebaseActive) {
    await db.collection('inscricoes').doc(inscricaoId).delete();
  } else {
    let inscricoes = JSON.parse(localStorage.getItem('feam_inscricoes_torneios')) || [];
    
    // Decrementa contagem do torneio correspondente antes de remover
    const insc = inscricoes.find(i => i.id === inscricaoId);
    if (insc) {
      const torneios = JSON.parse(localStorage.getItem('feam_torneios')) || [];
      const idx = torneios.findIndex(t => t.id === insc.torneioId);
      if (idx !== -1) {
        torneios[idx].registeredCount = Math.max(0, (torneios[idx].registeredCount || 1) - 1);
        localStorage.setItem('feam_torneios', JSON.stringify(torneios));
      }
    }

    inscricoes = inscricoes.filter(i => i.id !== inscricaoId);
    localStorage.setItem('feam_inscricoes_torneios', JSON.stringify(inscricoes));
  }
}

async function confirmarInscricaoPagamento(inscricaoId, pagoStatus) {
  if (isFirebaseActive) {
    await db.collection('inscricoes').doc(inscricaoId).update({ pago: pagoStatus });
  } else {
    const inscricoes = JSON.parse(localStorage.getItem('feam_inscricoes_torneios')) || [];
    const idx = inscricoes.findIndex(i => i.id === inscricaoId);
    if (idx !== -1) {
      inscricoes[idx].pago = pagoStatus;
      localStorage.setItem('feam_inscricoes_torneios', JSON.stringify(inscricoes));
    }
  }
}

async function excluirAtleta(atletaId) {
  if (isFirebaseActive) {
    try {
      await db.collection('atletas').doc(atletaId).delete();
    } catch (err) {
      console.error("Erro ao deletar atleta do Firestore:", err);
    }
  }
  // Remove sempre do local storage também para manter sincronizado e livre de lixo local
  let atletas = JSON.parse(localStorage.getItem('feam_atletas')) || [];
  atletas = atletas.filter(a => a.id !== atletaId);
  localStorage.setItem('feam_atletas', JSON.stringify(atletas));
}

async function alterarStatusAtleta(atletaId, status) {
  if (isFirebaseActive) {
    const updateData = { status: status };
    if (status === 'active') {
      updateData.paymentStatus = 'paid';
      updateData.pago = true;
    }
    await db.collection('atletas').doc(atletaId).update(updateData);
  } else {
    const atletas = JSON.parse(localStorage.getItem('feam_atletas')) || [];
    const idx = atletas.findIndex(a => a.id === atletaId);
    if (idx !== -1) {
      atletas[idx].status = status;
      if (status === 'active') {
        atletas[idx].paymentStatus = 'paid';
        atletas[idx].pago = true;
      }
      localStorage.setItem('feam_atletas', JSON.stringify(atletas));
    }
  }
}

async function atualizarAtleta(atletaId, fields) {
  if (isFirebaseActive) {
    try {
      await db.collection('atletas').doc(atletaId).update(fields);
    } catch (e) {
      try {
        await db.collection('atletas').doc(atletaId).set(fields, { merge: true });
      } catch (err) {
        console.error("Erro ao atualizar atleta no Firestore:", err);
      }
    }
  }
  const atletas = JSON.parse(localStorage.getItem('feam_atletas')) || [];
  const idx = atletas.findIndex(a => a.id === atletaId);
  if (idx !== -1) {
    atletas[idx] = { ...atletas[idx], ...fields };
    localStorage.setItem('feam_atletas', JSON.stringify(atletas));
  }
}

async function excluirAcademia(acadId) {
  if (isFirebaseActive) {
    try {
      await db.collection('academias').doc(acadId).delete();
    } catch (err) {
      console.error("Erro ao deletar academia do Firestore:", err);
    }
  }
  // Remove sempre do local storage também para manter sincronizado e livre de lixo local
  let academias = JSON.parse(localStorage.getItem('feam_academias')) || [];
  academias = academias.filter(a => a.id !== acadId);
  localStorage.setItem('feam_academias', JSON.stringify(academias));
}

async function alterarStatusAcademia(acadId, status) {
  if (isFirebaseActive) {
    const updateData = { status: status };
    if (status === 'active') {
      updateData.paymentStatus = 'paid';
      updateData.pago = true;
    }
    await db.collection('academias').doc(acadId).update(updateData);
  } else {
    const academias = JSON.parse(localStorage.getItem('feam_academias')) || [];
    const idx = academias.findIndex(a => a.id === acadId);
    if (idx !== -1) {
      academias[idx].status = status;
      if (status === 'active') {
        academias[idx].paymentStatus = 'paid';
        academias[idx].pago = true;
      }
      localStorage.setItem('feam_academias', JSON.stringify(academias));
    }
  }
}

async function adicionarTorneio(torneioData) {
  const novoTorneio = {
    ...torneioData,
    registeredCount: 0,
    status: 'open'
  };

  if (isFirebaseActive) {
    const docRef = await db.collection('torneios').add(novoTorneio);
    return { id: docRef.id, ...novoTorneio };
  } else {
    const torneios = JSON.parse(localStorage.getItem('feam_torneios')) || [];
    const id = 't-' + Math.floor(100000 + Math.random() * 900000);
    const completo = { id, ...novoTorneio };
    torneios.push(completo);
    localStorage.setItem('feam_torneios', JSON.stringify(torneios));
    return completo;
  }
}

async function excluirTorneio(torneioId) {
  if (isFirebaseActive) {
    try {
      await db.collection('torneios').doc(torneioId).delete();
    } catch (err) {
      console.error("Erro ao deletar torneio do Firestore:", err);
    }
  }
  // Remove sempre do local storage também para manter sincronizado e livre de lixo local
  let torneios = JSON.parse(localStorage.getItem('feam_torneios')) || [];
  torneios = torneios.filter(t => t.id !== torneioId);
  localStorage.setItem('feam_torneios', JSON.stringify(torneios));
}

// ========================================================
// RECURSOS COMPLEMENTARES DE ADMINISTRAÇÃO DINÂMICA (SITE)
// ========================================================

async function getSiteInfo() {
  let snapAtletasSize = 0;
  let snapAcademiasSize = 0;
  let snapTorneiosSize = 0;

  if (isFirebaseActive) {
    try {
      const snapAth = await db.collection('atletas').get();
      snapAtletasSize = snapAth.size;
    } catch(e){}
    try {
      const snapAcad = await db.collection('academias').get();
      // Temos 3 academias padrão no pen drive, no firestore usamos o tamanho direto
      snapAcademiasSize = snapAcad.size;
    } catch(e){}
    try {
      const snapTorn = await db.collection('torneios').get();
      snapTorneiosSize = snapTorn.size;
    } catch(e){}

    let data = null;
    try {
      const doc = await db.collection('config').doc('site_info').get();
      if (doc.exists) {
        data = doc.data();
      }
    } catch (e) {
      console.warn("Firestore site_info failed: ", e);
    }

    if (!data) {
      data = {
        heroTitle: "O Templo do Combate no <br> <span class=\"bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-orange-500 to-amber-500\">Rio de Janeiro</span>",
        heroSubtitle: "A FEAMCRJ é a entidade oficial responsável por homologar, certificar e gerenciar o circuito esportivo de artes marciais e esportes de combate no Estado do Rio de Janeiro.",
        alertMessage: "",
        footerDescription: "FEDERAÇÃO ESPORTIVA DE ARTE MARCIAL E COMBATE RIO DE JANEIRO. <br /> Entidade oficial reguladora e fomentadora do desporto de combate e artes marciais no estado do Rio de Janeiro.",
        president: "Raphael Jaboque",
        vicePresident: "Mestre Alexandre Silva",
        techDirector: "Mestre Wellington Santos",
        publicRelations: "Dra. Beatriz Ferreira Souza",
        contactEmail: "secretaria@feamcrj.com.br",
        contactPhone: "(21) 2568-9876",
        contactAddress: "Rua Conde de Bonfim, 342 - Sala 501 - Tijuca",
        contactCity: "Rio de Janeiro - RJ",
        cartorioText: "Homologada sob Registro de Cartório Civil de Pessoa Jurídica nº 812.428-RJ"
      };
    }

    data.statAtletas = (1800 + snapAtletasSize) + "+";
    data.statAcademias = (85 + snapAcademiasSize) + "+";
    data.statTorneios = (14 + snapTorneiosSize).toString();
    data.statOficial = "100%";
    return data;
  }

  const defaultInfo = {
    heroTitle: "O Templo do Combate no <br> <span class=\"bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-orange-500 to-amber-500\">Rio de Janeiro</span>",
    heroSubtitle: "A FEAMCRJ é a entidade oficial responsável por homologar, certificar e gerenciar o circuito esportivo de artes marciais e esportes de combate no Estado do Rio de Janeiro.",
    statAtletas: "1.800+",
    statAcademias: "85+",
    statTorneios: "14",
    statOficial: "100%",
    alertMessage: "",
    // Dados do rodapé (editável)
    footerDescription: "FEDERAÇÃO ESPORTIVA DE ARTE MARCIAL E COMBATE RIO DE JANEIRO. <br /> Entidade oficial reguladora e fomentadora do desporto de combate e artes marciais no estado do Rio de Janeiro.",
    president: "Raphael Jaboque",
    vicePresident: "Mestre Alexandre Silva",
    techDirector: "Mestre Wellington Santos",
    publicRelations: "Dra. Beatriz Ferreira Souza",
    contactEmail: "secretaria@feamcrj.com.br",
    contactPhone: "(21) 2568-9876",
    contactAddress: "Rua Conde de Bonfim, 342 - Sala 501 - Tijuca",
    contactCity: "Rio de Janeiro - RJ",
    cartorioText: "Homologada sob Registro de Cartório Civil de Pessoa Jurídica nº 812.428-RJ"
  };

  const local = localStorage.getItem('feam_site_info');
  const info = local ? JSON.parse(local) : defaultInfo;

  // Calcula automático localmente
  const localAtletas = JSON.parse(localStorage.getItem('feam_atletas')) || [];
  const localAcademias = JSON.parse(localStorage.getItem('feam_academias')) || [];
  const localTorneios = JSON.parse(localStorage.getItem('feam_torneios')) || [];

  const newAtletasCount = localAtletas.length;
  const newAcademiasCount = Math.max(0, localAcademias.length - 3);
  const newTorneiosCount = Math.max(0, localTorneios.length - 3);

  info.statAtletas = (1800 + newAtletasCount) + "+";
  info.statAcademias = (85 + newAcademiasCount) + "+";
  info.statTorneios = (14 + newTorneiosCount).toString();
  info.statOficial = "100%";

  return info;
}

async function salvarSiteInfo(infoData) {
  if (isFirebaseActive) {
    await db.collection('config').doc('site_info').set(infoData);
  }
  localStorage.setItem('feam_site_info', JSON.stringify(infoData));
}

async function adicionarAcademiaAdmin(acadData) {
  const { password, ...firestoreData } = acadData;
  const completo = {
    ...firestoreData,
    status: acadData.status || 'active',
    certifiedUntil: acadData.certifiedUntil || ((new Date().getFullYear() + 1) + '-12-31')
  };

  if (isFirebaseActive) {
    try {
      let docId = '';
      if (password) {
        // Register the new teacher in Auth using a secondary Firebase app instance
        // so that the admin is not signed out!
        const secondaryApp = firebase.initializeApp(firebaseConfig, "SecRegistration_" + Math.random());
        const secCredential = await secondaryApp.auth().createUserWithEmailAndPassword(acadData.email, password);
        docId = secCredential.user.uid;
        await secondaryApp.delete();
      } else {
        // Just add to Firestore
        const docRef = await db.collection('academias').add(completo);
        docId = docRef.id;
      }
      
      await db.collection('academias').doc(docId).set(completo);
      return { id: docId, ...completo };
    } catch (e) {
      throw new Error(e.message);
    }
  } else {
    const academias = JSON.parse(localStorage.getItem('feam_academias')) || [];
    const id = 'acad-' + Math.floor(100000 + Math.random() * 900000);
    const novaAcad = { id, ...completo, password: password || '123456' };
    academias.push(novaAcad);
    localStorage.setItem('feam_academias', JSON.stringify(academias));
    return novaAcad;
  }
}

async function atualizarAcademiaAdmin(acadId, acadData) {
  const { password, ...firestoreData } = acadData;
  if (isFirebaseActive) {
    await db.collection('academias').doc(acadId).update(firestoreData);
  } else {
    const academias = JSON.parse(localStorage.getItem('feam_academias')) || [];
    const idx = academias.findIndex(a => a.id === acadId);
    if (idx !== -1) {
      const updated = { ...academias[idx], ...firestoreData };
      if (password) updated.password = password;
      academias[idx] = updated;
      localStorage.setItem('feam_academias', JSON.stringify(academias));
    }
  }
}

async function atualizarTorneioAdmin(torneioId, torneioData) {
  if (isFirebaseActive) {
    await db.collection('torneios').doc(torneioId).update(torneioData);
  } else {
    const torneios = JSON.parse(localStorage.getItem('feam_torneios')) || [];
    const idx = torneios.findIndex(t => t.id === torneioId);
    if (idx !== -1) {
      torneios[idx] = { ...torneios[idx], ...torneioData };
      localStorage.setItem('feam_torneios', JSON.stringify(torneios));
    }
  }
}

// ========================================================
// RECURSOS ADICIONAIS PARA MÚLTIPLOS ADMINISTRADORES E CADASTRO
// ========================================================

async function getAdmins() {
  if (isFirebaseActive) {
    const snap = await db.collection('admins').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return JSON.parse(localStorage.getItem('feam_admins')) || [];
  }
}

async function adicionarAdmin(adminData) {
  const { password, ...firestoreData } = adminData;
  const completo = {
    ...firestoreData,
    status: 'active',
    tipo: 'admin'
  };

  if (isFirebaseActive) {
    try {
      const secondaryApp = firebase.initializeApp(firebaseConfig, "SecAdminReg_" + Math.random());
      const secCredential = await secondaryApp.auth().createUserWithEmailAndPassword(adminData.email, password);
      const docId = secCredential.user.uid;
      await secondaryApp.delete();
      
      await db.collection('admins').doc(docId).set(completo);
      return { id: docId, ...completo };
    } catch (e) {
      throw new Error(e.message);
    }
  } else {
    const admins = JSON.parse(localStorage.getItem('feam_admins')) || [];
    const id = 'adm-' + Math.floor(100000 + Math.random() * 900000);
    const novoAdmin = { id, ...completo, password: password };
    admins.push(novoAdmin);
    localStorage.setItem('feam_admins', JSON.stringify(admins));
    return novoAdmin;
  }
}

async function excluirAdmin(adminId) {
  if (isFirebaseActive) {
    await db.collection('admins').doc(adminId).delete();
  } else {
    let admins = JSON.parse(localStorage.getItem('feam_admins')) || [];
    admins = admins.filter(a => a.id !== adminId);
    localStorage.setItem('feam_admins', JSON.stringify(admins));
  }
}

async function adicionarAtletaAdmin(atletaData) {
  const numFiliacao = "FEAM-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
  const { password, ...firestoreData } = atletaData;
  const completo = {
    ...firestoreData,
    registrationNumber: numFiliacao,
    status: 'active',
    affiliationDate: new Date().toISOString().split('T')[0]
  };

  if (isFirebaseActive) {
    try {
      const secondaryApp = firebase.initializeApp(firebaseConfig, "SecAtletaReg_" + Math.random());
      const secCredential = await secondaryApp.auth().createUserWithEmailAndPassword(atletaData.email, password);
      const docId = secCredential.user.uid;
      await secondaryApp.delete();

      await db.collection('atletas').doc(docId).set(completo);
      return { id: docId, ...completo };
    } catch (e) {
      throw new Error(e.message);
    }
  } else {
    const atletas = JSON.parse(localStorage.getItem('feam_atletas')) || [];
    const id = 'ath-' + Math.floor(100000 + Math.random() * 900000);
    const novoAtleta = { id, ...completo, password: password };
    atletas.push(novoAtleta);
    localStorage.setItem('feam_atletas', JSON.stringify(atletas));
    return novoAtleta;
  }
}

// ==========================================
// MÓDULO FINANCEIRO E AUTOMAÇÃO COMERCIAL (CTs & FEDERAÇÃO)
// ==========================================

async function getTransacoes() {
  if (isFirebaseActive) {
    try {
      const snap = await db.collection('transacoes').get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Erro ao buscar transacoes no Firestore: ", e);
      return JSON.parse(localStorage.getItem('feam_transacoes')) || [];
    }
  } else {
    return JSON.parse(localStorage.getItem('feam_transacoes')) || [];
  }
}

async function registrarTransacao(data) {
  const transacao = {
    ...data,
    id: data.id || 'tr-' + Math.floor(100000 + Math.random() * 900000),
    data: data.data || new Date().toISOString().split('T')[0]
  };

  if (isFirebaseActive) {
    try {
      await db.collection('transacoes').doc(transacao.id).set(transacao);
    } catch (e) {
      console.error("Erro ao salvar transacao no Firestore: ", e);
    }
  }
  
  // Salva no LocalStorage em qualquer caso para garantir sync offline
  const localTrans = JSON.parse(localStorage.getItem('feam_transacoes')) || [];
  localTrans.push(transacao);
  localStorage.setItem('feam_transacoes', JSON.stringify(localTrans));
  return transacao;
}

async function excluirTransacao(id) {
  if (isFirebaseActive) {
    try {
      await db.collection('transacoes').doc(id).delete();
    } catch (e) {
      console.error(e);
    }
  }
  let localTrans = JSON.parse(localStorage.getItem('feam_transacoes')) || [];
  localTrans = localTrans.filter(t => t.id !== id);
  localStorage.setItem('feam_transacoes', JSON.stringify(localTrans));
}

async function getMensalidades() {
  if (isFirebaseActive) {
    try {
      const snap = await db.collection('mensalidades').get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Erro ao buscar mensalidades no Firestore: ", e);
      return JSON.parse(localStorage.getItem('feam_mensalidades')) || [];
    }
  } else {
    return JSON.parse(localStorage.getItem('feam_mensalidades')) || [];
  }
}

async function salvarMensalidade(data) {
  const mensalidade = {
    ...data,
    id: data.id || 'mens-' + Math.floor(100000 + Math.random() * 900000)
  };

  if (isFirebaseActive) {
    try {
      await db.collection('mensalidades').doc(mensalidade.id).set(mensalidade);
    } catch (e) {
      console.error("Erro ao salvar mensalidade no Firestore: ", e);
    }
  }

  const localMens = JSON.parse(localStorage.getItem('feam_mensalidades')) || [];
  const idx = localMens.findIndex(m => m.id === mensalidade.id || (m.alunoId === mensalidade.alunoId && m.mesReferencia === mensalidade.mesReferencia));
  if (idx !== -1) {
    localMens[idx] = { ...localMens[idx], ...mensalidade };
  } else {
    localMens.push(mensalidade);
  }
  localStorage.setItem('feam_mensalidades', JSON.stringify(localMens));
  return mensalidade;
}

// Documentos Dinâmicos - FEAMCRJ
async function getDocumentos() {
  if (isFirebaseActive) {
    try {
      const snap = await db.collection('documentos').get();
      const hasInit = localStorage.getItem('feam_documentos_init');
      if (!snap.empty) {
        localStorage.setItem('feam_documentos_init', 'true');
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else if (hasInit) {
        return [];
      }
    } catch (err) {
      console.error("Erro ao carregar documentos do Firestore:", err);
    }
  }
  
  let localDocs = JSON.parse(localStorage.getItem('feam_documentos'));
  const hasInit = localStorage.getItem('feam_documentos_init');
  if (localDocs === null && !hasInit) {
    localDocs = [
      {
        id: 'doc-1',
        title: 'Regulamento Geral Unificado de Competições FEAMCRJ 2026',
        category: 'Regulamento',
        uploadDate: '2026-01-10',
        size: '2.4 MB',
        format: 'PDF',
        isDefault: true
      },
      {
        id: 'doc-2',
        title: 'Tabela de Taxas Administrativas, Anuidade e Filiações 2026',
        category: 'Taxas',
        uploadDate: '2026-01-05',
        size: '850 KB',
        format: 'PDF',
        isDefault: true
      },
      {
        id: 'doc-3',
        title: 'Manual de Padronização de Graduações e Exames de Faixa Preta',
        category: 'Manual',
        uploadDate: '2026-02-18',
        size: '4.1 MB',
        format: 'PDF',
        isDefault: true
      },
      {
        id: 'doc-4',
        title: 'Ficha Cadastral de Filiação Coletiva para Academias',
        category: 'Formulário',
        uploadDate: '2026-03-01',
        size: '1.2 MB',
        format: 'DOCX',
        isDefault: true
      },
      {
        id: 'doc-5',
        title: 'Termo de Responsabilidade e Isenção Médica para Menores de Idade',
        category: 'Formulário',
        uploadDate: '2026-04-12',
        size: '430 KB',
        format: 'PDF',
        isDefault: true
      }
    ];
    localStorage.setItem('feam_documentos', JSON.stringify(localDocs));
    localStorage.setItem('feam_documentos_init', 'true');
    
    if (isFirebaseActive) {
      for (const d of localDocs) {
        try {
          await db.collection('documentos').doc(d.id).set(d);
        } catch (e) {
          console.error("Erro ao salvar documento inicial no Firestore:", e);
        }
      }
    }
  } else if (!localDocs) {
    localDocs = [];
  }
  return localDocs;
}

async function adicionarDocumento(docData) {
  const newId = docData.id || "doc-" + Date.now();
  const completo = {
    id: newId,
    title: docData.title,
    category: docData.category,
    uploadDate: docData.uploadDate || new Date().toISOString().split('T')[0],
    size: docData.size || '1.5 MB',
    format: docData.format || 'PDF',
    customBody: docData.customBody || '',
    fileUrl: docData.fileUrl || '', // Base64 ou link do documento anexado
    fileName: docData.fileName || '',
    isDefault: false
  };

  localStorage.setItem('feam_documentos_init', 'true');

  if (isFirebaseActive) {
    try {
      await db.collection('documentos').doc(newId).set(completo);
    } catch (e) {
      console.error("Erro ao adicionar documento no Firestore:", e);
    }
  }
  
  const docs = JSON.parse(localStorage.getItem('feam_documentos')) || [];
  docs.push(completo);
  localStorage.setItem('feam_documentos', JSON.stringify(docs));
  return completo;
}

async function excluirDocumento(docId) {
  localStorage.setItem('feam_documentos_init', 'true');
  if (isFirebaseActive) {
    try {
      await db.collection('documentos').doc(docId).delete();
    } catch (err) {
      console.error("Erro ao deletar documento do Firestore:", err);
    }
  }
  let docs = JSON.parse(localStorage.getItem('feam_documentos')) || [];
  docs = docs.filter(d => d.id !== docId);
  localStorage.setItem('feam_documentos', JSON.stringify(docs));
}

async function atualizarDocumento(docId, updatedFields) {
  localStorage.setItem('feam_documentos_init', 'true');
  
  if (isFirebaseActive) {
    try {
      await db.collection('documentos').doc(docId).set(updatedFields, { merge: true });
    } catch (err) {
      console.error("Erro ao atualizar documento no Firestore:", err);
    }
  }
  
  let docs = JSON.parse(localStorage.getItem('feam_documentos')) || [];
  const idx = docs.findIndex(d => d.id === docId);
  if (idx !== -1) {
    docs[idx] = { ...docs[idx], ...updatedFields };
  } else {
    docs.push({ id: docId, ...updatedFields });
  }
  localStorage.setItem('feam_documentos', JSON.stringify(docs));
}

