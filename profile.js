// ===========================================
// PROFILE - Perfil do usuário
// ===========================================

const PROF = {
  editing: false,
  loading: false,
  form: {}
};

async function loadProfileData() {
  await loadProfile(); // do app.js
  PROF.form = { ...(APP.profile || {}) };
}

async function saveProfile() {
  if (PROF.loading) return;
  PROF.loading = true;
  render();
  
  // Pegar valores dos inputs
  const f = {
    name: $("#prof-name")?.value?.trim() || null,
    age: parseInt($("#prof-age")?.value) || null,
    // Suporte para vírgula no peso
    weight: parseFloat($("#prof-weight")?.value?.replace(',', '.')) || null,
    height: parseInt($("#prof-height")?.value) || null,
    goal: $("#prof-goal")?.value || null,
    level: $("#prof-level")?.value || null,
    notes: $("#prof-notes")?.value?.trim() || null,
  };
  
  const { error } = await sb.from("profiles")
    .update({ ...f, updated_at: new Date().toISOString() })
    .eq("id", APP.user.id);
  
  PROF.loading = false;
  
  if (error) {
    console.error(error);
    showToast("Erro ao salvar perfil: " + error.message, "error");
    render();
    return;
  }
  
  APP.profile = { ...APP.profile, ...f };
  PROF.editing = false;
  showToast("Perfil atualizado!", "success");
  render();
}

function vProfile() {
  const p = APP.profile || {};
  const f = PROF.editing ? PROF.form : p;
  
  if (!PROF.editing) {
    return `
      <div class="profile-screen">
        <header class="hist-header">
          <button class="wh-back" data-act="gohome">←</button>
          <div class="wh-title-block">
            <div class="wh-name">MEU PERFIL</div>
            <div class="wh-sub">Dados pessoais</div>
          </div>
          <button class="header-btn" data-act="editprofile">✏️</button>
        </header>
        
        <div class="profile-body">
          <div class="profile-avatar-block">
            <div class="profile-avatar-big">
              ${(p.name || APP.user?.email || "?")[0].toUpperCase()}
            </div>
            <div class="profile-name">${escapeHTML(p.name || "Sem nome")}</div>
            <div class="profile-email">${escapeHTML(APP.user?.email || "")}</div>
          </div>
          
          <div class="info-grid">
            <div class="info-card">
              <div class="info-label">IDADE</div>
              <div class="info-value">${p.age ? `${p.age} anos` : "—"}</div>
            </div>
            <div class="info-card">
              <div class="info-label">PESO</div>
              <div class="info-value">${p.weight ? `${p.weight}kg` : "—"}</div>
            </div>
            <div class="info-card">
              <div class="info-label">ALTURA</div>
              <div class="info-value">${p.height ? `${p.height}cm` : "—"}</div>
            </div>
            <div class="info-card">
              <div class="info-label">IMC</div>
              <div class="info-value">${p.weight && p.height ? (p.weight / ((p.height/100) ** 2)).toFixed(1) : "—"}</div>
            </div>
          </div>
          
          <div class="info-full">
            <div class="info-label">OBJETIVO</div>
            <div class="info-tag info-tag-goal">${escapeHTML(p.goal || "Não definido")}</div>
          </div>
          
          <div class="info-full">
            <div class="info-label">NÍVEL</div>
            <div class="info-tag info-tag-level">${escapeHTML(p.level || "Não definido")}</div>
          </div>
          
          ${p.notes ? `
            <div class="info-full">
              <div class="info-label">OBSERVAÇÕES</div>
              <div class="info-notes">${escapeHTML(p.notes)}</div>
            </div>
          ` : ""}
        </div>
      </div>
    `;
  }
  
  // Modo edição
  return `
    <div class="profile-screen">
      <header class="hist-header">
        <button class="wh-back" data-act="cancelprofileedit">←</button>
        <div class="wh-title-block">
          <div class="wh-name">EDITAR PERFIL</div>
          <div class="wh-sub">Atualize seus dados</div>
        </div>
      </header>
      
      <div class="profile-body">
        <div class="form-field">
          <label class="form-label">NOME</label>
          <input id="prof-name" class="form-input" type="text" placeholder="Seu nome" value="${escapeHTML(f.name || "")}">
        </div>
        
        <div class="form-row">
          <div class="form-field">
            <label class="form-label">IDADE</label>
            <input id="prof-age" class="form-input" type="number" inputmode="numeric" placeholder="anos" value="${f.age || ""}">
          </div>
          <div class="form-field">
            <label class="form-label">PESO (kg)</label>
            <input id="prof-weight" class="form-input" type="number" inputmode="decimal" step="0.1" placeholder="kg" value="${f.weight || ""}">
          </div>
          <div class="form-field">
            <label class="form-label">ALTURA (cm)</label>
            <input id="prof-height" class="form-input" type="number" inputmode="numeric" placeholder="cm" value="${f.height || ""}">
          </div>
        </div>
        
        <div class="form-field">
          <label class="form-label">OBJETIVO</label>
          <select id="prof-goal" class="form-input">
            <option value="">Selecione...</option>
            <option value="Massa" ${f.goal === "Massa" ? "selected" : ""}>🏋️ Massa</option>
            <option value="Emagrecimento" ${f.goal === "Emagrecimento" ? "selected" : ""}>🔥 Emagrecimento</option>
            <option value="Ambos" ${f.goal === "Ambos" ? "selected" : ""}>💪 Ambos</option>
          </select>
        </div>
        
        <div class="form-field">
          <label class="form-label">NÍVEL</label>
          <select id="prof-level" class="form-input">
            <option value="">Selecione...</option>
            <option value="Iniciante" ${f.level === "Iniciante" ? "selected" : ""}>🌱 Iniciante</option>
            <option value="Intermediário" ${f.level === "Intermediário" ? "selected" : ""}>💪 Intermediário</option>
            <option value="Avançado" ${f.level === "Avançado" ? "selected" : ""}>🔥 Avançado</option>
          </select>
        </div>
        
        <div class="form-field">
          <label class="form-label">OBSERVAÇÕES</label>
          <textarea id="prof-notes" class="form-input form-textarea" placeholder="Lesões, restrições, etc.">${escapeHTML(f.notes || "")}</textarea>
        </div>
        
        <button class="auth-btn" data-act="saveprofile" ${PROF.loading ? "disabled" : ""}>
          ${PROF.loading ? "Salvando..." : "💾 Salvar Alterações"}
        </button>
      </div>
    </div>
  `;
}