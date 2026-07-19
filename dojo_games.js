// ==========================================
// DOJO VIRTUAL RETRO ARCADE - 21 EM 1
// ==========================================

const DOJO_GAMES = [
  { id: 'luta', name: 'Muay Thai Arena 🥊', desc: 'Combate 2D com socos, chutes e voadoras.', category: 'Ação', isCanvas: true },
  { id: 'carro', name: 'Fórmula FEAM 🏎️', desc: 'Desvie dos obstáculos na rodovia em alta velocidade.', category: 'Ação', isCanvas: true },
  { id: 'moto', name: 'Super FEAM Moto 🏍️', desc: 'Salte sobre buracos e colecione medalhas de ouro.', category: 'Reflexo', isCanvas: true },
  { id: 'tiro', name: 'Dojo Ninja Shooter 🎯', desc: 'Acerte os alvos ninjas antes que o tempo acabe.', category: 'Reflexo', isCanvas: true },
  { id: 'aviao', name: 'Defensor Aéreo ✈️', desc: 'Evite nuvens e jatos inimigos controlando a altitude.', category: 'Ação', isCanvas: true },
  { id: 'runner', name: 'Ninja Runner 🏃‍♂️', desc: 'Corra e salte sobre espetos mortais neste jogo de ritmo.', category: 'Reflexo', isCanvas: true },
  { id: 'pong', name: 'Dojo Pong 🏓', desc: 'O clássico ping-pong retrô contra a Inteligência Artificial.', category: 'Reflexo', isCanvas: true },
  { id: 'snake', name: 'Cobra do Dojo 🐍', desc: 'Coma shakes de proteína e cresça sem colidir na parede.', category: 'Reflexo', isCanvas: true },
  { id: 'bricks', name: 'Quebra Tijolos 🧱', desc: 'Destrua os blocos de cimento usando uma esfera metálica.', category: 'Ação', isCanvas: true },
  { id: 'maze', name: 'Labirinto Samurai 🗺️', desc: 'Navegue pelo labirinto e encontre o cinturão sagrado.', category: 'Mente', isCanvas: true },
  { id: 'flappy', name: 'Flappy Belt 🥋', desc: 'Faça o cinturão flutuar através dos sacos de pancada.', category: 'Reflexo', isCanvas: true },
  { id: 'penalties', name: 'Dojo Pênaltis ⚽', desc: 'Chute no ângulo contra o goleiro karateca.', category: 'Ação', isCanvas: true },
  
  // HTML-based Games
  { id: 'adivinhacao', name: 'Mestre Mental 🔮', desc: 'Adivinhe o número secreto do Grão-Mestre FEAM.', category: 'Mente', isCanvas: false },
  { id: 'detetive', name: 'Roubo do Cinturão 🕵️‍♂️', desc: 'Analise pistas e interrogue suspeitos no Dojo.', category: 'Mente', isCanvas: false },
  { id: 'memoria', name: 'Memória do Tatame 🧠', desc: 'Encontre os pares de cinturões correspondentes.', category: 'Mente', isCanvas: false },
  { id: 'simon', name: 'Simon do Mestre 🔴', desc: 'Repita a sequência exata de cores dos cinturões.', category: 'Mente', isCanvas: false },
  { id: 'clicker', name: 'Quebra-Madeira 🔥', desc: 'Toque rapidamente para quebrar tábuas de madeira.', category: 'Reflexo', isCanvas: false },
  { id: 'math', name: 'Ninja Math 🔢', desc: 'Fatie as melancias resolvendo equações matemáticas rápidas.', category: 'Mente', isCanvas: false },
  { id: 'tictactoe', name: 'Jogo da Velha ❌', desc: 'Vença o Grão-Mestre no clássico jogo da velha.', category: 'Mente', isCanvas: false },
  { id: 'jokenpo', name: 'Jokenpô de Elite ✊', desc: 'Vença no Pedra, Papel ou Tesoura em melhor de 3.', category: 'Ação', isCanvas: false },
  { id: 'mines', name: 'Caça ao Cinturão 💣', desc: 'Clique nas áreas seguras e evite as minas explosivas.', category: 'Mente', isCanvas: false }
];

let currentSelectedGame = null;
let gameIsOver = false;
let score = 0;
let canvas = null;
let ctx = null;
let animFrameId = null;
let screenShake = 0;
let particles = [];
let floatingTexts = [];

// Unified state manager
const gameState = {
  lives: 3,
  timer: 0,
  level: 1,
  
  // Muay Thai Fighters
  fighterPlayer: { x: 120, y: 175, baseX: 120, state: 'idle', frame: 0 },
  fighterEnemy: { x: 360, y: 175, baseX: 360, state: 'idle', frame: 0 },
  
  // Driving
  carLane: 1,
  carX: 240,
  carTraffic: [],
  
  // Moto
  bikeY: 165,
  bikeVy: 0,
  bikeIsJumping: false,
  obstacles: [],
  medals: [],
  
  // Targets
  targets: [],
  
  // Plane
  planeY: 110,
  planeCurY: 110,
  clouds: [],
  enemies: [],
  
  // Runner
  runnerY: 170,
  runnerVy: 0,
  runnerIsJumping: false,
  runnerIsSliding: false,
  runnerSlideTimer: 0,
  runnerObstacles: [],
  
  // Pong
  pongBall: { x: 240, y: 110, vx: 3, vy: 2, radius: 6 },
  pongPlayerY: 90,
  pongCurPlayerY: 90,
  pongAIY: 90,
  pongPlayerScore: 0,
  pongAIScore: 0,
  
  // Snake
  snake: [{ x: 100, y: 100 }],
  snakeDir: { x: 10, y: 0 },
  snakeFood: { x: 200, y: 100 },
  snakeTicks: 0,
  
  // Bricks
  brickPaddleX: 240,
  brickCurPaddleX: 240,
  brickBall: { x: 240, y: 150, vx: 3, vy: -3, radius: 5 },
  brickGrid: [],
  
  // Maze Grid layout (11x15)
  mazePlayer: { x: 1, y: 1 },
  mazeGoal: { x: 13, y: 9 },
  mazeGrid: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  
  // Flappy
  flappyY: 100,
  flappyVy: 0,
  flappyPipes: [],
  
  // Penalty
  penaltyGoalieX: 240,
  penaltyGoalieDir: 1,
  penaltyBall: { x: 240, y: 195, vx: 0, vy: 0, active: false, shotTo: '' },
  penaltyShotsLeft: 5,
  penaltyGoals: 0,
  
  // Mind States
  guessSecret: 0,
  guessAttempts: 8,
  
  memoryCards: [],
  memorySelected: [],
  
  simonSequence: [],
  simonPlayerIdx: 0,
  simonState: 'idle',
  
  clickerProgress: 0,
  
  mathQuestion: { q: '', a: 0, choices: [] },
  
  tttBoard: Array(9).fill(''),
  
  jokenpoHPPlayer: 3,
  jokenpoHPAI: 3,
  
  minesGrid: [],
  minesActive: false,
  minesSafeClicks: 0,
  minesAccumulatedXP: 0
};

// Belt Rank Calculator
function getDojoBelt(xp) {
  if (xp >= 1500) return { name: "Faixa Preta 🥋", style: "bg-zinc-950 text-yellow-400 border border-yellow-500 font-bold" };
  if (xp >= 1000) return { name: "Faixa Marrom 🟤", style: "bg-amber-900 text-zinc-100" };
  if (xp >= 600) return { name: "Faixa Roxa 🟣", style: "bg-purple-900 text-purple-100" };
  if (xp >= 300) return { name: "Faixa Azul 🔵", style: "bg-blue-900 text-blue-100" };
  if (xp >= 100) return { name: "Faixa Amarela 🟡", style: "bg-amber-500 text-black font-bold" };
  return { name: "Faixa Branca ⚪", style: "bg-white text-zinc-950 font-bold" };
}

function updateBeltUI() {
  const xp = parseInt(localStorage.getItem('feam_dojo_xp') || '0');
  const belt = getDojoBelt(xp);
  const badge = document.getElementById('game-belt-text');
  if (badge) {
    badge.textContent = belt.name;
    badge.className = `${belt.style} px-2 py-0.5 text-[8px] rounded uppercase tracking-widest font-black`;
  }
}

// Open/Close modal
function toggleDojoVirtualGame() {
  const modal = document.getElementById('dojo-virtual-modal');
  if (!modal) return;
  
  if (modal.classList.contains('hidden')) {
    modal.classList.remove('hidden');
    updateBeltUI();
    filterDojoGames(); // Load games grid
  } else {
    modal.classList.add('hidden');
    // Stop loops
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }
}

// Hub selection filtering
function filterDojoGames() {
  const grid = document.getElementById('dojo-games-grid');
  if (!grid) return;
  
  const searchVal = document.getElementById('game-search') ? document.getElementById('game-search').value.toLowerCase() : '';
  const catVal = document.getElementById('game-category') ? document.getElementById('game-category').value : 'Todos';
  
  grid.innerHTML = '';
  
  DOJO_GAMES.forEach(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchVal) || game.desc.toLowerCase().includes(searchVal);
    const matchesCat = catVal === 'Todos' || game.category === catVal;
    
    if (matchesSearch && matchesCat) {
      const card = document.createElement('div');
      card.className = "p-3.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500 rounded-2xl cursor-pointer transition-all flex flex-col justify-between space-y-2 group";
      card.onclick = () => selectDojoGame(game.id);
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-white group-hover:text-amber-400 transition-colors">${game.name}</span>
            <span class="px-1.5 py-0.5 bg-zinc-950 text-[8px] text-amber-500 rounded font-mono uppercase">${game.category}</span>
          </div>
          <p class="text-[10px] text-zinc-400 mt-1.5 leading-relaxed">${game.desc}</p>
        </div>
        <div class="text-[8px] text-zinc-600 font-mono tracking-widest uppercase group-hover:text-amber-500 text-right mt-2">JOGAR ▶</div>
      `;
      grid.appendChild(card);
    }
  });
}

function backToHub() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  document.getElementById('game-screen-selection').classList.remove('hidden');
  document.getElementById('game-screen-arena').classList.add('hidden');
  document.getElementById('game-screen-html').classList.add('hidden');
  document.getElementById('game-screen-result').classList.add('hidden');
}

function selectDojoGame(gameId) {
  currentSelectedGame = gameId;
  score = 0;
  gameIsOver = false;
  
  document.getElementById('game-screen-selection').classList.add('hidden');
  document.getElementById('game-screen-result').classList.add('hidden');
  
  const info = DOJO_GAMES.find(g => g.id === gameId);
  if (!info) return;
  
  if (info.isCanvas) {
    document.getElementById('game-screen-arena').classList.remove('hidden');
    document.getElementById('game-screen-html').classList.add('hidden');
    
    document.getElementById('arena-title').textContent = info.name;
    document.getElementById('arena-score').textContent = `Placar: 0`;
    
    canvas = document.getElementById('combat-canvas');
    if (canvas) ctx = canvas.getContext('2d');
    
    initCanvasGame(gameId);
    renderControls(gameId);
    
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(gameLoop);
  } else {
    document.getElementById('game-screen-arena').classList.add('hidden');
    document.getElementById('game-screen-html').classList.remove('hidden');
    
    initHtmlGame(gameId);
  }
}

function replayCurrentGame() {
  if (currentSelectedGame) selectDojoGame(currentSelectedGame);
}

// Canvas click detector for Ninja Shooter Target popping
document.addEventListener('DOMContentLoaded', () => {
  const cv = document.getElementById('combat-canvas');
  if (cv) {
    cv.onclick = (e) => {
      if (currentSelectedGame === 'tiro') {
        const rect = cv.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (cv.width / rect.width);
        const y = (e.clientY - rect.top) * (cv.height / rect.height);
        
        let hit = false;
        gameState.targets = gameState.targets.filter(t => {
          const dist = Math.hypot(t.x - x, t.y - y);
          if (dist <= t.radius) {
            score += 10;
            hit = true;
            spawnHitParticles(t.x, t.y, '#fbbf24');
            addFloatingText('+10 XP', t.x, t.y - 10, '#34d399');
            document.getElementById('arena-score').textContent = `Alvos: ${score}`;
            return false;
          }
          return true;
        });
        if (!hit) screenShake = 4;
      }
    };
  }
});

// Particles and floating text generators
function spawnHitParticles(x, y, color) {
  for (let i = 0; i < 8; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5 - 2,
      radius: 2.5 + Math.random() * 2,
      color,
      alpha: 1,
      decay: 0.03 + Math.random() * 0.02
    });
  }
}

function addFloatingText(text, x, y, color) {
  floatingTexts.push({ text, x, y, color, vy: -1, alpha: 1 });
}

// Initialize specific Canvas game state variables
function initCanvasGame(id) {
  gameState.timer = 0;
  gameState.level = 1;
  gameState.lives = 3;
  particles = [];
  floatingTexts = [];
  
  if (id === 'luta') {
    gameState.lives = 100; // Player HP
    gameState.timer = 100; // Enemy HP
    gameState.fighterPlayer = { x: 120, y: 175, baseX: 120, state: 'idle', frame: 0 };
    gameState.fighterEnemy = { x: 360, y: 175, baseX: 360, state: 'idle', frame: 0 };
  } else if (id === 'carro') {
    gameState.carLane = 1;
    gameState.carX = 240;
    gameState.carTraffic = [];
  } else if (id === 'moto') {
    gameState.bikeY = 165;
    gameState.bikeVy = 0;
    gameState.bikeIsJumping = false;
    gameState.obstacles = [];
    gameState.medals = [];
  } else if (id === 'tiro') {
    gameState.targets = [];
    gameState.lives = 3;
  } else if (id === 'aviao') {
    gameState.planeY = 110;
    gameState.planeCurY = 110;
    gameState.clouds = [];
    gameState.enemies = [];
  } else if (id === 'runner') {
    gameState.runnerY = 170;
    gameState.runnerVy = 0;
    gameState.runnerIsJumping = false;
    gameState.runnerIsSliding = false;
    gameState.runnerSlideTimer = 0;
    gameState.runnerObstacles = [];
  } else if (id === 'pong') {
    gameState.pongBall = { x: 240, y: 110, vx: 3, vy: 2, radius: 6 };
    gameState.pongPlayerY = 90;
    gameState.pongCurPlayerY = 90;
    gameState.pongAIY = 90;
    gameState.pongPlayerScore = 0;
    gameState.pongAIScore = 0;
  } else if (id === 'snake') {
    gameState.snake = [{ x: 100, y: 110 }];
    gameState.snakeDir = { x: 10, y: 0 };
    spawnSnakeFood();
    gameState.snakeTicks = 0;
  } else if (id === 'bricks') {
    gameState.brickPaddleX = 240;
    gameState.brickCurPaddleX = 240;
    gameState.brickBall = { x: 240, y: 160, vx: 3, vy: -3, radius: 5 };
    buildBrickGrid();
  } else if (id === 'maze') {
    gameState.mazePlayer = { x: 1, y: 1 };
  } else if (id === 'flappy') {
    gameState.flappyY = 110;
    gameState.flappyVy = 0;
    gameState.flappyPipes = [];
  } else if (id === 'penalties') {
    gameState.penaltyGoalieX = 240;
    gameState.penaltyGoalieDir = 1;
    gameState.penaltyBall = { x: 240, y: 195, vx: 0, vy: 0, active: false };
    gameState.penaltyShotsLeft = 5;
    gameState.penaltyGoals = 0;
  }
}

// Dynamic buttons rendering for Canvas game
function renderControls(id) {
  const container = document.getElementById('arena-controls-container');
  if (!container) return;
  container.innerHTML = '';
  
  if (id === 'luta') {
    container.innerHTML = `
      <button onclick="executeCombatAction('punch')" class="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-amber-500 rounded-xl text-[11px] font-bold text-white">Soco 👊</button>
      <button onclick="executeCombatAction('kick')" class="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-amber-500 rounded-xl text-[11px] font-bold text-white">Chute 🦵</button>
      <button onclick="executeCombatAction('special')" class="p-2.5 bg-amber-500 text-zinc-950 rounded-xl text-[11px] font-black uppercase">Voadora 🔥</button>
    `;
  } else if (id === 'carro') {
    container.innerHTML = `
      <button onclick="carMove(-1)" class="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-bold text-white">◀ Esquerda</button>
      <div class="flex items-center justify-center text-[9px] text-zinc-500 font-mono text-center leading-none">Mude de pista para desviar</div>
      <button onclick="carMove(1)" class="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-bold text-white">Direita ▶</button>
    `;
  } else if (id === 'moto') {
    container.innerHTML = `
      <div></div>
      <button onclick="motoJump()" class="p-3 bg-amber-500 text-zinc-950 rounded-xl text-xs font-black uppercase">SALTAR 🏍️</button>
      <div></div>
    `;
  } else if (id === 'tiro') {
    container.innerHTML = `
      <div class="col-span-3 text-center text-[10px] text-zinc-500 font-mono animate-pulse uppercase tracking-wider py-1.5">Clique direto nos Alvos circulares!</div>
    `;
  } else if (id === 'aviao') {
    container.innerHTML = `
      <button onclick="planeMove(-10)" class="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-bold text-white">Subir ▲</button>
      <div class="flex items-center justify-center text-[9px] text-zinc-500 font-mono text-center leading-none">Desvie dos mísseis</div>
      <button onclick="planeMove(10)" class="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-bold text-white">Descer ▼</button>
    `;
  } else if (id === 'runner') {
    container.innerHTML = `
      <button onclick="runnerJump()" class="p-2.5 bg-amber-500 text-zinc-950 rounded-xl text-[11px] font-black uppercase">PULAR 🥷</button>
      <div class="flex items-center justify-center text-[9px] text-zinc-500 font-mono text-center leading-none">Salte de espinhos</div>
      <button onclick="runnerSlide()" class="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-bold text-white">DESLIZAR</button>
    `;
  } else if (id === 'pong') {
    container.innerHTML = `
      <button onclick="pongMove(-20)" class="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-bold text-white">Sobe ▲</button>
      <div class="flex items-center justify-center text-[9px] text-zinc-500 font-mono text-center leading-none">Vença por 3 pontos</div>
      <button onclick="pongMove(20)" class="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-bold text-white">Desce ▼</button>
    `;
  } else if (id === 'snake') {
    container.innerHTML = `
      <div class="col-span-3 grid grid-cols-3 gap-1 max-w-[150px] mx-auto text-center">
        <div></div><button onclick="changeSnakeDir(0, -10)" class="p-1.5 bg-zinc-900 text-white text-[10px] rounded">▲</button><div></div>
        <button onclick="changeSnakeDir(-10, 0)" class="p-1.5 bg-zinc-900 text-white text-[10px] rounded">◀</button>
        <div class="bg-zinc-950"></div>
        <button onclick="changeSnakeDir(10, 0)" class="p-1.5 bg-zinc-900 text-white text-[10px] rounded">▶</button>
        <div></div><button onclick="changeSnakeDir(0, 10)" class="p-1.5 bg-zinc-900 text-white text-[10px] rounded">▼</button><div></div>
      </div>
    `;
  } else if (id === 'bricks') {
    container.innerHTML = `
      <button onclick="brickMovePaddle(-25)" class="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-bold text-white">◀ Esquerda</button>
      <div class="flex items-center justify-center text-[9px] text-zinc-500 font-mono text-center leading-none">Derrube todos os tijolos</div>
      <button onclick="brickMovePaddle(25)" class="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-bold text-white">Direita ▶</button>
    `;
  } else if (id === 'maze') {
    container.innerHTML = `
      <div class="col-span-3 grid grid-cols-3 gap-1 max-w-[150px] mx-auto text-center">
        <div></div><button onclick="moveMazePlayer(0, -1)" class="p-1.5 bg-zinc-900 text-white text-[10px] rounded">▲</button><div></div>
        <button onclick="moveMazePlayer(-1, 0)" class="p-1.5 bg-zinc-900 text-white text-[10px] rounded">◀</button>
        <div class="bg-zinc-950 flex items-center justify-center text-[8px] text-zinc-600 font-bold uppercase">MAZE</div>
        <button onclick="moveMazePlayer(1, 0)" class="p-1.5 bg-zinc-900 text-white text-[10px] rounded">▶</button>
        <div></div><button onclick="moveMazePlayer(0, 1)" class="p-1.5 bg-zinc-900 text-white text-[10px] rounded">▼</button><div></div>
      </div>
    `;
  } else if (id === 'flappy') {
    container.innerHTML = `
      <div></div>
      <button onclick="flappyJump()" class="p-3 bg-amber-500 text-zinc-950 rounded-xl text-xs font-black uppercase">VOAR 🥋</button>
      <div></div>
    `;
  } else if (id === 'penalties') {
    container.innerHTML = `
      <button id="btn-shoot-esquerda" onclick="shootPenalty('esquerda')" class="p-2 bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-white rounded-xl">Esquerda 🥅</button>
      <button id="btn-shoot-centro" onclick="shootPenalty('centro')" class="p-2 bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-white rounded-xl">Meio ⚽</button>
      <button id="btn-shoot-direita" onclick="shootPenalty('direita')" class="p-2 bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-white rounded-xl">Direita 🥅</button>
    `;
  }
}

// Canvas Game Handlers
function carMove(dir) {
  if (gameIsOver) return;
  gameState.carLane = Math.max(0, Math.min(2, gameState.carLane + dir));
}

function motoJump() {
  if (gameIsOver || gameState.bikeIsJumping) return;
  gameState.bikeIsJumping = true;
  gameState.bikeVy = -8.5;
}

function planeMove(dy) {
  if (gameIsOver) return;
  gameState.planeY = Math.max(20, Math.min(200, gameState.planeY + dy));
}

function runnerJump() {
  if (gameIsOver || gameState.runnerIsJumping) return;
  gameState.runnerIsJumping = true;
  gameState.runnerVy = -8.5;
}

function runnerSlide() {
  if (gameIsOver || gameState.runnerIsJumping) return;
  gameState.runnerIsSliding = true;
  gameState.runnerSlideTimer = 35; // Frames
}

function pongMove(dy) {
  if (gameIsOver) return;
  gameState.pongPlayerY = Math.max(10, Math.min(170, gameState.pongPlayerY + dy));
}

function resetPongBall(dir) {
  gameState.pongBall = { x: 240, y: 110, vx: dir * 3.5, vy: (Math.random() - 0.5) * 4, radius: 6 };
}

function changeSnakeDir(x, y) {
  if (gameIsOver) return;
  if (gameState.snakeDir.x !== 0 && x !== 0) return;
  if (gameState.snakeDir.y !== 0 && y !== 0) return;
  gameState.snakeDir = { x, y };
}

function spawnSnakeFood() {
  gameState.snakeFood = {
    x: Math.floor(Math.random() * 44) * 10 + 20,
    y: Math.floor(Math.random() * 18) * 10 + 20
  };
}

function brickMovePaddle(dx) {
  if (gameIsOver) return;
  gameState.brickPaddleX = Math.max(35, Math.min(445, gameState.brickPaddleX + dx));
}

function buildBrickGrid() {
  gameState.brickGrid = [];
  const colors = ['#f43f5e', '#fbbf24', '#34d399', '#60a5fa'];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 8; c++) {
      gameState.brickGrid.push({ x: 35 + c * 52, y: 35 + r * 16, w: 45, h: 11, active: true, color: colors[r] });
    }
  }
}

function moveMazePlayer(dx, dy) {
  if (gameIsOver) return;
  const tx = gameState.mazePlayer.x + dx;
  const ty = gameState.mazePlayer.y + dy;
  if (tx >= 0 && tx < 15 && ty >= 0 && ty < 11) {
    if (gameState.mazeGrid[ty][tx] === 0) {
      gameState.mazePlayer = { x: tx, y: ty };
    }
  }
}

function flappyJump() {
  if (gameIsOver) return;
  gameState.flappyVy = -5.2;
}

function shootPenalty(side) {
  if (gameIsOver || gameState.penaltyBall.active) return;
  
  // Disable shoot buttons
  ['esquerda', 'centro', 'direita'].forEach(s => {
    const btn = document.getElementById(`btn-shoot-${s}`);
    if (btn) btn.setAttribute('disabled', 'true');
  });
  
  const ball = gameState.penaltyBall;
  ball.active = true;
  ball.shotTo = side;
  
  let tx = 240;
  if (side === 'esquerda') tx = 140;
  else if (side === 'direita') tx = 340;
  
  ball.vx = (tx - 240) / 40;
  ball.vy = -4.2;
}

// Muay Thai Combat Action
function executeCombatAction(action) {
  if (gameIsOver || gameState.fighterPlayer.state !== 'idle') return;
  
  const p = gameState.fighterPlayer;
  const e = gameState.fighterEnemy;
  
  let dmg = 12;
  p.state = 'punching';
  if (action === 'kick') {
    p.state = 'kicking';
    dmg = 18;
  } else if (action === 'special') {
    p.state = 'special';
    dmg = 28;
  }
  
  // Slide animation towards enemy
  const startX = p.x;
  const anim = setInterval(() => {
    if (p.x < e.x - 35) {
      p.x += 12;
    } else {
      clearInterval(anim);
      screenShake = 12;
      gameState.timer -= dmg; // Enemy HP reduced
      spawnHitParticles(e.x, e.y - 30, '#ef4444');
      addFloatingText(`-${dmg} HP`, e.x, e.y - 50, '#f87171');
      document.getElementById('arena-score').textContent = `Mestre: ${Math.max(0, gameState.timer)} HP`;
      
      // Retreat
      const ret = setInterval(() => {
        if (p.x > startX) {
          p.x -= 8;
        } else {
          p.x = startX;
          p.state = 'idle';
          clearInterval(ret);
          
          if (gameState.timer <= 0) {
            endDojoGame('win');
          } else {
            // Enemy Turn attack
            setTimeout(executeEnemyCombatTurn, 1000);
          }
        }
      }, 15);
    }
  }, 15);
}

function executeEnemyCombatTurn() {
  if (gameIsOver) return;
  const p = gameState.fighterPlayer;
  const e = gameState.fighterEnemy;
  
  e.state = 'kicking';
  const startX = e.x;
  const anim = setInterval(() => {
    if (e.x > p.x + 35) {
      e.x -= 12;
    } else {
      clearInterval(anim);
      screenShake = 10;
      gameState.lives -= 15; // Player HP reduced
      spawnHitParticles(p.x, p.y - 30, '#3b82f6');
      addFloatingText('-15 HP', p.x, p.y - 50, '#f87171');
      document.getElementById('arena-score').textContent = `Você: ${Math.max(0, gameState.lives)} HP`;
      
      // Retreat
      const ret = setInterval(() => {
        if (e.x < startX) {
          e.x += 8;
        } else {
          e.x = startX;
          e.state = 'idle';
          clearInterval(ret);
          
          if (gameState.lives <= 0) {
            endDojoGame('lose');
          }
        }
      }, 15);
    }
  }, 15);
}

// Draw Fighter utility for Muay Thai game
function drawCombatFighter(ctx, f, isPlayer) {
  ctx.save();
  ctx.translate(f.x, f.y);
  if (!isPlayer) ctx.scale(-1, 1);
  
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 10, 20, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  let bob = Math.sin((f.frame || 0) * 0.15) * 2.5;
  let bodyY = -35 + bob;
  let headY = -60 + bob;
  
  // Draw Body (skin)
  ctx.fillStyle = '#fca5a5';
  ctx.beginPath();
  ctx.roundRect(-6, bodyY - 12, 12, 22, 3);
  ctx.fill();
  
  // Shorts (Red for Player, Blue for AI)
  ctx.fillStyle = isPlayer ? '#ef4444' : '#3b82f6';
  ctx.beginPath();
  ctx.roundRect(-7, bodyY + 6, 14, 10, 2);
  ctx.fill();
  
  // Head
  ctx.fillStyle = '#fca5a5';
  ctx.beginPath();
  ctx.arc(0, headY, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Mongkhon (Golden headband)
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, headY - 3, 8.5, Math.PI, 0);
  ctx.stroke();
  
  // Fighter Gloves
  ctx.fillStyle = isPlayer ? '#b91c1c' : '#1d4ed8';
  let armX = 10;
  let armY = bodyY - 4;
  if (f.state === 'punching') {
    armX = 26;
    armY = bodyY - 10;
  }
  ctx.beginPath();
  ctx.arc(armX, armY, 4.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

// Static Dojo Background Draw
function drawDojoBackground(ctx, w, h) {
  // Tatame floor
  ctx.fillStyle = '#292524';
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = '#44403c';
  ctx.fillRect(0, 160, w, h - 160);
  
  ctx.fillStyle = '#d97706';
  ctx.fillRect(0, 160, w, 2.5);
  
  // Big Red Sun Emblem
  ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
  ctx.beginPath();
  ctx.arc(w / 2, 75, 42, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.font = 'bold 32px "Space Grotesk"';
  ctx.textAlign = 'center';
  ctx.fillText('FEAM', w / 2, 85);
}

// HUD Overlay
function drawScoreOverlay(ctx, text, w) {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(6, 6, w - 12, 22);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(text, 14, 20);
}

// Canvas central render tick
function gameLoop() {
  if (!canvas || !ctx || gameIsOver) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.save();
  if (screenShake > 0) {
    ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
    screenShake *= 0.82;
    if (screenShake < 0.4) screenShake = 0;
  }
  
  // 1. Muay Thai Combat Arena
  if (currentSelectedGame === 'luta') {
    drawDojoBackground(ctx, canvas.width, canvas.height);
    gameState.fighterPlayer.frame++;
    gameState.fighterEnemy.frame++;
    
    drawCombatFighter(ctx, gameState.fighterPlayer, true);
    drawCombatFighter(ctx, gameState.fighterEnemy, false);
    drawScoreOverlay(ctx, `Você HP: ${gameState.lives} | Mestre HP: ${gameState.timer}`, canvas.width);
  }
  
  // 2. Formula Highway Racer
  else if (currentSelectedGame === 'carro') {
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Lane markers
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([15, 15]);
    ctx.lineDashOffset = -gameState.timer * 4.5;
    gameState.timer += 1.5;
    
    ctx.beginPath(); ctx.moveTo(160, 0); ctx.lineTo(160, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(320, 0); ctx.lineTo(320, canvas.height); ctx.stroke();
    ctx.setLineDash([]);
    
    // Green grassy borders
    ctx.fillStyle = '#14532d';
    ctx.fillRect(0, 0, 45, canvas.height);
    ctx.fillRect(canvas.width - 45, 0, 45, canvas.height);
    
    // Smooth racer position
    const targetX = 100 + gameState.carLane * 140;
    gameState.carX += (targetX - gameState.carX) * 0.22;
    
    // Draw player car
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.roundRect(gameState.carX - 15, 160, 30, 42, 5); ctx.fill();
    ctx.fillStyle = '#000'; // wheels
    ctx.fillRect(gameState.carX - 18, 165, 3, 10);
    ctx.fillRect(gameState.carX + 15, 165, 3, 10);
    ctx.fillRect(gameState.carX - 18, 185, 3, 10);
    ctx.fillRect(gameState.carX + 15, 185, 3, 10);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(gameState.carX - 6, 172, 12, 10); // cabin
    
    // Spawn highway obstacles
    if (Math.random() < 0.02) {
      const lane = Math.floor(Math.random() * 3);
      gameState.carTraffic.push({ x: 100 + lane * 140, y: -50, speed: 2.2 + Math.random() * 2 });
    }
    
    // Move and Draw traffic obstacle blocks
    gameState.carTraffic.forEach(tc => {
      tc.y += tc.speed;
      ctx.fillStyle = '#60a5fa'; // Blue car obstacle
      ctx.beginPath(); ctx.roundRect(tc.x - 15, tc.y, 30, 42, 5); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.fillRect(tc.x - 18, tc.y + 5, 3, 10);
      ctx.fillRect(tc.x + 15, tc.y + 5, 3, 10);
      ctx.fillRect(tc.x - 18, tc.y + 25, 3, 10);
      ctx.fillRect(tc.x + 15, tc.y + 25, 3, 10);
      
      // Collision detect
      if (Math.abs(gameState.carX - tc.x) < 28 && Math.abs(160 - tc.y) < 38) {
        screenShake = 15;
        spawnHitParticles(gameState.carX, 160, '#ef4444');
        endDojoGame('lose');
      }
    });
    
    gameState.carTraffic = gameState.carTraffic.filter(tc => tc.y < canvas.height + 50);
    score = Math.floor(gameState.timer / 8);
    drawScoreOverlay(ctx, `Pontos: ${score}`, canvas.width);
  }
  
  // 3. Moto Obstacle Course
  else if (currentSelectedGame === 'moto') {
    ctx.fillStyle = '#44403c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1e293b'; // Road lane
    ctx.fillRect(0, 150, canvas.width, 55);
    
    // Lanes line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([15, 15]);
    ctx.lineDashOffset = -gameState.timer * 4;
    ctx.beginPath(); ctx.moveTo(0, 175); ctx.lineTo(canvas.width, 175); ctx.stroke();
    ctx.setLineDash([]);
    gameState.timer++;
    
    // Physics
    gameState.bikeVy += 0.8;
    gameState.bikeY += gameState.bikeVy;
    if (gameState.bikeY >= 165) {
      gameState.bikeY = 165;
      gameState.bikeVy = 0;
      gameState.bikeIsJumping = false;
    }
    
    // Draw Moto
    ctx.fillStyle = '#10b981';
    ctx.fillRect(80, gameState.bikeY - 12, 22, 10);
    ctx.fillStyle = '#000'; // Tyres
    ctx.beginPath(); ctx.arc(82, gameState.bikeY, 7, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(100, gameState.bikeY, 7, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ef4444'; // rider helmet
    ctx.beginPath(); ctx.arc(90, gameState.bikeY - 18, 5, 0, Math.PI*2); ctx.fill();
    
    // Spawn barriers
    if (Math.random() < 0.015) {
      gameState.obstacles.push({ x: canvas.width + 40, y: 165, type: Math.random() > 0.5 ? 'brick' : 'tire' });
    }
    
    gameState.obstacles.forEach(obs => {
      obs.x -= 4;
      ctx.fillStyle = obs.type === 'brick' ? '#f43f5e' : '#27272a';
      ctx.fillRect(obs.x - 10, obs.y - 12, 16, 12);
      
      // Collision check
      if (Math.abs(obs.x - 90) < 18 && gameState.bikeY >= 160) {
        screenShake = 12;
        spawnHitParticles(90, gameState.bikeY, '#f43f5e');
        endDojoGame('lose');
      }
    });
    gameState.obstacles = gameState.obstacles.filter(obs => obs.x > -40);
    
    // Gold Medals
    if (Math.random() < 0.012) {
      gameState.medals.push({ x: canvas.width + 40, y: 120 + Math.random() * 25, collected: false });
    }
    
    gameState.medals.forEach(m => {
      m.x -= 4;
      if (!m.collected) {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(m.x, m.y, 5, 0, Math.PI*2); ctx.fill();
        
        // Pick
        if (Math.hypot(m.x - 90, m.y - gameState.bikeY + 5) < 18) {
          m.collected = true;
          score += 25;
          spawnHitParticles(m.x, m.y, '#fbbf24');
          addFloatingText('+25 XP', m.x, m.y - 10, '#34d399');
        }
      }
    });
    gameState.medals = gameState.medals.filter(m => m.x > -40 && !m.collected);
    
    score += 1;
    drawScoreOverlay(ctx, `Dojo Moedas: ${Math.floor(score/12)} | Score: ${score}`, canvas.width);
  }
  
  // 4. Dojo Ninja Target Shooter
  else if (currentSelectedGame === 'tiro') {
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (gameState.targets.length < 3 && Math.random() < 0.025) {
      gameState.targets.push({
        x: 60 + Math.random() * (canvas.width - 120),
        y: 60 + Math.random() * (canvas.height - 110),
        radius: 22 + Math.random() * 8,
        timer: 1.8,
        maxTimer: 1.8
      });
    }
    
    gameState.targets = gameState.targets.filter(t => {
      t.timer -= 1/60;
      if (t.timer <= 0) {
        gameState.lives--;
        screenShake = 6;
        spawnHitParticles(t.x, t.y, '#f43f5e');
        if (gameState.lives <= 0) endDojoGame('lose');
        return false;
      }
      
      // Target Ring
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius * (t.timer / t.maxTimer), 0, Math.PI * 2);
      ctx.stroke();
      
      // White and Red bullseye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(t.x, t.y, t.radius * 0.6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(t.x, t.y, t.radius * 0.3, 0, Math.PI*2); ctx.fill();
      
      return true;
    });
    
    drawScoreOverlay(ctx, `Vidas: ${'❤️'.repeat(gameState.lives)} | Alvos Derrubados: ${score/10}`, canvas.width);
  }
  
  // 5. Plane Altitude Survival
  else if (currentSelectedGame === 'aviao') {
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Spawn sky clouds
    if (Math.random() < 0.015) {
      gameState.clouds.push({ x: canvas.width + 80, y: Math.random() * 120, size: 35 + Math.random()*25, speed: 1.2 });
    }
    gameState.clouds.forEach(cl => {
      cl.x -= cl.speed;
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.beginPath(); ctx.arc(cl.x, cl.y, cl.size/2, 0, Math.PI*2); ctx.fill();
    });
    gameState.clouds = gameState.clouds.filter(cl => cl.x > -80);
    
    // Smooth Altitude Y
    gameState.planeCurY += (gameState.planeY - gameState.planeCurY) * 0.15;
    
    // Draw Red Biplane
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(50, gameState.planeCurY - 6, 22, 12);
    ctx.fillStyle = '#fbbf24'; // wings
    ctx.fillRect(58, gameState.planeCurY - 18, 5, 36);
    
    // Missile Spawn
    if (Math.random() < 0.025) {
      gameState.enemies.push({ x: canvas.width + 30, y: 30 + Math.random()*150, speed: 3.5 + Math.random()*1.8 });
    }
    
    gameState.enemies.forEach(m => {
      m.x -= m.speed;
      ctx.fillStyle = '#eab308';
      ctx.fillRect(m.x - 10, m.y - 4, 18, 8);
      ctx.fillStyle = '#ef4444'; // Tip
      ctx.fillRect(m.x - 14, m.y - 4, 4, 8);
      
      // Collision
      if (Math.hypot(m.x - 60, m.y - gameState.planeCurY) < 18) {
        screenShake = 15;
        spawnHitParticles(60, gameState.planeCurY, '#ef4444');
        endDojoGame('lose');
      }
    });
    gameState.enemies = gameState.enemies.filter(m => m.x > -30);
    
    score += 1;
    drawScoreOverlay(ctx, `Combustível de Vôo: ${score}`, canvas.width);
  }
  
  // 6. Ninja Endless Runner
  else if (currentSelectedGame === 'runner') {
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#312e81'; // Earth
    ctx.fillRect(0, 165, canvas.width, 55);
    
    ctx.strokeStyle = '#4338ca';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([10, 10]);
    ctx.lineDashOffset = -gameState.timer * 4;
    ctx.beginPath(); ctx.moveTo(0, 166); ctx.lineTo(canvas.width, 166); ctx.stroke();
    ctx.setLineDash([]);
    gameState.timer++;
    
    // Physics
    gameState.runnerVy += 0.75;
    gameState.runnerY += gameState.runnerVy;
    if (gameState.runnerY >= 165) {
      gameState.runnerY = 165;
      gameState.runnerVy = 0;
      gameState.runnerIsJumping = false;
    }
    
    if (gameState.runnerIsSliding) {
      gameState.runnerSlideTimer--;
      if (gameState.runnerSlideTimer <= 0) gameState.runnerIsSliding = false;
    }
    
    // Draw Purple Ninja
    ctx.fillStyle = '#c084fc';
    if (gameState.runnerIsSliding) {
      ctx.fillRect(60, gameState.runnerY - 8, 20, 8);
    } else {
      ctx.fillRect(64, gameState.runnerY - 24, 12, 24);
      ctx.fillStyle = '#ef4444'; // sash
      ctx.fillRect(52, gameState.runnerY - 14, 12, 3.5);
    }
    
    // Spikes Obstacles
    if (Math.random() < 0.015) {
      gameState.runnerObstacles.push({ x: canvas.width + 30, y: 165, w: 12, h: 15 });
    }
    
    gameState.runnerObstacles.forEach(obs => {
      obs.x -= 4;
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(obs.x - obs.w/2, obs.y);
      ctx.lineTo(obs.x + obs.w/2, obs.y);
      ctx.lineTo(obs.x, obs.y - obs.h);
      ctx.fill();
      
      // Collision
      const hitX = Math.abs(obs.x - 70);
      const hitY = gameState.runnerIsSliding ? 10 : 24;
      if (hitX < 14 && gameState.runnerY >= 165 - hitY) {
        screenShake = 12;
        spawnHitParticles(70, gameState.runnerY - 10, '#f43f5e');
        endDojoGame('lose');
      }
    });
    gameState.runnerObstacles = gameState.runnerObstacles.filter(obs => obs.x > -30);
    
    score += 2;
    drawScoreOverlay(ctx, `Ninja Distância: ${score} metros`, canvas.width);
  }
  
  // 7. Dojo Pong Classic
  else if (currentSelectedGame === 'pong') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Center divider
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([10, 10]);
    ctx.beginPath(); ctx.moveTo(canvas.width/2, 0); ctx.lineTo(canvas.width/2, canvas.height); ctx.stroke();
    ctx.setLineDash([]);
    
    // Move Player Paddle smoothly
    gameState.pongCurPlayerY += (gameState.pongPlayerY - gameState.pongCurPlayerY) * 0.16;
    
    // AI moves
    if (gameState.pongBall.y < gameState.pongAIY + 20) gameState.pongAIY -= 2;
    else if (gameState.pongBall.y > gameState.pongAIY + 20) gameState.pongAIY += 2;
    gameState.pongAIY = Math.max(10, Math.min(170, gameState.pongAIY));
    
    // Ball moving
    const b = gameState.pongBall;
    b.x += b.vx;
    b.y += b.vy;
    
    if (b.y - b.radius <= 0 || b.y + b.radius >= canvas.height) b.vy = -b.vy;
    
    // Draw paddles
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(20, gameState.pongCurPlayerY, 8, 40);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(canvas.width - 28, gameState.pongAIY, 8, 40);
    
    // Draw ball
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2); ctx.fill();
    
    // Bounce Player
    if (b.x - b.radius <= 28 && b.x - b.radius >= 18 && b.y >= gameState.pongCurPlayerY && b.y <= gameState.pongCurPlayerY + 40) {
      b.vx = Math.abs(b.vx) + 0.15;
      spawnHitParticles(b.x, b.y, '#3b82f6');
    }
    // Bounce AI
    if (b.x + b.radius >= canvas.width - 28 && b.x + b.radius <= canvas.width - 18 && b.y >= gameState.pongAIY && b.y <= gameState.pongAIY + 40) {
      b.vx = -(Math.abs(b.vx) + 0.15);
      spawnHitParticles(b.x, b.y, '#ef4444');
    }
    
    // Scores
    if (b.x < 0) {
      gameState.pongAIScore++;
      resetPongBall(1);
      if (gameState.pongAIScore >= 3) endDojoGame('lose');
    } else if (b.x > canvas.width) {
      gameState.pongPlayerScore++;
      resetPongBall(-1);
      if (gameState.pongPlayerScore >= 3) endDojoGame('win');
    }
    
    drawScoreOverlay(ctx, `Você: ${gameState.pongPlayerScore} | Mestre AI: ${gameState.pongAIScore}`, canvas.width);
  }
  
  // 8. Cobra do Dojo (Grid Snake)
  else if (currentSelectedGame === 'snake') {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    gameState.snakeTicks++;
    if (gameState.snakeTicks >= 7) {
      gameState.snakeTicks = 0;
      
      const head = { x: gameState.snake[0].x + gameState.snakeDir.x, y: gameState.snake[0].y + gameState.snakeDir.y };
      
      if (head.x < 10 || head.x >= canvas.width - 10 || head.y < 10 || head.y >= canvas.height - 10) {
        endDojoGame('lose');
        return;
      }
      for (let i = 0; i < gameState.snake.length; i++) {
        if (gameState.snake[i].x === head.x && gameState.snake[i].y === head.y) {
          endDojoGame('lose');
          return;
        }
      }
      
      gameState.snake.unshift(head);
      
      // Eat gold food
      if (Math.abs(head.x - gameState.snakeFood.x) < 10 && Math.abs(head.y - gameState.snakeFood.y) < 10) {
        score += 15;
        spawnHitParticles(gameState.snakeFood.x, gameState.snakeFood.y, '#fbbf24');
        addFloatingText('+15 XP', gameState.snakeFood.x, gameState.snakeFood.y - 10, '#34d399');
        spawnSnakeFood();
      } else {
        gameState.snake.pop();
      }
    }
    
    // Border boundary visual
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Food
    ctx.fillStyle = '#eab308';
    ctx.beginPath(); ctx.arc(gameState.snakeFood.x + 5, gameState.snakeFood.y + 5, 5, 0, Math.PI*2); ctx.fill();
    
    // Snake body
    gameState.snake.forEach((seg, index) => {
      ctx.fillStyle = index === 0 ? '#10b981' : '#047857';
      ctx.fillRect(seg.x, seg.y, 9, 9);
    });
    
    drawScoreOverlay(ctx, `Proteínas Ingeridas: ${score}`, canvas.width);
  }
  
  // 9. Arkanoid Breakout Bricks
  else if (currentSelectedGame === 'bricks') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    gameState.brickCurPaddleX += (gameState.brickPaddleX - gameState.brickCurPaddleX) * 0.22;
    
    // Draw paddle
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(gameState.brickCurPaddleX - 30, 200, 60, 8);
    
    const b = gameState.brickBall;
    b.x += b.vx;
    b.y += b.vy;
    
    if (b.x - b.radius <= 0 || b.x + b.radius >= canvas.width) b.vx = -b.vx;
    if (b.y - b.radius <= 0) b.vy = -b.vy;
    
    // Paddle bounce
    if (b.y + b.radius >= 200 && b.y + b.radius <= 208 && b.x >= gameState.brickCurPaddleX - 35 && b.x <= gameState.brickCurPaddleX + 35) {
      b.vy = -Math.abs(b.vy);
      b.vx = (b.x - gameState.brickCurPaddleX) * 0.16;
      spawnHitParticles(b.x, b.y, '#fbbf24');
    }
    
    if (b.y > canvas.height) endDojoGame('lose');
    
    // Ball
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2); ctx.fill();
    
    // Bricks grid check
    let activeBricks = 0;
    gameState.brickGrid.forEach(br => {
      if (br.active) {
        activeBricks++;
        ctx.fillStyle = br.color;
        ctx.fillRect(br.x, br.y, br.w, br.h);
        
        if (b.x + b.radius > br.x && b.x - b.radius < br.x + br.w && b.y + b.radius > br.y && b.y - b.radius < br.y + br.h) {
          br.active = false;
          b.vy = -b.vy;
          score += 10;
          spawnHitParticles(br.x + br.w/2, br.y + br.h/2, br.color);
          addFloatingText('+10', br.x + br.w/2, br.y, br.color);
        }
      }
    });
    
    if (activeBricks === 0) endDojoGame('win');
    drawScoreOverlay(ctx, `Tijolos Quebrados: ${score}`, canvas.width);
  }
  
  // 10. Maze Navigator
  else if (currentSelectedGame === 'maze') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cs = 18;
    const sx = (canvas.width - 15 * cs) / 2;
    const sy = (canvas.height - 11 * cs) / 2;
    
    for (let r = 0; r < 11; r++) {
      for (let c = 0; c < 15; c++) {
        const x = sx + c * cs;
        const y = sy + r * cs;
        ctx.fillStyle = gameState.mazeGrid[r][c] === 1 ? '#475569' : '#1e293b';
        ctx.fillRect(x, y, cs - 1.5, cs - 1.5);
      }
    }
    
    // Draw gold medal target
    const gx = sx + gameState.mazeGoal.x * cs + cs/2;
    const gy = sy + gameState.mazeGoal.y * cs + cs/2;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(gx, gy, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '8px sans-serif';
    ctx.fillText('🏆', gx - 4.5, gy + 3);
    
    // Draw player dot
    const px = sx + gameState.mazePlayer.x * cs + cs/2;
    const py = sy + gameState.mazePlayer.y * cs + cs/2;
    ctx.fillStyle = '#c084fc';
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI*2); ctx.fill();
    
    if (gameState.mazePlayer.x === gameState.mazeGoal.x && gameState.mazePlayer.y === gameState.mazeGoal.y) {
      endDojoGame('win');
    }
    drawScoreOverlay(ctx, 'Alcançar a Taça Sagrada no final do Labirinto!', canvas.width);
  }
  
  // 11. Flappy Flying Belt
  else if (currentSelectedGame === 'flappy') {
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    gameState.flappyVy += 0.45;
    gameState.flappyY += gameState.flappyVy;
    if (gameState.flappyY < 5) { gameState.flappyY = 5; gameState.flappyVy = 0; }
    
    if (gameState.flappyY >= canvas.height - 10) {
      screenShake = 10;
      spawnHitParticles(80, gameState.flappyY, '#fbbf24');
      endDojoGame('lose');
    }
    
    // Player flying dot
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(80, gameState.flappyY, 7, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(75, gameState.flappyY - 2, 10, 4);
    
    // Obstacles pipes
    if (Math.random() < 0.016) {
      const gap = 58;
      const th = 30 + Math.random() * 80;
      gameState.flappyPipes.push({ x: canvas.width + 30, topH: th, bottomH: canvas.height - th - gap, passed: false });
    }
    
    gameState.flappyPipes.forEach(p => {
      p.x -= 2.5;
      ctx.fillStyle = '#991b1b'; // Red punchbags
      ctx.fillRect(p.x - 12, 0, 24, p.topH);
      ctx.fillRect(p.x - 12, canvas.height - p.bottomH, 24, p.bottomH);
      
      // Hit overlap check
      if (80 + 7 > p.x - 12 && 80 - 7 < p.x + 12) {
        if (gameState.flappyY - 7 < p.topH || gameState.flappyY + 7 > canvas.height - p.bottomH) {
          screenShake = 15;
          spawnHitParticles(80, gameState.flappyY, '#ef4444');
          endDojoGame('lose');
        }
      }
      
      if (!p.passed && p.x < 80) {
        p.passed = true;
        score++;
        addFloatingText('+1', 80, gameState.flappyY - 15, '#34d399');
      }
    });
    gameState.flappyPipes = gameState.flappyPipes.filter(p => p.x > -30);
    drawScoreOverlay(ctx, `Sacos de Pancada desviados: ${score}`, canvas.width);
  }
  
  // 12. Penalty Shootout
  else if (currentSelectedGame === 'penalties') {
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Goal line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(110, 0); ctx.lineTo(110, 45); ctx.lineTo(370, 45); ctx.lineTo(370, 0);
    ctx.stroke();
    
    // Goalie moves back and forth
    gameState.penaltyGoalieX += gameState.penaltyGoalieDir * 3.5;
    if (gameState.penaltyGoalieX < 130 || gameState.penaltyGoalieX > 350) {
      gameState.penaltyGoalieDir = -gameState.penaltyGoalieDir;
    }
    
    // Draw goalie
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(gameState.penaltyGoalieX, 35, 7, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath(); ctx.arc(gameState.penaltyGoalieX, 23, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000'; // Belt
    ctx.fillRect(gameState.penaltyGoalieX - 5, 41, 10, 3);
    
    // Moving penalty ball
    const ball = gameState.penaltyBall;
    if (ball.active) {
      ball.x += ball.vx;
      ball.y += ball.vy;
      
      if (ball.y <= 45) {
        ball.active = false;
        const caught = Math.abs(ball.x - gameState.penaltyGoalieX) < 28;
        if (caught) {
          screenShake = 6;
          spawnHitParticles(ball.x, ball.y, '#ffffff');
          addFloatingText('DEFENDEU! 🧤', ball.x, ball.y - 12, '#ef4444');
        } else {
          if (ball.x >= 115 && ball.x <= 365) {
            gameState.penaltyGoals++;
            spawnHitParticles(ball.x, ball.y, '#fbbf24');
            addFloatingText('GOLAÇO! ⚽', ball.x, ball.y - 12, '#34d399');
          } else {
            addFloatingText('FORA! 💨', ball.x, ball.y - 12, '#94a3b8');
          }
        }
        
        gameState.penaltyShotsLeft--;
        setTimeout(() => {
          if (gameState.penaltyShotsLeft <= 0) {
            if (gameState.penaltyGoals >= 3) endDojoGame('win');
            else endDojoGame('lose');
          } else {
            // Reset position
            ball.x = 240; ball.y = 195; ball.vx = 0; ball.vy = 0;
            // enable shootout buttons
            ['esquerda', 'centro', 'direita'].forEach(s => {
              const b = document.getElementById(`btn-shoot-${s}`);
              if (b) b.removeAttribute('disabled');
            });
          }
        }, 1200);
      }
    }
    
    // Ball
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(ball.x, ball.y, 8, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    drawScoreOverlay(ctx, `Gols: ${gameState.penaltyGoals}/3 | Chutes Restantes: ${gameState.penaltyShotsLeft}`, canvas.width);
  }
  
  // Render active particle sparks
  particles = particles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.alpha -= p.decay;
    if (p.alpha <= 0) return false;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2); ctx.fill();
    ctx.restore();
    return true;
  });
  
  // Render active floating overlay texts
  floatingTexts = floatingTexts.filter(t => {
    t.y += t.vy;
    t.alpha -= 0.02;
    if (t.alpha <= 0) return false;
    ctx.save();
    ctx.globalAlpha = t.alpha;
    ctx.fillStyle = t.color;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.text, t.x, t.y);
    ctx.restore();
    return true;
  });
  
  ctx.restore();
  animFrameId = requestAnimationFrame(gameLoop);
}

// END THE ACTIVE RUNNING GAME & PERSIST XP
function endDojoGame(res) {
  gameIsOver = true;
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  
  document.getElementById('game-screen-arena').classList.add('hidden');
  document.getElementById('game-screen-html').classList.add('hidden');
  document.getElementById('game-screen-result').classList.remove('hidden');
  
  const title = document.getElementById('result-title');
  const xpText = document.getElementById('result-reward-xp');
  
  let earned = 0;
  if (res === 'win') {
    title.textContent = "VITÓRIA EXCELENTE! 🏆";
    title.className = "text-lg font-black text-amber-400 uppercase tracking-widest";
    earned = 50;
    xpText.textContent = `+50 XP coletados para sua faixa!`;
  } else if (res === 'win_partial') {
    title.textContent = "RETIRADA SEGURA! 💰";
    title.className = "text-lg font-black text-emerald-400 uppercase tracking-widest";
    earned = score;
    xpText.textContent = `+${earned} XP coletados com sucesso!`;
  } else {
    title.textContent = "FIM DE JOGO 🥊";
    title.className = "text-lg font-black text-red-500 uppercase tracking-widest";
    earned = 10;
    xpText.textContent = `Dojo de treino: +10 XP de participação!`;
  }
  
  // Update local dojo storage
  let currentXP = parseInt(localStorage.getItem('feam_dojo_xp') || '0');
  currentXP += earned;
  localStorage.setItem('feam_dojo_xp', currentXP.toString());
  updateBeltUI();
}

// Initialize specific HTML Game interface panels
function initHtmlGame(id) {
  const container = document.getElementById('game-html-container');
  if (!container) return;
  container.innerHTML = '';
  
  if (id === 'adivinhacao') {
    gameState.guessSecret = Math.floor(Math.random() * 100) + 1;
    gameState.guessAttempts = 8;
    
    container.innerHTML = `
      <div class="space-y-4 text-center">
        <h4 class="text-sm font-black text-white uppercase tracking-wider">Adivinhação do Grão-Mestre</h4>
        <p class="text-[10px] text-zinc-400">Pensei em um número secreto de 1 a 100. Encontre-o!</p>
        
        <div class="flex max-w-[180px] mx-auto gap-2">
          <input type="number" id="guess-input" min="1" max="100" class="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-amber-500" placeholder="Chute">
          <button onclick="submitDojoGuess()" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-xl text-xs font-black text-zinc-950">Chutar</button>
        </div>
        
        <p id="guess-feedback" class="text-xs font-bold text-amber-500">Faça o seu palpite inicial!</p>
        <p id="guess-lives-bar" class="text-[9px] text-zinc-500 font-mono">Tentativas: ❤️❤️❤️❤️❤️❤️❤️❤️</p>
        
        <div class="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-900">
          <div id="guess-temp-bar" class="h-full bg-blue-500 w-0 transition-all duration-300"></div>
        </div>
      </div>
    `;
  }
  
  else if (id === 'detetive') {
    container.innerHTML = `
      <div class="space-y-4">
        <div class="text-center">
          <h4 class="text-sm font-black text-white uppercase">MISTÉRIO DO CINTURÃO ROUBADO</h4>
          <p class="text-[9px] text-zinc-400 mt-1">O Cinturão de Ouro sumiu do cofre principal! Interrogue suspeitos.</p>
        </div>
        
        <div class="bg-zinc-950 p-3 rounded-xl border border-zinc-850 text-[9px] text-zinc-300 space-y-1">
          <span class="font-bold text-amber-500 uppercase tracking-widest block mb-1">🔍 Provas Policiais:</span>
          <p>• Pegada lamacenta de sapato tamanho 42.</p>
          <p>• Um fio de cabelo azul preso na maçaneta.</p>
          <p>• Cheiro de perfume de baunilha doce no ar.</p>
        </div>
        
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-zinc-900/60 p-2 border border-zinc-850 rounded-xl text-center space-y-1.5">
            <span class="text-[10px] font-bold text-white block">Mestre Jaboque</span>
            <button onclick="interrogateDojoSuspect('jaboque')" class="w-full py-1 bg-zinc-950 text-[8px] text-zinc-300 rounded font-bold">Interrogar</button>
            <button onclick="accuseDojoSuspect('jaboque', true)" class="w-full py-1 bg-red-600 text-[8px] text-white font-black rounded">Acusar 🚨</button>
          </div>
          <div class="bg-zinc-900/60 p-2 border border-zinc-850 rounded-xl text-center space-y-1.5">
            <span class="text-[10px] font-bold text-white block">Professor Hugo</span>
            <button onclick="interrogateDojoSuspect('hugo')" class="w-full py-1 bg-zinc-950 text-[8px] text-zinc-300 rounded font-bold">Interrogar</button>
            <button onclick="accuseDojoSuspect('hugo', false)" class="w-full py-1 bg-red-600 text-[8px] text-white font-black rounded">Acusar 🚨</button>
          </div>
          <div class="bg-zinc-900/60 p-2 border border-zinc-850 rounded-xl text-center space-y-1.5">
            <span class="text-[10px] font-bold text-white block">Instrutora Aline</span>
            <button onclick="interrogateDojoSuspect('aline')" class="w-full py-1 bg-zinc-950 text-[8px] text-zinc-300 rounded font-bold">Interrogar</button>
            <button onclick="accuseDojoSuspect('aline', false)" class="w-full py-1 bg-red-600 text-[8px] text-white font-black rounded">Acusar 🚨</button>
          </div>
          <div class="bg-zinc-900/60 p-2 border border-zinc-850 rounded-xl text-center space-y-1.5">
            <span class="text-[10px] font-bold text-white block">Atleta Rafael</span>
            <button onclick="interrogateDojoSuspect('rafael')" class="w-full py-1 bg-zinc-950 text-[8px] text-zinc-300 rounded font-bold">Interrogar</button>
            <button onclick="accuseDojoSuspect('rafael', false)" class="w-full py-1 bg-red-600 text-[8px] text-white font-black rounded">Acusar 🚨</button>
          </div>
        </div>
        
        <p id="detetive-speech" class="text-center text-[9px] text-zinc-500 italic bg-zinc-950 py-1.5 rounded">Selecione uma ação para escutar...</p>
      </div>
    `;
  }
  
  else if (id === 'memoria') {
    const icons = ['🥋', '🥊', '🏆', '🥇', '🥈', '🥉', '🥋', '🥊', '🏆', '🥇', '🥈', '🥉'];
    icons.sort(() => Math.random() - 0.5);
    gameState.memoryCards = icons.map((icon, idx) => ({ id: idx, icon, revealed: false, matched: false }));
    gameState.memorySelected = [];
    
    container.innerHTML = `
      <div class="space-y-4 text-center">
        <h4 class="text-sm font-black text-white uppercase">Memória do Dojo</h4>
        <div id="memory-grid" class="grid grid-cols-4 gap-2.5 max-w-[240px] mx-auto"></div>
      </div>
    `;
    renderMemoryCardsHTML();
  }
  
  else if (id === 'simon') {
    gameState.simonSequence = [Math.floor(Math.random() * 4)];
    gameState.simonPlayerIdx = 0;
    gameState.simonState = 'play';
    score = 0;
    
    container.innerHTML = `
      <div class="space-y-4 text-center">
        <h4 class="text-sm font-black text-white uppercase">Mestre Simon</h4>
        <p id="simon-status" class="text-[10px] text-zinc-400">Observe atentamente!</p>
        
        <div class="grid grid-cols-2 gap-3 max-w-[160px] mx-auto">
          <button id="simon-btn-0" onclick="clickSimonButton(0)" class="w-16 h-16 bg-red-950 border border-red-750 rounded-2xl transition-all"></button>
          <button id="simon-btn-1" onclick="clickSimonButton(1)" class="w-16 h-16 bg-blue-950 border border-blue-750 rounded-2xl transition-all"></button>
          <button id="simon-btn-2" onclick="clickSimonButton(2)" class="w-16 h-16 bg-green-950 border border-green-750 rounded-2xl transition-all"></button>
          <button id="simon-btn-3" onclick="clickSimonButton(3)" class="w-16 h-16 bg-yellow-950 border border-yellow-750 rounded-2xl transition-all"></button>
        </div>
      </div>
    `;
    setTimeout(playSimonPattern, 800);
  }
  
  else if (id === 'clicker') {
    gameState.clickerProgress = 0;
    gameState.level = 1;
    gameState.timer = 8.0;
    renderClickerHTML();
    
    const clickerInterval = setInterval(() => {
      if (currentSelectedGame !== 'clicker' || gameIsOver) {
        clearInterval(clickerInterval);
        return;
      }
      gameState.timer = Math.max(0, gameState.timer - 0.1);
      gameState.clickerProgress = Math.max(0, gameState.clickerProgress - 1.2);
      
      const bar = document.getElementById('clicker-bar');
      const timerLabel = document.getElementById('clicker-timer-label');
      if (bar) bar.style.width = `${gameState.clickerProgress}%`;
      if (timerLabel) timerLabel.textContent = `Tempo: ${gameState.timer.toFixed(1)}s`;
      
      if (gameState.timer <= 0) {
        clearInterval(clickerInterval);
        endDojoGame('lose');
      }
    }, 100);
  }
  
  else if (id === 'math') {
    gameState.level = 1;
    score = 0;
    renderMathProblemHTML();
  }
  
  else if (id === 'tictactoe') {
    gameState.tttBoard = Array(9).fill('');
    container.innerHTML = `
      <div class="space-y-4">
        <h4 class="text-sm font-black text-white uppercase text-center">Jogo da Velha</h4>
        <div id="ttt-grid" class="grid grid-cols-3 gap-2.5 max-w-[160px] mx-auto"></div>
        <p id="ttt-status" class="text-[10px] text-zinc-400 text-center">Sua vez! Marque o X</p>
      </div>
    `;
    renderTicTacToeGrid();
  }
  
  else if (id === 'jokenpo') {
    gameState.jokenpoHPPlayer = 3;
    gameState.jokenpoHPAI = 3;
    
    container.innerHTML = `
      <div class="space-y-4 text-center">
        <h4 class="text-sm font-black text-white uppercase">Jokenpô de Elite</h4>
        
        <div class="flex justify-between items-center bg-zinc-950 p-2.5 rounded-xl text-xs max-w-[260px] mx-auto">
          <div>Você: <span id="jk-hp-player" class="text-emerald-400 font-mono">❤️❤️❤️</span></div>
          <div class="font-bold text-red-500">VS</div>
          <div>Mestre: <span id="jk-hp-ai" class="text-red-400 font-mono">❤️❤️❤️</span></div>
        </div>
        
        <p id="jk-feedback" class="text-[10px] text-zinc-400 italic min-h-[30px] flex items-center justify-center p-1.5">Escolha seu ataque!</p>
        
        <div class="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
          <button onclick="playDojoJokenpo('pedra')" class="p-2.5 bg-zinc-900 border border-zinc-850 rounded-xl text-xs font-bold text-white">Pedra ✊</button>
          <button onclick="playDojoJokenpo('papel')" class="p-2.5 bg-zinc-900 border border-zinc-850 rounded-xl text-xs font-bold text-white">Papel ✋</button>
          <button onclick="playDojoJokenpo('tesoura')" class="p-2.5 bg-zinc-900 border border-zinc-850 rounded-xl text-xs font-bold text-white">Tesoura ✌️</button>
        </div>
      </div>
    `;
  }
  
  else if (id === 'mines') {
    const tiles = Array(16).fill(null).map((_, i) => ({ id: i, isMine: false, revealed: false }));
    let minesPlaced = 0;
    while (minesPlaced < 3) {
      const rIdx = Math.floor(Math.random() * 16);
      if (!tiles[rIdx].isMine) {
        tiles[rIdx].isMine = true;
        minesPlaced++;
      }
    }
    gameState.minesGrid = tiles;
    gameState.minesActive = true;
    gameState.minesSafeClicks = 0;
    gameState.minesAccumulatedXP = 0;
    renderMinesGridHTML();
  }
}

// 1. Guessing game logic
function submitDojoGuess() {
  if (gameIsOver) return;
  const input = document.getElementById('guess-input');
  const feedback = document.getElementById('guess-feedback');
  const livesBar = document.getElementById('guess-lives-bar');
  const tempBar = document.getElementById('guess-temp-bar');
  if (!input || !feedback || !livesBar || !tempBar) return;
  
  const val = parseInt(input.value);
  if (isNaN(val) || val < 1 || val > 100) return;
  
  gameState.guessAttempts--;
  const secret = gameState.guessSecret;
  const diff = Math.abs(val - secret);
  
  tempBar.style.width = `${Math.max(0, 100 - diff)}%`;
  
  if (val === secret) {
    feedback.textContent = `🎯 ACERTOU! O número era ${secret}!`;
    endDojoGame('win');
  } else {
    feedback.textContent = val < secret ? "Muito baixo! ❄️" : "Muito alto! ❄️";
    if (diff < 10) feedback.textContent += " (Está quente! 🔥)";
    livesBar.textContent = `Tentativas: ${'❤️'.repeat(gameState.guessAttempts)}`;
    
    if (gameState.guessAttempts <= 0) {
      feedback.textContent = `Fim de Jogo! O número correto era ${secret}.`;
      endDojoGame('lose');
    }
  }
  input.value = '';
}

// 2. Detective suspect logic
function interrogateDojoSuspect(name) {
  const sp = document.getElementById('detetive-speech');
  if (!sp) return;
  const speeches = {
    jaboque: "Mestre Jaboque: 'Uso calçado 42, mudei meu cabelo para azul ontem e amo o aroma doce de baunilha.'",
    hugo: "Professor Hugo: 'Calço tamanho 41, meu cabelo é curto e preto, e prefiro perfumes de pinho.'",
    aline: "Instrutora Aline: 'Calço tamanho 37, pintei meu cabelo de azul mas odeio baunilha.'",
    rafael: "Atleta Rafael: 'Calço tamanho 43, sou loiro e nunca uso perfume.'"
  };
  sp.textContent = speeches[name] || "Silêncio...";
}

function accuseDojoSuspect(name, isCorrect) {
  if (gameIsOver) return;
  const sp = document.getElementById('detetive-speech');
  if (!sp) return;
  
  if (isCorrect) {
    sp.textContent = "🚨 SOLUCIONADO! Mestre Jaboque confessa que pegou o cinturão para limpá-lo de surpresa!";
    endDojoGame('win');
  } else {
    sp.textContent = "🚨 ERRADO! O álibi desse suspeito é perfeito.";
    endDojoGame('lose');
  }
}

// 3. Memory Card click logic
function renderMemoryCardsHTML() {
  const grid = document.getElementById('memory-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  gameState.memoryCards.forEach(c => {
    const b = document.createElement('button');
    b.className = `w-12 h-12 flex items-center justify-center rounded-2xl text-lg font-bold border transition-all cursor-pointer ${
      c.revealed || c.matched ? 'bg-zinc-900 border-amber-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-600'
    }`;
    b.onclick = () => selectMemoryCard(c.id);
    b.textContent = c.revealed || c.matched ? c.icon : '❓';
    grid.appendChild(b);
  });
}

function selectMemoryCard(id) {
  if (gameIsOver || gameState.memorySelected.length >= 2) return;
  const card = gameState.memoryCards.find(c => c.id === id);
  if (!card || card.revealed || card.matched) return;
  
  card.revealed = true;
  gameState.memorySelected.push(card);
  renderMemoryCardsHTML();
  
  if (gameState.memorySelected.length === 2) {
    const [c1, c2] = gameState.memorySelected;
    if (c1.icon === c2.icon) {
      c1.matched = true;
      c2.matched = true;
      gameState.memorySelected = [];
      const win = gameState.memoryCards.every(c => c.matched);
      if (win) setTimeout(() => endDojoGame('win'), 600);
    } else {
      setTimeout(() => {
        c1.revealed = false;
        c2.revealed = false;
        gameState.memorySelected = [];
        renderMemoryCardsHTML();
      }, 750);
    }
  }
}

// 4. Simon color memory
function flashSimonButton(id) {
  const btn = document.getElementById(`simon-btn-${id}`);
  if (!btn) return;
  const colors = ['bg-red-500 border-red-400 scale-105 shadow-md', 'bg-blue-500 border-blue-400 scale-105 shadow-md', 'bg-green-500 border-green-400 scale-105 shadow-md', 'bg-yellow-500 border-yellow-400 scale-105 shadow-md'];
  const darks = ['bg-red-950 border-red-750', 'bg-blue-950 border-blue-750', 'bg-green-950 border-green-750', 'bg-yellow-950 border-yellow-750'];
  
  btn.className = `w-16 h-16 rounded-2xl transition-all cursor-pointer ${colors[id]}`;
  setTimeout(() => {
    btn.className = `w-16 h-16 rounded-2xl transition-all cursor-pointer ${darks[id]}`;
  }, 350);
}

function playSimonPattern() {
  if (currentSelectedGame !== 'simon' || gameIsOver) return;
  gameState.simonState = 'play';
  document.getElementById('simon-status').textContent = "Grão-Mestre demonstrando...";
  
  let i = 0;
  const timer = setInterval(() => {
    if (i >= gameState.simonSequence.length) {
      clearInterval(timer);
      gameState.simonState = 'input';
      document.getElementById('simon-status').textContent = "Sua vez! Repita.";
      return;
    }
    flashSimonButton(gameState.simonSequence[i]);
    i++;
  }, 650);
}

function clickSimonButton(id) {
  if (gameIsOver || gameState.simonState !== 'input') return;
  flashSimonButton(id);
  
  if (id === gameState.simonSequence[gameState.simonPlayerIdx]) {
    gameState.simonPlayerIdx++;
    if (gameState.simonPlayerIdx >= gameState.simonSequence.length) {
      score++;
      gameState.simonPlayerIdx = 0;
      if (score >= 4) {
        endDojoGame('win');
      } else {
        gameState.simonSequence.push(Math.floor(Math.random() * 4));
        setTimeout(playSimonPattern, 900);
      }
    }
  } else {
    endDojoGame('lose');
  }
}

// 5. Wood clicker
function renderClickerHTML() {
  const container = document.getElementById('game-html-container');
  if (!container) return;
  
  const boards = ['Madeira 🪵', 'Argila 🧱', 'Mármore 🪨', 'Aço 🛡️'];
  const colors = ['text-amber-600', 'text-red-500', 'text-stone-400', 'text-blue-300'];
  
  container.innerHTML = `
    <div class="space-y-4 text-center flex flex-col items-center">
      <h4 class="text-sm font-black text-white uppercase">Quebra de Tábuas</h4>
      <p class="text-[10px] text-zinc-400">Pressione rápido para quebrar a placa de <span class="font-bold ${colors[gameState.level-1]}">${boards[gameState.level-1]}</span></p>
      
      <div class="w-36 h-24 bg-zinc-950 border border-zinc-850 rounded-2xl flex items-center justify-center relative shadow-inner">
        <span class="text-3xl animate-pulse">🥋</span>
        <div id="clicker-timer-label" class="absolute bottom-1 right-2 text-[9px] font-mono text-amber-500">Tempo: ${gameState.timer.toFixed(1)}s</div>
      </div>
      
      <div class="w-full max-w-[200px] bg-zinc-950 h-2.5 rounded-full border border-zinc-900 overflow-hidden">
        <div id="clicker-bar" class="h-full bg-gradient-to-r from-red-600 to-amber-400" style="width: ${gameState.clickerProgress}%"></div>
      </div>
      
      <button onclick="strikeWoodBoard()" class="w-full max-w-[200px] py-2.5 bg-amber-500 text-zinc-950 rounded-xl text-xs font-black uppercase active:scale-95 transition-all">GOLPEAR! 👊</button>
    </div>
  `;
}

function strikeWoodBoard() {
  if (gameIsOver) return;
  gameState.clickerProgress = Math.min(100, gameState.clickerProgress + 9);
  if (gameState.clickerProgress >= 100) {
    gameState.clickerProgress = 0;
    gameState.level++;
    gameState.timer = Math.max(4.0, 9.0 - gameState.level * 1.2);
    if (gameState.level > 4) {
      endDojoGame('win');
    } else {
      renderClickerHTML();
    }
  }
}

// 6. Math ninja calculations
function renderMathProblemHTML() {
  const container = document.getElementById('game-html-container');
  if (!container) return;
  
  const ops = ['+', '-', 'x'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let n1, n2, ans;
  if (op === '+') {
    n1 = Math.floor(Math.random() * 25) + 5;
    n2 = Math.floor(Math.random() * 20) + 5;
    ans = n1 + n2;
  } else if (op === '-') {
    n1 = Math.floor(Math.random() * 25) + 10;
    n2 = Math.floor(Math.random() * n1);
    ans = n1 - n2;
  } else {
    n1 = Math.floor(Math.random() * 9) + 2;
    n2 = Math.floor(Math.random() * 6) + 2;
    ans = n1 * n2;
  }
  
  gameState.mathQuestion = { q: `${n1} ${op} ${n2}`, a: ans };
  const choices = [ans, ans + 4, ans - 3].sort(() => Math.random() - 0.5);
  
  container.innerHTML = `
    <div class="space-y-4 text-center">
      <h4 class="text-sm font-black text-white uppercase">Ninja Math</h4>
      <div class="bg-zinc-950 border border-zinc-850 p-4 rounded-xl text-lg font-mono font-black text-white max-w-[160px] mx-auto">${gameState.mathQuestion.q}</div>
      
      <div class="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
        ${choices.map(c => `<button onclick="answerMathDojo(${c})" class="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-xs font-bold rounded-xl text-white">${c}</button>`).join('')}
      </div>
      <p class="text-[9px] text-zinc-500 font-mono">Problema: ${gameState.level}/5 | Acertos: ${score}</p>
    </div>
  `;
}

function answerMathDojo(c) {
  if (gameIsOver) return;
  if (c === gameState.mathQuestion.a) score++;
  
  gameState.level++;
  if (gameState.level > 5) {
    if (score >= 4) endDojoGame('win');
    else endDojoGame('lose');
  } else {
    renderMathProblemHTML();
  }
}

// 7. TicTacToe grid rendering
function renderTicTacToeGrid() {
  const grid = document.getElementById('ttt-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  gameState.tttBoard.forEach((cell, idx) => {
    const btn = document.createElement('button');
    btn.className = "w-11 h-11 flex items-center justify-center bg-zinc-900 border border-zinc-850 rounded-xl text-sm font-black text-white";
    btn.onclick = () => playTTT(idx);
    btn.textContent = cell;
    grid.appendChild(btn);
  });
}

function playTTT(idx) {
  if (gameIsOver || gameState.tttBoard[idx] !== '') return;
  gameState.tttBoard[idx] = 'X';
  renderTicTacToeGrid();
  
  if (checkTTTWin('X')) {
    endDojoGame('win');
    return;
  }
  if (gameState.tttBoard.every(c => c !== '')) {
    endDojoGame('lose');
    return;
  }
  
  setTimeout(() => {
    const empties = gameState.tttBoard.map((c, i) => c === '' ? i : null).filter(v => v !== null);
    if (empties.length > 0) {
      gameState.tttBoard[empties[Math.floor(Math.random() * empties.length)]] = 'O';
      renderTicTacToeGrid();
      if (checkTTTWin('O')) endDojoGame('lose');
    }
  }, 350);
}

function checkTTTWin(p) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return lines.some(l => l.every(idx => gameState.tttBoard[idx] === p));
}

// 8. Elite Jokenpo RPS Match
function playDojoJokenpo(pChoice) {
  if (gameIsOver) return;
  const opts = ['pedra', 'papel', 'tesoura'];
  const ai = opts[Math.floor(Math.random() * 3)];
  const labels = { pedra: 'Pedra ✊', papel: 'Papel ✋', tesoura: 'Tesoura ✌️' };
  
  let res = 'tie';
  if (pChoice !== ai) {
    if ((pChoice==='pedra'&&ai==='tesoura') || (pChoice==='papel'&&ai==='pedra') || (pChoice==='tesoura'&&ai==='papel')) res = 'win';
    else res = 'lose';
  }
  
  const fb = document.getElementById('jk-feedback');
  if (res === 'tie') {
    fb.textContent = `Empate! Ambos escolheram ${labels[pChoice]}`;
  } else if (res === 'win') {
    gameState.jokenpoHPAI--;
    fb.textContent = `Mestre usou ${labels[ai]}. Você venceu o round! 💥`;
  } else {
    gameState.jokenpoHPPlayer--;
    fb.textContent = `Mestre usou ${labels[ai]}. Você perdeu o round! ❄️`;
  }
  
  document.getElementById('jk-hp-player').textContent = '❤️'.repeat(Math.max(0, gameState.jokenpoHPPlayer));
  document.getElementById('jk-hp-ai').textContent = '❤️'.repeat(Math.max(0, gameState.jokenpoHPAI));
  
  if (gameState.jokenpoHPPlayer <= 0) endDojoGame('lose');
  else if (gameState.jokenpoHPAI <= 0) endDojoGame('win');
}

// 9. Mines (Caça ao Cinturão)
function renderMinesGridHTML() {
  const container = document.getElementById('game-html-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="space-y-4 text-center">
      <h4 class="text-sm font-black text-white uppercase">Caça ao Cinturão</h4>
      <p class="text-[9px] text-zinc-400">Ache cinturões na arena 4x4. Desvie das bombas para retirar!</p>
      
      <div class="grid grid-cols-4 gap-2 max-w-[170px] mx-auto">
        ${gameState.minesGrid.map(cell => `
          <button onclick="clickMinesTile(${cell.id})" class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs cursor-pointer transition-all ${
            cell.revealed ? (cell.isMine ? 'bg-red-600 text-white' : 'bg-zinc-950 border border-amber-500 text-amber-500') : 'bg-zinc-900 border border-zinc-800 text-zinc-600'
          }">
            ${cell.revealed ? (cell.isMine ? '💣' : '🥋') : '❓'}
          </button>
        `).join('')}
      </div>
      
      <div class="flex justify-between items-center bg-zinc-950/65 border border-zinc-850 p-2.5 rounded-xl max-w-[190px] mx-auto text-[10px]">
        <span class="text-zinc-400">Ganhos: <span class="text-emerald-400 font-bold font-mono">+${gameState.minesAccumulatedXP} XP</span></span>
        <button onclick="cashOutMines()" class="px-2.5 py-1.5 bg-amber-500 text-zinc-950 font-black text-[9px] uppercase rounded">Retirar</button>
      </div>
    </div>
  `;
}

function clickMinesTile(id) {
  if (gameIsOver || !gameState.minesActive) return;
  const tile = gameState.minesGrid.find(t => t.id === id);
  if (!tile || tile.revealed) return;
  
  tile.revealed = true;
  if (tile.isMine) {
    gameState.minesActive = false;
    renderMinesGridHTML();
    setTimeout(() => endDojoGame('lose'), 800);
  } else {
    gameState.minesSafeClicks++;
    gameState.minesAccumulatedXP += 15;
    if (gameState.minesSafeClicks === 13) {
      gameState.minesActive = false;
      renderMinesGridHTML();
      setTimeout(() => endDojoGame('win'), 600);
    } else {
      renderMinesGridHTML();
    }
  }
}

function cashOutMines() {
  if (gameIsOver || !gameState.minesActive) return;
  gameState.minesActive = false;
  gameState.minesGrid.forEach(t => t.revealed = true);
  renderMinesGridHTML();
  setTimeout(() => {
    score = gameState.minesAccumulatedXP;
    endDojoGame('win_partial');
  }, 900);
}
