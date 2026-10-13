// ===========================================
// WMB GYM - Corrida (plano 5 km até 29/11/2026)
// ===========================================
// Plano fixo no código (por data). Só os REGISTROS vão para o Supabase
// (tabela run_logs — ver SQL_CORRIDA.sql).
// ===========================================

const RUN_RACE_DATE = "2026-11-29";
const RUN_BASE = { sec: 30 * 60 + 20.6, label: "30:20", pace: 364, date: "11/10" };
const RUN_GOAL = { sec: 29 * 60 + 30, label: "29:30", pace: 354 };

const RUN_KINDS = {
  easy:      { label: "Leve",     color: "#4A9EFF", icon: "🟦" },
  strides:   { label: "Leve + tiros curtos", color: "#4A9EFF", icon: "🟦" },
  intervals: { label: "Intervalado", color: "#FF6B4A", icon: "🔥" },
  tempo:     { label: "Tempo run", color: "#FFB84A", icon: "⚡" },
  race:      { label: "PROVA", color: "#00FF00", icon: "🏁" }
};

const RUN_EASY = "7:00–7:30/km. Se der pra conversar, está certo. Não acelere.";
const RUN_STRIDES = "Depois do trote, 4×20 s rápidos (soltos, não é sprint), voltando caminhando/trotando 60–90 s entre eles.";
const RUN_WARM = "Aquecimento 10–15 min leve + 3–4 progressivos. Desaquecimento 5–10 min leve.";

// Semanas de segunda a domingo. Domingo: correr ANTES do Push.
const RUN_PLAN = [
  { date: "2026-10-13", week: 1, kind: "easy",    title: "25 min leve", desc: [RUN_EASY] },
  { date: "2026-10-16", week: 1, kind: "easy",    title: "30 min leve", desc: [RUN_EASY] },
  { date: "2026-10-18", week: 1, kind: "strides", title: "6 km leve + 4×20 s", desc: ["6 km em 7:00–7:30/km.", RUN_STRIDES] },

  { date: "2026-10-20", week: 2, kind: "easy",    title: "30 min leve", desc: [RUN_EASY] },
  { date: "2026-10-23", week: 2, kind: "strides", title: "30 min leve + 4×20 s", desc: [RUN_EASY, RUN_STRIDES] },
  { date: "2026-10-25", week: 2, kind: "intervals", title: "5×800 m", desc: [RUN_WARM, "5 tiros de 800 m a 5:50–5:55/km.", "Recuperação: 90 s trotando entre os tiros."] },

  { date: "2026-10-27", week: 3, kind: "easy",    title: "35 min leve", desc: [RUN_EASY] },
  { date: "2026-10-30", week: 3, kind: "strides", title: "30 min leve + 4×20 s", desc: [RUN_EASY, RUN_STRIDES] },
  { date: "2026-11-01", week: 3, kind: "tempo",   title: "Tempo run 20 min", desc: [RUN_WARM, "20 min contínuos a 6:20–6:30/km (forte mas controlado)."] },

  { date: "2026-11-03", week: 4, kind: "easy",    title: "35 min leve", desc: [RUN_EASY] },
  { date: "2026-11-06", week: 4, kind: "strides", title: "30 min leve + 4×20 s", desc: [RUN_EASY, RUN_STRIDES] },
  { date: "2026-11-08", week: 4, kind: "intervals", title: "4×1000 m", desc: [RUN_WARM, "4 tiros de 1000 m a 5:50–5:55/km.", "Recuperação: 2 min trotando.", "Reavaliar a meta de 29:30 com base nesse treino."] },

  { date: "2026-11-10", week: 5, kind: "easy",    title: "35 min leve", desc: [RUN_EASY] },
  { date: "2026-11-13", week: 5, kind: "strides", title: "30 min leve + 4×20 s", desc: [RUN_EASY, RUN_STRIDES] },
  { date: "2026-11-15", week: 5, kind: "intervals", title: "5×1000 m", desc: [RUN_WARM, "5 tiros de 1000 m a 5:50–5:55/km.", "Recuperação: 2 min trotando."] },

  { date: "2026-11-17", week: 6, kind: "easy",    title: "30 min leve", desc: [RUN_EASY] },
  { date: "2026-11-20", week: 6, kind: "strides", title: "25 min leve + 4×20 s", desc: [RUN_EASY, RUN_STRIDES] },
  { date: "2026-11-22", week: 6, kind: "intervals", title: "3×1200 m", desc: [RUN_WARM, "3 tiros de 1200 m a 5:50–5:55/km.", "Recuperação: 2 min trotando. Último treino forte antes da prova."] },

  { date: "2026-11-24", week: 7, kind: "easy",    title: "20 min leve", desc: [RUN_EASY] },
  { date: "2026-11-27", week: 7, kind: "strides", title: "15–20 min leve + 4×20 s", desc: [RUN_EASY, RUN_STRIDES] },
  { date: "2026-11-29", week: 7, kind: "race",    title: "PROVA 5 km", desc: ["Largue em ~5:55/km nos primeiros 1–2 km, mantenha, e acelere no último km se sobrar.", "Meta: 29:30 (5:54/km). Base: 30:20 (6:04/km)."] }
];

const RUN = { logs: [], loading: false, loaded: false, tableMissing: false, modal: null, form: null, saving: false };

// ---------- utilidades ----------

function runDateStr(d) {
  const x = d || new Date();
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}
function runDateParts(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
function runDateLabel(s) {
  const d = runDateParts(s);
  const dows = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  return `${dows[d.getDay()]} ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function runDaysUntil(s) {
  const a = runDateParts(runDateStr());
  const b = runDateParts(s);
  return Math.round((b - a) / 86400000);
}
function runFmtTime(sec) {
  if (sec == null || !isFinite(sec)) return "—";
  const total = Math.round(sec);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}
function runFmtPace(secPerKm) {
  if (!secPerKm || !isFinite(secPerKm)) return "—";
  const t = Math.round(secPerKm);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}/km`;
}
// "30:20", "30:20.6", "1:05:10" → segundos. Número solto = minutos.
function runParseTime(str) {
  if (!str) return null;
  const parts = String(str).trim().replace(",", ".").split(":");
  if (parts.some(p => p === "" || isNaN(Number(p)))) return null;
  const n = parts.map(Number);
  if (n.some(v => v < 0)) return null;
  if (n.length === 1) return n[0] * 60;
  if (n.length === 2) return n[0] * 60 + n[1];
  if (n.length === 3) return n[0] * 3600 + n[1] * 60 + n[2];
  return null;
}
function runParseDist(str) {
  if (!str) return null;
  const v = Number(String(str).trim().replace(",", "."));
  return isFinite(v) && v > 0 ? v : null;
}
function runPlanFor(dateStr) { return RUN_PLAN.find(p => p.date === dateStr) || null; }
function runLogsFor(planDate) { return RUN.logs.filter(l => l.plan_date === planDate); }

function runNextSession() {
  const today = runDateStr();
  const pending = RUN_PLAN.filter(p => p.date >= today && runLogsFor(p.date).length === 0);
  return pending[0] || null;
}

// ---------- dados ----------

async function loadRunLogs() {
  if (!APP.user) return;
  RUN.loading = true;
  const { data, error } = await sb.from("run_logs")
    .select("*")
    .eq("user_id", APP.user.id)
    .order("run_date", { ascending: false })
    .order("created_at", { ascending: false });
  RUN.loading = false;
  if (error) {
    console.error("run_logs:", error);
    RUN.tableMissing = /run_logs|does not exist|42P01|schema cache/i.test(`${error.code || ""} ${error.message || ""}`);
    RUN.logs = [];
  } else {
    RUN.tableMissing = false;
    RUN.logs = data || [];
  }
  RUN.loaded = true;
}

async function saveRunLog() {
  const f = RUN.form;
  if (!f || RUN.saving) return;
  const dist = runParseDist(f.dist);
  const dur = runParseTime(f.time);
  if (!dist) { showToast("Informe a distância em km (ex: 5 ou 5,2)", "warn"); return; }
  if (!dur || dur < 60) { showToast("Informe o tempo no formato mm:ss (ex: 30:20)", "warn"); return; }
  if (dist > 60) { showToast("Distância parece alta demais (máx. 60 km)", "warn"); return; }
  const pace = dur / dist;
  if (pace < 150 || pace > 1200) { showToast("Ritmo fora do normal — confira distância e tempo", "warn"); return; }
  const rpe = f.rpe ? Math.min(10, Math.max(1, parseInt(f.rpe))) : null;

  RUN.saving = true;
  const row = {
    user_id: APP.user.id,
    run_date: f.date,
    plan_date: f.planDate || null,
    distance_km: dist,
    duration_sec: Math.round(dur * 10) / 10,
    rpe,
    notes: (f.notes || "").trim() || null
  };
  const { error } = await sb.from("run_logs").insert(row);
  RUN.saving = false;
  if (error) {
    console.error(error);
    showToast(/run_logs|42P01|schema cache/i.test(error.message || "") ? "Tabela run_logs não existe — rode o SQL_CORRIDA.sql" : "Erro ao salvar: " + error.message, "error");
    return;
  }
  RUN.modal = null;
  RUN.form = null;
  showToast("Corrida registrada! 🏃", "success");
  await loadRunLogs();
  render();
}

async function deleteRunLog(id) {
  const ok = await confirmDialog({
    title: "Apagar este registro?",
    message: "A corrida some do histórico e das comparações.",
    confirmText: "Apagar",
    cancelText: "Manter",
    danger: true
  });
  if (!ok) return;
  const { error } = await sb.from("run_logs").delete().eq("id", id).eq("user_id", APP.user.id);
  if (error) { showToast("Erro ao apagar: " + error.message, "error"); return; }
  await loadRunLogs();
  render();
}

function openRunModal(planDate) {
  const plan = planDate ? runPlanFor(planDate) : null;
  const isRace = plan?.kind === "race";
  RUN.form = {
    date: runDateStr(),
    planDate: planDate || "",
    dist: isRace ? "5" : "",
    time: "",
    rpe: "",
    notes: ""
  };
  RUN.modal = "log";
  render();
}

// ---------- views ----------

function runPaceFromForm() {
  const f = RUN.form;
  if (!f) return null;
  const d = runParseDist(f.dist), t = runParseTime(f.time);
  return d && t ? t / d : null;
}

function runPaceHint() {
  const p = runPaceFromForm();
  if (!p) return "Preencha distância e tempo";
  const proj = p * 5;
  return `Ritmo ${runFmtPace(p)} · projeção 5 km: ${runFmtTime(proj)}`;
}

function vRunSession(p) {
  const k = RUN_KINDS[p.kind];
  const logs = runLogsFor(p.date);
  const done = logs.length > 0;
  const today = runDateStr();
  const isToday = p.date === today;
  const isPast = p.date < today;
  const best = logs[0];
  return `
    <div class="run-sess ${done ? "run-done" : ""} ${isToday ? "run-today" : ""} ${p.kind === "race" ? "run-race" : ""}" style="--rc:${k.color}">
      <div class="run-sess-head">
        <div class="run-date">${runDateLabel(p.date)}${isToday ? " · HOJE" : ""}</div>
        <div class="run-badge">${k.icon} ${k.label}</div>
      </div>
      <div class="run-title">${escapeHTML(p.title)}</div>
      <div class="run-desc">${p.desc.map(l => `<div>${escapeHTML(l)}</div>`).join("")}</div>
      ${done ? `
        <div class="run-result">✓ ${best.distance_km} km em ${runFmtTime(best.duration_sec)} · ${runFmtPace(best.duration_sec / best.distance_km)}</div>
      ` : `
        <button class="run-btn ${isPast ? "run-btn-ghost" : ""}" data-act="runlog" data-plan="${p.date}">${isPast ? "Registrar (atrasado)" : "Registrar corrida"}</button>
      `}
    </div>
  `;
}

function vRunLogRow(l) {
  const pace = l.duration_sec / l.distance_km;
  const plan = l.plan_date ? runPlanFor(l.plan_date) : null;
  return `
    <div class="run-log">
      <div class="run-log-main">
        <div class="run-log-top"><span>${runDateLabel(l.run_date)}</span>${plan ? `<span class="run-log-tag">${escapeHTML(plan.title)}</span>` : `<span class="run-log-tag">Livre</span>`}</div>
        <div class="run-log-val">${Number(l.distance_km)} km · ${runFmtTime(l.duration_sec)} · <b>${runFmtPace(pace)}</b></div>
        ${l.rpe ? `<div class="run-log-note">Esforço ${l.rpe}/10</div>` : ""}
        ${l.notes ? `<div class="run-log-note">${escapeHTML(l.notes)}</div>` : ""}
      </div>
      <button class="run-del" data-act="rundelete" data-id="${l.id}" aria-label="Apagar registro">✕</button>
    </div>
  `;
}

function vRunModal() {
  const f = RUN.form || {};
  const plan = f.planDate ? runPlanFor(f.planDate) : null;
  return `
    <div class="modal-overlay" data-act="runclose">
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-title">${plan ? escapeHTML(plan.title) : "Registrar corrida"}</div>
        <div class="run-form">
          <label class="run-lbl">Data
            <input class="auth-input" type="date" id="run-date" value="${f.date}" max="${runDateStr()}">
          </label>
          <div class="run-row2">
            <label class="run-lbl">Distância (km)
              <input class="auth-input" type="text" inputmode="decimal" id="run-dist" placeholder="5,00" value="${escapeHTML(f.dist)}" autocomplete="off">
            </label>
            <label class="run-lbl">Tempo (mm:ss)
              <input class="auth-input" type="text" inputmode="decimal" id="run-time" placeholder="30:20" value="${escapeHTML(f.time)}" autocomplete="off">
            </label>
          </div>
          <div class="run-pace" id="run-pace">${runPaceHint()}</div>
          <label class="run-lbl">Esforço percebido (1–10, opcional)
            <input class="auth-input" type="text" inputmode="numeric" id="run-rpe" placeholder="7" value="${escapeHTML(f.rpe)}" maxlength="2" autocomplete="off">
          </label>
          <label class="run-lbl">Observações (opcional)
            <input class="auth-input" type="text" id="run-notes" placeholder="Ex: tiros em 5:48, 5:50, 5:52..." value="${escapeHTML(f.notes)}" autocomplete="off">
          </label>
          <button class="auth-btn" data-act="runsave" ${RUN.saving ? "disabled" : ""}>${RUN.saving ? "Salvando..." : "Salvar"}</button>
          <button class="run-cancel" data-act="runclose">Cancelar</button>
        </div>
      </div>
    </div>
  `;
}

function vRun() {
  const daysToRace = runDaysUntil(RUN_RACE_DATE);
  const raceLabel = daysToRace > 0 ? `${daysToRace} ${daysToRace === 1 ? "dia" : "dias"} para a prova`
    : daysToRace === 0 ? "A PROVA É HOJE" : "Prova realizada";
  const next = runNextSession();
  const weeks = {};
  RUN_PLAN.forEach(p => { (weeks[p.week] = weeks[p.week] || []).push(p); });

  const today = runDateStr();
  const totalPlanned = RUN_PLAN.filter(p => p.date <= today).length;
  const totalDone = RUN_PLAN.filter(p => p.date <= today && runLogsFor(p.date).length > 0).length;
  const kmTotal = RUN.logs.reduce((a, l) => a + Number(l.distance_km || 0), 0);

  // Melhor 5 km já registrado (distância 4,9–5,3 km, projetado se for mais curto não entra)
  const fiveK = RUN.logs.filter(l => l.distance_km >= 4.95 && l.distance_km <= 5.3);
  const best5 = fiveK.length ? Math.min(...fiveK.map(l => l.duration_sec * 5 / l.distance_km)) : null;
  const bestVs = best5 != null ? best5 - RUN_BASE.sec : null;

  const weekHtml = Object.keys(weeks).map(w => {
    const sessions = weeks[w];
    const first = sessions[0].date;
    const monday = runDateParts(first);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
    const lab = `${String(monday.getDate()).padStart(2, "0")}/${String(monday.getMonth() + 1).padStart(2, "0")} – ${String(sunday.getDate()).padStart(2, "0")}/${String(sunday.getMonth() + 1).padStart(2, "0")}`;
    return `
      <div class="run-week">
        <div class="run-week-label">SEMANA ${w} <span>${lab}</span></div>
        ${sessions.map(vRunSession).join("")}
      </div>
    `;
  }).join("");

  const recent = RUN.logs.slice(0, 12);

  return `
    <div class="history-screen run-screen">
      <header class="hist-header">
        <button class="wh-back" data-act="gohome" aria-label="Voltar">←</button>
        <div class="wh-title-block">
          <div class="wh-name">CORRIDA 5 KM</div>
          <div class="wh-sub">${raceLabel} · 29/11</div>
        </div>
        <button class="header-btn" data-act="runlog" data-plan="" aria-label="Registrar corrida livre">＋</button>
      </header>

      <div class="run-body">
        ${RUN.tableMissing ? `
          <div class="run-warn">A tabela <b>run_logs</b> ainda não existe no Supabase. Rode o arquivo <b>SQL_CORRIDA.sql</b> no SQL Editor e volte aqui.</div>
        ` : ""}

        <div class="run-goal">
          <div class="run-goal-col"><div class="run-goal-l">BASE (11/10)</div><div class="run-goal-v">${RUN_BASE.label}</div><div class="run-goal-s">6:04/km</div></div>
          <div class="run-goal-arrow">→</div>
          <div class="run-goal-col run-goal-target"><div class="run-goal-l">META</div><div class="run-goal-v">${RUN_GOAL.label}</div><div class="run-goal-s">5:54/km</div></div>
        </div>
        ${best5 != null ? `<div class="run-best">Melhor 5 km registrado: <b>${runFmtTime(best5)}</b> (${bestVs <= 0 ? "−" : "+"}${runFmtTime(Math.abs(bestVs))} vs base)</div>` : ""}

        <div class="run-stats">
          <div><div class="run-stat-v">${totalDone}/${totalPlanned}</div><div class="run-stat-l">SESSÕES FEITAS</div></div>
          <div><div class="run-stat-v">${kmTotal.toFixed(1).replace(".", ",")}</div><div class="run-stat-l">KM REGISTRADOS</div></div>
        </div>

        ${next ? `
          <div class="run-next-label">PRÓXIMA SESSÃO</div>
          ${vRunSession(next)}
        ` : ""}

        <h2 class="section-title" style="margin-top:22px">Plano completo</h2>
        ${weekHtml}

        <h2 class="section-title" style="margin-top:22px">Registros</h2>
        ${RUN.loading && !RUN.loaded ? `<div class="empty-state">Carregando...</div>` :
          recent.length ? recent.map(vRunLogRow).join("") : `<div class="empty-state">Nenhuma corrida registrada ainda</div>`}

        <div class="run-note">
          Ritmos são estimativas a partir do seu 5 km de 30:20. Dor aguda, canela dolorida ou pernas
          muito pesadas dos treinos de perna: troque o treino por leve ou descanse. Domingo: corra antes do Push.
        </div>
      </div>
    </div>
  `;
}

// ---------- eventos ----------

// Retorna true se tratou o clique
async function handleRunAct(act, el) {
  if (act === "gorun") {
    APP.view = "run";
    APP.modal = null;
    render();
    await loadRunLogs();
    render();
    return true;
  }
  if (act === "runlog") { openRunModal(el.dataset.plan || ""); return true; }
  if (act === "runclose") { RUN.modal = null; RUN.form = null; render(); return true; }
  if (act === "runsave") { await saveRunLog(); return true; }
  if (act === "rundelete") { await deleteRunLog(el.dataset.id); return true; }
  return false;
}

document.addEventListener("input", (e) => {
  const t = e.target;
  if (!RUN.form || !t.id || !t.id.startsWith("run-")) return;
  const map = { "run-date": "date", "run-dist": "dist", "run-time": "time", "run-rpe": "rpe", "run-notes": "notes" };
  const key = map[t.id];
  if (!key) return;
  RUN.form[key] = t.value;
  const hint = document.getElementById("run-pace");
  if (hint) hint.textContent = runPaceHint();
});

// Carrega os registros em segundo plano para o selo ✓ da home
async function ensureRunLogs() {
  if (!RUN.loaded && !RUN.loading) { await loadRunLogs(); if (APP.view === "home") render(); }
}
