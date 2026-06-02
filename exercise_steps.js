// ===========================================
// EXERCISE STEPS - Passo a passo de execução
// ===========================================
// Adiciona descrição técnica de como fazer cada exercício
// Roda uma vez no login para atualizar exercícios sem steps

const EXERCISE_STEPS = {
  // ── TREINO A ──
  "Supino Inclinado com Halteres": [
    "Banco inclinado a 30-45°. Halteres na altura do peito superior, palmas viradas para frente.",
    "Desça os halteres de forma controlada até sentir o peito superior alongar bem.",
    "Pressione para cima e ligeiramente para dentro, sem travar os cotovelos no topo."
  ],
  "Supino Reto com Halteres": [
    "Deite no banco plano. Halteres na altura do peito, palmas viradas para frente.",
    "Desça os halteres lentamente até a linha do peito, cotovelos a ~45° do tronco.",
    "Empurre para cima até quase estender os braços, sentindo a contração do peito."
  ],
  "Crossover Polia Alta": [
    "Posicione-se entre as polias, peguem as alças com as mãos, um passo à frente. Tronco levemente inclinado.",
    "Puxe as alças em arco para baixo e à frente, mãos se encontrando na altura do quadril.",
    "Retorne controlado sentindo o peito alongar nos dois lados."
  ],
  "Elevação Lateral com Halteres": [
    "Em pé, halteres ao lado do corpo, cotovelos levemente flexionados.",
    "Eleve os braços lateralmente até a altura dos ombros, polegares ligeiramente para baixo.",
    "Desça de forma muito controlada. NADA de balanço — força só dos deltoides."
  ],
  "Desenvolvimento Sentado com Halter": [
    "Sentado em banco com encosto. Halteres na altura dos ombros, palmas para frente.",
    "Pressione os halteres para cima até quase estender os braços (não bata os halteres no topo).",
    "Desça controlado até a altura das orelhas para máxima amplitude."
  ],
  "Tríceps Testa com Halteres": [
    "Deitado no banco. Halteres acima do peito com braços estendidos, palmas voltadas uma para a outra.",
    "Dobre APENAS os cotovelos, descendo os halteres em direção às têmporas.",
    "Estenda os braços de volta usando só o tríceps. Cotovelos fixos apontando para o teto."
  ],
  
  // ── TREINO B ──
  "Pulldown Barra Reta": [
    "Sentado na máquina, joelhos travados. Pegada pronada (palmas para frente), mais larga que ombros.",
    "Puxe a barra em direção ao peito, inclinando o tronco levemente para trás. Apertar as escápulas.",
    "Retorne controlado, deixando os braços estenderem completamente."
  ],
  "Puxada Pulley Barra Aberta Pegada Pronada": [
    "Polia alta, pegada pronada na barra aberta. Mais larga que os ombros.",
    "Puxe a barra até o peito superior, mantendo o tronco firme.",
    "Retorne completamente, sentindo o latíssimo alongar."
  ],
  "Remada Baixa Unilateral Neutra": [
    "Polia baixa, peguem a alça com pegada neutra (palma virada para dentro). Sentado ou em pé.",
    "Puxe a alça em direção ao quadril, cotovelo próximo ao corpo. Apertar as escápulas no final.",
    "Retorne completamente, alongando a musculatura das costas."
  ],
  "Pullface Corda na Polia": [
    "Polia na altura do rosto. Pegue a corda com pegada pronada (polegares para cima).",
    "Puxe a corda em direção ao rosto, separando as pontas e levando os cotovelos para fora.",
    "Mantenha 1 segundo na contração e retorne controlado."
  ],
  "Rosca Direta com Halteres": [
    "Em pé, halteres ao lado do corpo, palmas viradas para frente.",
    "Flexione os cotovelos levando os halteres em direção aos ombros. Cotovelos colados ao tronco.",
    "Desça controlado SEM soltar bruscamente. Aproveite a fase excêntrica."
  ],
  "Rosca Direta Banco Inclinado": [
    "Sentado em banco inclinado a ~60°. Braços pendurados ao lado do corpo, palmas para frente.",
    "Flexione os cotovelos levando os halteres em direção aos ombros. Cotovelos NÃO se movem para frente.",
    "Desça controlado até o alongamento completo do bíceps."
  ],
  "Hiperextensão de Lombar Solo": [
    "Deite de bruços no chão ou banco romano. Mãos atrás da cabeça ou cruzadas no peito.",
    "Eleve o tronco do chão contraindo a lombar e glúteos. Não force hiperextensão.",
    "Desça controlado até a posição inicial."
  ],
  
  // ── TREINO C ──
  "Abdominal Supra Banco Declinado": [
    "Deite no banco declinado, pés presos. Segure um peso acima da cabeça com braços estendidos.",
    "Eleve o tronco em direção aos joelhos contraindo o abdômen. Cabeça neutra.",
    "Desça lentamente sem deixar o peso da cabeça relaxar completamente."
  ],
  "Abdominal Oblíquo Alternado": [
    "Deitado de costas, joelhos flexionados. Mãos atrás da cabeça.",
    "Eleve o tronco rotacionando, levando o cotovelo direito em direção ao joelho esquerdo.",
    "Volte e repita para o lado oposto. Alternar lado A e lado B."
  ],
  "Cadeira Flexora": [
    "Sente na máquina, apoio nas coxas. Rolo sobre os tornozelos, joelhos alinhados ao eixo.",
    "Flexione os joelhos puxando o rolo em direção ao glúteo, contraindo o posterior.",
    "Retorne lentamente em 3 segundos. NÃO deixe o peso bater."
  ],
  "Leg Press 45": [
    "Sente na máquina, pés na plataforma na largura dos ombros. Solte a trava.",
    "Desça controlado até os joelhos chegarem a ~90°, sem perder contato lombar do apoio.",
    "Empurre forte sem travar completamente os joelhos no topo."
  ],
  "Afundo no Smith": [
    "Posicione a barra do Smith nos ombros. Dê um passo grande à frente, pé traseiro apoiado na ponta.",
    "Desça flexionando ambos os joelhos até o joelho traseiro quase tocar o chão.",
    "Suba empurrando com o calcanhar da perna da frente. Complete todas reps de um lado antes de trocar."
  ],
  "Mesa Flexora": [
    "Deite de bruços na máquina. Joelhos alinhados ao eixo, rolo no tendão de Aquiles.",
    "Flexione os joelhos puxando o rolo em direção aos glúteos.",
    "Retorne em 3 segundos controlando o peso. Não deixe estender 100%."
  ],
  "Cadeira Abdutora 45 Graus": [
    "Sente na máquina com encosto reclinado a 45°. Almofadas na parte externa dos joelhos.",
    "Abra as pernas para fora contraindo os glúteos médios. Movimento controlado.",
    "Retorne sem deixar o peso bater. NÃO use impulso do tronco."
  ],
  "Panturrilha no Leg Press Horizontal": [
    "Posicione as pontas dos pés na base da plataforma. Calcanhares para fora.",
    "Desça os calcanhares o máximo possível alongando a panturrilha.",
    "Suba na ponta dos pés ao máximo, contraindo bem. Sem quicar."
  ],
  
  // ── TREINO D ──
  "Supino Maquina (Pegada Pronada)": [
    "Sente na máquina de supino, pegada pronada (palmas para baixo) nas alças.",
    "Empurre as alças para frente, estendendo os braços. Sentir o peito trabalhar.",
    "Retorne controlado até as alças chegarem próximas ao peito."
  ],
  "Pullover com Halteres": [
    "Deite atravessado em um banco, apenas ombros apoiados. Halter segurado com as duas mãos acima do peito.",
    "Desça o halter em arco para trás da cabeça, cotovelos levemente flexionados.",
    "Retorne contraindo as costas (latíssimo) e o peito."
  ],
  "Puxada Pulley Barra Aberta Pegada Supinada": [
    "Polia alta, pegada supinada (palmas para você) na barra aberta. Pegada na largura dos ombros.",
    "Puxe a barra até o peito superior. Tronco levemente inclinado para trás.",
    "Retorne controlado, alongando bem o latíssimo."
  ],
  "Remada T": [
    "Em pé, pés afastados na plataforma da máquina. Tronco inclinado a ~45°, costas retas.",
    "Puxe a barra T em direção ao peito/abdômen apertando bem as escápulas.",
    "Desça controlado até quase estender os braços."
  ],
  "Tríceps Testa na Polia com Corda + Rosca Martelo na Polia com Corda (BISET)": [
    "TRÍCEPS TESTA: Polia alta. Em pé de costas para a polia, corda acima da cabeça. Estenda os braços.",
    "ROSCA MARTELO: Polia baixa. De frente para a polia. Flexione os cotovelos puxando a corda em direção ao queixo.",
    "FAZER OS 2 EM SEQUÊNCIA SEM DESCANSO. Descanso só ao final do biset."
  ],
  
  // ── TREINO E ──
  "Agachamento Smith": [
    "Posicione a barra do Smith nos trapézios. Pés na largura dos ombros, ligeiramente à frente da barra.",
    "Desça flexionando quadril e joelhos até as coxas ficarem paralelas ao solo.",
    "Suba empurrando o chão com os calcanhares, contraindo glúteos."
  ],
  "Leg Press Horizontal Unilateral": [
    "Sente na máquina, apenas uma perna apoiada na plataforma, no centro.",
    "Desça controlado até o joelho chegar a ~90°. Sem deslocar o quadril.",
    "Empurre sem travar o joelho. Complete todas reps de uma perna antes de trocar."
  ],
  "Cadeira Extensora": [
    "Ajuste o banco para o joelho alinhar ao eixo da máquina. Pés sob o rolo.",
    "Estenda os joelhos completamente, segurando 1 segundo no topo.",
    "Desça muito controlado em ~3 segundos. NÃO deixe estender 100% atrás."
  ],
  "Stiff com Barra": [
    "Em pé, pés na largura do quadril. Barra na frente das coxas, joelhos levemente flexionados.",
    "Empurre o quadril para trás descendo a barra raspando as pernas. COSTAS RETAS sempre.",
    "Suba contraindo glúteos e isquiotibiais. A lombar NÃO faz o trabalho."
  ],
  "Gêmeos Sentado": [
    "Sente na máquina, almofada nas coxas próximo dos joelhos. Pontas dos pés na plataforma.",
    "Desça os calcanhares lentamente o máximo possível.",
    "Suba forte na ponta dos pés contraindo bem. Sem quicar."
  ],
  "Panturrilha no Smith com Step": [
    "Posicione um step embaixo da barra Smith. Pontas dos pés no step, calcanhares fora.",
    "Desça os calcanhares lentamente alongando a panturrilha.",
    "Suba na ponta dos pés ao máximo contraindo bem."
  ]
};

// Função para atualizar exercícios sem steps no banco
async function updateExerciseSteps() {
  if (!APP.user) return;
  
  // Buscar exercícios do usuário que não têm steps preenchidos
  const { data: workouts, error } = await sb.from("workouts")
    .select("id, exercises(id, name, steps)")
    .eq("user_id", APP.user.id);
  
  if (error || !workouts) { console.error(error); return; }
  
  let updatedCount = 0;
  
  for (const wo of workouts) {
    if (!wo.exercises) continue;
    
    for (const ex of wo.exercises) {
      // Pula se já tem steps preenchidos
      if (ex.steps && ex.steps.length > 0) continue;
      
      // Procura nos steps definidos (match exato pelo nome)
      const steps = EXERCISE_STEPS[ex.name];
      if (!steps) continue;
      
      const { error: upErr } = await sb.from("exercises")
        .update({ steps })
        .eq("id", ex.id);
      
      if (!upErr) updatedCount++;
    }
  }
  
  if (updatedCount > 0) {
    console.log(`✓ ${updatedCount} exercícios atualizados com passo a passo`);
    await loadWorkouts(); // Recarrega para refletir mudanças
  }
}
