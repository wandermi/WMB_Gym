// ===========================================
// SETTINGS - Configurações + Rotação Semanal
// ===========================================

const SETT = {
  schedule: {},  // { 0: workout_id, 1: null, ... }
  scheduleActivity: {},  // { 0: "workout" | "rest" | "caminhada" | "corrida" | "bike" | "crossfit", ... }
  loading: false,
};

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DAY_NAMES_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

async function loadSchedule() {
  const { data, error } = await sb.from("schedule")
    .select("*")
    .eq("user_id", APP.user.id);
  
  if (error) { console.error(error); return; }
  
  SETT.schedule = {};
  SETT.scheduleActivity = {};
  (data || []).forEach(s => {
    const activity = s.activity_type || (s.is_rest ? "rest" : "workout");
    SETT.schedule[s.day_of_week] = s.workout_id || null;
    SETT.scheduleActivity[s.day_of_week] = activity;
  });
}

async function saveDayWorkout(day, value) {
  let workoutId = null, activityType = null, isRest = false;
  
  if (value === "" || value === null) {
    await sb.from("schedule").delete().eq("user_id", APP.user.id).eq("day_of_week", day);
    delete SETT.schedule[day];
    delete SETT.scheduleActivity[day];
    render();
    return;
  } else if (value === "rest") {
    isRest = true;
    activityType = "rest";
  } else if (value.startsWith("activity:")) {
    activityType = value.split(":")[1];
  } else {
    workoutId = value;
    activityType = "workout";
  }
  
  const { error } = await sb.from("schedule")
    .upsert({
      user_id: APP.user.id,
      day_of_week: day,
      workout_id: workoutId,
      is_rest: isRest,
      activity_type: activityType
    }, { onConflict: "user_id,day_of_week" });
  
  if (error) {
    console.error(error);
    showToast("Erro ao salvar rotação", "error");
    return;
  }
  
  SETT.schedule[day] = workoutId;
  SETT.scheduleActivity[day] = activityType;
  render();
}

async function clearAllProgress() {
  // Conta o que será perdido — número concreto pesa mais que aviso genérico
  let resumo = "Todo o seu histórico de treinos e cargas registradas será apagado.";
  try {
    const [{ count: nSessions }, { count: nSets }] = await Promise.all([
      sb.from("workout_sessions").select("id", { count: "exact", head: true }).eq("user_id", APP.user.id),
      sb.from("set_logs").select("id", { count: "exact", head: true }).eq("user_id", APP.user.id)
    ]);
    if (nSessions || nSets) {
      resumo = `Você vai apagar ${nSessions || 0} treino(s) e ${nSets || 0} série(s) registradas. Suas cargas e recordes serão perdidos. Isso não pode ser desfeito.`;
    }
  } catch (e) { /* offline ou erro de contagem: mantém o texto genérico */ }

  const ok = await confirmDialog({
    title: "Apagar todo o histórico",
    message: resumo,
    confirmText: "Apagar tudo",
    cancelText: "Cancelar",
    danger: true,
    holdToConfirm: true
  });
  if (!ok) return;
  
  await sb.from("set_logs").delete().eq("user_id", APP.user.id);
  await sb.from("workout_sessions").delete().eq("user_id", APP.user.id);
  
  // Limpa também filas e estados locais — evita sets órfãos ressuscitando na sincronização
  localStorage.removeItem("wmb_offline_queue");
  localStorage.removeItem("wmb_offline_sets");
  localStorage.removeItem("wmb_rest_timer");
  localStorage.removeItem("wmb_deload_active");
  
  showToast("Histórico apagado", "success");
  HIST.sessions = [];
  render();
}

function vSettings() {
  // Encontrar o protocolo atual
  const currentProtocolName = APP.workouts[0]?.protocol_name || "Nenhum";
  let pData = { name: currentProtocolName, goal: "-", level: "-", cardio: "Não definido" };
  
  for (const key in PROTOCOLS_CATALOG) {
    if (PROTOCOLS_CATALOG[key].name === currentProtocolName) {
      pData = PROTOCOLS_CATALOG[key];
      break;
    }
  }

  return `
    <div class="settings-screen">
      <header class="hist-header">
        <button class="wh-back" data-act="gohome">←</button>
        <div class="wh-title-block">
          <div class="wh-name">CONFIGURAÇÕES</div>
          <div class="wh-sub">Rotação e gerenciamento</div>
        </div>
      </header>
      
      <div class="settings-body">
        <section class="settings-section">
          <h3 class="settings-title">📅 ROTAÇÃO SEMANAL</h3>
          <p class="settings-desc">Defina qual treino você faz em cada dia da semana</p>
          
          <div class="schedule-grid">
            ${[1, 2, 3, 4, 5, 6, 0].map(day => {
              const current = SETT.schedule[day];
              const workout = current && current !== "rest" 
                ? APP.workouts.find(w => w.id === current) 
                : null;
              const isRest = current === "rest";
              
              return `
                <div class="schedule-row">
                  <div class="sch-day-label">${DAY_NAMES_FULL[day]}</div>
                  <select class="form-input schedule-select" data-act="setday" data-day="${day}">
                    <option value="" ${!current && SETT.scheduleActivity?.[day] !== "rest" && SETT.scheduleActivity?.[day] !== "caminhada" && SETT.scheduleActivity?.[day] !== "corrida" && SETT.scheduleActivity?.[day] !== "bike" && SETT.scheduleActivity?.[day] !== "crossfit" ? "selected" : ""}>— Livre —</option>
                    <option value="rest" ${SETT.scheduleActivity?.[day] === "rest" ? "selected" : ""}>🛌 Descanso</option>
                    <option value="activity:caminhada" ${SETT.scheduleActivity?.[day] === "caminhada" ? "selected" : ""}>🚶 Caminhada</option>
                    <option value="activity:corrida" ${SETT.scheduleActivity?.[day] === "corrida" ? "selected" : ""}>🏃 Corrida</option>
                    <option value="activity:bike" ${SETT.scheduleActivity?.[day] === "bike" ? "selected" : ""}>🚴 Bike</option>
                    <option value="activity:crossfit" ${SETT.scheduleActivity?.[day] === "crossfit" ? "selected" : ""}>⛹️ CrossFit</option>
                    <optgroup label="─ Treinos ─">
                      ${APP.workouts.map(w => 
                        `<option value="${w.id}" ${current === w.id ? "selected" : ""}>${w.letter || ""} - ${escapeHTML(w.name)}</option>`
                      ).join("")}
                    </optgroup>
                  </select>
                  ${(() => {
                    const act = SETT.scheduleActivity?.[day];
                    if (act === "rest") return `<div class="sch-color-dot rest-dot">💤</div>`;
                    if (act === "caminhada") return `<div class="sch-color-dot" style="background:#8FBC8F">🚶</div>`;
                    if (act === "corrida") return `<div class="sch-color-dot" style="background:#FF6347">🏃</div>`;
                    if (act === "bike") return `<div class="sch-color-dot" style="background:#4169E1">🚴</div>`;
                    if (act === "crossfit") return `<div class="sch-color-dot" style="background:#FF8F00">⛹️</div>`;
                    if (workout) return `<div class="sch-color-dot" style="background:${workout.color}"></div>`;
                    return "";
                  })()}
                </div>
              `;
            }).join("")}
          </div>
        </section>
        
        <section class="settings-section">
          <h3 class="settings-title">📋 PROTOCOLO ATUAL</h3>
          <div class="protocol-info">
            <div class="pi-line"><strong>Nome:</strong> ${escapeHTML(pData.name)}</div>
            <div class="pi-line"><strong>Foco:</strong> ${escapeHTML(pData.goal)}</div>
            <div class="pi-line"><strong>Nível:</strong> ${escapeHTML(pData.level)}</div>
            <div class="pi-line"><strong>Cardio:</strong> ${escapeHTML(pData.cardio)}</div>
            <button class="auth-btn" data-act="goto" data-view="onboarding" style="margin-top: 14px; background: var(--bg); border: 1px solid var(--a); color: var(--a);">
              🔄 Trocar Protocolo de Treino
            </button>
          </div>
        </section>
        
        <section class="settings-section settings-danger">
          <h3 class="settings-title">⚠️ ZONA DE PERIGO</h3>
          <p class="settings-desc">Ações irreversíveis. Use com cuidado.</p>
          
          <button class="danger-btn" data-act="clearprogress">
            🗑️ Apagar Histórico de Treinos
          </button>
        </section>
        
        <div class="version-info">
          WMB GYM v5.0 • ${APP.user?.email || ""}
        </div>
      </div>
    </div>
  `;
}