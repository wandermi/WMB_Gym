// ===========================================
// WMB GYM v2 - Core Application
// ===========================================

// Supabase client
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Application state
const APP = {
  user: null,
  profile: null,
  workouts: [],
  view: "loading",
  loading: false,
  error: null,
  modal: null
};

// ===========================================
// UTILITIES
// ===========================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; };

function escapeHTML(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);
}

function showToast(msg, type = "info") {
  const colors = { info: "#4A9EFF", success: "#00FF00", error: "#FF6B6B", warn: "#FFD600" };
  const toast = el(`<div class="toast" style="background:${colors[type]}22;border-color:${colors[type]};color:${colors[type]}">${escapeHTML(msg)}</div>`);
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ===========================================
// AUTH FUNCTIONS
// ===========================================

async function signUp(email, password, name) {
  APP.loading = true;
  render();
  const { data, error } = await sb.auth.signUp({
    email, password,
    options: { data: { name } }
  });
  APP.loading = false;
  if (error) { showToast(error.message, "error"); render(); return false; }
  showToast("Conta criada! Verifique seu email se necessário.", "success");
  await checkSession();
  return true;
}

async function signIn(email, password) {
  APP.loading = true;
  render();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  APP.loading = false;
  if (error) { showToast(error.message, "error"); render(); return false; }
  showToast("Login realizado!", "success");
  await checkSession();
  return true;
}

async function signOut() {
  await sb.auth.signOut();
  APP.user = null;
  APP.profile = null;
  APP.workouts = [];
  APP.view = "auth";
  render();
}

async function checkSession() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    APP.user = session.user;
    await loadUserData();
  } else {
    APP.view = "auth";
    render();
  }
}

// ===========================================
// DATA FUNCTIONS
// ===========================================

async function loadProfile() {
  const { data, error } = await sb.from("profiles").select("*").eq("id", APP.user.id).single();
  if (!error) APP.profile = data;
}

async function loadWorkouts() {
  const { data: workouts, error } = await sb.from("workouts")
    .select("*, exercises(*)")
    .eq("user_id", APP.user.id)
    .order("position", { ascending: true });
  if (error) { console.error(error); return; }
  if (workouts) {
    workouts.forEach(w => {
      if (w.exercises) w.exercises.sort((a, b) => (a.position || 0) - (b.position || 0));
    });
    APP.workouts = workouts;
  }
}

async function seedInitialWorkouts() {
  showToast("Importando seu protocolo de treino...", "info");
  for (const wkData of WORKOUTS_SEED) {
    const { exercises, ...workout } = wkData;
    const { data: newWorkout, error: wkError } = await sb.from("workouts")
      .insert({
        user_id: APP.user.id,
        name: workout.name,
        sub: workout.sub,
        color: workout.color,
        icon: workout.icon,
        position: workout.position,
        letter: workout.letter,
        protocol_name: PROTOCOL_DATA.name,
        goal: PROTOCOL_DATA.goal
      })
      .select()
      .single();
    
    if (wkError) { console.error("Erro workout:", wkError); continue; }
    
    const exercisesToInsert = exercises.map(ex => ({
      workout_id: newWorkout.id,
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      rest: ex.rest,
      tip: ex.tip || null,
      instructions: ex.instructions || null,
      method: ex.method || null,
      is_warmup: ex.is_warmup || false,
      is_mobility: ex.is_mobility || false,
      duration_sec: ex.duration_sec || null,
      muscles_primary: ex.muscles_primary || [],
      muscles_secondary: ex.muscles_secondary || [],
      steps: ex.steps || [],
      position: ex.position
    }));
    
    const { error: exError } = await sb.from("exercises").insert(exercisesToInsert);
    if (exError) console.error("Erro exercises:", exError);
  }
  
  await sb.from("protocol_notes").insert({
    user_id: APP.user.id,
    protocol_name: PROTOCOL_DATA.name,
    cardio_instructions: PROTOCOL_DATA.cardio,
    general_notes: PROTOCOL_DATA.notes
  });
  
  showToast("Protocolo importado com sucesso!", "success");
}

async function loadUserData() {
  APP.loading = true;
  APP.view = "loading";
  render();
  
  await loadProfile();
  await loadWorkouts();
  
  if (APP.workouts.length === 0) {
    await seedInitialWorkouts();
    await loadWorkouts();
  }
  
  await loadSchedule(); // Para mostrar treino do dia na home
  
  APP.view = "home";
  APP.loading = false;
  render();
}

// ===========================================
// VIEWS
// ===========================================

function vAuth() {
  const isSignup = APP.authMode === "signup";
  return `
    <div class="auth-container">
      <div class="auth-logo">
        <div class="logo-text">WMB<br>GYM</div>
        <div class="logo-sub">Seu treino, sua evolução</div>
      </div>
      <div class="auth-card">
        <div class="auth-tabs">
          <button class="auth-tab ${!isSignup ? "active" : ""}" data-act="setmode" data-mode="signin">Entrar</button>
          <button class="auth-tab ${isSignup ? "active" : ""}" data-act="setmode" data-mode="signup">Cadastrar</button>
        </div>
        <form class="auth-form" data-act="${isSignup ? "submitsignup" : "submitsignin"}">
          ${isSignup ? `<input type="text" id="auth-name" placeholder="Seu nome" required class="auth-input">` : ""}
          <input type="email" id="auth-email" placeholder="Email" required class="auth-input">
          <input type="password" id="auth-password" placeholder="Senha (mínimo 6 caracteres)" minlength="6" required class="auth-input">
          <button type="submit" class="auth-btn" ${APP.loading ? "disabled" : ""}>
            ${APP.loading ? "Carregando..." : (isSignup ? "Criar Conta" : "Entrar")}
          </button>
        </form>
        ${!isSignup ? `<a href="#" class="auth-link" data-act="forgot">Esqueci minha senha</a>` : ""}
      </div>
    </div>
  `;
}

function vLoading() {
  return `<div class="loading-screen"><div class="spinner"></div><div class="loading-text">Carregando...</div></div>`;
}

function vHome() {
  const name = APP.profile?.name || APP.user?.email?.split("@")[0] || "Atleta";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  
  // Buscar treino de hoje (se rotação configurada)
  const today = new Date().getDay(); // 0=Dom, 6=Sáb
  const todayScheduled = SETT.schedule?.[today];
  let todayWorkout = null;
  let todayIsRest = false;
  if (todayScheduled === "rest") todayIsRest = true;
  else if (todayScheduled) todayWorkout = APP.workouts.find(w => w.id === todayScheduled);
  
  const todayCard = todayIsRest ? `
    <div class="today-card rest-card">
      <div class="tc-icon">🛌</div>
      <div class="tc-info">
        <div class="tc-label">HOJE</div>
        <div class="tc-name">Dia de Descanso</div>
        <div class="tc-sub">Aproveite pra recuperar</div>
      </div>
    </div>
  ` : todayWorkout ? `
    <div class="today-card" data-act="openworkout" data-id="${todayWorkout.id}" style="--ex-color:${todayWorkout.color}">
      <div class="tc-letter" style="background:${todayWorkout.color}22;color:${todayWorkout.color};border-color:${todayWorkout.color}66">${todayWorkout.letter || "?"}</div>
      <div class="tc-info">
        <div class="tc-label">SEU TREINO DE HOJE</div>
        <div class="tc-name">${escapeHTML(todayWorkout.name)}</div>
        <div class="tc-sub">${escapeHTML(todayWorkout.sub || "")}</div>
      </div>
      <div class="tc-action">▶</div>
    </div>
  ` : "";
  
  const workoutCards = APP.workouts.map(w => {
    const exCount = w.exercises?.length || 0;
    const setsCount = w.exercises?.reduce((a, e) => a + (e.sets || 0), 0) || 0;
    const mobilityCount = w.exercises?.filter(e => e.is_warmup || e.is_mobility).length || 0;
    const mainCount = exCount - mobilityCount;
    return `
      <div class="workout-card" data-act="openworkout" data-id="${w.id}">
        <div class="wc-letter" style="background:${w.color}22;color:${w.color};border-color:${w.color}66">${w.letter || "?"}</div>
        <div class="wc-info">
          <div class="wc-name">${escapeHTML(w.name)}</div>
          <div class="wc-sub">${escapeHTML(w.sub || "")}</div>
          <div class="wc-meta">
            <span>${mainCount} exercícios</span>
            <span>•</span>
            <span>${setsCount} séries</span>
            ${mobilityCount > 0 ? `<span>•</span><span>${mobilityCount} aquec/mob</span>` : ""}
          </div>
        </div>
        <div class="wc-arrow">›</div>
      </div>
    `;
  }).join("");
  
  return `
    <div class="home-container">
      <header class="home-header">
        <div>
          <div class="home-greeting">${greeting},</div>
          <div class="home-name">${escapeHTML(name)} 💪</div>
        </div>
        <button class="header-btn" data-act="menu">⋮</button>
      </header>
      
      ${todayCard}
      
      <div class="protocol-badge">
        <div class="pb-icon">🏆</div>
        <div>
          <div class="pb-name">PROTOCOLO 2</div>
          <div class="pb-meta">Hipertrofia • Intermediário</div>
        </div>
      </div>
      
      <section class="section">
        <h2 class="section-title">Meus Treinos</h2>
        <div class="workout-list">
          ${workoutCards || `<div class="empty-state">Nenhum treino encontrado</div>`}
        </div>
      </section>
      
      <section class="section">
        <h2 class="section-title">Acesso Rápido</h2>
        <div class="quick-grid">
          <div class="quick-card" data-act="goto" data-view="history">
            <div class="qc-icon">📊</div>
            <div class="qc-label">Histórico</div>
          </div>
          <div class="quick-card" data-act="goprogress">
            <div class="qc-icon">📈</div>
            <div class="qc-label">Progressão</div>
          </div>
          <div class="quick-card" data-act="goto" data-view="profile">
            <div class="qc-icon">👤</div>
            <div class="qc-label">Perfil</div>
          </div>
          <div class="quick-card" data-act="goto" data-view="settings">
            <div class="qc-icon">⚙️</div>
            <div class="qc-label">Config</div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function vMenu() {
  return `
    <div class="modal-overlay" data-act="closemodal">
      <div class="modal-sheet" onclick="event.stopPropagation()">
        <div class="modal-handle"></div>
        <div class="modal-title">Menu</div>
        <div class="menu-list">
          <button class="menu-item" data-act="goto" data-view="history">
            <span>📊</span> Histórico de Treinos
          </button>
          <button class="menu-item" data-act="goto" data-view="profile">
            <span>👤</span> Meu Perfil
          </button>
          <button class="menu-item" data-act="goto" data-view="settings">
            <span>⚙️</span> Configurações
          </button>
          <button class="menu-item" data-act="logout">
            <span>🚪</span> Sair
          </button>
        </div>
      </div>
    </div>
  `;
}

// ===========================================
// RENDER
// ===========================================

function render() {
  const app = $("#app");
  if (!app) return;
  
  let html = "";
  switch (APP.view) {
    case "loading": html = vLoading(); break;
    case "auth": html = vAuth(); break;
    case "home": html = vHome(); break;
    case "workout": html = vWorkoutExecution(); break;
    case "history": html = vHistory(); break;
    case "progress": html = vProgress(); break;
    case "profile": html = vProfile(); break;
    case "settings": html = vSettings(); break;
    default: html = vLoading();
  }
  
  app.innerHTML = html;
  
  if (APP.modal === "menu") {
    app.insertAdjacentHTML("beforeend", vMenu());
  }
  
  // Video modal
  if (WO.videoModal && APP.view === "workout") {
    app.insertAdjacentHTML("beforeend", vVideoModal());
  }
  
  // Re-render rest timer overlay se ativo
  if (WO.restTimer && APP.view === "workout") {
    updateRestTimerUI();
  }
  
  // Re-render chart se estiver na tela de progresso
  if (APP.view === "progress" && HIST.progressExercise && HIST.progressData.length > 0) {
    setTimeout(renderChart, 50);
  }
}

// ===========================================
// EVENT HANDLERS
// ===========================================

document.addEventListener("click", async (e) => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  
  const act = el.dataset.act;
  
  if (act === "setmode") {
    APP.authMode = el.dataset.mode;
    render();
  } else if (act === "menu") {
    APP.modal = "menu";
    render();
  } else if (act === "closemodal") {
    APP.modal = null;
    render();
  } else if (act === "logout") {
    if (confirm("Tem certeza que deseja sair?")) await signOut();
  } else if (act === "openworkout") {
    await startWorkout(el.dataset.id);
  } else if (act === "toggleex") {
    const id = el.dataset.id;
    if (WO.expanded.has(id)) WO.expanded.delete(id);
    else WO.expanded.add(id);
    render();
  } else if (act === "togglewarmup") {
    WO.warmupExpanded = !WO.warmupExpanded;
    render();
  } else if (act === "skipwarmup") {
    WO.warmupSkipped = true;
    render();
  } else if (act === "toggleset") {
    await toggleSetCompleted(el.dataset.eid, parseInt(el.dataset.idx));
  } else if (act === "skiprest") {
    skipRestTimer();
  } else if (act === "addrest") {
    addRestTime(parseInt(el.dataset.sec));
  } else if (act === "cancelworkout") {
    await cancelWorkout();
  } else if (act === "finishworkout") {
    const totalSets = Object.values(WO.setLogs).flat().length;
    const doneSets = Object.values(WO.setLogs).flat().filter(s => s.completed).length;
    if (doneSets < totalSets) {
      if (!confirm(`Você completou ${doneSets} de ${totalSets} séries. Finalizar mesmo assim?`)) return;
    }
    await finishWorkout();
  } else if (act === "goto") {
    const view = el.dataset.view;
    APP.modal = null;
    if (view === "history") {
      APP.view = "history";
      render();
      await loadHistory();
    } else if (view === "profile") {
      APP.view = "profile";
      PROF.editing = false;
      render();
      await loadProfileData();
      render();
    } else if (view === "settings") {
      APP.view = "settings";
      render();
      await loadSchedule();
      render();
    } else {
      render();
    }
  } else if (act === "editprofile") {
    PROF.form = { ...(APP.profile || {}) };
    PROF.editing = true;
    render();
  } else if (act === "cancelprofileedit") {
    PROF.editing = false;
    render();
  } else if (act === "saveprofile") {
    await saveProfile();
  } else if (act === "clearprogress") {
    await clearAllProgress();
  } else if (act === "resetworkouts") {
    await resetWorkouts();
  } else if (act === "openvideo") {
    openVideoModal(el.dataset.id);
  } else if (act === "closevideo") {
    closeVideoModal();
  } else if (act === "gohome") {
    APP.view = "home";
    HIST.selectedSession = null;
    HIST.sessionDetails = null;
    render();
  } else if (act === "gohistory") {
    APP.view = "history";
    if (HIST.chartInstance) { HIST.chartInstance.destroy(); HIST.chartInstance = null; }
    render();
  } else if (act === "goprogress") {
    APP.view = "progress";
    HIST.progressExercise = null;
    HIST.progressData = [];
    render();
    await loadExerciseList();
    render();
  } else if (act === "setfilter") {
    HIST.filter = el.dataset.id;
    HIST.selectedSession = null;
    HIST.sessionDetails = null;
    render();
  } else if (act === "togglesession") {
    const id = el.dataset.id;
    if (HIST.selectedSession === id) {
      HIST.selectedSession = null;
      HIST.sessionDetails = null;
      render();
    } else {
      HIST.selectedSession = id;
      HIST.sessionDetails = null;
      render();
      await loadSessionDetails(id);
    }
  }
});

document.addEventListener("submit", async (e) => {
  const form = e.target.closest("[data-act]");
  if (!form) return;
  e.preventDefault();
  
  const act = form.dataset.act;
  
  if (act === "submitsignin") {
    const email = $("#auth-email").value.trim();
    const password = $("#auth-password").value;
    await signIn(email, password);
  } else if (act === "submitsignup") {
    const name = $("#auth-name").value.trim();
    const email = $("#auth-email").value.trim();
    const password = $("#auth-password").value;
    if (password.length < 6) { showToast("Senha precisa ter no mínimo 6 caracteres", "error"); return; }
    await signUp(email, password, name);
  }
});

// Sincronizar inputs de carga/reps em tempo real
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.dataset.w || t.dataset.r) {
    const isWeight = !!t.dataset.w;
    const key = isWeight ? t.dataset.w : t.dataset.r;
    const [exId, idx] = key.split("-");
    const sets = WO.setLogs[exId];
    if (sets && sets[idx]) {
      if (isWeight) sets[idx].weight = t.value;
      else sets[idx].reps = t.value;
    }
  }
});

// Handler para selects (exercise picker)
document.addEventListener("change", async (e) => {
  const t = e.target;
  if (t.dataset.act === "selectexercise") {
    const id = t.value;
    if (id) await loadExerciseProgress(id);
  } else if (t.dataset.act === "setday") {
    const day = parseInt(t.dataset.day);
    const value = t.value || null;
    await saveDayWorkout(day, value);
  }
});

// ===========================================
// INIT
// ===========================================

sb.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN" && session) {
    APP.user = session.user;
  } else if (event === "SIGNED_OUT") {
    APP.user = null;
    APP.view = "auth";
    render();
  }
});

(async function init() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  await checkSession();
})();
