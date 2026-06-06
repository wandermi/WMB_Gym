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
        letter: "A",
        name: "Treino A",
        sub: "Peito · Ombros · Tríceps",
        color: "#4A9EFF",
        icon: "🔵",
        position: 0,
        exercises: [
          { name: "Supino Reto na Máquina", sets: 3, reps: 12, rest: 90, position: 0,
            instructions: "3 séries de 10 a 12 rep",
            muscles_primary: ["Peito"], muscles_secondary: ["Tríceps"],
            steps: ["Sente na máquina com as costas bem apoiadas.", "Empurre as alças para frente até quase estender os braços.", "Retorne controlando o peso sem deixar as placas baterem."] },
          { name: "Voador Peitoral (Peck Deck)", sets: 3, reps: 12, rest: 90, position: 1, instructions: "3 séries de 10 a 12 rep", muscles_primary: ["Peito"] },
          { name: "Desenvolvimento na Máquina", sets: 3, reps: 12, rest: 90, position: 2, instructions: "3 séries de 10 a 12 rep", muscles_primary: ["Ombros"] },
          { name: "Elevação Lateral com Halteres", sets: 3, reps: 12, rest: 90, position: 3, instructions: "3 séries de 10 a 12 rep", muscles_primary: ["Ombros"] },
          { name: "Tríceps Pulley com Barra Reta", sets: 3, reps: 12, rest: 90, position: 4, instructions: "3 séries de 10 a 12 rep", muscles_primary: ["Tríceps"] }
        ]
      },
      {
        letter: "B",
        name: "Treino B",
        sub: "Costas · Bíceps · Abdômen",
        color: "#FF8F00",
        icon: "🟠",
        position: 1,
        exercises: [
          { name: "Puxada Alta pela Frente", sets: 3, reps: 12, rest: 90, position: 0, instructions: "3 séries de 10 a 12 rep", muscles_primary: ["Costas"], muscles_secondary: ["Bíceps"] },
          { name: "Remada Baixa na Máquina", sets: 3, reps: 12, rest: 90, position: 1, instructions: "3 séries de 10 a 12 rep", muscles_primary: ["Costas"] },
          { name: "Rosca Direta na Polia Baixa", sets: 3, reps: 12, rest: 90, position: 2, instructions: "3 séries de 10 a 12 rep", muscles_primary: ["Bíceps"] },
          { name: "Rosca Martelo com Halteres", sets: 3, reps: 12, rest: 90, position: 3, instructions: "3 séries de 10 a 12 rep", muscles_primary: ["Bíceps"] },
          { name: "Abdominal Máquina ou Polia", sets: 3, reps: 15, rest: 60, position: 4, instructions: "3 séries de 12 a 15 rep", muscles_primary: ["Abdômen"] }
        ]
      },
      {
        letter: "C",
        name: "Treino C",
        sub: "Pernas · Panturrilha",
        color: "#00FF00",
        icon: "🟢",
        position: 2,
        exercises: [
          { name: "Leg Press 45", sets: 3, reps: 12, rest: 90, position: 0, instructions: "3 séries de 10 a 12 rep", muscles_primary: ["Quadríceps", "Glúteos"] },
          { name: "Cadeira Extensora", sets: 3, reps: 12, rest: 90, position: 1, instructions: "3 séries de 10 a 12 rep", muscles_primary: ["Quadríceps"] },
          { name: "Cadeira Flexora", sets: 3, reps: 12, rest: 90, position: 2, instructions: "3 séries de 10 a 12 rep", muscles_primary: ["Isquiotibiais"] },
          { name: "Cadeira Abdutora", sets: 3, reps: 12, rest: 60, position: 3, instructions: "3 séries de 10 a 12 rep", muscles_primary: ["Glúteos"] },
          { name: "Panturrilha no Leg Press", sets: 3, reps: 15, rest: 60, position: 4, instructions: "3 séries de 12 a 15 rep", muscles_primary: ["Panturrilha"] }
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
      "Treinar sempre no máximo da intensidade que o número de repetições pedir"
    ],
    workouts: [
      {
        letter: "A",
        name: "Treino A",
        sub: "Peito · Ombros · Tríceps",
        color: "#FF3D00",
        icon: "🔴",
        position: 0,
        exercises: [
          { is_mobility: true, name: "Alongamento de Dorsal", sets: 2, reps: 15, rest: 30, duration_sec: 15, position: 0 },
          { is_mobility: true, name: "Alongamento de Peitoral", sets: 2, reps: 15, rest: 30, duration_sec: 15, position: 1 },
          { name: "Supino Inclinado com Halteres", sets: 4, reps: 8, rest: 90, position: 2, muscles_primary: ["Peito"] },
          { name: "Supino Reto com Halteres", sets: 3, reps: 8, rest: 90, position: 3, muscles_primary: ["Peito"] },
          { name: "Crossover Polia Alta", sets: 4, reps: 10, rest: 90, method: "drop_set", position: 4, muscles_primary: ["Peito"] },
          { name: "Elevação Lateral com Halteres", sets: 4, reps: 10, rest: 90, method: "cluster_set", position: 5, muscles_primary: ["Ombros"] },
          { name: "Desenvolvimento Sentado com Halter", sets: 4, reps: 8, rest: 90, position: 6, muscles_primary: ["Ombros"] },
          { name: "Tríceps Testa com Halteres", sets: 4, reps: 10, rest: 90, position: 7, muscles_primary: ["Tríceps"] }
        ]
      },
      {
        letter: "B",
        name: "Treino B",
        sub: "Costas · Bíceps · Lombar",
        color: "#FF8F00",
        icon: "🟠",
        position: 1,
        exercises: [
          { name: "Pulldown Barra Reta", sets: 4, reps: 10, rest: 90, method: "backoff", position: 0, muscles_primary: ["Costas"] },
          { name: "Puxada Pulley Barra Aberta Pegada Pronada", sets: 4, reps: 10, rest: 90, position: 1, muscles_primary: ["Costas"] },
          { name: "Remada Baixa Unilateral Neutra", sets: 4, reps: 10, rest: 90, position: 2, muscles_primary: ["Costas"] },
          { name: "Pullface Corda na Polia", sets: 3, reps: 10, rest: 90, position: 3, muscles_primary: ["Ombros", "Costas"] },
          { name: "Rosca Direta com Halteres", sets: 3, reps: 10, rest: 90, method: "three_seven", position: 4, muscles_primary: ["Bíceps"] },
          { name: "Rosca Direta Banco Inclinado", sets: 3, reps: 10, rest: 90, position: 5, muscles_primary: ["Bíceps"] },
          { name: "Hiperextensão de Lombar Solo", sets: 3, reps: 12, rest: 60, position: 6, muscles_primary: ["Lombar"] }
        ]
      },
      {
        letter: "C",
        name: "Treino C",
        sub: "Posterior · Glúteo · Abdômen",
        color: "#FFD600",
        icon: "🟡",
        position: 2,
        exercises: [
          { name: "Abdominal Supra Banco Declinado", sets: 3, reps: 12, rest: 90, position: 0, muscles_primary: ["Abdômen"] },
          { name: "Abdominal Oblíquo Alternado", sets: 3, reps: 12, rest: 60, position: 1, muscles_primary: ["Abdômen"] },
          { name: "Cadeira Flexora", sets: 4, reps: 10, rest: 90, position: 2, muscles_primary: ["Isquiotibiais"] },
          { name: "Leg Press 45", sets: 4, reps: 10, rest: 90, method: "cluster_set", position: 3, muscles_primary: ["Quadríceps"] },
          { name: "Afundo no Smith", sets: 4, reps: 8, rest: 90, position: 4, muscles_primary: ["Quadríceps", "Glúteos"] },
          { name: "Mesa Flexora", sets: 3, reps: 8, rest: 90, method: "drop_set", position: 5, muscles_primary: ["Isquiotibiais"] },
          { name: "Cadeira Abdutora 45 Graus", sets: 3, reps: 10, rest: 90, position: 6, muscles_primary: ["Glúteos"] },
          { name: "Panturrilha no Leg Press Horizontal", sets: 4, reps: 10, rest: 90, position: 7, muscles_primary: ["Panturrilha"] }
        ]
      },
      {
        letter: "D",
        name: "Treino D",
        sub: "Ombros · Peito · Costas (Upper)",
        color: "#E040FB",
        icon: "🟣",
        position: 3,
        exercises: [
          { name: "Elevação Lateral com Halteres", sets: 4, reps: 10, rest: 90, method: "cluster_set", position: 0, muscles_primary: ["Ombros"] },
          { name: "Desenvolvimento Sentado com Halter", sets: 4, reps: 8, rest: 90, position: 1, muscles_primary: ["Ombros"] },
          { name: "Supino Máquina (Pegada Pronada)", sets: 4, reps: 10, rest: 90, method: "cluster_set", position: 2, muscles_primary: ["Peito"] },
          { name: "Pullover com Halteres", sets: 4, reps: 10, rest: 90, position: 3, muscles_primary: ["Costas"] },
          { name: "Puxada Pulley Barra Aberta Supinada", sets: 4, reps: 10, rest: 90, method: "backoff", position: 4, muscles_primary: ["Costas"] },
          { name: "Remada T", sets: 3, reps: 8, rest: 90, method: "backoff", position: 5, muscles_primary: ["Costas"] },
          { name: "Tríceps Testa Polia + Rosca Martelo Polia", sets: 3, reps: 10, rest: 90, method: "biset", position: 6, muscles_primary: ["Tríceps", "Bíceps"] }
        ]
      },
      {
        letter: "E",
        name: "Treino E",
        sub: "Quadríceps · Posterior · Panturrilha",
        color: "#00BCD4",
        icon: "🔵",
        position: 4,
        exercises: [
          { name: "Agachamento Smith", sets: 4, reps: 10, rest: 90, position: 0, muscles_primary: ["Quadríceps"] },
          { name: "Leg Press Horizontal Unilateral", sets: 3, reps: 8, rest: 90, position: 1, muscles_primary: ["Quadríceps"] },
          { name: "Cadeira Extensora", sets: 4, reps: 10, rest: 90, method: "drop_set", position: 2, muscles_primary: ["Quadríceps"] },
          { name: "Stiff com Barra", sets: 3, reps: 10, rest: 90, position: 3, muscles_primary: ["Isquiotibiais"] },
          { name: "Gêmeos Sentado", sets: 4, reps: 10, rest: 90, position: 4, muscles_primary: ["Panturrilha"] },
          { name: "Panturrilha no Smith com Step", sets: 3, reps: 12, rest: 90, method: "drop_set", position: 5, muscles_primary: ["Panturrilha"] }
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
    notes: [
      "Foque na progressão de carga mantendo a execução perfeita.",
      "Comece a explorar a falha muscular nas últimas séries de cada exercício."
    ],
    workouts: [
      {
        letter: "A", name: "Treino A", sub: "Peito · Tríceps", color: "#4A9EFF", icon: "🔵", position: 0,
        exercises: [
          { name: "Supino Reto com Barra", sets: 4, reps: 10, rest: 90, position: 0, muscles_primary: ["Peito"] },
          { name: "Supino Inclinado com Halteres", sets: 3, reps: 10, rest: 90, position: 1, muscles_primary: ["Peito"] },
          { name: "Voador Peitoral (Peck Deck)", sets: 4, reps: 12, rest: 90, position: 2, muscles_primary: ["Peito"] },
          { name: "Tríceps Testa com Barra W", sets: 4, reps: 10, rest: 90, position: 3, muscles_primary: ["Tríceps"] },
          { name: "Tríceps Polia com Barra Reta", sets: 3, reps: 12, rest: 90, method: "drop_set", position: 4, muscles_primary: ["Tríceps"] }
        ]
      },
      {
        letter: "B", name: "Treino B", sub: "Costas · Bíceps", color: "#FF8F00", icon: "🟠", position: 1,
        exercises: [
          { name: "Puxada Alta Pegada Pronada", sets: 4, reps: 10, rest: 90, position: 0, muscles_primary: ["Costas"] },
          { name: "Remada Curvada com Barra", sets: 4, reps: 10, rest: 90, position: 1, muscles_primary: ["Costas"] },
          { name: "Remada Unilateral com Halter (Serrote)", sets: 3, reps: 10, rest: 90, position: 2, muscles_primary: ["Costas"] },
          { name: "Rosca Direta com Barra", sets: 4, reps: 10, rest: 90, position: 3, muscles_primary: ["Bíceps"] },
          { name: "Rosca Scott na Máquina", sets: 3, reps: 12, rest: 90, method: "drop_set", position: 4, muscles_primary: ["Bíceps"] }
        ]
      },
      {
        letter: "C", name: "Treino C", sub: "Pernas Completas", color: "#00FF00", icon: "🟢", position: 2,
        exercises: [
          { name: "Agachamento no Smith", sets: 4, reps: 10, rest: 120, position: 0, muscles_primary: ["Quadríceps", "Glúteos"] },
          { name: "Leg Press 45", sets: 4, reps: 10, rest: 120, position: 1, muscles_primary: ["Quadríceps"] },
          { name: "Cadeira Extensora", sets: 4, reps: 12, rest: 90, position: 2, muscles_primary: ["Quadríceps"] },
          { name: "Mesa Flexora", sets: 4, reps: 12, rest: 90, position: 3, muscles_primary: ["Isquiotibiais"] },
          { name: "Panturrilha no Smith com Step", sets: 4, reps: 15, rest: 60, position: 4, muscles_primary: ["Panturrilha"] }
        ]
      },
      {
        letter: "D", name: "Treino D", sub: "Ombros · Abdômen", color: "#E040FB", icon: "🟣", position: 3,
        exercises: [
          { name: "Desenvolvimento com Halteres", sets: 4, reps: 10, rest: 90, position: 0, muscles_primary: ["Ombros"] },
          { name: "Elevação Lateral com Halteres", sets: 4, reps: 12, rest: 90, position: 1, muscles_primary: ["Ombros"] },
          { name: "Crucifixo Invertido na Máquina", sets: 3, reps: 12, rest: 90, position: 2, muscles_primary: ["Ombros"] },
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
    notes: [
      "Divisão ABCDE: O músculo é treinado apenas uma vez na semana com intensidade máxima.",
      "Controle extremo na fase excêntrica (descida do peso)."
    ],
    workouts: [
      {
        letter: "A", name: "Treino A", sub: "Peito", color: "#FF3D00", icon: "🔴", position: 0,
        exercises: [
          { name: "Supino Inclinado com Halteres", sets: 4, reps: 8, rest: 120, position: 0, muscles_primary: ["Peito"] },
          { name: "Supino Reto na Máquina", sets: 4, reps: 10, rest: 90, position: 1, muscles_primary: ["Peito"] },
          { name: "Crossover Polia Média", sets: 4, reps: 12, rest: 90, position: 2, muscles_primary: ["Peito"] },
          { name: "Voador Peitoral (Peck Deck)", sets: 3, reps: 12, rest: 90, method: "drop_set", position: 3, muscles_primary: ["Peito"] }
        ]
      },
      {
        letter: "B", name: "Treino B", sub: "Costas", color: "#FF8F00", icon: "🟠", position: 1,
        exercises: [
          { name: "Puxada Alta Pegada Supinada", sets: 4, reps: 8, rest: 120, position: 0, muscles_primary: ["Costas"] },
          { name: "Remada T Máquina", sets: 4, reps: 10, rest: 90, position: 1, muscles_primary: ["Costas"] },
          { name: "Remada Baixa com Triângulo", sets: 4, reps: 12, rest: 90, position: 2, muscles_primary: ["Costas"] },
          { name: "Pulldown com Corda", sets: 3, reps: 12, rest: 90, method: "drop_set", position: 3, muscles_primary: ["Costas"] }
        ]
      },
      {
        letter: "C", name: "Treino C", sub: "Pernas (Foco Quadríceps)", color: "#00FF00", icon: "🟢", position: 2,
        exercises: [
          { name: "Agachamento no Smith", sets: 4, reps: 8, rest: 120, position: 0, muscles_primary: ["Quadríceps"] },
          { name: "Leg Press 45", sets: 4, reps: 10, rest: 120, position: 1, muscles_primary: ["Quadríceps"] },
          { name: "Passada no Smith", sets: 3, reps: 10, rest: 90, position: 2, muscles_primary: ["Quadríceps", "Glúteos"] },
          { name: "Cadeira Extensora", sets: 4, reps: 12, rest: 90, method: "drop_set", position: 3, muscles_primary: ["Quadríceps"] }
        ]
      },
      {
        letter: "D", name: "Treino D", sub: "Ombros e Braços", color: "#E040FB", icon: "🟣", position: 3,
        exercises: [
          { name: "Desenvolvimento na Máquina", sets: 4, reps: 10, rest: 90, position: 0, muscles_primary: ["Ombros"] },
          { name: "Elevação Lateral com Halteres", sets: 4, reps: 12, rest: 90, method: "drop_set", position: 1, muscles_primary: ["Ombros"] },
          { name: "Tríceps Corda na Polia", sets: 4, reps: 12, rest: 90, position: 2, muscles_primary: ["Tríceps"] },
          { name: "Rosca Direta com Halteres", sets: 4, reps: 10, rest: 90, position: 3, muscles_primary: ["Bíceps"] },
          { name: "Rosca Martelo com Corda na Polia", sets: 3, reps: 12, rest: 90, position: 4, muscles_primary: ["Bíceps"] }
        ]
      },
      {
        letter: "E", name: "Treino E", sub: "Posterior e Panturrilha", color: "#00BCD4", icon: "🔵", position: 4,
        exercises: [
          { name: "Stiff com Barra", sets: 4, reps: 10, rest: 120, position: 0, muscles_primary: ["Isquiotibiais"] },
          { name: "Mesa Flexora", sets: 4, reps: 10, rest: 90, position: 1, muscles_primary: ["Isquiotibiais"] },
          { name: "Cadeira Flexora", sets: 3, reps: 12, rest: 90, method: "drop_set", position: 2, muscles_primary: ["Isquiotibiais"] },
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
    notes: [
      "Divisão ABCDEF: Foco em corrigir assimetrias musculares.",
      "Uso intenso de máquinas para manter a tensão constante no músculo."
    ],
    workouts: [
      {
        letter: "A", name: "Treino A", sub: "Peito e Costas (Força)", color: "#FF3D00", icon: "🔴", position: 0,
        exercises: [
          { name: "Supino Reto com Halteres", sets: 4, reps: 8, rest: 120, position: 0, muscles_primary: ["Peito"] },
          { name: "Puxada Alta Pegada Larga", sets: 4, reps: 8, rest: 120, position: 1, muscles_primary: ["Costas"] },
          { name: "Supino Inclinado na Máquina", sets: 4, reps: 10, rest: 90, position: 2, muscles_primary: ["Peito"] },
          { name: "Remada Curvada com Barra", sets: 4, reps: 10, rest: 90, position: 3, muscles_primary: ["Costas"] }
        ]
      },
      {
        letter: "B", name: "Treino B", sub: "Pernas (Foco Anterior)", color: "#00FF00", icon: "🟢", position: 1,
        exercises: [
          { name: "Agachamento no Smith", sets: 4, reps: 8, rest: 120, position: 0, muscles_primary: ["Quadríceps"] },
          { name: "Leg Press 45", sets: 4, reps: 10, rest: 120, position: 1, muscles_primary: ["Quadríceps"] },
          { name: "Cadeira Extensora", sets: 4, reps: 12, rest: 90, method: "cluster_set", position: 2, muscles_primary: ["Quadríceps"] }
        ]
      },
      {
        letter: "C", name: "Treino C", sub: "Braços Completos", color: "#4A9EFF", icon: "🔵", position: 2,
        exercises: [
          { name: "Rosca Direta com Barra W", sets: 4, reps: 10, rest: 90, position: 0, muscles_primary: ["Bíceps"] },
          { name: "Tríceps Testa com Barra W", sets: 4, reps: 10, rest: 90, position: 1, muscles_primary: ["Tríceps"] },
          { name: "Rosca Scott na Máquina", sets: 3, reps: 12, rest: 90, position: 2, muscles_primary: ["Bíceps"] },
          { name: "Tríceps Polia Corda", sets: 3, reps: 12, rest: 90, position: 3, muscles_primary: ["Tríceps"] }
        ]
      },
      {
        letter: "D", name: "Treino D", sub: "Ombros Isolados", color: "#E040FB", icon: "🟣", position: 3,
        exercises: [
          { name: "Desenvolvimento com Halteres", sets: 4, reps: 8, rest: 90, position: 0, muscles_primary: ["Ombros"] },
          { name: "Elevação Lateral na Polia", sets: 4, reps: 12, rest: 60, position: 1, muscles_primary: ["Ombros"] },
          { name: "Crucifixo Invertido com Halteres", sets: 4, reps: 12, rest: 60, position: 2, muscles_primary: ["Ombros"] },
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
          { name: "Stiff com Halteres", sets: 4, reps: 10, rest: 90, position: 0, muscles_primary: ["Isquiotibiais"] },
          { name: "Mesa Flexora", sets: 4, reps: 12, rest: 90, method: "drop_set", position: 1, muscles_primary: ["Isquiotibiais"] },
          { name: "Panturrilha no Leg Press", sets: 5, reps: 15, rest: 60, position: 2, muscles_primary: ["Panturrilha"] },
          { name: "Panturrilha Sentado", sets: 4, reps: 15, rest: 60, position: 3, muscles_primary: ["Panturrilha"] }
        ]
      }
    ]
  }
};