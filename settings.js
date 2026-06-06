// ===========================================
// SETTINGS - Configurações + Rotação Semanal
// ===========================================

const SETT = {
  schedule: {},  // { 0: workout_id, 1: "rest", ... }  (0=Domingo, 6=Sábado)
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
  (data || []).forEach(s => {
    SETT.schedule[s.day_of_week] = s.is_rest ? "rest" : s.workout_id;
  });
}

async function saveDayWorkout(day, value) {
  const isRest = value === "rest";
  const workoutId = (value && value !== "rest") ? value : null;
  
  const { error } = await sb.from("schedule")
    .upsert({
      user_id: APP.user.id,
      day_of_week: day,
      workout_id: workoutId,
      is_rest: isRest
    }, { onConflict: "user_id,day_of_week" });
  
  if (error) {
    console.error(error);
    showToast("Erro ao salvar rotação", "error");
    return;
  }
  
  if (value === null || value === "") {
    await sb.from("schedule").delete().eq("user_id", APP.user.id).eq("day_of_week", day);
    delete SETT.schedule[day];
  } else {
    SETT.schedule[day] = value;
  }
  render();
}

async function clearAllProgress() {
  if (!confirm("⚠️ Isso vai APAGAR todo o seu histórico de treinos e cargas registradas. Tem certeza?")) return;
  if (!confirm("Última chance! Vai apagar TUDO. Continuar?")) return;
  
  await sb.from("set_logs").delete().eq("user_id", APP.user.id);
  await sb.from("workout_sessions").delete().eq("user_id", APP.user.id);
  
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
                    <option value="" ${!current ? "selected" : ""}>— Livre —</option>
                    <option value="rest" ${isRest ? "selected" : ""}>🛌 Descanso</option>
                    ${APP.workouts.map(w => 
                      `<option value="${w.id}" ${current === w.id ? "selected" : ""}>${w.letter || ""} - ${escapeHTML(w.name)}</option>`
                    ).join("")}
                  </select>
                  ${workout ? `<div class="sch-color-dot" style="background:${workout.color}"></div>` : ""}
                  ${isRest ? `<div class="sch-color-dot rest-dot">💤</div>` : ""}
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