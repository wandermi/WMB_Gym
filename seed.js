// ===========================================
// PROTOCOLS CATALOG - Banco de Treinos
// ===========================================

const PROTOCOLS_CATALOG = {
  "protocolo_1": {
    id: "protocolo_1",
    name: "PROTOCOLO 1",
    goal: "Adaptação e Base",
    level: "Iniciante",
    cardio: "Realizar cardio de 20 a 30 minutos após o treino, caminhada moderada.",
    notes: [
      "Foque em aprender o movimento antes de aumentar a carga.",
      "Mantenha a postura e a respiração contínua.",
      "Descanse o tempo necessário para se sentir recuperado para a próxima série."
    ],
    workouts: [
      {
        letter: "A", name: "Treino A", sub: "Peito · Ombros · Tríceps", color: "#4A9EFF", icon: "🔵", position: 0,
        exercises: [
          { name: "Supino Reto na Máquina", sets: 3, reps: 15, rest: 90, position: 0, 
            instructions: "3 séries de 15 rep", muscles_primary: ["Peito"], muscles_secondary: ["Tríceps"], 
            steps: ["Sente na máquina com as costas bem apoiadas.", "Empurre as alças para frente até quase estender os braços.", "Retorne controlando o peso sem deixar as placas baterem."] },
          { name: "Voador Peitoral (Peck Deck)", sets: 3, reps: 15, rest: 90, position: 1, instructions: "3 séries de 15 rep", muscles_primary: ["Peito"] },
          { name: "Desenvolvimento na Máquina", sets: 3, reps: 15, rest: 90, position: 2, instructions: "3 séries de 15 rep", muscles_primary: ["Ombros"] },
          { name: "Elevação Lateral com Halteres", sets: 3, reps: 15, rest: 90, position: 3, instructions: "3 séries de 15 rep", muscles_primary: ["Ombros"] },
          { name: "Tríceps Pulley com Barra Reta", sets: 3, reps: 15, rest: 90, position: 4, instructions: "3 séries de 15 rep", muscles_primary: ["Tríceps"] }
        ]
      },
      {
        letter: "B", name: "Treino B", sub: "Costas · Bíceps · Abdômen", color: "#FF8F00", icon: "🟠", position: 1,
        exercises: [
          { name: "Puxada Alta pela Frente", sets: 3, reps: 15, rest: 90, position: 0, instructions: "3 séries de 15 rep", muscles_primary: ["Costas"], muscles_secondary: ["Bíceps"] },
          { name: "Remada Baixa na Máquina", sets: 3, reps: 15, rest: 90, position: 1, instructions: "3 séries de 15 rep", muscles_primary: ["Costas"] },
          { name: "Rosca Direta na Polia Baixa", sets: 3, reps: 15, rest: 90, position: 2, instructions: "3 séries de 15 rep", muscles_primary: ["Bíceps"] },
          { name: "Rosca Martelo com Halteres", sets: 3, reps: 15, rest: 90, position: 3, instructions: "3 séries de 15 rep", muscles_primary: ["Bíceps"] },
          { name: "Abdominal Máquina ou Polia", sets: 3, reps: 15, rest: 60, position: 4, instructions: "3 séries de 15 rep", muscles_primary: ["Abdômen"] }
        ]
      },
      {
        letter: "C", name: "Treino C", sub: "Pernas · Panturrilha", color: "#00FF00", icon: "🟢", position: 2,
        exercises: [
          { name: "Leg Press 45", sets: 3, reps: 15, rest: 90, position: 0, instructions: "3 séries de 15 rep", muscles_primary: ["Quadríceps", "Glúteos"] },
          { name: "Cadeira Extensora", sets: 3, reps: 15, rest: 90, position: 1, instructions: "3 séries de 15 rep", muscles_primary: ["Quadríceps"] },
          { name: "Cadeira Flexora", sets: 3, reps: 15, rest: 90, position: 2, instructions: "3 séries de 15 rep", muscles_primary: ["Isquiotibiais"] },
          { name: "Cadeira Abdutora", sets: 3, reps: 15, rest: 60, position: 3, instructions: "3 séries de 15 rep", muscles_primary: ["Glúteos"] },
          { name: "Panturrilha no Leg Press", sets: 3, reps: 15, rest: 60, position: 4, instructions: "3 séries de 15 rep", muscles_primary: ["Panturrilha"] }
        ]
      }
    ]
  },
  
  "protocolo_2": {
    id: "protocolo_2",
    name: "PROTOCOLO 2",
    goal: "Hipertrofia",
    level: "Intermediário",
    cardio: "Realizar cardio em todos os treinos de 20 a 40 minutos, na esteira com inclinação ou na bike",
    notes: [
      "Tirar fotos de comparações no início e final de ciclo",
      "Mantenha a postura em todos os movimentos sem perder a intensidade",
      "Movimentos sempre controlados",
      "Realize contrações excêntricas sempre com calma e respeitando a velocidade",
      "Se esforçar ao máximo que puder sempre e respeitar sinais de fadiga e lesão",
      "Treinar sempre no máximo da intensidade que o número de repetições pedir"
    ],
    workouts: [
      {
        letter: "A", name: "Treino A", sub: "Peito · Ombros · Tríceps", color: "#FF3D00", icon: "🔴", position: 0,
        exercises: [
          { is_mobility: true, name: "Alongamento de Dorsal", sets: 2, reps: 15, rest: 30, duration_sec: 15, position: 0 },
          { is_mobility: true, name: "Alongamento de Peitoral no Espaldar", sets: 2, reps: 15, rest: 30, duration_sec: 15, position: 1 },
          { name: "Supino Inclinado com Halteres", sets: 4, reps: 15, rest: 90, position: 2, 
            instructions: "4 séries de 15 rep", muscles_primary: ["Peito"], muscles_secondary: ["Tríceps", "Ombros"], 
            steps: ["Banco inclinado a 30-45°. Halteres na altura do peito superior, palmas viradas para frente.", "Desça os halteres de forma controlada até sentir o peito superior alongar bem.", "Pressione para cima e ligeiramente para dentro, sem travar os cotovelos no topo."] },
          { name: "Supino Reto com Halteres", sets: 3, reps: 15, rest: 90, position: 3, 
            instructions: "3 séries de 15 rep", muscles_primary: ["Peito"], muscles_secondary: ["Tríceps"], 
            steps: ["Deite no banco plano. Halteres na altura do peito, palmas viradas para frente.", "Desça os halteres lentamente até a linha do peito, cotovelos a ~45° do tronco.", "Empurre para cima até quase estender os braços, sentindo a contração do peito."] },
          { name: "Crossover Polia Alta", sets: 4, reps: 15, rest: 90, method: "drop_set", position: 4, 
            instructions: "3 séries de 15 rep\n1 série de 15 rep + DROP", muscles_primary: ["Peito"], muscles_secondary: ["Ombros"], 
            steps: ["Posicione-se entre as polias, peguem as alças com as mãos, um passo à frente. Tronco levemente inclinado.", "Puxe as alças em arco para baixo e à frente, mãos se encontrando na altura do quadril.", "Retorne controlado sentindo o peito alongar nos dois lados."] },
          { name: "Elevação Lateral com Halteres", sets: 4, reps: 15, rest: 90, method: "cluster_set", position: 5, 
            instructions: "3 séries de 15 rep\n1 série de CLUSTER-SET", muscles_primary: ["Ombros"], 
            steps: ["Em pé, halteres ao lado do corpo, cotovelos levemente flexionados.", "Eleve os braços lateralmente até a altura dos ombros, polegares ligeiramente para baixo.", "Desça de forma muito controlada. NADA de balanço — força só dos deltoides."] },
          { name: "Desenvolvimento Sentado com Halter", sets: 4, reps: 15, rest: 90, position: 6, 
            instructions: "4 séries de 15 rep", muscles_primary: ["Ombros"], muscles_secondary: ["Tríceps"], 
            steps: ["Sentado em banco com encosto. Halteres na altura dos ombros, palmas para frente.", "Pressione os halteres para cima até quase estender os braços (não bata os halteres no topo).", "Desça controlado até a altura das orelhas para máxima amplitude."] },
          { name: "Tríceps Testa com Halteres", sets: 4, reps: 15, rest: 90, position: 7, 
            instructions: "4 séries de 15 rep\nUm halter em cada mão", muscles_primary: ["Tríceps"], 
            steps: ["Deitado no banco. Halteres acima do peito com braços estendidos, palmas voltadas uma para a outra.", "Dobre APENAS os cotovelos, descendo os halteres em direção às têmporas.", "Estenda os braços de volta usando só o tríceps. Cotovelos fixos apontando para o teto."] }
        ]
      },
      {
        letter: "B", name: "Treino B", sub: "Costas · Bíceps · Lombar", color: "#FF8F00", icon: "🟠", position: 1,
        exercises: [
          { is_warmup: true, name: "W com Elástico", sets: 1, reps: 15, rest: 30, position: 0 },
          { is_warmup: true, name: "Elevação Y com Halteres no Banco", sets: 2, reps: 15, rest: 30, position: 1 },
          { is_mobility: true, name: "Alongamento de Dorsal", sets: 1, reps: 15, rest: 30, duration_sec: 15, position: 2 },
          { name: "Pulldown Barra Reta", sets: 4, reps: 15, rest: 90, method: "backoff", position: 3, 
            instructions: "3 séries de 15 rep\n1 série de 15 rep + BACKOFF", muscles_primary: ["Costas"], 
            steps: ["Sentado na máquina, joelhos travados. Pegada pronada (palmas para frente), mais larga que ombros.", "Puxe a barra em direção ao peito, inclinando o tronco levemente para trás. Apertar as escápulas.", "Retorne controlado, deixando os braços estenderem completamente."] },
          { name: "Puxada Pulley Barra Aberta Pegada Pronada", sets: 4, reps: 15, rest: 90, position: 4, 
            instructions: "4 séries de 15 rep", muscles_primary: ["Costas"], 
            steps: ["Polia alta, pegada pronada na barra aberta. Mais larga que os ombros.", "Puxe a barra até o peito superior, mantendo o tronco firme.", "Retorne completamente, sentindo o latíssimo alongar."] },
          { name: "Remada Baixa Unilateral Neutra", sets: 4, reps: 15, rest: 90, position: 5, 
            instructions: "4 séries de 15 rep", muscles_primary: ["Costas"], 
            steps: ["Polia baixa, peguem a alça com pegada neutra (palma virada para dentro). Sentado ou em pé.", "Puxe a alça em direção ao quadril, cotovelo próximo ao corpo. Apertar as escápulas no final.", "Retorne completamente, alongando a musculatura das costas."] },
          { name: "Pullface Corda na Polia", sets: 3, reps: 15, rest: 90, position: 6, 
            instructions: "3 séries de 15 rep", muscles_primary: ["Ombros"], muscles_secondary: ["Costas"], 
            steps: ["Polia na altura do rosto. Pegue a corda com pegada pronada (polegares para cima).", "Puxe a corda em direção ao rosto, separando as pontas e levando os cotovelos para fora.", "Mantenha 1 segundo na contração e retorne controlado."] },
          { name: "Rosca Direta com Halteres", sets: 3, reps: 15, rest: 90, method: "three_seven", position: 7, 
            instructions: "2 séries de 15 rep\n1 série de 3/7", muscles_primary: ["Bíceps"], 
            steps: ["Em pé, halteres ao lado do corpo, palmas viradas para frente.", "Flexione os cotovelos levando os halteres em direção aos ombros. Cotovelos colados ao tronco.", "Desça controlado SEM soltar bruscamente. Aproveite a fase excêntrica."] },
          { name: "Rosca Direta Banco Inclinado", sets: 3, reps: 15, rest: 90, position: 8, 
            instructions: "3 séries de 15 rep", muscles_primary: ["Bíceps"], 
            steps: ["Sentado em banco inclinado a ~60°. Braços pendurados ao lado do corpo, palmas para frente.", "Flexione os cotovelos levando os halteres em direção aos ombros. Cotovelos NÃO se movem para frente.", "Desça controlado até o alongamento completo do bíceps."] },
          { name: "Hiperextensão de Lombar Solo", sets: 3, reps: 15, rest: 60, position: 9, 
            instructions: "3 séries de 15 rep", muscles_primary: ["Lombar"], muscles_secondary: ["Glúteos"], 
            steps: ["Deite de bruços no chão ou banco romano. Mãos atrás da cabeça ou cruzadas no peito.", "Eleve o tronco do chão contraindo a lombar e glúteos. Não force hiperextensão.", "Desça controlado até a posição inicial."] }
        ]
      },
      {
        letter: "C", name: "Treino C", sub: "Posterior · Glúteo · Abdômen", color: "#FFD600", icon: "🟡", position: 2,
        exercises: [
          { is_mobility: true, name: "Alongamento Borboleta Deitado", sets: 1, reps: 15, rest: 30, duration_sec: 15, position: 0 },
          { is_mobility: true, name: "Alongamento de Piriforme e Glúteo Médio", sets: 1, reps: 15, rest: 30, duration_sec: 15, position: 1 },
          { is_mobility: true, name: "Alongamento de Iliopsoas e Reto Femoral", sets: 1, reps: 15, rest: 30, duration_sec: 15, position: 2 },
          { is_warmup: true, name: "Mobilidade de Quadril de Cócoras", sets: 2, reps: 10, rest: 30, position: 3 },
          { is_warmup: true, name: "Mobilidade de Tornozelo", sets: 2, reps: 10, rest: 30, position: 4 },
          { name: "Abdominal Supra Banco Declinado", sets: 3, reps: 15, rest: 90, position: 5, 
            instructions: "3 séries de 15 rep (segurar peso acima da linha da cabeça)", muscles_primary: ["Abdômen"], 
            steps: ["Deite no banco declinado, pés presos. Segure um peso acima da cabeça com braços estendidos.", "Eleve o tronco em direção aos joelhos contraindo o abdômen. Cabeça neutra.", "Desça lentamente sem deixar o peso da cabeça relaxar completamente."] },
          { name: "Abdominal Oblíquo Alternado", sets: 3, reps: 15, rest: 60, position: 6, 
            instructions: "3 séries de 15 rep cada lado", muscles_primary: ["Abdômen"], 
            steps: ["Deitado de costas, joelhos flexionados. Mãos atrás da cabeça.", "Eleve o tronco rotacionando, levando o cotovelo direito em direção ao joelho esquerdo.", "Volte e repita para o lado oposto. Alternar lado A e lado B."] },
          { name: "Cadeira Flexora", sets: 4, reps: 15, rest: 90, position: 7, 
            instructions: "4 séries de 15 rep", muscles_primary: ["Isquiotibiais"], 
            steps: ["Sente na máquina, apoio nas coxas. Rolo sobre os tornozelos, joelhos alinhados ao eixo.", "Flexione os joelhos puxando o rolo em direção ao glúteo, contraindo o posterior.", "Retorne lentamente em 3 segundos. NÃO deixe o peso bater."] },
          { name: "Leg Press 45", sets: 4, reps: 15, rest: 90, method: "cluster_set", position: 8, 
            instructions: "3 séries de 15 rep\n1 série de CLUSTER-SET", muscles_primary: ["Quadríceps", "Glúteos"], muscles_secondary: ["Isquiotibiais"], 
            steps: ["Sente na máquina, pés na plataforma na largura dos ombros. Solte a trava.", "Desça controlado até os joelhos chegarem a ~90°, sem perder contato lombar do apoio.", "Empurre forte sem travar completamente os joelhos no topo."] },
          { name: "Afundo no Smith", sets: 4, reps: 15, rest: 90, position: 9, 
            instructions: "4 séries de 15 rep\nDar intervalo de 20 seg entre as pernas", muscles_primary: ["Quadríceps", "Glúteos"], 
            steps: ["Posicione a barra do Smith nos ombros. Dê um passo grande à frente, pé traseiro apoiado na ponta.", "Desça flexionando ambos os joelhos até o joelho traseiro quase tocar o chão.", "Suba empurrando com o calcanhar da perna da frente. Complete todas reps de um lado antes de trocar."] },
          { name: "Mesa Flexora", sets: 3, reps: 15, rest: 90, method: "drop_set", position: 10, 
            instructions: "2 séries de 15 rep\n1 série de 15 rep + DROP", muscles_primary: ["Isquiotibiais"], 
            steps: ["Deite de bruços na máquina. Joelhos alinhados ao eixo, rolo no tendão de Aquiles.", "Flexione os joelhos puxando o rolo em direção aos glúteos.", "Retorne em 3 segundos controlando o peso. Não deixe estender 100%."] },
          { name: "Cadeira Abdutora 45 Graus", sets: 3, reps: 15, rest: 90, position: 11, 
            instructions: "3 séries de 15 rep", muscles_primary: ["Glúteos"], 
            steps: ["Sente na máquina com encosto reclinado a 45°. Almofadas na parte externa dos joelhos.", "Abra as pernas para fora contraindo os glúteos médios. Movimento controlado.", "Retorne sem deixar o peso bater. NÃO use impulso do tronco."] },
          { name: "Panturrilha no Leg Press Horizontal", sets: 4, reps: 15, rest: 90, position: 12, 
            instructions: "4 séries de 15 rep", muscles_primary: ["Panturrilha"], 
            steps: ["Posicione as pontas dos pés na base da plataforma. Calcanhares para fora.", "Desça os calcanhares o máximo possível alongando a panturrilha.", "Suba na ponta dos pés ao máximo, contraindo bem. Sem quicar."] }
        ]
      },
      {
        letter: "D", name: "Treino D", sub: "Ombros · Peito · Costas (Upper)", color: "#E040FB", icon: "🟣", position: 3,
        exercises: [
          { is_warmup: true, name: "Mobilidade de Ombro I", sets: 2, reps: 10, rest: 30, position: 0, instructions: "2 séries de 10 rep" },
          { is_warmup: true, name: "Mobilidade Torácica X", sets: 2, reps: 10, rest: 30, position: 1, instructions: "2 séries de 10 rep" },
          { name: "Elevação Lateral com Halteres", sets: 4, reps: 15, rest: 90, method: "cluster_set", position: 2, 
            instructions: "3 séries de 15 rep\n1 série de CLUSTER-SET", muscles_primary: ["Ombros"], 
            steps: ["Em pé, halteres ao lado do corpo, cotovelos levemente flexionados.", "Eleve os braços lateralmente até a altura dos ombros, polegares ligeiramente para baixo.", "Desça de forma muito controlada. NADA de balanço — força só dos deltoides."] },
          { name: "Desenvolvimento Sentado com Halter", sets: 4, reps: 15, rest: 90, position: 3, 
            instructions: "4 séries de 15 rep", muscles_primary: ["Ombros"], muscles_secondary: ["Tríceps"], 
            steps: ["Sentado em banco com encosto. Halteres na altura dos ombros, palmas para frente.", "Pressione os halteres para cima até quase estender os braços (não bata os halteres no topo).", "Desça controlado até a altura das orelhas para máxima amplitude."] },
          { name: "Supino Máquina (Pegada Pronada)", sets: 4, reps: 15, rest: 90, method: "cluster_set", position: 4, 
            instructions: "3 séries de 15 rep\n1 série de CLUSTER-SET", muscles_primary: ["Peito"], muscles_secondary: ["Tríceps", "Ombros"] },
          { name: "Pullover com Halteres", sets: 4, reps: 15, rest: 90, position: 5, 
            instructions: "4 séries de 15 rep", muscles_primary: ["Costas"], muscles_secondary: ["Peito"], 
            steps: ["Deite atravessado em um banco, apenas ombros apoiados. Halter segurado com as duas mãos acima do peito.", "Desça o halter em arco para trás da cabeça, cotovelos levemente flexionados.", "Retorne contraindo as costas (latíssimo) e o peito."] },
          { name: "Puxada Pulley Barra Aberta Pegada Supinada", sets: 4, reps: 15, rest: 90, method: "backoff", position: 6, 
            instructions: "3 séries de 15 rep\n1 série de 15 rep + BACKOFF", muscles_primary: ["Costas"], muscles_secondary: ["Bíceps"], 
            steps: ["Polia alta, pegada supinada (palmas para você) na barra aberta. Pegada na largura dos ombros.", "Puxe a barra até o peito superior. Tronco levemente inclinado para trás.", "Retorne controlado, alongando bem o latíssimo."] },
          { name: "Remada T", sets: 3, reps: 15, rest: 90, method: "backoff", position: 7, 
            instructions: "2 séries de 15 rep\n1 série de 15 rep + BACKOFF", muscles_primary: ["Costas"], 
            steps: ["Em pé, pés afastados na plataforma da máquina. Tronco inclinado a ~45°, costas retas.", "Puxe a barra T em direção ao peito/abdômen apertando bem as escápulas.", "Desça controlado até quase estender os braços."] },
          { name: "Tríceps Testa na Polia com Corda + Rosca Martelo na Polia (BISET)", sets: 3, reps: 15, rest: 90, method: "biset", position: 8, 
            instructions: "BISET:\nTríceps Testa: 3 séries de 15 rep\nRosca Martelo: 3 séries de 15 rep", muscles_primary: ["Tríceps", "Bíceps"] }
        ]
      },
      {
        letter: "E", name: "Treino E", sub: "Quadríceps · Posterior · Panturrilha", color: "#00BCD4", icon: "🔵", position: 4,
        exercises: [
          { is_mobility: true, name: "Alongamento de Piriforme e Glúteo Médio", sets: 1, reps: 15, rest: 30, duration_sec: 15, position: 0 },
          { is_mobility: true, name: "Alongamento Borboleta Deitado", sets: 1, reps: 15, rest: 30, duration_sec: 15, position: 1 },
          { is_mobility: true, name: "Alongamento de Iliopsoas e Reto Femoral", sets: 1, reps: 15, rest: 30, duration_sec: 15, position: 2 },
          { is_warmup: true, name: "Mobilidade de Quadril de Cócoras", sets: 2, reps: 10, rest: 30, position: 3 },
          { is_warmup: true, name: "Mobilidade de Tornozelo", sets: 2, reps: 10, rest: 30, position: 4 },
          { name: "Agachamento Smith", sets: 4, reps: 15, rest: 90, position: 5, 
            instructions: "4 séries de 15 rep", muscles_primary: ["Quadríceps", "Glúteos"], 
            steps: ["Posicione a barra do Smith nos trapézios. Pés na largura dos ombros, ligeiramente à frente da barra.", "Desça flexionando quadril e joelhos até as coxas ficarem paralelas ao solo.", "Suba empurrando o chão com os calcanhares, contraindo glúteos."] },
          { name: "Leg Press Horizontal Unilateral", sets: 3, reps: 15, rest: 90, position: 6, 
            instructions: "3 séries de 15 rep", muscles_primary: ["Quadríceps", "Glúteos"], 
            steps: ["Sente na máquina, apenas uma perna apoiada na plataforma, no centro.", "Desça controlado até o joelho chegar a ~90°. Sem deslocar o quadril.", "Empurre sem travar o joelho. Complete todas reps de uma perna antes de trocar."] },
          { name: "Cadeira Extensora", sets: 4, reps: 15, rest: 90, method: "drop_set", position: 7, 
            instructions: "3 séries de 15 rep\n1 série de 15 rep + DROP", muscles_primary: ["Quadríceps"], 
            steps: ["Ajuste o banco para o joelho alinhar ao eixo da máquina. Pés sob o rolo.", "Estenda os joelhos completamente, segurando 1 segundo no topo.", "Desça muito controlado em ~3 segundos. NÃO deixe estender 100% atrás."] },
          { name: "Stiff com Barra", sets: 3, reps: 15, rest: 90, position: 8, 
            instructions: "3 séries de 15 rep", muscles_primary: ["Isquiotibiais", "Glúteos"], 
            steps: ["Em pé, pés na largura do quadril. Barra na frente das coxas, joelhos levemente flexionados.", "Empurre o quadril para trás descendo a barra raspando as pernas. COSTAS RETAS sempre.", "Suba contraindo glúteos e isquiotibiais. A lombar NÃO faz o trabalho."] },
          { name: "Gêmeos Sentado", sets: 4, reps: 15, rest: 90, position: 9, 
            instructions: "4 séries de 15 rep", muscles_primary: ["Panturrilha"], 
            steps: ["Sente na máquina, almofada nas coxas próximo dos joelhos. Pontas dos pés na plataforma.", "Desça os calcanhares lentamente o máximo possível.", "Suba forte na ponta dos pés contraindo bem. Sem quicar."] },
          { name: "Panturrilha no Smith com Step", sets: 3, reps: 15, rest: 90, method: "drop_set", position: 10, 
            instructions: "2 séries de 15 rep\n1 série de 15 rep + DROP", muscles_primary: ["Panturrilha"], 
            steps: ["Posicione um step embaixo da barra Smith. Pontas dos pés no step, calcanhares fora.", "Desça os calcanhares lentamente alongando a panturrilha.", "Suba na ponta dos pés ao máximo contraindo bem."] }
        ]
      }
    ]
  },

  "protocolo_3": {
    id: "protocolo_3",
    name: "PROTOCOLO 3",
    goal: "Volume e Detalhamento",
    level: "Intermediário",
    cardio: "20 a 30 minutos de esteira ou bike (moderado) pós-treino.",
    notes: ["Foque na progressão de carga mantendo a execução perfeita."],
    workouts: [
      {
        letter: "A", name: "Treino A", sub: "Peito · Tríceps", color: "#4A9EFF", icon: "🔵", position: 0,
        exercises: [
          { name: "Supino Reto com Barra", sets: 4, reps: 15, rest: 90, position: 0, muscles_primary: ["Peito"] },
          { name: "Supino Inclinado com Halteres", sets: 3, reps: 15, rest: 90, position: 1, muscles_primary: ["Peito"] },
          { name: "Voador Peitoral (Peck Deck)", sets: 4, reps: 15, rest: 90, position: 2, muscles_primary: ["Peito"] },
          { name: "Tríceps Testa com Barra W", sets: 4, reps: 15, rest: 90, position: 3, muscles_primary: ["Tríceps"] },
          { name: "Tríceps Polia com Barra Reta", sets: 3, reps: 15, rest: 90, method: "drop_set", position: 4, muscles_primary: ["Tríceps"] }
        ]
      },
      {
        letter: "B", name: "Treino B", sub: "Costas · Bíceps", color: "#FF8F00", icon: "🟠", position: 1,
        exercises: [
          { name: "Puxada Alta Pegada Pronada", sets: 4, reps: 15, rest: 90, position: 0, muscles_primary: ["Costas"] },
          { name: "Remada Curvada com Barra", sets: 4, reps: 15, rest: 90, position: 1, muscles_primary: ["Costas"] },
          { name: "Remada Unilateral com Halter (Serrote)", sets: 3, reps: 15, rest: 90, position: 2, muscles_primary: ["Costas"] },
          { name: "Rosca Direta com Barra", sets: 4, reps: 15, rest: 90, position: 3, muscles_primary: ["Bíceps"] },
          { name: "Rosca Scott na Máquina", sets: 3, reps: 15, rest: 90, method: "drop_set", position: 4, muscles_primary: ["Bíceps"] }
        ]
      },
      {
        letter: "C", name: "Treino C", sub: "Pernas Completas", color: "#00FF00", icon: "🟢", position: 2,
        exercises: [
          { name: "Agachamento no Smith", sets: 4, reps: 15, rest: 120, position: 0, muscles_primary: ["Quadríceps", "Glúteos"] },
          { name: "Leg Press 45", sets: 4, reps: 15, rest: 120, position: 1, muscles_primary: ["Quadríceps"] },
          { name: "Cadeira Extensora", sets: 4, reps: 15, rest: 90, position: 2, muscles_primary: ["Quadríceps"] },
          { name: "Mesa Flexora", sets: 4, reps: 15, rest: 90, position: 3, muscles_primary: ["Isquiotibiais"] },
          { name: "Panturrilha no Smith com Step", sets: 4, reps: 15, rest: 60, position: 4, muscles_primary: ["Panturrilha"] }
        ]
      },
      {
        letter: "D", name: "Treino D", sub: "Ombros · Abdômen", color: "#E040FB", icon: "🟣", position: 3,
        exercises: [
          { name: "Desenvolvimento com Halteres", sets: 4, reps: 15, rest: 90, position: 0, muscles_primary: ["Ombros"] },
          { name: "Elevação Lateral com Halteres", sets: 4, reps: 15, rest: 90, position: 1, muscles_primary: ["Ombros"] },
          { name: "Crucifixo Invertido na Máquina", sets: 3, reps: 15, rest: 90, position: 2, muscles_primary: ["Ombros"] },
          { name: "Abdominal Supra na Máquina", sets: 4, reps: 15, rest: 60, position: 3, muscles_primary: ["Abdômen"] },
          { name: "Abdominal Polia Alta (Crunch)", sets: 3, reps: 15, rest: 60, position: 4, muscles_primary: ["Abdômen"] }
        ]
      }
    ]
  },

  "protocolo_4": {
    id: "protocolo_4",
    name: "PROTOCOLO 4",
    goal: "Intensidade e Falha",
    level: "Avançado",
    cardio: "20 minutos de HIIT ou 40 minutos moderado na esteira.",
    notes: ["O músculo é treinado apenas uma vez na semana com intensidade máxima."],
    workouts: [
      {
        letter: "A", name: "Treino A", sub: "Peito", color: "#FF3D00", icon: "🔴", position: 0,
        exercises: [
          { name: "Supino Inclinado com Halteres", sets: 4, reps: 15, rest: 120, position: 0, muscles_primary: ["Peito"] },
          { name: "Supino Reto na Máquina", sets: 4, reps: 15, rest: 90, position: 1, muscles_primary: ["Peito"] },
          { name: "Crossover Polia Média", sets: 4, reps: 15, rest: 90, position: 2, muscles_primary: ["Peito"] },
          { name: "Voador Peitoral (Peck Deck)", sets: 3, reps: 15, rest: 90, method: "drop_set", position: 3, muscles_primary: ["Peito"] }
        ]
      },
      {
        letter: "B", name: "Treino B", sub: "Costas", color: "#FF8F00", icon: "🟠", position: 1,
        exercises: [
          { name: "Puxada Alta Pegada Supinada", sets: 4, reps: 15, rest: 120, position: 0, muscles_primary: ["Costas"] },
          { name: "Remada T Máquina", sets: 4, reps: 15, rest: 90, position: 1, muscles_primary: ["Costas"] },
          { name: "Remada Baixa com Triângulo", sets: 4, reps: 15, rest: 90, position: 2, muscles_primary: ["Costas"] },
          { name: "Pulldown com Corda", sets: 3, reps: 15, rest: 90, method: "drop_set", position: 3, muscles_primary: ["Costas"] }
        ]
      },
      {
        letter: "C", name: "Treino C", sub: "Pernas (Foco Quadríceps)", color: "#00FF00", icon: "🟢", position: 2,
        exercises: [
          { name: "Agachamento no Smith", sets: 4, reps: 15, rest: 120, position: 0, muscles_primary: ["Quadríceps"] },
          { name: "Leg Press 45", sets: 4, reps: 15, rest: 120, position: 1, muscles_primary: ["Quadríceps"] },
          { name: "Passada no Smith", sets: 3, reps: 15, rest: 90, position: 2, muscles_primary: ["Quadríceps", "Glúteos"] },
          { name: "Cadeira Extensora", sets: 4, reps: 15, rest: 90, method: "drop_set", position: 3, muscles_primary: ["Quadríceps"] }
        ]
      },
      {
        letter: "D", name: "Treino D", sub: "Ombros e Braços", color: "#E040FB", icon: "🟣", position: 3,
        exercises: [
          { name: "Desenvolvimento na Máquina", sets: 4, reps: 15, rest: 90, position: 0, muscles_primary: ["Ombros"] },
          { name: "Elevação Lateral com Halteres", sets: 4, reps: 15, rest: 90, method: "drop_set", position: 1, muscles_primary: ["Ombros"] },
          { name: "Tríceps Corda na Polia", sets: 4, reps: 15, rest: 90, position: 2, muscles_primary: ["Tríceps"] },
          { name: "Rosca Direta com Halteres", sets: 4, reps: 15, rest: 90, position: 3, muscles_primary: ["Bíceps"] },
          { name: "Rosca Martelo com Corda na Polia", sets: 3, reps: 15, rest: 90, position: 4, muscles_primary: ["Bíceps"] }
        ]
      },
      {
        letter: "E", name: "Treino E", sub: "Posterior e Panturrilha", color: "#00BCD4", icon: "🔵", position: 4,
        exercises: [
          { name: "Stiff com Barra", sets: 4, reps: 15, rest: 120, position: 0, muscles_primary: ["Isquiotibiais"] },
          { name: "Mesa Flexora", sets: 4, reps: 15, rest: 90, position: 1, muscles_primary: ["Isquiotibiais"] },
          { name: "Cadeira Flexora", sets: 3, reps: 15, rest: 90, method: "drop_set", position: 2, muscles_primary: ["Isquiotibiais"] },
          { name: "Cadeira Abdutora", sets: 4, reps: 15, rest: 60, position: 3, muscles_primary: ["Glúteos"] },
          { name: "Panturrilha Sentado (Máquina)", sets: 5, reps: 15, rest: 60, position: 4, muscles_primary: ["Panturrilha"] }
        ]
      }
    ]
  },

  "protocolo_5": {
    id: "protocolo_5",
    name: "PROTOCOLO 5",
    goal: "Especialização e Detalhamento",
    level: "Avançado",
    cardio: "30 minutos de cardio moderado 4x na semana.",
    notes: ["Uso intenso de máquinas para manter a tensão constante no músculo."],
    workouts: [
      {
        letter: "A", name: "Treino A", sub: "Peito e Costas (Força)", color: "#FF3D00", icon: "🔴", position: 0,
        exercises: [
          { name: "Supino Reto com Halteres", sets: 4, reps: 15, rest: 120, position: 0, muscles_primary: ["Peito"] },
          { name: "Puxada Alta Pegada Larga", sets: 4, reps: 15, rest: 120, position: 1, muscles_primary: ["Costas"] },
          { name: "Supino Inclinado na Máquina", sets: 4, reps: 15, rest: 90, position: 2, muscles_primary: ["Peito"] },
          { name: "Remada Curvada com Barra", sets: 4, reps: 15, rest: 90, position: 3, muscles_primary: ["Costas"] }
        ]
      },
      {
        letter: "B", name: "Treino B", sub: "Pernas (Foco Anterior)", color: "#00FF00", icon: "🟢", position: 1,
        exercises: [
          { name: "Agachamento no Smith", sets: 4, reps: 15, rest: 120, position: 0, muscles_primary: ["Quadríceps"] },
          { name: "Leg Press 45", sets: 4, reps: 15, rest: 120, position: 1, muscles_primary: ["Quadríceps"] },
          { name: "Cadeira Extensora", sets: 4, reps: 15, rest: 90, method: "cluster_set", position: 2, muscles_primary: ["Quadríceps"] }
        ]
      },
      {
        letter: "C", name: "Treino C", sub: "Braços Completos", color: "#4A9EFF", icon: "🔵", position: 2,
        exercises: [
          { name: "Rosca Direta com Barra W", sets: 4, reps: 15, rest: 90, position: 0, muscles_primary: ["Bíceps"] },
          { name: "Tríceps Testa com Barra W", sets: 4, reps: 15, rest: 90, position: 1, muscles_primary: ["Tríceps"] },
          { name: "Rosca Scott na Máquina", sets: 3, reps: 15, rest: 90, position: 2, muscles_primary: ["Bíceps"] },
          { name: "Tríceps Polia Corda", sets: 3, reps: 15, rest: 90, position: 3, muscles_primary: ["Tríceps"] }
        ]
      },
      {
        letter: "D", name: "Treino D", sub: "Ombros Isolados", color: "#E040FB", icon: "🟣", position: 3,
        exercises: [
          { name: "Desenvolvimento com Halteres", sets: 4, reps: 15, rest: 90, position: 0, muscles_primary: ["Ombros"] },
          { name: "Elevação Lateral na Polia", sets: 4, reps: 15, rest: 60, position: 1, muscles_primary: ["Ombros"] },
          { name: "Crucifixo Invertido com Halteres", sets: 4, reps: 15, rest: 60, position: 2, muscles_primary: ["Ombros"] },
          { name: "Encolhimento de Ombros no Smith", sets: 4, reps: 15, rest: 60, position: 3, muscles_primary: ["Trapézio"] }
        ]
      },
      {
        letter: "E", name: "Treino E", sub: "Peito e Costas (Pump/Isolamento)", color: "#FF8F00", icon: "🟠", position: 4,
        exercises: [
          { name: "Voador Peitoral", sets: 4, reps: 15, rest: 60, position: 0, muscles_primary: ["Peito"] },
          { name: "Pulldown com Corda", sets: 4, reps: 15, rest: 60, position: 1, muscles_primary: ["Costas"] },
          { name: "Crossover Polia Alta", sets: 3, reps: 15, rest: 60, position: 2, muscles_primary: ["Peito"] },
          { name: "Remada Baixa Polia", sets: 3, reps: 15, rest: 60, position: 3, muscles_primary: ["Costas"] }
        ]
      },
      {
        letter: "F", name: "Treino F", sub: "Posterior e Panturrilha", color: "#00BCD4", icon: "🔵", position: 5,
        exercises: [
          { name: "Stiff com Halteres", sets: 4, reps: 15, rest: 90, position: 0, muscles_primary: ["Isquiotibiais"] },
          { name: "Mesa Flexora", sets: 4, reps: 15, rest: 90, method: "drop_set", position: 1, muscles_primary: ["Isquiotibiais"] },
          { name: "Panturrilha no Leg Press", sets: 5, reps: 15, rest: 60, position: 2, muscles_primary: ["Panturrilha"] },
          { name: "Panturrilha Sentado", sets: 4, reps: 15, rest: 60, position: 3, muscles_primary: ["Panturrilha"] }
        ]
      }
    ]
  },

  "protocolo_6": {
    id: "protocolo_6",
    name: "PROTOCOLO 6 — PPL",
    goal: "Hipertrofia (Push/Pull/Legs)",
    level: "Intermediário",
    cardio: "Cardio opcional 20-30min ao final do treino (esteira inclinada ou bike). Em dias de pernas, prefira esteira plana.",
    notes: [
      "Divisão: Seg/Sex = Push, Ter/Sáb = Pull, Qui/Dom = Legs, Qua = descanso total.",
      "Trabalhe próximo à falha nas últimas séries (RIR 1-2). Não falhe na primeira série.",
      "Faixas de reps são intencionais: respeite-as e suba carga quando bater o topo da faixa em todas as séries (dupla progressão).",
      "Aqueça com 1-2 séries leves do primeiro exercício de cada grupo muscular antes das séries valendo."
    ],
    workouts: [
      {
        letter: "A", name: "Treino A", sub: "PUSH · Peito · Ombros · Tríceps", color: "#4A9EFF", icon: "💪", position: 0,
        exercises: [
          { name: "Supino Inclinado com Halteres", sets: 4, reps: "8 a 10", rest: 90, position: 0,
            instructions: "4 séries de 8 a 10 reps — foco em peito superior",
            muscles_primary: ["Peito"], muscles_secondary: ["Ombros", "Tríceps"],
            steps: ["Banco inclinado 30-45°, halteres na altura do peito com punhos pronados.", "Empurre até quase estender os cotovelos, sem travar.", "Desça controlado até sentir alongamento no peito superior."] },
          { name: "Supino Reto na Barra", sets: 3, reps: "8 a 12", rest: 90, position: 1,
            instructions: "3 séries de 8 a 12 reps — foco em peito geral",
            muscles_primary: ["Peito"], muscles_secondary: ["Tríceps", "Ombros"],
            steps: ["Deite no banco, pegada um pouco mais aberta que os ombros, barra na linha do peito.", "Desça a barra controlado até tocar o peitoral.", "Empurre de volta sem travar os cotovelos no topo."] },
          { name: "Crossover na Polia", sets: 3, reps: "12 a 15", rest: 60, position: 2,
            instructions: "3 séries de 12 a 15 reps — isolador de peito",
            muscles_primary: ["Peito"],
            steps: ["Em pé entre as polias altas, leve inclinação do tronco à frente.", "Traga as mãos cruzando à frente do corpo na linha do umbigo.", "Volte controlado sentindo o alongamento do peito."] },
          { name: "Desenvolvimento com Halteres", sets: 3, reps: "8 a 12", rest: 90, position: 3,
            instructions: "3 séries de 8 a 12 reps — ombro anterior e médio",
            muscles_primary: ["Ombros"], muscles_secondary: ["Tríceps"],
            steps: ["Sentado, halteres na altura dos ombros com palmas pra frente.", "Empurre os halteres acima da cabeça sem travar os cotovelos.", "Desça controlado até a posição inicial."] },
          { name: "Elevação Lateral na Polia ou Halter", sets: 4, reps: "12 a 15", rest: 60, position: 4,
            instructions: "4 séries de 12 a 15 reps — largura do ombro",
            muscles_primary: ["Ombros"],
            steps: ["Halter em uma das mãos, leve flexão no cotovelo.", "Eleve o braço lateralmente até a altura do ombro.", "Desça lento, sem balanço."] },
          { name: "Tríceps Polia Alta com Corda", sets: 3, reps: "10 a 12", rest: 60, position: 5,
            instructions: "3 séries de 10 a 12 reps",
            muscles_primary: ["Tríceps"],
            steps: ["Em pé de frente para a polia, cotovelos colados ao tronco.", "Estenda os cotovelos abrindo as cordas no final do movimento.", "Volte controlado até formar 90° no cotovelo."] },
          { name: "Tríceps Testa com Barra W", sets: 3, reps: "10 a 12", rest: 60, position: 6,
            instructions: "3 séries de 10 a 12 reps",
            muscles_primary: ["Tríceps"],
            steps: ["Deitado no banco, segure a barra W com pegada estreita acima do peito.", "Desça flexionando apenas os cotovelos até a barra ficar próxima à testa.", "Estenda os cotovelos voltando à posição inicial."] }
        ]
      },
      {
        letter: "B", name: "Treino B", sub: "PULL · Costas · Bíceps · Post. Ombro", color: "#FF8F00", icon: "🦅", position: 1,
        exercises: [
          { name: "Puxada Alta Aberta no Pulley", sets: 4, reps: "10 a 12", rest: 90, position: 0,
            instructions: "4 séries de 10 a 12 reps — largura das costas",
            muscles_primary: ["Costas"], muscles_secondary: ["Bíceps"],
            steps: ["Sentado, pegada aberta pronada na barra reta.", "Puxe a barra em direção à parte superior do peito, escápulas retraídas.", "Volte controlado até estender quase totalmente os braços."] },
          { name: "Remada Curvada com Barra", sets: 3, reps: "8 a 10", rest: 90, position: 1,
            instructions: "3 séries de 8 a 10 reps — espessura das costas",
            muscles_primary: ["Costas"], muscles_secondary: ["Bíceps"],
            steps: ["Em pé, tronco inclinado a ~45°, joelhos semiflexionados, barra pendurada.", "Puxe a barra em direção ao umbigo levando os cotovelos para trás.", "Desça controlado mantendo a coluna neutra."] },
          { name: "Remada Unilateral com Halter (Serrote)", sets: 3, reps: "10 a 12", rest: 60, position: 2,
            instructions: "3 séries de 10 a 12 reps por lado",
            muscles_primary: ["Costas"], muscles_secondary: ["Bíceps"],
            steps: ["Apoie um joelho e uma mão no banco, halter na outra mão pendurado.", "Puxe o halter próximo ao quadril levando o cotovelo para trás.", "Desça lento controlando o peso até estender o braço."] },
          { name: "Crucifixo Invertido com Halteres", sets: 4, reps: "12 a 15", rest: 60, position: 3,
            instructions: "4 séries de 12 a 15 reps — posterior de ombro",
            muscles_primary: ["Ombros"], muscles_secondary: ["Costas"],
            steps: ["Tronco inclinado à frente, halteres pendurados com leve flexão de cotovelo.", "Abra os braços lateralmente até a altura dos ombros, escápulas se aproximando.", "Desça controlado sem balanço."] },
          { name: "Rosca Direta com Barra W", sets: 3, reps: "10 a 12", rest: 60, position: 4,
            instructions: "3 séries de 10 a 12 reps — bíceps geral",
            muscles_primary: ["Bíceps"],
            steps: ["Em pé, pegada na barra W com palmas pra cima, cotovelos colados ao tronco.", "Flexione os cotovelos subindo a barra até a altura dos ombros.", "Desça controlado até estender quase totalmente os braços."] },
          { name: "Rosca Alternada no Banco Inclinado", sets: 3, reps: "10 a 12", rest: 60, position: 5,
            instructions: "3 séries de 10 a 12 reps por braço — cabeça longa do bíceps",
            muscles_primary: ["Bíceps"],
            steps: ["Sentado em banco inclinado, braços pendurados ao lado do corpo.", "Flexione um cotovelo girando o punho para supinação no caminho.", "Desça controlado e alterne o lado."] },
          { name: "Rosca Martelo com Halteres", sets: 3, reps: "12", rest: 60, position: 6,
            instructions: "3 séries de 12 reps — braquial e antebraço",
            muscles_primary: ["Bíceps"],
            steps: ["Em pé, halteres ao lado do corpo com palmas voltadas para dentro (pegada neutra).", "Flexione os cotovelos mantendo a pegada neutra durante todo movimento.", "Desça controlado sem balanço do tronco."] }
        ]
      },
      {
        letter: "C", name: "Treino C", sub: "LEGS · Pernas e Abdômen", color: "#00FF00", icon: "🍗", position: 2,
        exercises: [
          { name: "Agachamento Livre ou no Smith", sets: 4, reps: "8 a 10", rest: 120, position: 0,
            instructions: "4 séries de 8 a 10 reps — quadríceps e glúteos",
            muscles_primary: ["Quadríceps", "Glúteos"], muscles_secondary: ["Isquiotibiais"],
            steps: ["Barra apoiada nos trapézios, pés na largura dos ombros, pontas levemente abertas.", "Desça empurrando o quadril para trás até as coxas ficarem paralelas ao chão.", "Suba empurrando o chão, sem travar os joelhos no topo."] },
          { name: "Leg Press 45°", sets: 4, reps: "10 a 12", rest: 90, position: 1,
            instructions: "4 séries de 10 a 12 reps — coxas gerais",
            muscles_primary: ["Quadríceps", "Glúteos"], muscles_secondary: ["Isquiotibiais"],
            steps: ["Sentado no leg press com pés afastados na largura dos ombros, joelhos alinhados aos pés.", "Desça o peso flexionando joelhos até ~90°, sem perder o contato lombar.", "Empurre de volta sem travar os joelhos no topo."] },
          { name: "Cadeira Extensora", sets: 3, reps: "12 a 15", rest: 60, position: 2,
            instructions: "3 séries de 12 a 15 reps — isolador de quadríceps",
            muscles_primary: ["Quadríceps"],
            steps: ["Sentado, ajuste o encosto e o apoio dos tornozelos.", "Estenda os joelhos totalmente fazendo a contração no topo.", "Desça controlado sem deixar o peso bater."] },
          { name: "Stiff com Halteres ou Barra", sets: 3, reps: "10 a 12", rest: 90, position: 3,
            instructions: "3 séries de 10 a 12 reps — posterior e glúteos",
            muscles_primary: ["Isquiotibiais", "Glúteos"],
            steps: ["Em pé, halteres ou barra à frente do corpo, joelhos levemente flexionados.", "Empurre o quadril para trás descendo o peso pela frente das pernas.", "Suba contraindo glúteos e posterior, sem hiperextender a lombar."] },
          { name: "Cadeira ou Mesa Flexora", sets: 4, reps: "10 a 12", rest: 60, position: 4,
            instructions: "4 séries de 10 a 12 reps — isolador de posterior",
            muscles_primary: ["Isquiotibiais"],
            steps: ["Ajuste o apoio na altura dos tornozelos (na flexora deitada, no calcanhar).", "Flexione os joelhos puxando o peso até o final do movimento.", "Desça controlado sem deixar o peso bater nas placas."] },
          { name: "Panturrilha em Pé na Máquina", sets: 4, reps: "15 a 20", rest: 60, position: 5,
            instructions: "4 séries de 15 a 20 reps",
            muscles_primary: ["Panturrilha"],
            steps: ["Em pé na máquina, pontas dos pés na plataforma com calcanhares no ar.", "Suba na ponta dos pés fazendo a contração máxima no topo.", "Desça controlado alongando a panturrilha no final."] },
          { name: "Abdominal Infra (Elevação de Pernas)", sets: 3, reps: "15", rest: 60, position: 6,
            instructions: "3 séries de 15 reps — abdômen inferior",
            muscles_primary: ["Abdômen"],
            steps: ["Pendurado na barra fixa ou apoiado no banco romano, pernas estendidas para baixo.", "Eleve as pernas mantendo joelhos retos ou levemente flexionados até 90°.", "Desça controlado sem usar balanço."] },
          { name: "Abdominal Supra (Crunch)", sets: 3, reps: "15", rest: 60, position: 7,
            instructions: "3 séries de 15 reps — abdômen superior",
            muscles_primary: ["Abdômen"],
            steps: ["Deitado de costas, joelhos flexionados, mãos ao lado da cabeça (sem puxar o pescoço).", "Eleve o tronco contraindo o abdômen até a escápula sair do chão.", "Desça controlado sem deitar totalmente."] }
        ]
      }
    ],
    schedule_default: { 0: "C", 1: "A", 2: "B", 3: null, 4: "C", 5: "A", 6: "B" }
  }
};