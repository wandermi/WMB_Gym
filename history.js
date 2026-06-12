// ===========================================
// HISTORY - Histórico de treinos + gráficos
// ===========================================

const HIST = {
  sessions: [],              // Lista de workout_sessions
  loading: false,
  filter: "all",             // "all" | workout_id
  selectedSession: null,     // Sessão expandida (com detalhes)
  sessionDetails: null,      // set_logs da sessão selecionada
  
  progressExercise: null,    
  progressData: [],          
  exerciseList: [],          
  chartInstance: null,
};

async function loadHistory() {
  HIST.loading = true;
  render();
  
  const { data, error } = await sb.from("workout_sessions")
    .select("*")
    .eq("user_id", APP.user.id)
    .not("finished_at", "is", null)
    .order("started_at", { ascending: false })
    .limit(100);
  
  if (error) {
    console.error(error);
    showToast("Erro ao carregar histórico", "error");
    HIST.loading = false;
    return;
  }
  
  HIST.sessions = data || [];
  HIST.loading = false;
  render();
}

async function loadSessionDetails(sessionId) {
  HIST.sessionDetails = null;
  render();
  
  const { data, error } = await sb.from("set_logs")
    .select("*")
    .eq("session_id", sessionId)
    .eq("completed", true)
    .order("created_at", { ascending: true });
  
  if (error) {
    console.error(error);
    return;
  }
  
  const grouped = {};
  const order = [];
  data.forEach(log => {
    if (!grouped[log.exercise_name]) {
      grouped[log.exercise_name] = [];
      order.push(log.exercise_name);
    }
    grouped[log.exercise_name].push(log);
  });
  
  HIST.sessionDetails = { grouped, order };
  render();
}

async function loadExerciseList() {
  const { data, error } = await sb.from("set_logs")
    .select("exercise_id, exercise_name")
    .eq("user_id", APP.user.id)
    .eq("completed", true)
    .not("exercise_id", "is", null);
  
  if (error) { console.error(error); return; }
  
  const unique = {};
  (data || []).forEach(l => {
    if (l.exercise_id) unique[l.exercise_id] = l.exercise_name;
  });
  
  HIST.exerciseList = Object.entries(unique)
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function loadExerciseProgress(exerciseId) {
  HIST.progressData = [];
  HIST.progressExercise = HIST.exerciseList.find(e => e.id === exerciseId);
  render();
  
  const { data, error } = await sb.from("set_logs")
    .select("weight_kg, reps_done, completed_at, set_number, session_id")
    .eq("user_id", APP.user.id)
    .eq("exercise_id", exerciseId)
    .eq("completed", true)
    .not("weight_kg", "is", null)
    .order("completed_at", { ascending: true });
  
  if (error) { console.error(error); return; }
  
  const sessionMap = {};
  (data || []).forEach(log => {
    const key = log.session_id;
    if (!sessionMap[key]) {
      sessionMap[key] = {
        date: log.completed_at,
        maxWeight: 0,
        totalVolume: 0,
        sets: []
      };
    }
    sessionMap[key].sets.push(log);
    const w = parseFloat(log.weight_kg);
    const r = parseInt(log.reps_done) || 0;
    
    if (isNaN(w) || w === 0) {
      sessionMap[key].isBodyweight = true;
      if (r > sessionMap[key].maxWeight) sessionMap[key].maxWeight = r;
      sessionMap[key].totalVolume += r;
    } else {
      if (w > sessionMap[key].maxWeight) sessionMap[key].maxWeight = w;
      sessionMap[key].totalVolume += w * r;
      // e1RM estimado (Epley): peso × (1 + reps/30) — métrica que normaliza faixas de reps diferentes
      if (r > 0) {
        const e1 = w * (1 + r / 30);
        if (!sessionMap[key].e1rm || e1 > sessionMap[key].e1rm) sessionMap[key].e1rm = Math.round(e1 * 10) / 10;
      }
    }
  });
  
  HIST.progressData = Object.values(sessionMap).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  render();
  setTimeout(renderChart, 50);
}

async function renderChart() {
  const canvas = document.getElementById("progress-chart");
  if (!canvas || HIST.progressData.length === 0) return;
  
  try { await loadChartJs(); } catch { showToast("Sem internet para carregar o gráfico", "warn"); return; }
  
  if (HIST.chartInstance) {
    HIST.chartInstance.destroy();
    HIST.chartInstance = null;
  }
  
  const ctx = canvas.getContext("2d");
  const labels = HIST.progressData.map(d => {
    const date = new Date(d.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });
  const weights = HIST.progressData.map(d => d.maxWeight);
  const e1rms = HIST.progressData.map(d => d.e1rm || null);
  const hasE1rm = e1rms.some(v => v !== null);
  
  const datasets = [{
    label: "Carga máxima (kg)",
    data: weights,
    borderColor: "#00FF00",
    backgroundColor: "rgba(0,255,0,0.1)",
    borderWidth: 2,
    tension: 0.3,
    pointBackgroundColor: "#00FF00",
    pointRadius: 4,
    pointHoverRadius: 6,
    fill: true
  }];
  
  if (hasE1rm) {
    datasets.push({
      label: "1RM estimado (kg)",
      data: e1rms,
      borderColor: "#4A9EFF",
      backgroundColor: "transparent",
      borderWidth: 2,
      borderDash: [6, 4],
      tension: 0.3,
      pointBackgroundColor: "#4A9EFF",
      pointRadius: 3,
      fill: false
    });
  }
  
  HIST.chartInstance = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#AAA", font: { family: "Inter", size: 11 } } },
        tooltip: {
          backgroundColor: "#1A1A1A",
          borderColor: "#00FF00",
          borderWidth: 1,
          titleColor: "#00FF00",
          bodyColor: "#F0F0F0",
          padding: 12
        }
      },
      scales: {
        x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#888", font: { size: 10 } } },
        y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#888", font: { size: 10 }, callback: (v) => `${v}kg` }, beginAtZero: false }
      }
    }
  });
}

function computeStats() {
  const sessions = HIST.sessions;
  const totalWorkouts = sessions.length;
  const totalMinutes = sessions.reduce((a, s) => a + (s.duration_min || 0), 0);
  const totalSets = sessions.reduce((a, s) => a + (s.completed_sets || 0), 0);
  
  let streak = 0;
  if (sessions.length > 0) {
    const dates = [...new Set(sessions.map(s => 
      new Date(s.started_at).toDateString()
    ))].sort((a, b) => new Date(b) - new Date(a));
    
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);
    const today = checkDate.toDateString();
    const yesterday = new Date(checkDate.getTime() - 86400000).toDateString();
    
    if (dates.includes(today) || dates.includes(yesterday)) {
      let i = dates.includes(today) ? 0 : 1;
      for (; i < 365; i++) {
        const d = new Date(Date.now() - i * 86400000).toDateString();
        if (dates.includes(d)) streak++;
        else if (i > 0) break;
      }
    }
  }
  
  const fourWeeksAgo = Date.now() - 28 * 86400000;
  const recentSessions = sessions.filter(s => new Date(s.started_at).getTime() > fourWeeksAgo);
  const avgPerWeek = (recentSessions.length / 4).toFixed(1);
  
  return { totalWorkouts, totalMinutes, totalSets, streak, avgPerWeek };
}

function vHistory() {
  if (HIST.loading) return vLoading();
  
  const stats = computeStats();
  
  const workoutOptions = APP.workouts.map(w => 
    `<button class="filter-chip ${HIST.filter === w.id ? "active" : ""}" data-act="setfilter" data-id="${w.id}" style="--ch-color:${w.color}">${w.letter || "?"}</button>`
  ).join("");
  
  let filtered = HIST.sessions;
  if (HIST.filter !== "all") {
    filtered = filtered.filter(s => s.workout_id === HIST.filter);
  }
  
  const groups = {};
  filtered.forEach(s => {
    const d = new Date(s.started_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groups[key]) groups[key] = { label: monthLabel(d), sessions: [] };
    groups[key].sessions.push(s);
  });
  
  const groupKeys = Object.keys(groups).sort().reverse();
  
  const sessionsHtml = groupKeys.length === 0 ? `
    <div class="empty-state-large">
      <div class="es-icon">📊</div>
      <div class="es-title">Nenhum treino registrado</div>
      <div class="es-sub">Complete um treino pra começar a aparecer aqui</div>
    </div>
  ` : groupKeys.map(k => `
    <div class="hist-group">
      <div class="hist-group-label">${groups[k].label}</div>
      ${groups[k].sessions.map(s => renderSessionCard(s)).join("")}
    </div>
  `).join("");
  
  return `
    <div class="history-screen">
      <header class="hist-header">
        <button class="wh-back" data-act="gohome">←</button>
        <div class="wh-title-block">
          <div class="wh-name">HISTÓRICO</div>
          <div class="wh-sub">${stats.totalWorkouts} ${stats.totalWorkouts === 1 ? "treino" : "treinos"}</div>
        </div>
        <button class="header-btn" data-act="goprogress">📈</button>
      </header>
      
      <div class="hist-stats">
        <div class="hs-card">
          <div class="hs-value">${stats.streak}</div>
          <div class="hs-label">${stats.streak === 1 ? "DIA" : "DIAS"} SEGUIDOS</div>
        </div>
        <div class="hs-card">
          <div class="hs-value">${stats.avgPerWeek}</div>
          <div class="hs-label">POR SEMANA</div>
        </div>
        <div class="hs-card">
          <div class="hs-value">${fmtTotalTime(stats.totalMinutes)}</div>
          <div class="hs-label">TEMPO TOTAL</div>
        </div>
        <div class="hs-card">
          <div class="hs-value">${stats.totalSets}</div>
          <div class="hs-label">SÉRIES TOTAIS</div>
        </div>
      </div>
      
      <div class="filter-row">
        <button class="filter-chip ${HIST.filter === "all" ? "active" : ""}" data-act="setfilter" data-id="all">Todos</button>
        ${workoutOptions}
      </div>
      
      <div class="hist-body">
        ${sessionsHtml}
      </div>
    </div>
  `;
}

function renderSessionCard(s) {
  const date = new Date(s.started_at);
  const dayName = date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
  const dayNum = date.getDate();
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  
  const workout = APP.workouts.find(w => w.id === s.workout_id);
  const color = workout?.color || "#00FF00";
  const pct = s.total_sets > 0 ? Math.round((s.completed_sets / s.total_sets) * 100) : 0;
  
  const isExpanded = HIST.selectedSession === s.id;
  
  let detailsHtml = "";
  if (isExpanded) {
    if (!HIST.sessionDetails) {
      detailsHtml = `<div class="session-details"><div class="spinner-small"></div></div>`;
    } else {
      const exercises = HIST.sessionDetails.order.map(name => {
        const logs = HIST.sessionDetails.grouped[name];
        const setsList = logs.map(l => `
          <div class="detail-set">
            <span class="ds-num">${l.set_number}</span>
            <span class="ds-data">${l.weight_kg ? `${l.weight_kg}kg` : "—"} × ${l.reps_done || "—"}</span>
          </div>
        `).join("");
        return `
          <div class="detail-exercise">
            <div class="de-name">${escapeHTML(name)}</div>
            <div class="de-sets">${setsList}</div>
          </div>
        `;
      }).join("");
      
      detailsHtml = `<div class="session-details">${exercises}</div>`;
    }
  }
  
  return `
    <div class="session-card ${isExpanded ? "expanded" : ""}" data-act="togglesession" data-id="${s.id}">
      <div class="sc-date">
        <div class="sc-day">${dayName}</div>
        <div class="sc-num" style="color:${color}">${dayNum}</div>
      </div>
      <div class="sc-content">
        <div class="sc-name">${escapeHTML(s.workout_name || "Treino")}</div>
        <div class="sc-sub">${escapeHTML(s.workout_sub || "")}</div>
        <div class="sc-meta">
          <span>⏱ ${s.duration_min || 0}min</span>
          <span>•</span>
          <span>💪 ${s.completed_sets || 0}/${s.total_sets || 0}</span>
          <span>•</span>
          <span>🕐 ${time}</span>
        </div>
      </div>
      <div class="sc-pct" style="color:${pct === 100 ? "#00FF00" : color}">${pct}%</div>
    </div>
    ${detailsHtml}
  `;
}

function vProgress() {
  const hasExercises = HIST.exerciseList.length > 0;
  
  return `
    <div class="progress-screen">
      <header class="hist-header">
        <button class="wh-back" data-act="gohistory">←</button>
        <div class="wh-title-block">
          <div class="wh-name">PROGRESSÃO</div>
          <div class="wh-sub">${HIST.progressExercise ? escapeHTML(HIST.progressExercise.name) : "Selecione um exercício"}</div>
        </div>
      </header>
      
      ${!hasExercises ? `
        <div class="empty-state-large">
          <div class="es-icon">📈</div>
          <div class="es-title">Sem dados ainda</div>
          <div class="es-sub">Complete alguns treinos pra ver seu progresso</div>
        </div>
      ` : `
        <div class="progress-body">
          ${HIST.bodyLogs.length >= 2 ? `
            <div class="chart-card" style="margin-bottom:16px">
              <div class="chart-title">⚖️ PESO CORPORAL</div>
              <div class="chart-container" style="height:160px">
                <canvas id="body-chart"></canvas>
              </div>
              <div class="bw-summary">
                Atual: <strong>${HIST.bodyLogs[HIST.bodyLogs.length-1].weight_kg}kg</strong>
                ${HIST.bodyLogs.length >= 2 ? (() => {
                  const diff = (parseFloat(HIST.bodyLogs[HIST.bodyLogs.length-1].weight_kg) - parseFloat(HIST.bodyLogs[0].weight_kg)).toFixed(1);
                  return ` • ${diff > 0 ? "+" : ""}${diff}kg no período`;
                })() : ""}
              </div>
            </div>
          ` : ""}
          <div class="exercise-selector">
            <label class="form-label">Exercício</label>
            <select class="exercise-select" data-act="selectexercise">
              <option value="">Escolha um exercício...</option>
              ${HIST.exerciseList.map(e => 
                `<option value="${e.id}" ${HIST.progressExercise?.id === e.id ? "selected" : ""}>${escapeHTML(e.name)}</option>`
              ).join("")}
            </select>
          </div>
          
          ${HIST.progressExercise && HIST.progressData.length > 0 ? `
            <div class="chart-card">
              <div class="chart-title">EVOLUÇÃO DE CARGA</div>
              <div class="chart-container">
                <canvas id="progress-chart"></canvas>
              </div>
            </div>
            
            <div class="progress-stats">
              ${renderProgressStats()}
            </div>
            
            <div class="progress-sessions">
              <div class="ps-title">ÚLTIMAS SESSÕES</div>
              ${HIST.progressData.slice(-10).reverse().map(d => {
                const unit = d.isBodyweight ? " reps" : "kg";
                const volUnit = d.isBodyweight ? "reps total" : "kg total";
                return `
                <div class="ps-row">
                  <div class="ps-date">${new Date(d.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</div>
                  <div class="ps-weight">${d.maxWeight}${unit}</div>
                  <div class="ps-volume">${Math.round(d.totalVolume)} ${volUnit}</div>
                </div>
                `;
              }).join("")}
            </div>
          ` : HIST.progressExercise ? `
            <div class="empty-state-large">
              <div class="es-icon">📊</div>
              <div class="es-title">Sem dados desse exercício</div>
            </div>
          ` : ""}
        </div>
      `}
    </div>
  `;
}

function renderProgressStats() {
  if (HIST.progressData.length === 0) return "";
  
  const isBw = HIST.progressData[0]?.isBodyweight;
  const unit = isBw ? " reps" : "kg";
  const volUnit = isBw ? " reps no total" : "kg no total";
  
  const weights = HIST.progressData.map(d => d.maxWeight);
  const maxWeight = Math.max(...weights);
  const firstWeight = weights[0];
  const lastWeight = weights[weights.length - 1];
  const diff = lastWeight - firstWeight;
  const diffPct = firstWeight > 0 ? ((diff / firstWeight) * 100).toFixed(1) : 0;
  
  const totalVolume = HIST.progressData.reduce((a, d) => a + d.totalVolume, 0);
  
  return `
    <div class="ps-grid">
      <div class="ps-stat">
        <div class="ps-stat-label">PR ATUAL</div>
        <div class="ps-stat-value" style="color:#00FF00">${maxWeight}${unit}</div>
      </div>
      <div class="ps-stat">
        <div class="ps-stat-label">EVOLUÇÃO</div>
        <div class="ps-stat-value" style="color:${diff >= 0 ? "#00FF00" : "#FF6B6B"}">${diff >= 0 ? "+" : ""}${diff.toFixed(1)}${unit}</div>
        <div class="ps-stat-sub">${diff >= 0 ? "+" : ""}${diffPct}%</div>
      </div>
      <div class="ps-stat">
        <div class="ps-stat-label">SESSÕES</div>
        <div class="ps-stat-value">${HIST.progressData.length}</div>
      </div>
      <div class="ps-stat">
        <div class="ps-stat-label">VOLUME TOTAL</div>
        <div class="ps-stat-value">${Math.round(totalVolume).toLocaleString("pt-BR")}</div>
        <div class="ps-stat-sub">${volUnit}</div>
      </div>
    </div>
  `;
}

function monthLabel(date) {
  const months = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
                  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function fmtTotalTime(minutes) {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m > 0 ? m + "m" : ""}`;
}

// ===========================================
// PESO CORPORAL - dados e gráfico
// ===========================================

HIST.bodyLogs = [];
HIST.bodyChartInstance = null;

async function loadBodyLogs() {
  const { data, error } = await sb.from("body_logs")
    .select("log_date, weight_kg")
    .eq("user_id", APP.user.id)
    .order("log_date", { ascending: true })
    .limit(120);
  if (!error && data) HIST.bodyLogs = data;
}

async function renderBodyChart() {
  const canvas = document.getElementById("body-chart");
  if (!canvas || HIST.bodyLogs.length < 2) return;
  
  try { await loadChartJs(); } catch { return; }
  
  if (HIST.bodyChartInstance) { HIST.bodyChartInstance.destroy(); HIST.bodyChartInstance = null; }
  
  const ctx = canvas.getContext("2d");
  HIST.bodyChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: HIST.bodyLogs.map(d => {
        const dt = new Date(d.log_date + "T12:00:00");
        return `${dt.getDate()}/${dt.getMonth() + 1}`;
      }),
      datasets: [{
        label: "Peso corporal (kg)",
        data: HIST.bodyLogs.map(d => parseFloat(d.weight_kg)),
        borderColor: "#FFD600",
        backgroundColor: "rgba(255,214,0,0.08)",
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: "#FFD600",
        pointRadius: 3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#AAA", font: { family: "Inter", size: 11 } } },
        tooltip: { backgroundColor: "#1A1A1A", borderColor: "#FFD600", borderWidth: 1, titleColor: "#FFD600", bodyColor: "#F0F0F0", padding: 12 }
      },
      scales: {
        x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#888", font: { size: 10 } } },
        y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#888", font: { size: 10 }, callback: v => `${v}kg` }, beginAtZero: false }
      }
    }
  });
}
