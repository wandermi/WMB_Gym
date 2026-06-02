// ===========================================
// WORKOUT EXECUTION - Tela de execução do treino
// ===========================================

const WO = {
  workout: null,         // workout atual sendo executado
  session: null,         // workout_session ativa
  setLogs: {},           // { exerciseId: [ {set_number, weight, reps, completed} ] }
  previousLogs: {},      // { exerciseId: { weight, reps, set_number } }
  expanded: new Set(),   // exercise IDs expandidos
  warmupExpanded: false, // seção de aquecimento expandida?
  warmupSkipped: false,  // pulou aquecimento?
  restTimer: null,       // { secondsLeft, totalSeconds, exerciseId, intervalId }
  startedAt: null,       // Date.now() do início
  sessionTimerId: null,  // setInterval pra atualizar header
};

// Audio context para beeps (criado on-demand pra evitar bloqueio)
let audioCtx = null;
function playBeep(frequency = 800, duration = 200, volume = 0.3) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = frequency;
    osc.type = "sine";
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration/1000);
    osc.start();
    osc.stop(audioCtx.currentTime + duration/1000);
  } catch(e) { console.warn("Audio failed:", e); }
}

function playRestEndSound() {
  // 3 beeps em sequência
  playBeep(800, 200);
  setTimeout(() => playBeep(800, 200), 250);
  setTimeout(() => playBeep(1000, 400), 500);
  // Vibração
  if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
}

function fmtTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.abs(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function fmtDuration(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  return `${m}:${String(s).padStart(2,"0")}`;
}

// ===========================================
// SESSION MANAGEMENT
// ===========================================

async function startWorkout(workoutId) {
  const wo = APP.workouts.find(w => w.id === workoutId);
  if (!wo) { showToast("Treino não encontrado", "error"); return; }
  
  WO.workout = wo;
  WO.expanded = new Set();
  WO.warmupExpanded = false;
  WO.warmupSkipped = false;
  WO.setLogs = {};
  WO.previousLogs = {};
  WO.startedAt = Date.now();
  
  // Carregar logs anteriores de cada exercício
  await loadPreviousLogs();
  
  // Criar workout_session no banco
  const { data: session, error } = await sb.from("workout_sessions").insert({
    user_id: APP.user.id,
    workout_id: wo.id,
    workout_name: wo.name,
    workout_sub: wo.sub,
    started_at: new Date().toISOString(),
    total_sets: wo.exercises.filter(e => !e.is_warmup && !e.is_mobility).reduce((a,e) => a + (e.sets || 0), 0)
  }).select().single();
  
  if (error) { console.error(error); showToast("Erro ao iniciar sessão", "error"); return; }
  WO.session = session;
  
  // Inicializar setLogs vazios pra cada exercício principal
  wo.exercises.forEach(ex => {
    if (!ex.is_warmup && !ex.is_mobility) {
      WO.setLogs[ex.id] = Array.from({length: ex.sets || 0}, (_, i) => ({
        set_number: i + 1,
        weight: WO.previousLogs[ex.id]?.weight || "",
        reps: "",
        completed: false
      }));
    }
  });
  
  // Iniciar timer da sessão
  WO.sessionTimerId = setInterval(() => {
    if (APP.view === "workout") updateSessionTimer();
  }, 1000);
  
  APP.view = "workout";
  render();
}

async function loadPreviousLogs() {
  if (!WO.workout) return;
  const exerciseIds = WO.workout.exercises.filter(e => !e.is_warmup && !e.is_mobility).map(e => e.id);
  if (exerciseIds.length === 0) return;
  
  // Pega os últimos set_logs completados de cada exercício
  const { data, error } = await sb.from("set_logs")
    .select("exercise_id, weight_kg, reps_done, set_number, completed_at")
    .eq("user_id", APP.user.id)
    .eq("completed", true)
    .in("exercise_id", exerciseIds)
    .order("completed_at", { ascending: false });
  
  if (error || !data) return;
  
  // Pegar o último log de cada exercise_id (primeiro que aparecer)
  data.forEach(log => {
    if (!WO.previousLogs[log.exercise_id]) {
      WO.previousLogs[log.exercise_id] = {
        weight: log.weight_kg,
        reps: log.reps_done,
        set_number: log.set_number
      };
    }
  });
}

async function finishWorkout() {
  if (!WO.session) return;
  
  const completedSets = Object.values(WO.setLogs).flat().filter(s => s.completed).length;
  const totalSets = Object.values(WO.setLogs).flat().length;
  const durationMs = Date.now() - WO.startedAt;
  const durationMin = Math.max(1, Math.round(durationMs / 60000));
  
  // Atualizar workout_session
  await sb.from("workout_sessions").update({
    finished_at: new Date().toISOString(),
    duration_min: durationMin,
    completed_sets: completedSets
  }).eq("id", WO.session.id);
  
  // Limpar timers
  if (WO.sessionTimerId) clearInterval(WO.sessionTimerId);
  if (WO.restTimer?.intervalId) clearInterval(WO.restTimer.intervalId);
  
  showToast(`Treino concluído! ${completedSets}/${totalSets} séries em ${durationMin}min`, "success");
  
  // Voltar pra home
  WO.workout = null;
  WO.session = null;
  WO.setLogs = {};
  WO.restTimer = null;
  APP.view = "home";
  render();
}

async function cancelWorkout() {
  if (!confirm("Cancelar treino? Os dados desta sessão serão perdidos.")) return;
  
  // Apagar a session
  if (WO.session) {
    await sb.from("workout_sessions").delete().eq("id", WO.session.id);
  }
  
  if (WO.sessionTimerId) clearInterval(WO.sessionTimerId);
  if (WO.restTimer?.intervalId) clearInterval(WO.restTimer.intervalId);
  
  WO.workout = null;
  WO.session = null;
  WO.setLogs = {};
  WO.restTimer = null;
  APP.view = "home";
  render();
}

// ===========================================
// SET LOG MANAGEMENT
// ===========================================

async function toggleSetCompleted(exerciseId, setIndex) {
  const sets = WO.setLogs[exerciseId];
  if (!sets || !sets[setIndex]) return;
  
  const set = sets[setIndex];
  const wasCompleted = set.completed;
  
  // Sincronizar inputs visíveis primeiro
  syncSetInputs(exerciseId);
  
  set.completed = !wasCompleted;
  set.completed_at = set.completed ? new Date().toISOString() : null;
  
  // Salvar no banco
  const exercise = WO.workout.exercises.find(e => e.id === exerciseId);
  
  if (set.completed) {
    // Inserir set_log
    const { data, error } = await sb.from("set_logs").insert({
      session_id: WO.session.id,
      user_id: APP.user.id,
      exercise_id: exerciseId,
      exercise_name: exercise.name,
      set_number: set.set_number,
      weight_kg: set.weight ? parseFloat(set.weight) : null,
      reps_done: set.reps || null,
      completed: true,
      completed_at: set.completed_at
    }).select().single();
    
    if (data) set.log_id = data.id;
    if (error) console.error("Erro salvando set:", error);
    
    // Iniciar timer de descanso
    startRestTimer(exercise.rest || 60, exerciseId);
  } else {
    // Remover set_log
    if (set.log_id) {
      await sb.from("set_logs").delete().eq("id", set.log_id);
      delete set.log_id;
    }
  }
  
  render();
}

function syncSetInputs(exerciseId) {
  // Pegar valores dos inputs visíveis e sincronizar com state
  const sets = WO.setLogs[exerciseId];
  if (!sets) return;
  
  sets.forEach((set, i) => {
    const wInput = document.querySelector(`[data-w="${exerciseId}-${i}"]`);
    const rInput = document.querySelector(`[data-r="${exerciseId}-${i}"]`);
    if (wInput) set.weight = wInput.value;
    if (rInput) set.reps = rInput.value;
  });
}

// ===========================================
// REST TIMER
// ===========================================

function startRestTimer(seconds, exerciseId) {
  // Cancela timer anterior se houver
  if (WO.restTimer?.intervalId) clearInterval(WO.restTimer.intervalId);
  
  WO.restTimer = {
    secondsLeft: seconds,
    totalSeconds: seconds,
    exerciseId,
    intervalId: null
  };
  
  WO.restTimer.intervalId = setInterval(() => {
    WO.restTimer.secondsLeft--;
    if (WO.restTimer.secondsLeft <= 0) {
      clearInterval(WO.restTimer.intervalId);
      playRestEndSound();
      WO.restTimer = null;
      updateRestTimerUI();
      return;
    }
    updateRestTimerUI();
  }, 1000);
  
  updateRestTimerUI();
}

function skipRestTimer() {
  if (WO.restTimer?.intervalId) clearInterval(WO.restTimer.intervalId);
  WO.restTimer = null;
  updateRestTimerUI();
}

function addRestTime(seconds) {
  if (!WO.restTimer) return;
  WO.restTimer.secondsLeft += seconds;
  WO.restTimer.totalSeconds += seconds;
  updateRestTimerUI();
}

function updateRestTimerUI() {
  const overlay = document.getElementById("rest-overlay");
  if (!WO.restTimer) {
    if (overlay) overlay.remove();
    return;
  }
  const pct = (WO.restTimer.secondsLeft / WO.restTimer.totalSeconds) * 100;
  const html = `
    <div class="rest-timer-content">
      <div class="rt-info">
        <div class="rt-label">Descansando</div>
        <div class="rt-time">${fmtTime(WO.restTimer.secondsLeft)}</div>
      </div>
      <div class="rt-actions">
        <button class="rt-btn" data-act="addrest" data-sec="-15">−15s</button>
        <button class="rt-btn" data-act="addrest" data-sec="15">+15s</button>
        <button class="rt-btn rt-skip" data-act="skiprest">Pular</button>
      </div>
    </div>
    <div class="rt-progress"><div class="rt-progress-bar" style="width:${pct}%"></div></div>
  `;
  if (overlay) {
    overlay.innerHTML = html;
  } else {
    const newOverlay = document.createElement("div");
    newOverlay.id = "rest-overlay";
    newOverlay.className = "rest-overlay";
    newOverlay.innerHTML = html;
    document.body.appendChild(newOverlay);
  }
}

function updateSessionTimer() {
  const el = document.getElementById("session-timer");
  if (!el || !WO.startedAt) return;
  el.textContent = fmtDuration(Date.now() - WO.startedAt);
}

// ===========================================
// VIEW
// ===========================================

function vWorkoutExecution() {
  if (!WO.workout) return "";
  
  const allEx = WO.workout.exercises;
  const warmupExs = allEx.filter(e => e.is_warmup || e.is_mobility);
  const mainExs = allEx.filter(e => !e.is_warmup && !e.is_mobility);
  
  const completedSets = Object.values(WO.setLogs).flat().filter(s => s.completed).length;
  const totalSets = Object.values(WO.setLogs).flat().length;
  const progressPct = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  
  const wo = WO.workout;
  
  // Warmup section
  let warmupHtml = "";
  if (warmupExs.length > 0 && !WO.warmupSkipped) {
    const warmupItems = WO.warmupExpanded ? warmupExs.map(ex => `
      <div class="warmup-item">
        <div class="wi-icon">${ex.is_mobility ? "🧘" : "🔥"}</div>
        <div class="wi-info">
          <div class="wi-name">${escapeHTML(ex.name)}</div>
          <div class="wi-meta">${ex.sets || 1} × ${escapeHTML(ex.reps || "")}</div>
        </div>
      </div>
    `).join("") : "";
    
    warmupHtml = `
      <div class="warmup-section">
        <div class="warmup-header" data-act="togglewarmup">
          <div class="wh-icon">🔥</div>
          <div class="wh-info">
            <div class="wh-title">Aquecimento e Mobilidade</div>
            <div class="wh-meta">${warmupExs.length} ${warmupExs.length === 1 ? "exercício" : "exercícios"} • opcional</div>
          </div>
          <div class="wh-chevron">${WO.warmupExpanded ? "▴" : "▾"}</div>
        </div>
        ${WO.warmupExpanded ? `
          <div class="warmup-body">
            ${warmupItems}
            <button class="warmup-skip-btn" data-act="skipwarmup">Pular aquecimento ⏭</button>
          </div>
        ` : ""}
      </div>
    `;
  }
  
  // Main exercises
  const exerciseCards = mainExs.map((ex, idx) => {
    const isExpanded = WO.expanded.has(ex.id);
    const sets = WO.setLogs[ex.id] || [];
    const doneCount = sets.filter(s => s.completed).length;
    const totalCount = sets.length;
    const exPct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
    const allDone = doneCount === totalCount && totalCount > 0;
    
    const prev = WO.previousLogs[ex.id];
    
    let setsTableHtml = "";
    if (isExpanded) {
      const rows = sets.map((set, i) => `
        <div class="set-row ${set.completed ? "set-done" : ""}">
          <div class="set-num">${set.set_number}</div>
          <div class="set-prev">${prev ? `${prev.weight}kg × ${prev.reps || "-"}` : "—"}</div>
          <input class="set-input" type="number" inputmode="decimal" placeholder="kg" value="${set.weight || ""}" data-w="${ex.id}-${i}" ${set.completed ? "disabled" : ""}>
          <input class="set-input" type="number" inputmode="numeric" placeholder="reps" value="${set.reps || ""}" data-r="${ex.id}-${i}" ${set.completed ? "disabled" : ""}>
          <button class="set-check ${set.completed ? "checked" : ""}" data-act="toggleset" data-eid="${ex.id}" data-idx="${i}">${set.completed ? "✓" : ""}</button>
        </div>
      `).join("");
      
      setsTableHtml = `
        <div class="ex-body">
          <button class="video-btn-ex" data-act="openvideo" data-id="${ex.id}">
            🎥 Ver demonstração
          </button>
          ${ex.steps && ex.steps.length > 0 ? `
            <div class="how-to-compact">
              <div class="ex-inst-label">🎯 Como fazer</div>
              <div class="how-to-list">
                ${ex.steps.map((step, i) => `<div class="hts-compact">${i + 1}. ${escapeHTML(step)}</div>`).join("")}
              </div>
            </div>
          ` : ""}
          ${ex.instructions ? `<div class="ex-instructions"><div class="ex-inst-label">📋 Séries e métodos</div><div class="ex-inst-text">${escapeHTML(ex.instructions).replace(/\n/g, "<br>")}</div></div>` : ""}
          ${ex.method ? `<div class="ex-method">${methodBadge(ex.method)}</div>` : ""}
          ${prev ? `<div class="ex-previous">Última vez: <strong>${prev.weight}kg × ${prev.reps || "-"} reps</strong></div>` : ""}
          <div class="sets-table">
            <div class="set-row set-header">
              <div class="set-num">Set</div>
              <div class="set-prev">Anterior</div>
              <div class="set-col">kg</div>
              <div class="set-col">Reps</div>
              <div class="set-col">✓</div>
            </div>
            ${rows}
          </div>
        </div>
      `;
    }
    
    return `
      <div class="ex-card ${allDone ? "ex-done" : ""}" style="--ex-color:${wo.color}">
        <div class="ex-header" data-act="toggleex" data-id="${ex.id}">
          <div class="ex-progress-circle">
            <svg viewBox="0 0 36 36" width="36" height="36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#252525" stroke-width="3"/>
              <circle cx="18" cy="18" r="15" fill="none" stroke="${allDone ? "#00FF00" : wo.color}" stroke-width="3" stroke-dasharray="${2*Math.PI*15}" stroke-dashoffset="${2*Math.PI*15*(1-exPct/100)}" stroke-linecap="round" transform="rotate(-90 18 18)"/>
            </svg>
            <div class="ex-progress-text">${doneCount}/${totalCount}</div>
          </div>
          <div class="ex-info">
            <div class="ex-name">${escapeHTML(ex.name)}</div>
            <div class="ex-meta">
              <span>${ex.sets || 0} séries</span>
              <span>•</span>
              <span>descanso ${ex.rest}s</span>
              ${ex.method ? `<span>•</span><span class="ex-method-tag">${methodName(ex.method)}</span>` : ""}
            </div>
          </div>
          <div class="ex-chevron">${isExpanded ? "▴" : "▾"}</div>
        </div>
        ${setsTableHtml}
      </div>
    `;
  }).join("");
  
  return `
    <div class="workout-screen">
      <header class="workout-header">
        <button class="wh-back" data-act="cancelworkout">←</button>
        <div class="wh-title-block">
          <div class="wh-name">${escapeHTML(wo.name)}</div>
          <div class="wh-sub">${escapeHTML(wo.sub || "")}</div>
        </div>
      </header>
      
      <div class="workout-stats">
        <div class="ws-item">
          <div class="ws-label">Tempo</div>
          <div class="ws-value" id="session-timer">0:00</div>
        </div>
        <div class="ws-item">
          <div class="ws-label">Progresso</div>
          <div class="ws-value">${completedSets}/${totalSets}</div>
        </div>
        <div class="ws-item">
          <div class="ws-label">%</div>
          <div class="ws-value">${Math.round(progressPct)}%</div>
        </div>
      </div>
      
      <div class="workout-progress-bar">
        <div class="wpb-fill" style="width:${progressPct}%;background:${wo.color}"></div>
      </div>
      
      <div class="workout-body">
        ${warmupHtml}
        <div class="main-section">
          <div class="section-label">EXERCÍCIOS PRINCIPAIS</div>
          ${exerciseCards || `<div class="empty-state">Nenhum exercício</div>`}
        </div>
      </div>
      
      <div class="workout-footer">
        <button class="finish-btn ${completedSets === totalSets && totalSets > 0 ? "ready" : ""}" data-act="finishworkout">
          ${completedSets === totalSets && totalSets > 0 ? "🏆 FINALIZAR TREINO" : `Finalizar (${completedSets}/${totalSets})`}
        </button>
      </div>
    </div>
  `;
}

function methodName(m) {
  const names = {
    drop_set: "DROP SET",
    rest_pause: "REST PAUSE",
    cluster_set: "CLUSTER SET",
    backoff: "BACKOFF",
    biset: "BISET",
    three_seven: "3/7"
  };
  return names[m] || m;
}

function methodBadge(m) {
  const descs = {
    drop_set: "🔻 Drop Set: ao falhar, reduza 20-30% da carga e continue até falha (sem descanso)",
    rest_pause: "⏸ Rest Pause: 20s de descanso entre mini-séries até bater o número total",
    cluster_set: "📦 Cluster Set: divide a série em mini-blocos com 15-20s de pausa",
    backoff: "⬇ Backoff: após série pesada, reduz 20-30% e faz até a falha",
    biset: "🔀 Biset: 2 exercícios em sequência sem descanso",
    three_seven: "🎯 3/7: 7→6→5→4→3 reps com 15s de pausa entre cada série"
  };
  return `<div class="method-info">${escapeHTML(descs[m] || m)}</div>`;
}

// ===========================================
// VIDEO MODAL - Demonstração do exercício
// ===========================================

function openVideoModal(exerciseId) {
  const ex = WO.workout?.exercises?.find(e => e.id === exerciseId);
  if (!ex) return;
  WO.videoModal = ex;
  render();
}

function closeVideoModal() {
  WO.videoModal = null;
  render();
}

function vVideoModal() {
  if (!WO.videoModal) return "";
  const ex = WO.videoModal;
  
  // Buscar URL customizada salva (se houver)
  const customUrl = ex.video_url || null;
  
  // Query para YouTube (em português + exercício)
  const searchQuery = encodeURIComponent(`${ex.name} como fazer correto musculação`);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
  const youtubeEmbedUrl = `https://www.youtube.com/embed?listType=search&list=${searchQuery}`;
  
  return `
    <div class="modal-overlay" data-act="closevideo">
      <div class="modal-sheet video-modal" onclick="event.stopPropagation()">
        <div class="modal-handle"></div>
        <div class="video-header">
          <div class="video-title">${escapeHTML(ex.name)}</div>
          <button class="header-btn" data-act="closevideo">✕</button>
        </div>
        
        ${customUrl ? `
          <div class="video-container">
            ${customUrl.includes("youtube.com") || customUrl.includes("youtu.be") ? `
              <iframe src="${getYouTubeEmbed(customUrl)}" frameborder="0" allowfullscreen></iframe>
            ` : `
              <img src="${customUrl}" alt="${escapeHTML(ex.name)}" class="video-image">
            `}
          </div>
        ` : `
          <div class="video-search-section">
            <div class="vs-icon">🎥</div>
            <div class="vs-title">Buscar Demonstração</div>
            <div class="vs-desc">Clique no botão para ver vídeos deste exercício no YouTube</div>
            <a href="${youtubeSearchUrl}" target="_blank" rel="noopener" class="auth-btn youtube-btn">
              ▶️ Abrir no YouTube
            </a>
          </div>
        `}
        
        ${ex.steps && ex.steps.length > 0 ? `
          <div class="how-to-section">
            <div class="ex-inst-label">🎯 Como executar</div>
            <div class="how-to-steps">
              ${ex.steps.map((step, i) => `
                <div class="how-to-step">
                  <div class="hts-num">${i + 1}</div>
                  <div class="hts-text">${escapeHTML(step)}</div>
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}
        
        ${ex.instructions ? `
          <div class="ex-instructions" style="margin-top:14px">
            <div class="ex-inst-label">📋 Séries e métodos</div>
            <div class="ex-inst-text">${escapeHTML(ex.instructions).replace(/\n/g, "<br>")}</div>
          </div>
        ` : ""}
        
        ${ex.muscles_primary && ex.muscles_primary.length > 0 ? `
          <div class="muscle-tags">
            <div class="ex-inst-label">💪 Músculos trabalhados</div>
            <div class="mt-list">
              ${ex.muscles_primary.map(m => `<span class="mt-primary">${escapeHTML(m)}</span>`).join("")}
              ${(ex.muscles_secondary || []).map(m => `<span class="mt-secondary">${escapeHTML(m)}</span>`).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    </div>
  `;
}

function getYouTubeEmbed(url) {
  // Extrai video ID de várias formas de URL do YouTube
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}
