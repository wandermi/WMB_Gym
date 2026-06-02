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
  // value pode ser: workout_id, "rest", ou null
  const isRest = value === "rest";
  const workoutId = (value && value !== "rest") ? value : null;
  
  // Upsert
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
    // Remover entrada
    await sb.from("schedule")
      .delete()
      .eq("user_id", APP.user.id)
      .eq("day_of_week", day);
    delete SETT.schedule[day];
  } else {
    SETT.schedule[day] = value;
  }
  
  render();
}

async function clearAllProgress() {
  if (!confirm("⚠️ Isso vai APAGAR todo o seu histórico de treinos e cargas registradas. Tem certeza?")) return;
  if (!confirm("Última chance! Vai apagar TUDO. Continuar?")) return;
  
  // Apagar set_logs primeiro (cascade vai cuidar)
  await sb.from("set_logs").delete().eq("user_id", APP.user.id);
  await sb.from("workout_sessions").delete().eq("user_id", APP.user.id);
  
  showToast("Histórico apagado", "success");
  HIST.sessions = [];
}

async function resetWorkouts() {
  if (!confirm("⚠️ Isso vai APAGAR seus treinos atuais e reimportar o Protocolo 2 do zero. Continuar?")) return;
  if (!confirm("Isso também apaga TODO o histórico relacionado. Tem certeza?")) return;
  
  await sb.from("set_logs").delete().eq("user_id", APP.user.id);
  await sb.from("workout_sessions").delete().eq("user_id", APP.user.id);
  await sb.from("schedule").delete().eq("user_id", APP.user.id);
  // Cascade vai apagar exercises automaticamente
  await sb.from("workouts").delete().eq("user_id", APP.user.id);
  
  showToast("Reimportando treinos...", "info");
  await seedInitialWorkouts();
  await loadWorkouts();
  SETT.schedule = {};
  
  showToast("Treinos resetados!", "success");
  render();
}

function vSettings() {
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
            <div class="pi-line"><strong>Nome:</strong> Protocolo 2</div>
            <div class="pi-line"><strong>Foco:</strong> Hipertrofia</div>
            <div class="pi-line"><strong>Nível:</strong> Intermediário</div>
            <div class="pi-line"><strong>Cardio:</strong> 20-40min de esteira com inclinação ou bike em todos os treinos</div>
          </div>
        </section>
        
        <section class="settings-section settings-danger">
          <h3 class="settings-title">⚠️ ZONA DE PERIGO</h3>
          <p class="settings-desc">Ações irreversíveis. Use com cuidado.</p>
          
          <button class="danger-btn" data-act="clearprogress">
            🗑️ Apagar Histórico de Treinos
          </button>
          
          <button class="danger-btn" data-act="resetworkouts">
            🔄 Resetar Treinos e Reimportar Protocolo
          </button>
        </section>
        
        <div class="version-info">
          WMB GYM v4.0 • ${APP.user?.email || ""}
        </div>
      </div>
    </div>
  `;
}
