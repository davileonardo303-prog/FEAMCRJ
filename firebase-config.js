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

// Load Firebase Compat SDK scripts if not already loaded on the page
if (typeof firebase === 'undefined') {
  document.write('<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>');
  document.write('<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>');
  document.write('<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>');
}

// === COORDENAÇÃO DE CREDENCIAIS DO FIREBASE ===
let firebaseConfig = {
  apiKey: "AIzaSyDrt-S9dkePFM9AMjX_AaAf6xwbsr5x-0w",
  authDomain: "feamcrj-78f07.firebaseapp.com",
  projectId: "feamcrj-78f07",
  storageBucket: "feamcrj-78f07.firebasestorage.app",
  messagingSenderId: "452441331892",
  appId: "1:452441331892:web:729b61b9b7797f61859fe1"
};

// Tenta carregar as credenciais reais do sandbox / workspace do usuário de forma síncrona
try {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/firebase-applet-config.json', false); // síncrono
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
        databaseId: appletConfig.firestoreDatabaseId
      };
      console.log("📦 Loaded workspace Firebase configuration successfully.");
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
      firebase.initializeApp(firebaseConfig);
      if (firebaseConfig.databaseId) {
        db = firebase.app().firestore(firebaseConfig.databaseId);
      } else {
        db = firebase.firestore();
      }
      auth = firebase.auth();
      isFirebaseActive = true;
      console.log("🔥 Firebase inicializado com sucesso para FEAMCRJ!");
    } catch (error) {
      console.warn("⚠️ Falha ao carregar Firebase. Executando em modo de Persistência Local (Pen Drive):", error);
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
      // Cria usuário no Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(atletaData.email, atletaData.password);
      // Salva os dados do perfil no Firestore usando o UID como ID do documento
      await db.collection('atletas').doc(userCredential.user.uid).set(completo);
      salvarUsuarioLocal(userCredential.user.uid, completo, 'atleta');
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
    
    // Salva sessão local automática
    salvarUsuarioLocal(id, novoAtleta, 'atleta');
    return novoAtleta;
  }
}

// Academias
async function getAcademias() {
  if (isFirebaseActive) {
    const snap = await db.collection('academias').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return JSON.parse(localStorage.getItem('feam_academias'));
  }
}

async function cadastrarAcademia(acadData) {
  const { password, ...firestoreData } = acadData;
  const completo = {
    ...firestoreData,
    certifiedUntil: (new Date().getFullYear() + 1) + '-12-31',
    status: 'active'
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
    const snap = await db.collection('torneios').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return JSON.parse(localStorage.getItem('feam_torneios'));
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
  // ADMINISTRADOR MASTER FEAMCRJ
  if (email.toLowerCase() === 'feamcrj@gmail.com') {
    if (senha !== 'Perfumaria20') {
      throw new Error('Senha incorreta para a conta de administrador master.');
    }
    
    if (isFirebaseActive) {
      try {
        await auth.signInWithEmailAndPassword(email, senha);
      } catch (authErr) {
        // Modern Firebase returns 'auth/invalid-credential' instead of 'auth/user-not-found' for security.
        // We attempt to create the user to verify if they didn't exist.
        try {
          await auth.createUserWithEmailAndPassword(email, senha);
          console.log("🚀 Administrador master criado automaticamente no Firebase Auth!");
        } catch (createErr) {
          if (createErr.code === 'auth/email-already-in-use' || createErr.message.includes('email-already-in-use')) {
            // If the email is in use, the sign in error was due to wrong password.
            throw new Error("Senha incorreta para a conta de administrador master.");
          } else {
            throw authErr;
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
        salvarUsuarioLocal(d.id, d.data(), 'atleta');
        return { success: true, user: { id: d.id, ...d.data(), tipo: 'atleta' } };
      }
      
      // Se não achar perfil mas autenticou
      const dummy = { name: "Usuário Cadastrado", email: email };
      salvarUsuarioLocal(userCredential.user.uid, dummy, 'atleta');
      return { success: true, user: dummy };
    } catch (e) {
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
    await db.collection('atletas').doc(atletaId).delete();
  } else {
    let atletas = JSON.parse(localStorage.getItem('feam_atletas')) || [];
    atletas = atletas.filter(a => a.id !== atletaId);
    localStorage.setItem('feam_atletas', JSON.stringify(atletas));
  }
}

async function alterarStatusAtleta(atletaId, status) {
  if (isFirebaseActive) {
    await db.collection('atletas').doc(atletaId).update({ status: status });
  } else {
    const atletas = JSON.parse(localStorage.getItem('feam_atletas')) || [];
    const idx = atletas.findIndex(a => a.id === atletaId);
    if (idx !== -1) {
      atletas[idx].status = status;
      localStorage.setItem('feam_atletas', JSON.stringify(atletas));
    }
  }
}

async function excluirAcademia(acadId) {
  if (isFirebaseActive) {
    await db.collection('academias').doc(acadId).delete();
  } else {
    let academias = JSON.parse(localStorage.getItem('feam_academias')) || [];
    academias = academias.filter(a => a.id !== acadId);
    localStorage.setItem('feam_academias', JSON.stringify(academias));
  }
}

async function alterarStatusAcademia(acadId, status) {
  if (isFirebaseActive) {
    await db.collection('academias').doc(acadId).update({ status: status });
  } else {
    const academias = JSON.parse(localStorage.getItem('feam_academias')) || [];
    const idx = academias.findIndex(a => a.id === acadId);
    if (idx !== -1) {
      academias[idx].status = status;
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
    await db.collection('torneios').doc(torneioId).delete();
  } else {
    let torneios = JSON.parse(localStorage.getItem('feam_torneios')) || [];
    torneios = torneios.filter(t => t.id !== torneioId);
    localStorage.setItem('feam_torneios', JSON.stringify(torneios));
  }
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
        president: "Grão-Mestre Roberto Albuquerque",
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
    president: "Grão-Mestre Roberto Albuquerque",
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
