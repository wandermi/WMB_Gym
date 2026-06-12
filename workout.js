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
  summary: null          // dados para o ecrã de resumo pós-treino
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
  playBeep(800, 200);
  setTimeout(() => playBeep(800, 200), 250);
  setTimeout(() => playBeep(1000, 400), 500);
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
  WO.summary = null;
  
  if (navigator.onLine) await loadPreviousLogs();
  
  const sessionPayload = {
    id: crypto.randomUUID(),
    user_id: APP.user.id,
    workout_id: wo.id,
    workout_name: wo.name,
    workout_sub: wo.sub,
    started_at: new Date().toISOString(),
    total_sets: wo.exercises.filter(e => !e.is_warmup && !e.is_mobility).reduce((a,e) => a + (e.sets || 0), 0)
  };
  
  if (navigator.onLine) {
    const { data: session, error } = await sb.from("workout_sessions").insert(sessionPayload).select().single();
    if (error) { console.error(error); showToast("Erro ao iniciar sessão", "error"); return; }
    WO.session = session;
  } else {
    // Offline: ID gerado no cliente, criação enfileirada para sincronizar depois
    queueOffline({ table: "workout_sessions", op: "insert", payload: sessionPayload });
    WO.session = sessionPayload;
    showToast("Sem internet — treino será sincronizado depois", "warn");
  }
  
  wo.exercises.forEach(ex => {
    if (!ex.is_warmup && !ex.is_mobility) {
      const logs = Array.from({length: ex.sets || 0}, (_, i) => ({
        set_number: i + 1,
        weight: WO.previousLogs[ex.id]?.weight || "",
        reps: WO.previousLogs[ex.id]?.reps || ex.reps || "",
        completed: false,
        is_drop: false
      }));
      // Drop Set / Backoff: linha extra com carga reduzida sugerida
      if (ex.method === "drop_set" || ex.method === "backoff") {
        const lastW = parseFloat(WO.previousLogs[ex.id]?.weight) || 0;
        const reduction = ex.method === "drop_set" ? 0.7 : 0.75; // -30% / -25%
        logs.push({
          set_number: logs.length + 1,
          weight: lastW > 0 ? String(Math.round(lastW * reduction * 2) / 2) : "",
          reps: "falha",
          completed: false,
          is_drop: true
        });
      }
      WO.setLogs[ex.id] = logs;
    }
  });
  
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
  
  const { data, error } = await sb.from("set_logs")
    .select("exercise_id, session_id, weight_kg, reps_done, set_number, completed_at, is_drop")
    .eq("user_id", APP.user.id)
    .eq("completed", true)
    .in("exercise_id", exerciseIds)
    .order("completed_at", { ascending: false });
  
  if (error || !data) return;
  
  // Para cada exercício: último set (compat), todos os sets da última sessão e máximo histórico
  data.forEach(log => {
    if (!WO.previousLogs[log.exercise_id]) {
      WO.previousLogs[log.exercise_id] = {
        weight: log.weight_kg,
        reps: log.reps_done,
        set_number: log.set_number,
        lastSessionId: log.session_id,
        lastSessionSets: [],
        maxWeight: 0
      };
    }
    const prev = WO.previousLogs[log.exercise_id];
    if (log.session_id === prev.lastSessionId && !log.is_drop) {
      prev.lastSessionSets.push({ weight: parseFloat(log.weight_kg) || 0, reps: parseInt(log.reps_done) || 0 });
    }
    const w = parseFloat(log.weight_kg) || 0;
    if (w > prev.maxWeight) prev.maxWeight = w;
  });
}

// ===========================================
// DUPLA PROGRESSÃO - Sugestão de carga
// ===========================================
// Se na última sessão TODAS as séries atingiram o topo da faixa de reps,
// sugere aumentar a carga (+2,5kg superior / +5kg inferior)

const LOWER_BODY_MUSCLES = ["Quadríceps", "Isquiotibiais", "Glúteos", "Panturrilha"];

function parseRepRange(repsStr) {
  if (!repsStr) return null;
  const m = String(repsStr).match(/(\d+)\s*(?:a|–|-|à)\s*(\d+)/i);
  if (!m) return null;
  return { min: parseInt(m[1]), max: parseInt(m[2]) };
}

function progressionHint(ex, prev) {
  if (!prev || !prev.lastSessionSets || prev.lastSessionSets.length === 0) return null;
  const range = parseRepRange(ex.reps) || parseRepRange(ex.instructions);
  if (!range) return null;
  
  const sets = prev.lastSessionSets;
  // Todas as séries da última sessão bateram o topo da faixa?
  const allAtTop = sets.length >= (ex.sets || 1) - 1 && sets.every(s => s.reps >= range.max && s.weight > 0);
  if (!allAtTop) return null;
  
  const isLower = (ex.muscles_primary || []).some(m => LOWER_BODY_MUSCLES.includes(m));
  const inc = isLower ? 5 : 2.5;
  const lastWeight = Math.max(...sets.map(s => s.weight));
  return { newWeight: lastWeight + inc, inc };
}

async function finishWorkout() {
  if (!WO.session) return;
  
  const completedSets = Object.values(WO.setLogs).flat().filter(s => s.completed).length;
  const totalSets = Object.values(WO.setLogs).flat().length;
  const durationMs = Date.now() - WO.startedAt;
  const durationMin = Math.max(1, Math.round(durationMs / 60000));
  
  const updatePayload = {
    finished_at: new Date().toISOString(),
    duration_min: durationMin,
    completed_sets: completedSets,
    total_sets: totalSets  // recalculado: linhas de drop entram na conta
  };
  
  if (navigator.onLine) {
    await sb.from("workout_sessions").update(updatePayload).eq("id", WO.session.id);
  } else {
    queueOffline({ table: "workout_sessions", op: "update", payload: updatePayload, match: { id: WO.session.id } });
  }
  
  // Detectar PRs: maior carga da sessão vs máximo histórico
  const prs = [];
  WO.workout.exercises.forEach(ex => {
    const sets = WO.setLogs[ex.id];
    if (!sets) return;
    const sessionMax = Math.max(0, ...sets.filter(s => s.completed && !s.is_drop).map(s => parseFloat(String(s.weight).replace(",", ".")) || 0));
    const histMax = WO.previousLogs[ex.id]?.maxWeight || 0;
    if (sessionMax > 0 && histMax > 0 && sessionMax > histMax) {
      prs.push({ name: ex.name, weight: sessionMax, prev: histMax });
    }
  });
  
  WO.summary = {
    duration: durationMin,
    completedSets,
    totalSets,
    name: WO.workout.name,
    sessionId: WO.session.id,
    prs,
    cardioSaved: false
  };
  
  if (WO.sessionTimerId) clearInterval(WO.sessionTimerId);
  if (WO.restTimer?.intervalId) clearInterval(WO.restTimer.intervalId);
  localStorage.removeItem("wmb_rest_timer");
  
  WO.workout = null;
  WO.session = null;
  WO.setLogs = {};
  WO.restTimer = null;
  APP.view = "summary";
  render();
}

async function cancelWorkout() {
  if (!confirm("Cancelar treino? Os dados desta sessão serão perdidos.")) return;
  
  if (WO.session) {
    if (navigator.onLine) {
      await sb.from("workout_sessions").delete().eq("id", WO.session.id);
    }
    // Remove da fila offline tudo relacionado a esta sessão (sets e a própria criação)
    removeFromOfflineQueue(item =>
      (item.payload?.session_id === WO.session.id) ||
      (item.table === "workout_sessions" && item.payload?.id === WO.session.id) ||
      (item.match?.id === WO.session.id)
    );
  }
  localStorage.removeItem("wmb_rest_timer");
  
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
  
  syncSetInputs(exerciseId);
  
  set.completed = !wasCompleted;
  set.completed_at = set.completed ? new Date().toISOString() : null;
  
  const exercise = WO.workout.exercises.find(e => e.id === exerciseId);
  
  if (set.completed) {
    const logData = {
      id: crypto.randomUUID(),
      session_id: WO.session.id,
      user_id: APP.user.id,
      exercise_id: exerciseId,
      exercise_name: exercise.name,
      set_number: set.set_number,
      weight_kg: set.weight ? parseFloat(set.weight.toString().replace(',', '.')) : null,
      reps_done: set.reps || null,
      is_drop: set.is_drop || false,
      completed: true,
      completed_at: set.completed_at
    };
    set.log_id = logData.id;

    if (!navigator.onLine) {
      queueOffline({ table: "set_logs", op: "insert", payload: logData });
      showToast("Salvo offline. Irá sincronizar quando houver internet.", "warn");
    } else {
      const { error } = await sb.from("set_logs").insert(logData);
      if (error) {
        console.error("Erro a guardar set:", error);
        queueOffline({ table: "set_logs", op: "insert", payload: logData }); // fallback: tenta depois
      }
    }
    startRestTimer(exercise.rest || 60, exerciseId);
  } else {
    if (set.log_id) {
      if (navigator.onLine) {
        await sb.from("set_logs").delete().eq("id", set.log_id);
      }
      // Se estava na fila offline, basta remover de lá
      removeFromOfflineQueue(item => item.payload?.id === set.log_id);
      delete set.log_id;
    }
  }
  
  // Exercício completo? Auto-colapsa e expande o próximo (render completo: teclado já não importa)
  const allDone = sets.every(s => s.completed);
  if (set.completed && allDone) {
    WO.expanded.delete(exerciseId);
    const mainExs = WO.workout.exercises.filter(e => !e.is_warmup && !e.is_mobility);
    const next = mainExs.find(e => {
      const l = WO.setLogs[e.id];
      return l && !l.every(s => s.completed);
    });
    if (next) WO.expanded.add(next.id);
    render();
    // Scroll suave até o próximo exercício
    if (next) setTimeout(() => {
      document.getElementById(`exc-${next.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return;
  }
  
  // Caso normal: atualização cirúrgica do DOM — preserva foco e teclado aberto
  updateAfterSetToggle(exerciseId, setIndex);
}

// ===========================================
// RENDER PARCIAL - atualiza só o que mudou
// ===========================================

function updateAfterSetToggle(exerciseId, setIndex) {
  const sets = WO.setLogs[exerciseId];
  const set = sets[setIndex];
  
  // 1. Linha do set: classes, inputs disabled, botão ✓
  const row = document.querySelector(`[data-act="toggleset"][data-eid="${exerciseId}"][data-idx="${setIndex}"]`)?.closest(".set-row");
  if (row) {
    row.classList.toggle("set-done", set.completed);
    row.querySelectorAll(".set-input").forEach(inp => inp.disabled = set.completed);
    const btn = row.querySelector(".set-check");
    if (btn) { btn.classList.toggle("checked", set.completed); btn.textContent = set.completed ? "✓" : ""; }
  }
  
  // 2. Anel de progresso do exercício
  const card = document.getElementById(`exc-${exerciseId}`);
  if (card) {
    const doneCount = sets.filter(s => s.completed).length;
    const totalCount = sets.length;
    const allDone = doneCount === totalCount && totalCount > 0;
    card.classList.toggle("ex-done", allDone);
    const txt = card.querySelector(".ex-progress-text");
    if (txt) txt.textContent = `${doneCount}/${totalCount}`;
    const ring = card.querySelectorAll(".ex-progress-circle circle")[1];
    if (ring) {
      const circ = 2 * Math.PI * 15;
      ring.setAttribute("stroke-dashoffset", circ * (1 - doneCount / Math.max(1, totalCount)));
      ring.setAttribute("stroke", allDone ? "#00FF00" : WO.workout.color);
    }
  }
  
  // 3. Stats do header + barra de progresso + botão finalizar
  updateWorkoutHeaderStats();
}

function updateWorkoutHeaderStats() {
  const all = Object.values(WO.setLogs).flat();
  const done = all.filter(s => s.completed).length;
  const total = all.length;
  const pct = total > 0 ? (done / total) * 100 : 0;
  
  const statValues = document.querySelectorAll(".workout-stats .ws-value");
  if (statValues[1]) statValues[1].textContent = `${done}/${total}`;
  if (statValues[2]) statValues[2].textContent = `${Math.round(pct)}%`;
  
  const fill = document.querySelector(".wpb-fill");
  if (fill) fill.style.width = `${pct}%`;
  
  const finBtn = document.querySelector(".finish-btn");
  if (finBtn) {
    const ready = done === total && total > 0;
    finBtn.classList.toggle("ready", ready);
    finBtn.textContent = ready ? "🏆 FINALIZAR TREINO" : `Finalizar (${done}/${total})`;
  }
}

function syncSetInputs(exerciseId) {
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
  if (WO.restTimer?.intervalId) clearInterval(WO.restTimer.intervalId);
  
  const endTime = Date.now() + (seconds * 1000);
  localStorage.setItem("wmb_rest_timer", JSON.stringify({ endTime, totalSeconds: seconds, exerciseId }));
  
  WO.restTimer = { secondsLeft: seconds, totalSeconds: seconds, exerciseId, intervalId: null };
  runRestTimerTick(endTime);
}

function runRestTimerTick(endTime) {
  WO.restTimer.intervalId = setInterval(() => {
    const now = Date.now();
    WO.restTimer.secondsLeft = Math.ceil((endTime - now) / 1000);
    
    if (WO.restTimer.secondsLeft <= 0) {
      clearInterval(WO.restTimer.intervalId);
      localStorage.removeItem("wmb_rest_timer");
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
  localStorage.removeItem("wmb_rest_timer");
  WO.restTimer = null;
  updateRestTimerUI();
}

function addRestTime(seconds) {
  if (!WO.restTimer) return;
  WO.restTimer.secondsLeft += seconds;
  WO.restTimer.totalSeconds += seconds;
  
  const saved = localStorage.getItem("wmb_rest_timer");
  if (saved) {
    const data = JSON.parse(saved);
    data.endTime += (seconds * 1000);
    data.totalSeconds += seconds;
    localStorage.setItem("wmb_rest_timer", JSON.stringify(data));
  }
  
  updateRestTimerUI();
}

function restoreRestTimer() {
  const saved = localStorage.getItem("wmb_rest_timer");
  if (saved) {
    const data = JSON.parse(saved);
    const left = Math.ceil((data.endTime - Date.now()) / 1000);
    if (left > 0) {
      WO.restTimer = { secondsLeft: left, totalSeconds: data.totalSeconds, exerciseId: data.exerciseId, intervalId: null };
      runRestTimerTick(data.endTime);
    } else {
      localStorage.removeItem("wmb_rest_timer");
    }
  }
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

function vSummary() {
  if (!WO.summary) return "";
  const s = WO.summary;
  
  const prsHtml = s.prs && s.prs.length > 0 ? `
    <div class="pr-block">
      <div class="pr-title">🏆 NOVOS RECORDES PESSOAIS</div>
      ${s.prs.map(pr => `
        <div class="pr-row">
          <div class="pr-name">${escapeHTML(pr.name)}</div>
          <div class="pr-weight">${pr.weight}kg <span class="pr-prev">(antes: ${pr.prev}kg)</span></div>
        </div>
      `).join("")}
    </div>
  ` : "";
  
  const cardioHtml = s.cardioSaved ? `
    <div class="cardio-saved">✓ Cardio registrado: ${s.cardioMin}min de ${escapeHTML(s.cardioType || "")}</div>
  ` : `
    <div class="cardio-block">
      <div class="cardio-title">🏃 FEZ O CARDIO? (20–40min)</div>
      <div class="cardio-form">
        <input id="cardio-min" class="form-input" type="number" inputmode="numeric" placeholder="min" style="width:80px;text-align:center">
        <select id="cardio-type" class="form-input" style="flex:1">
          <option value="Esteira inclinada">Esteira inclinada</option>
          <option value="Bike">Bike</option>
          <option value="Escada">Escada</option>
          <option value="Outro">Outro</option>
        </select>
        <button class="cardio-save-btn" data-act="savecardio">✓</button>
      </div>
    </div>
  `;
  
  return `
    <div class="workout-screen summary-screen">
      <h1 class="summary-emoji">🎉</h1>
      <h2 class="wh-name summary-title">Treino Concluído!</h2>
      <p class="summary-sub">Bom trabalho no ${escapeHTML(s.name)}.</p>
      
      <div class="hist-stats summary-stats">
        <div class="hs-card">
          <div class="hs-value">${s.duration}</div>
          <div class="hs-label">MINUTOS</div>
        </div>
        <div class="hs-card">
          <div class="hs-value">${s.completedSets}/${s.totalSets}</div>
          <div class="hs-label">SÉRIES</div>
        </div>
      </div>
      
      ${prsHtml}
      ${cardioHtml}
      
      <button class="finish-btn ready" data-act="gohome" style="margin-top:20px">Voltar ao Início</button>
    </div>
  `;
}

async function saveCardio() {
  if (!WO.summary) return;
  const min = parseInt(document.getElementById("cardio-min")?.value);
  const type = document.getElementById("cardio-type")?.value || null;
  if (!min || min <= 0) { showToast("Informe os minutos de cardio", "warn"); return; }
  
  const payload = { cardio_min: min, cardio_type: type };
  if (navigator.onLine) {
    const { error } = await sb.from("workout_sessions").update(payload).eq("id", WO.summary.sessionId);
    if (error) { console.error(error); showToast("Erro ao salvar cardio", "error"); return; }
  } else {
    queueOffline({ table: "workout_sessions", op: "update", payload, match: { id: WO.summary.sessionId } });
  }
  
  WO.summary.cardioSaved = true;
  WO.summary.cardioMin = min;
  WO.summary.cardioType = type;
  showToast("Cardio registrado! 🏃", "success");
  render();
}

function vWorkoutExecution() {
  if (!WO.workout) return "";
  
  const allEx = WO.workout.exercises;
  const warmupExs = allEx.filter(e => e.is_warmup || e.is_mobility);
  const mainExs = allEx.filter(e => !e.is_warmup && !e.is_mobility);
  
  const completedSets = Object.values(WO.setLogs).flat().filter(s => s.completed).length;
  const totalSets = Object.values(WO.setLogs).flat().length;
  const progressPct = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  
  const wo = WO.workout;
  
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
  
  const exerciseCards = mainExs.map((ex, idx) => {
    const isExpanded = WO.expanded.has(ex.id);
    const sets = WO.setLogs[ex.id] || [];
    const doneCount = sets.filter(s => s.completed).length;
    const totalCount = sets.length;
    const exPct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
    const allDone = doneCount === totalCount && totalCount > 0;
    
    const prev = WO.previousLogs[ex.id];
    const hint = progressionHint(ex, prev);
    
    // GIF: prioriza gif_url do banco; fallback pro padrão por nome
    const gifUrl = ex.gif_url || `https://ebqmtvjieyvceckcegju.supabase.co/storage/v1/object/public/gifs/${encodeURIComponent(ex.name)}.gif`;
    
    let setsTableHtml = "";
    if (isExpanded) {
      const rows = sets.map((set, i) => `
        <div class="set-row ${set.completed ? "set-done" : ""} ${set.is_drop ? "set-drop" : ""}">
          <div class="set-num">${set.is_drop ? "D" : set.set_number}</div>
          <div class="set-prev">${set.is_drop ? "−30%" : (prev ? `${prev.weight}kg × ${prev.reps || "-"}` : "—")}</div>
          <input class="set-input" type="number" inputmode="decimal" placeholder="kg" value="${set.weight || ""}" data-w="${ex.id}-${i}" ${set.completed ? "disabled" : ""}>
          <input class="set-input" type="text" inputmode="numeric" placeholder="${set.is_drop ? "falha" : "reps"}" value="${set.reps || ""}" data-r="${ex.id}-${i}" ${set.completed ? "disabled" : ""}>
          <button class="set-check ${set.completed ? "checked" : ""}" data-act="toggleset" data-eid="${ex.id}" data-idx="${i}">${set.completed ? "✓" : ""}</button>
        </div>
      `).join("");
      
      setsTableHtml = `
        <div class="ex-body">
          <button class="video-btn-ex" data-act="openvideo" data-id="${ex.id}">
            🎥 Ver demonstração em vídeo
          </button>
          
          <div style="text-align: center; margin-bottom: 14px;">
            <img src="${gifUrl}" alt="${escapeHTML(ex.name)}" style="width: 100%; max-width: 300px; border-radius: 12px; object-fit: contain; background: var(--bg);" onerror="this.style.display='none'">
          </div>

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
          ${hint ? `<div class="progression-hint">📈 Você fechou todas as séries no topo da faixa. <strong>Suba para ${hint.newWeight}kg</strong> (+${hint.inc}kg)</div>` : ""}
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
      <div class="ex-card ${allDone ? "ex-done" : ""}" id="exc-${ex.id}" style="--ex-color:${wo.color}">
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
  const names = { drop_set: "DROP SET", rest_pause: "REST PAUSE", cluster_set: "CLUSTER SET", backoff: "BACKOFF", biset: "BISET", three_seven: "3/7" };
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
  const customUrl = ex.video_url || null;
  const searchQuery = encodeURIComponent(`${ex.name} como fazer correto musculação`);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
  
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
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return ""; // URL não reconhecida como YouTube: não embeda (evita injeção via src)
}