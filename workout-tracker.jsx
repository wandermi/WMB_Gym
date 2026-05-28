import { useState, useEffect, useRef } from "react";

const MC = {"Peito":"#FF6B6B","Tríceps":"#FFA07A","Ombros":"#FFD700","Costas":"#4ECDC4","Bíceps":"#45B7D1","Antebraço":"#74B9FF","Quadríceps":"#A29BFE","Isquiotibiais":"#DDA0DD","Glúteos":"#F0A500","Panturrilha":"#81ECEC","Core":"#55EFC4"};

const WORKOUTS = [
  { id:"T1", label:"Treino 1", sub:"Push A — Peito · Ombros · Tríceps", color:"#FF3D00", icon:"🔴",
    exercises:[
      { name:"Supino Reto c/ Barra", sets:4, reps:"8–10", rest:90, tip:"Desça até tocar o peito, subida explosiva",
        muscles:{primary:["Peito"],secondary:["Tríceps","Ombros"]},
        steps:["Deite no banco, barra na linha do peito. Pegada levemente mais larga que os ombros.","Desça a barra de forma controlada até tocar levemente o peito — não quique.","Empurre explosivamente sem travar os cotovelos no topo."],
        ytQuery:"supino reto barra como fazer academia" },
      { name:"Supino Inclinado c/ Halteres", sets:3, reps:"10–12", rest:75, tip:"Banco 30–45°, cotovelos levemente fechados",
        muscles:{primary:["Peito"],secondary:["Tríceps","Ombros"]},
        steps:["Banco inclinado a 30–45°. Halteres na altura do peito superior.","Desça os halteres controlado até sentir o peito superior alongar.","Pressione para cima e levemente para dentro."],
        ytQuery:"supino inclinado haltere como fazer" },
      { name:"Crucifixo c/ Halteres", sets:3, reps:"12–15", rest:60, tip:"Leve flexão no cotovelo, sinta o alongamento",
        muscles:{primary:["Peito"],secondary:["Ombros"]},
        steps:["Deite no banco plano, halteres acima do peito, cotovelos levemente dobrados.","Abra os braços em arco até sentir o peito alongar bem.","Feche os braços como se abraçasse uma árvore grande."],
        ytQuery:"crucifixo haltere banco como fazer" },
      { name:"Desenvolvimento Militar c/ Barra", sets:4, reps:"8–10", rest:90, tip:"Core firme, sem hiperestender a lombar",
        muscles:{primary:["Ombros"],secondary:["Tríceps"]},
        steps:["Sentado, barra na frente na altura do peito, pegada na largura dos ombros.","Empurre a barra para cima até os braços estenderem acima da cabeça.","Desça de forma controlada até a altura do queixo."],
        ytQuery:"desenvolvimento militar barra como fazer ombros" },
      { name:"Elevação Lateral c/ Haltere", sets:4, reps:"12–15", rest:60, tip:"Cotovelo levemente dobrado, sem balançar o tronco",
        muscles:{primary:["Ombros"],secondary:[]},
        steps:["Em pé, halteres ao lado do corpo.","Levante os braços para os lados até ficarem paralelos ao chão.","Desça de forma controlada. Nada de balanço."],
        ytQuery:"elevação lateral haltere ombros como fazer" },
      { name:"Tríceps Pulley — corda", sets:4, reps:"10–12", rest:60, tip:"Abra a corda no final, cotovelos fixos ao corpo",
        muscles:{primary:["Tríceps"],secondary:[]},
        steps:["Polia alta. Cotovelos colados ao corpo segurando a corda.","Empurre para baixo até os braços estenderem. Abra as pontas.","Volte controlado — só os antebraços se movem."],
        ytQuery:"triceps pulley corda como fazer" },
    ]},
  { id:"T2", label:"Treino 2", sub:"Pull A — Costas · Bíceps", color:"#FF8F00", icon:"🟠",
    exercises:[
      { name:"Puxada Frontal — pegada larga", sets:4, reps:"8–10", rest:90, tip:"Cotovelos apontam para baixo, puxe até o peito",
        muscles:{primary:["Costas"],secondary:["Bíceps"]},
        steps:["Polia alta, pegada mais larga que os ombros, palmas para frente.","Puxe a barra até o peito, inclinando levemente o tronco.","Retorne controlado, braços estendendo completamente."],
        ytQuery:"puxada frontal pegada larga como fazer" },
      { name:"Remada Curvada c/ Barra", sets:4, reps:"8–10", rest:90, tip:"Tronco ~45°, puxe até o umbigo",
        muscles:{primary:["Costas"],secondary:["Bíceps","Ombros"]},
        steps:["Incline o tronco a ~45° com joelhos levemente dobrados. Barra na largura dos ombros.","Puxe a barra até o umbigo, apertando as escápulas no final.","Desça controlado mantendo o tronco firme."],
        ytQuery:"remada curvada barra como fazer" },
      { name:"Remada Unilateral c/ Haltere", sets:3, reps:"10–12", rest:75, tip:"Rotação leve do tronco no final da puxada",
        muscles:{primary:["Costas"],secondary:["Bíceps"]},
        steps:["Apoie joelho e mão do mesmo lado no banco. Halter na outra mão.","Puxe o halter em direção ao quadril, cotovelo próximo ao corpo.","Desça completamente, sentindo o alongamento da costas."],
        ytQuery:"remada unilateral haltere como fazer" },
      { name:"Pull-over c/ Haltere", sets:3, reps:"12–15", rest:60, tip:"Sinta o latíssimo alongar completamente",
        muscles:{primary:["Costas"],secondary:["Peito"]},
        steps:["Deite transversalmente no banco, ombros apoiados. Halter com as duas mãos acima do peito.","Desça o halter para trás da cabeça em arco, cotovelos levemente dobrados.","Retorne contraindo costas e peito."],
        ytQuery:"pullover haltere banco como fazer" },
      { name:"Rosca Direta c/ Barra EZ", sets:4, reps:"8–10", rest:60, tip:"Cotovelos fixos, sem balançar o tronco",
        muscles:{primary:["Bíceps"],secondary:["Antebraço"]},
        steps:["Em pé, barra EZ com pegada supinada. Cotovelos colados ao corpo.","Dobre os cotovelos levantando a barra até próximo dos ombros.","Desça de forma controlada, sem soltar bruscamente."],
        ytQuery:"rosca direta barra EZ como fazer" },
      { name:"Rosca Martelo c/ Haltere", sets:3, reps:"10–12", rest:60, tip:"Palmas para dentro durante todo o movimento",
        muscles:{primary:["Bíceps"],secondary:["Antebraço"]},
        steps:["Em pé, halteres ao lado com palmas voltadas para o corpo.","Levante um halter de cada vez sem rodar o punho.","Desça controlado antes de subir o outro lado."],
        ytQuery:"rosca martelo haltere como fazer biceps" },
    ]},
  { id:"T3", label:"Treino 3", sub:"Legs A — Quadríceps · Glúteos", color:"#FFD600", icon:"🟡",
    exercises:[
      { name:"Hack Squat na Máquina", sets:4, reps:"8–10", rest:120, tip:"Costas na plataforma, amplitude total",
        muscles:{primary:["Quadríceps","Glúteos"],secondary:["Isquiotibiais"]},
        steps:["Apoie as costas e ombros na plataforma. Pés na largura dos ombros, levemente abertos.","Desça até as coxas ficarem paralelas ou abaixo.","Empurre a plataforma para cima sem travar os joelhos."],
        ytQuery:"hack squat máquina como usar correto" },
      { name:"Leg Press 45°", sets:4, reps:"10–12", rest:90, tip:"Não trave os joelhos, não levante o quadril",
        muscles:{primary:["Quadríceps","Glúteos"],secondary:["Isquiotibiais"]},
        steps:["Pés na plataforma na largura dos ombros. Solte o trava.","Desça até os joelhos chegarem a ~90°.","Empurre sem bloquear completamente os joelhos."],
        ytQuery:"leg press 45 como fazer correto" },
      { name:"Cadeira Extensora", sets:3, reps:"12–15", rest:60, tip:"Pause 1s no topo — máximo pico de contração",
        muscles:{primary:["Quadríceps"],secondary:[]},
        steps:["Ajuste para o joelho alinhar ao eixo. Pés sob o rolo.","Estenda as pernas completamente para cima.","Segure 1s no topo, desça lentamente até ~90°."],
        ytQuery:"cadeira extensora como usar quadríceps" },
      { name:"Mesa Flexora Deitada", sets:3, reps:"12–15", rest:60, tip:"Descida lenta 3s — isso constrói mais do que a subida",
        muscles:{primary:["Isquiotibiais"],secondary:["Panturrilha"]},
        steps:["Deite no aparelho, joelhos alinhados ao eixo, rolo sob os tornozelos.","Dobre os joelhos puxando em direção ao glúteo com força.","Desça de forma muito lenta — conte 3 segundos."],
        ytQuery:"mesa flexora isquiotibial como usar" },
      { name:"Stiff c/ Halteres", sets:3, reps:"10–12", rest:75, tip:"Costas retas — a lombar não faz o trabalho",
        muscles:{primary:["Isquiotibiais","Glúteos"],secondary:["Costas"]},
        steps:["Em pé, halteres na frente das coxas, joelhos levemente dobrados.","Incline o tronco para frente com as costas retas, descendo os halteres.","Suba usando glúteo e posterior da coxa."],
        ytQuery:"stiff haltere como fazer isquiotibial" },
      { name:"Panturrilha em Pé — Smith ou Máquina", sets:4, reps:"15–20", rest:45, tip:"Amplitude máxima — suba e desça completamente",
        muscles:{primary:["Panturrilha"],secondary:[]},
        steps:["Pontas dos pés em borda de degrau ou apoio. Barra nos ombros (ou máquina específica).","Desça o calcanhar o máximo possível.","Suba na ponta dos pés o mais alto possível. Sem quicar."],
        ytQuery:"panturrilha em pé smith como fazer academia" },
    ]},
  { id:"T4", label:"Treino 4", sub:"Push B — Peito · Ombros · Tríceps", color:"#E040FB", icon:"🟣",
    exercises:[
      { name:"Supino Declinado c/ Halteres", sets:4, reps:"8–10", rest:90, tip:"Banco –15°/–30°, foca o peito inferior",
        muscles:{primary:["Peito"],secondary:["Tríceps","Ombros"]},
        steps:["Banco em declive (~15–30°). Halteres na linha do peito inferior.","Desça os halteres controlado sentindo o peito inferior alongar.","Pressione para cima e levemente para dentro."],
        ytQuery:"supino declinado haltere como fazer peito inferior" },
      { name:"Crossover na Polia", sets:3, reps:"12–15", rest:60, tip:"Mãos se encontram na frente — não nos cotovelos",
        muscles:{primary:["Peito"],secondary:["Ombros"]},
        steps:["Polias altas nos dois lados. Fique no centro, um passo à frente.","Puxe os cabos em arco para baixo e frente, mãos se encontrando.","Retorne controlado sentindo o peito alongar nos dois lados."],
        ytQuery:"crossover polia alta peito como fazer" },
      { name:"Crucifixo Inclinado c/ Halteres", sets:3, reps:"12–15", rest:60, tip:"Banco 30°, foca o peito superior",
        muscles:{primary:["Peito"],secondary:["Ombros"]},
        steps:["Banco inclinado a 30°. Halteres acima do peito superior, cotovelos levemente dobrados.","Abra os braços em arco até sentir o peito superior alongar.","Feche os braços de volta contraindo o peito."],
        ytQuery:"crucifixo inclinado haltere peito superior como fazer" },
      { name:"Desenvolvimento c/ Halteres", sets:4, reps:"10–12", rest:75, tip:"Maior amplitude que a barra — mais ativação",
        muscles:{primary:["Ombros"],secondary:["Tríceps"]},
        steps:["Sentado, halteres na altura dos ombros, palmas para frente.","Pressione para cima até os braços estenderem.","Desça até abaixo das orelhas para máxima amplitude."],
        ytQuery:"desenvolvimento haltere ombros como fazer" },
      { name:"Elevação Frontal c/ Haltere", sets:3, reps:"12–15", rest:60, tip:"Alternado, sem balançar o tronco",
        muscles:{primary:["Ombros"],secondary:[]},
        steps:["Em pé, halteres na frente das coxas.","Levante um braço à frente até a altura dos ombros.","Desça controlado antes de subir o outro lado."],
        ytQuery:"elevação frontal haltere ombros como fazer" },
      { name:"Tríceps Testa c/ Barra EZ", sets:3, reps:"10–12", rest:60, tip:"Só os antebraços se movem — cotovelos fixos",
        muscles:{primary:["Tríceps"],secondary:[]},
        steps:["Deite no banco, barra EZ acima da testa com braços estendidos.","Dobre apenas os cotovelos descendo a barra em direção à testa.","Estenda de volta. Cotovelos apontam para o teto o tempo todo."],
        ytQuery:"triceps testa barra EZ como fazer" },
    ]},
  { id:"T5", label:"Treino 5", sub:"Pull B — Costas · Bíceps", color:"#00BCD4", icon:"🔵",
    exercises:[
      { name:"Puxada c/ Pegada Supinada", sets:4, reps:"8–10", rest:90, tip:"Pegada fechada, bíceps mais ativo",
        muscles:{primary:["Costas"],secondary:["Bíceps"]},
        steps:["Polia alta, pegada supinada (palmas para você), fechada.","Puxe até o peito, inclinando levemente o tronco.","Retorne controlado, braços estendendo completamente."],
        ytQuery:"puxada supinada pegada fechada biceps costas como fazer" },
      { name:"Remada c/ Haltere no Cabo (unilateral)", sets:4, reps:"10–12", rest:75, tip:"Rotação leve do tronco no final da puxada",
        muscles:{primary:["Costas"],secondary:["Bíceps"]},
        steps:["Polia baixa, segure a alça com uma mão. Tronco levemente inclinado.","Puxe em direção ao quadril, cotovelo para trás.","Retorne completamente para máximo alongamento. Alterne os lados."],
        ytQuery:"remada unilateral polia baixa como fazer costas" },
      { name:"Remada Baixa na Polia — triângulo", sets:3, reps:"10–12", rest:75, tip:"Tronco ereto, apertar as escápulas no final",
        muscles:{primary:["Costas"],secondary:["Bíceps"]},
        steps:["Sente na polia baixa, pés apoiados, costas eretas.","Puxe o triângulo até o abdômen, apertando as escápulas.","Estenda os braços de forma controlada."],
        ytQuery:"remada baixa polia triangulo como fazer" },
      { name:"Encolhimento c/ Halteres (trapézio)", sets:3, reps:"12–15", rest:60, tip:"Suba direto — sem circular os ombros",
        muscles:{primary:["Ombros"],secondary:["Costas"]},
        steps:["Em pé, halteres ao lado do corpo.","Eleve os ombros em direção às orelhas o máximo possível.","Desça de forma controlada. Sem rotação."],
        ytQuery:"encolhimento haltere trapezio como fazer" },
      { name:"Rosca Concentrada c/ Haltere", sets:3, reps:"10–12", rest:60, tip:"Cotovelo apoiado na parte interna da coxa",
        muscles:{primary:["Bíceps"],secondary:[]},
        steps:["Sente na ponta do banco. Cotovelo apoiado na parte interna da coxa.","Levante o halter até o ombro, supinando o punho no topo.","Desça muito controlado — máximo isolamento."],
        ytQuery:"rosca concentrada haltere biceps como fazer" },
      { name:"Rosca 21 c/ Barra EZ", sets:3, reps:"21", rest:75, tip:"7 embaixo + 7 cima + 7 completo sem parar",
        muscles:{primary:["Bíceps"],secondary:["Antebraço"]},
        steps:["7 reps: da posição inicial até o meio (90°).","7 reps: do meio até completamente em cima.","7 reps: amplitude total. Sem parar entre as 3 fases."],
        ytQuery:"rosca 21 barra EZ biceps como fazer" },
    ]},
  { id:"T6", label:"Treino 6", sub:"Legs B — Posterior · Glúteos", color:"#00C853", icon:"🟢",
    exercises:[
      { name:"Terra Romeno c/ Barra", sets:4, reps:"8–10", rest:120, tip:"Barra raspa as pernas, costas SEMPRE retas",
        muscles:{primary:["Isquiotibiais","Glúteos"],secondary:["Costas"]},
        steps:["Barra na frente das coxas. Pés na largura do quadril, joelhos levemente dobrados.","Incline o tronco para frente empurrando o quadril para trás, barra descendo pelas pernas.","Suba contraindo glúteo e posterior — a lombar não faz o trabalho."],
        ytQuery:"terra romeno barra como fazer correto isquiotibial" },
      { name:"Afundo c/ Halteres", sets:4, reps:"10–12 cada", rest:75, tip:"Joelho traseiro quase toca o chão",
        muscles:{primary:["Quadríceps","Glúteos"],secondary:["Isquiotibiais"]},
        steps:["Em pé, halteres em cada mão.","Dê um passo à frente e desça até o joelho traseiro quase tocar o chão.","Empurre com o pé da frente para voltar. Alterne as pernas."],
        ytQuery:"afundo haltere como fazer correto" },
      { name:"Cadeira Abdutora", sets:3, reps:"15–20", rest:60, tip:"Movimento lento — não use impulso",
        muscles:{primary:["Glúteos"],secondary:[]},
        steps:["Sente com as almofadas na parte externa das coxas.","Empurre as pernas para fora o máximo possível, contraindo o glúteo.","Retorne muito controlado — não deixe o peso bater."],
        ytQuery:"cadeira abdutora gluteo como usar academia" },
      { name:"Mesa Flexora Sentada", sets:4, reps:"12–15", rest:60, tip:"Sentada ativa mais o bíceps femoral que deitada",
        muscles:{primary:["Isquiotibiais"],secondary:["Panturrilha"]},
        steps:["Sente na mesa flexora sentada, rolo sobre os tornozelos.","Empurre o rolo para baixo contraindo o isquiotibial.","Retorne lentamente em 3 segundos."],
        ytQuery:"mesa flexora sentada isquiotibial como usar" },
      { name:"Leg Press Sumô (pés altos e abertos)", sets:3, reps:"12–15", rest:75, tip:"Pés no alto da plataforma e abertos → glúteo e posterior",
        muscles:{primary:["Glúteos","Isquiotibiais"],secondary:["Quadríceps"]},
        steps:["No Leg Press, posicione os pés na parte ALTA da plataforma, bem afastados e apontados para fora.","Desça até os joelhos chegarem a 90°.","Empurre sentindo o glúteo trabalhar."],
        ytQuery:"leg press pes altos abertos gluteo como fazer" },
      { name:"Panturrilha Sentado — Sóleo", sets:4, reps:"15–20", rest:45, tip:"Músculo profundo — diferente da panturrilha em pé",
        muscles:{primary:["Panturrilha"],secondary:[]},
        steps:["Sente na máquina, rolo nas coxas próximo ao joelho.","Desça o calcanhar o máximo possível.","Suba completamente na ponta dos pés. Sem quicar."],
        ytQuery:"panturrilha sentado soleo maquina como usar" },
    ]},
];
const SCHEDULE = ["T1","T2","T3","DESCANSO","T4","T5","T6"];
const fmtTime = s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
const fmtDateShort = ts=>new Date(ts).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"});
const fmtDateFull = ts=>new Date(ts).toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"short"});

// Storage helpers
const wKey = n=>`wmb:w:${n.replace(/\W+/g,"_").slice(0,28)}`;
const saveWeightHist = async (name, weight)=>{
  if(!weight||isNaN(parseFloat(weight)))return;
  const key=wKey(name); let h=[];
  try{const r=await window.storage.get(key);h=JSON.parse(r.value);}catch{}
  const today=new Date().toDateString();
  h=h.filter(x=>new Date(x.ts).toDateString()!==today);
  h.unshift({ts:Date.now(),w:parseFloat(weight)});
  if(h.length>30)h=h.slice(0,30);
  try{await window.storage.set(key,JSON.stringify(h));}catch{}
};
const loadWeightHist = async (name)=>{
  try{const r=await window.storage.get(wKey(name));return JSON.parse(r.value);}catch{return [];}
};
const saveHistory = async entry=>{
  let h=[]; try{const r=await window.storage.get("wmb:hist");h=JSON.parse(r.value);}catch{}
  h.unshift(entry); if(h.length>60)h=h.slice(0,60);
  try{await window.storage.set("wmb:hist",JSON.stringify(h));}catch{}
};
const loadHistory = async ()=>{
  try{const r=await window.storage.get("wmb:hist");return JSON.parse(r.value);}catch{return [];}
};

const openYouTube = q=>{
  const url=`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  window.open(url,"_blank","noopener,noreferrer");
};

const styles=`
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#0D0D0D;}
:root{--bg:#0D0D0D;--s:#161616;--card:#1E1E1E;--b:#2A2A2A;--t:#F0F0F0;--m:#666;--a:#FF3D00;--done:#00E676;}
.app{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh;color:var(--t);max-width:440px;margin:0 auto;}
.hd{padding:38px 22px 16px;border-bottom:1px solid var(--b);display:flex;justify-content:space-between;align-items:flex-start;}
.hd h1{font-family:'Bebas Neue',sans-serif;font-size:50px;line-height:1;letter-spacing:.04em;}
.hd-sub{font-size:11px;color:var(--m);letter-spacing:.08em;text-transform:uppercase;margin-top:4px;}
.hd-r{display:flex;gap:7px;}
.icon-btn{background:var(--card);border:1px solid var(--b);border-radius:8px;color:var(--m);font-size:12px;padding:7px 11px;cursor:pointer;display:flex;align-items:center;gap:5px;white-space:nowrap;}
.icon-btn:hover{border-color:#444;color:var(--t);}
.sch-wrap{padding:12px 16px 4px;}
.sch-lbl{font-size:9px;color:#444;text-transform:uppercase;letter-spacing:.09em;margin-bottom:7px;}
.sch-row{display:flex;gap:4px;}
.sch-i{display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;}
.sch-dot{width:30px;height:30px;border-radius:50%;border:2px solid var(--b);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;color:var(--m);}
.sch-day{font-size:8px;color:#444;letter-spacing:.02em;}
.day-list{padding:14px 14px 90px;display:flex;flex-direction:column;gap:9px;}
.day-card{background:var(--card);border:1px solid var(--b);border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:13px;cursor:pointer;transition:border-color .15s,transform .1s;}
.day-card:active{transform:scale(.98);}
.day-card:hover{border-color:#444;}
.di{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
.d-info{flex:1;}
.d-lbl{font-family:'Bebas Neue',sans-serif;font-size:21px;letter-spacing:.06em;line-height:1;}
.d-sub{font-size:12px;color:var(--m);margin-top:2px;}
.d-meta{font-size:11px;color:#444;margin-top:1px;}
.d-arr{color:var(--m);font-size:20px;}
.wh{padding:16px 16px 12px;position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--b);z-index:10;}
.wh-top{display:flex;align-items:center;gap:9px;margin-bottom:10px;}
.bk{background:var(--card);border:1px solid var(--b);border-radius:8px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t);font-size:16px;flex-shrink:0;}
.wh-ti{flex:1;}
.wh-l{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:.06em;line-height:1;}
.wh-s{font-size:11px;color:var(--m);margin-top:1px;}
.cb{background:#0043881A;border:1px solid #00438818;border-radius:6px;font-size:10px;color:#4A9EFF;padding:3px 7px;white-space:nowrap;flex-shrink:0;}
.pb-wrap{height:3px;background:var(--b);border-radius:2px;overflow:hidden;}
.pb-fill{height:100%;border-radius:2px;transition:width .4s ease;}
.pb-lbl{font-size:11px;color:var(--m);margin-top:5px;display:flex;justify-content:space-between;}
.ex-list{padding:10px 12px 110px;display:flex;flex-direction:column;gap:10px;}
.ex-card{background:var(--card);border:1px solid var(--b);border-radius:12px;overflow:hidden;}
.ex-card.xdone{border-color:#00E67633;}
.ex-head{padding:12px 13px 0;display:flex;justify-content:space-between;align-items:flex-start;gap:7px;}
.ex-nm{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:.03em;line-height:1.1;flex:1;}
.ib{background:transparent;border:1px solid var(--b);border-radius:6px;color:var(--m);font-size:11px;padding:4px 8px;cursor:pointer;flex-shrink:0;}
.ib:hover{border-color:#555;color:var(--t);}
.ex-rp{font-size:11px;color:var(--m);padding:3px 13px 0;}
.ex-tip{font-size:11px;color:#555;padding:2px 13px 0;font-style:italic;}
.weight-row{padding:7px 13px 0;display:flex;align-items:center;gap:8px;}
.last-w{font-size:11px;color:var(--m);}
.last-w span{color:#aaa;font-weight:600;}
.w-trend-up{color:#00E676;}
.w-trend-dn{color:#FF6B6B;}
.w-inp-wrap{display:flex;align-items:center;gap:5px;margin-left:auto;}
.w-inp{background:var(--b);border:1px solid #333;border-radius:6px;color:var(--t);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;width:70px;padding:5px 7px;text-align:center;}
.w-inp:focus{outline:none;border-color:var(--a);}
.w-unit{font-size:11px;color:var(--m);}
.sets-row{padding:8px 13px 12px;display:flex;gap:7px;flex-wrap:wrap;}
.sb{width:44px;height:44px;border-radius:8px;border:2px solid var(--b);background:transparent;color:var(--m);font-family:'Bebas Neue',sans-serif;font-size:16px;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;}
.sb.done{border-color:var(--done);background:#00E67618;color:var(--done);}
.sb:active{transform:scale(.92);}
.ro{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:440px;background:#161616;border-top:2px solid var(--a);padding:13px 20px;display:flex;align-items:center;gap:13px;z-index:50;}
.ro-lbl{font-size:10px;color:var(--m);text-transform:uppercase;letter-spacing:.08em;}
.ro-t{font-family:'Bebas Neue',sans-serif;font-size:34px;letter-spacing:.04em;line-height:1;color:var(--a);}
.rring{position:relative;width:56px;height:56px;flex-shrink:0;}
.rring svg{transform:rotate(-90deg);}
.rring-n{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--a);}
.skip{margin-left:auto;background:var(--b);border:none;border-radius:8px;color:var(--m);font-size:12px;font-weight:500;padding:8px 13px;cursor:pointer;}
.mo{position:fixed;inset:0;background:#000000CC;z-index:100;display:flex;align-items:flex-end;justify-content:center;}
.ms{background:#1A1A1A;border-radius:20px 20px 0 0;width:100%;max-width:440px;padding:20px 18px 36px;max-height:88vh;overflow-y:auto;}
.mh{width:38px;height:4px;background:var(--b);border-radius:2px;margin:0 auto 16px;}
.mt{font-family:'Bebas Neue',sans-serif;font-size:25px;letter-spacing:.03em;line-height:1.1;margin-bottom:10px;}
.mtags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px;}
.mtag{font-size:11px;font-weight:600;padding:4px 9px;border-radius:20px;}
.sec-tag{background:#2A2A2A;color:#666;border:1px solid #333;}
.slbl{font-size:10px;color:var(--m);text-transform:uppercase;letter-spacing:.1em;margin-bottom:7px;}
.stps{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
.stp{display:flex;gap:10px;align-items:flex-start;}
.stp-n{width:22px;height:22px;border-radius:50%;background:var(--a);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}
.stp-t{font-size:13px;line-height:1.5;color:#ccc;}
.w-hist-list{display:flex;flex-direction:column;gap:5px;margin-bottom:14px;}
.w-hist-row{display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:#141414;border-radius:8px;}
.w-hist-date{font-size:11px;color:var(--m);}
.w-hist-val{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:.04em;}
.w-hist-diff{font-size:11px;margin-left:6px;}
.yt-btn{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;background:#CC0000;border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:600;padding:12px;cursor:pointer;margin-bottom:9px;}
.cl-btn{display:flex;align-items:center;justify-content:center;width:100%;background:var(--b);border:none;border-radius:10px;color:var(--m);font-size:13px;font-weight:500;padding:12px;cursor:pointer;}
.done-sc{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 22px;text-align:center;gap:13px;}
.done-em{font-size:64px;line-height:1;}
.done-ti{font-family:'Bebas Neue',sans-serif;font-size:48px;line-height:1;}
.done-sub{font-size:13px;color:var(--m);max-width:250px;}
.st-row{display:flex;gap:22px;margin-top:4px;}
.st{text-align:center;}
.st-v{font-family:'Bebas Neue',sans-serif;font-size:32px;color:var(--done);}
.st-l{font-size:10px;color:var(--m);text-transform:uppercase;letter-spacing:.06em;}
.btn-p{background:var(--a);border:none;border-radius:10px;color:#fff;font-weight:600;font-size:14px;padding:12px 26px;cursor:pointer;}
.hst-hd{padding:36px 20px 16px;border-bottom:1px solid var(--b);display:flex;align-items:center;gap:11px;}
.hst-hd h2{font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:.04em;flex:1;}
.hst-list{padding:12px 12px 60px;display:flex;flex-direction:column;gap:9px;}
.hst-sum{background:var(--card);border:1px solid var(--b);border-radius:12px;padding:14px 16px;display:flex;gap:16px;}
.hsum-n{font-family:'Bebas Neue',sans-serif;font-size:36px;color:var(--a);line-height:1;}
.hsum-l{font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.04em;line-height:1.1;}
.hsum-s{font-size:11px;color:#444;margin-top:2px;}
.hst-card{background:var(--card);border:1px solid var(--b);border-radius:12px;padding:13px 15px;}
.hc-top{display:flex;justify-content:space-between;align-items:center;}
.hc-dt{font-size:11px;color:var(--m);text-transform:uppercase;letter-spacing:.06em;}
.hc-nm{font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:.03em;margin-top:2px;}
.hc-sb{font-size:11px;color:#555;margin-top:1px;}
.hc-st{display:flex;gap:13px;margin-top:6px;}
.hc-s{font-size:12px;color:var(--m);}
.hc-s span{color:var(--t);font-weight:600;}
.no-hist{text-align:center;padding:50px 22px;color:var(--m);font-size:13px;}
`;

export default function App() {
  const [view,setView]=useState("home");
  const [selIdx,setSelIdx]=useState(null);
  const [compSets,setCompSets]=useState({});
  const [wInputs,setWInputs]=useState({}); // {exIdx: string weight}
  const [lastW,setLastW]=useState({});    // {exName: [{ts,w}...]}
  const [rest,setRest]=useState({active:false,seconds:0,total:0});
  const [modalEx,setModalEx]=useState(null);
  const [modalWH,setModalWH]=useState([]); // weight history for modal
  const [history,setHistory]=useState([]);
  const timerRef=useRef();
  const t0=useRef();

  useEffect(()=>{
    if(!rest.active)return;
    if(rest.seconds<=0){setRest(p=>({...p,active:false}));return;}
    timerRef.current=setTimeout(()=>setRest(p=>({...p,seconds:p.seconds-1})),1000);
    return ()=>clearTimeout(timerRef.current);
  },[rest.active,rest.seconds]);

  const startWorkout=async idx=>{
    const exs=WORKOUTS[idx].exercises;
    const init={},wi={},lw={};
    for(let i=0;i<exs.length;i++){
      init[i]=Array(exs[i].sets).fill(false);
      const h=await loadWeightHist(exs[i].name);
      lw[exs[i].name]=h;
      if(h.length>0)wi[i]=String(h[0].w);
    }
    setCompSets(init);setWInputs(wi);setLastW(lw);
    setSelIdx(idx);t0.current=Date.now();setView("workout");
  };

  const toggleSet=(ei,si)=>{
    const was=compSets[ei][si];
    setCompSets(p=>{const u={...p,[ei]:[...p[ei]]};u[ei][si]=!was;return u;});
    if(!was){
      const r=WORKOUTS[selIdx].exercises[ei].rest;
      clearTimeout(timerRef.current);
      setRest({active:true,seconds:r,total:r});
    }
  };

  const finishWorkout=async()=>{
    const exs=WORKOUTS[selIdx].exercises;
    for(let i=0;i<exs.length;i++){
      const w=wInputs[i];
      if(w&&!isNaN(parseFloat(w)))await saveWeightHist(exs[i].name,parseFloat(w));
    }
    const dur=Math.round((Date.now()-(t0.current||Date.now()))/60000);
    const wo=WORKOUTS[selIdx];
    await saveHistory({ts:Date.now(),id:wo.id,label:wo.label,sub:wo.sub,sets:doneSets,totalSets,exs:wo.exercises.length,dur:dur||1});
    setView("done");
  };

  const openModal=async ex=>{
    const h=await loadWeightHist(ex.name);
    setModalWH(h);setModalEx(ex);
  };

  const allSets=Object.values(compSets).flat();
  const doneSets=allSets.filter(Boolean).length;
  const totalSets=allSets.length;
  const prog=totalSets>0?doneSets/totalSets:0;
  const allDone=totalSets>0&&doneSets===totalSets;
  const wo=selIdx!==null?WORKOUTS[selIdx]:null;
  const ac=wo?.color||"#FF3D00";
  const rR=24,rC=2*Math.PI*rR;
  const rDash=rest.total>0?rC*(rest.seconds/rest.total):0;

  const getTrend=(name,curInput)=>{
    const h=lastW[name];
    if(!h||h.length<1)return null;
    const prev=h[0]?.w;
    const cur=parseFloat(curInput);
    if(!prev||isNaN(cur)||cur===prev)return null;
    return cur>prev?"up":"dn";
  };

  // HISTORY VIEW
  if(view==="history"){
    const tw=history.length, ts=history.reduce((a,h)=>a+(h.sets||0),0), tm=history.reduce((a,h)=>a+(h.dur||0),0);
    return(<div className="app"><style>{styles}</style>
      <div className="hst-hd"><button className="bk" onClick={()=>setView("home")}>‹</button><h2>HISTÓRICO</h2></div>
      <div className="hst-list">
        {tw===0?(<div className="no-hist">Nenhum treino ainda.<br/>Complete o primeiro!</div>):(
          <>
            <div className="hst-sum">
              <div><div className="hsum-n">{tw}</div></div>
              <div><div className="hsum-l">TREINOS COMPLETOS</div><div className="hsum-s">{ts} séries · {tm}min no total</div></div>
            </div>
            {history.map((h,i)=>(
              <div key={i} className="hst-card">
                <div className="hc-top"><div className="hc-dt">{fmtDateFull(h.ts)}</div><div style={{fontSize:11,color:"#00E676"}}>✓</div></div>
                <div className="hc-nm">{h.label}</div>
                <div className="hc-sb">{h.sub}</div>
                <div className="hc-st">
                  <div className="hc-s"><span>{h.sets}</span> séries</div>
                  <div className="hc-s"><span>{h.exs}</span> exercícios</div>
                  <div className="hc-s"><span>{h.dur}min</span></div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>);
  }

  // DONE VIEW
  if(view==="done") return(<div className="app"><style>{styles}</style>
    <div className="done-sc">
      <div className="done-em">🏆</div>
      <div className="done-ti">TREINO<br/>CONCLUÍDO</div>
      <div className="st-row">
        <div className="st"><div className="st-v">{doneSets}</div><div className="st-l">Séries</div></div>
        <div className="st"><div className="st-v">{wo?.exercises.length}</div><div className="st-l">Exercícios</div></div>
      </div>
      <p className="done-sub">Cargas salvas. Bom trabalho — não esqueça os 20min de esteira!</p>
      <button className="btn-p" onClick={()=>{setView("home");setSelIdx(null);}}>← Voltar</button>
    </div>
  </div>);

  // WORKOUT VIEW
  if(view==="workout"&&wo) return(<div className="app"><style>{styles}</style>
    <div className="wh">
      <div className="wh-top">
        <button className="bk" onClick={()=>setView("home")}>‹</button>
        <div className="wh-ti"><div className="wh-l">{wo.label}</div><div className="wh-s">{wo.sub}</div></div>
        <div className="cb">🏃 +20min</div>
      </div>
      <div className="pb-wrap"><div className="pb-fill" style={{width:`${prog*100}%`,background:ac}}/></div>
      <div className="pb-lbl"><span>Progresso</span><span style={{color:ac}}>{doneSets}/{totalSets} séries</span></div>
    </div>
    <div className="ex-list">
      {wo.exercises.map((ex,i)=>{
        const exS=compSets[i]||[], xd=exS.every(Boolean);
        const wHist=lastW[ex.name]||[];
        const lastVal=wHist[0]?.w;
        const curInput=wInputs[i]||"";
        const trend=getTrend(ex.name,curInput);
        return(
          <div key={i} className={`ex-card${xd?" xdone":""}`}>
            <div className="ex-head">
              <div className="ex-nm">{ex.name}</div>
              <button className="ib" onClick={()=>openModal(ex)}>ℹ️ Ver</button>
            </div>
            <div className="ex-rp">{ex.sets} séries · {ex.reps} reps · descanso {fmtTime(ex.rest)}</div>
            <div className="ex-tip">💡 {ex.tip}</div>
            <div className="weight-row">
              {lastVal&&<div className="last-w">Última: <span>{lastVal}kg</span></div>}
              {!lastVal&&<div className="last-w" style={{color:"#444"}}>Primeira vez</div>}
              <div className="w-inp-wrap">
                {trend==="up"&&<span className="w-hist-diff w-trend-up">↑</span>}
                {trend==="dn"&&<span className="w-hist-diff w-trend-dn">↓</span>}
                <input className="w-inp" type="number" inputMode="decimal" placeholder="kg" value={curInput}
                  onChange={e=>setWInputs(p=>({...p,[i]:e.target.value}))}/>
                <span className="w-unit">kg</span>
              </div>
            </div>
            <div className="sets-row">
              {exS.map((done,si)=>(
                <button key={si} className={`sb${done?" done":""}`} onClick={()=>toggleSet(i,si)}>
                  {done?"✓":si+1}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {allDone&&<button className="btn-p" style={{width:"100%",marginTop:4}} onClick={finishWorkout}>Finalizar treino 🏁</button>}
    </div>
    {rest.active&&(
      <div className="ro">
        <div className="rring">
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r={rR} fill="none" stroke="#2A2A2A" strokeWidth="4"/>
            <circle cx="28" cy="28" r={rR} fill="none" stroke={ac} strokeWidth="4"
              strokeDasharray={rC} strokeDashoffset={rC-rDash} strokeLinecap="round"/>
          </svg>
          <div className="rring-n">{rest.seconds}</div>
        </div>
        <div><div className="ro-lbl">Descanso</div><div className="ro-t">{fmtTime(rest.seconds)}</div></div>
        <button className="skip" onClick={()=>{clearTimeout(timerRef.current);setRest({active:false,seconds:0,total:0});}}>Pular</button>
      </div>
    )}
    {modalEx&&(
      <div className="mo" onClick={()=>setModalEx(null)}>
        <div className="ms" onClick={e=>e.stopPropagation()}>
          <div className="mh"/>
          <div className="mt">{modalEx.name}</div>
          <div className="mtags">
            {modalEx.muscles.primary.map(m=>(
              <span key={m} className="mtag" style={{background:MC[m]+"33",color:MC[m],border:`1px solid ${MC[m]}55`}}>{m}</span>
            ))}
            {modalEx.muscles.secondary.map(m=>(<span key={m} className="mtag sec-tag">{m}</span>))}
          </div>
          <div className="slbl">Como fazer</div>
          <div className="stps">
            {modalEx.steps.map((s,i)=>(
              <div key={i} className="stp">
                <div className="stp-n">{i+1}</div>
                <div className="stp-t">{s}</div>
              </div>
            ))}
          </div>
          {modalWH.length>0&&(<>
            <div className="slbl">Histórico de carga</div>
            <div className="w-hist-list">
              {modalWH.slice(0,6).map((h,i)=>{
                const prev=modalWH[i+1]?.w;
                const diff=prev?h.w-prev:null;
                return(
                  <div key={i} className="w-hist-row">
                    <div className="w-hist-date">{fmtDateShort(h.ts)}</div>
                    <div style={{display:"flex",alignItems:"center"}}>
                      <div className="w-hist-val" style={{color:i===0?ac:undefined}}>{h.w}kg</div>
                      {diff!==null&&<span className={`w-hist-diff ${diff>0?"w-trend-up":diff<0?"w-trend-dn":""}`}>
                        {diff>0?`+${diff.toFixed(1)}`:diff<0?diff.toFixed(1):"="}
                      </span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>)}
          <button className="yt-btn" onClick={()=>openYouTube(modalEx.ytQuery)}>▶ Buscar vídeo no YouTube</button>
          <button className="cl-btn" onClick={()=>setModalEx(null)}>Fechar</button>
        </div>
      </div>
    )}
  </div>);

  // HOME VIEW
  const loadHist=async()=>{setHistory(await loadHistory());};
  return(<div className="app"><style>{styles}</style>
    <div className="hd">
      <div><h1>WMB<br/>GYM</h1><div className="hd-sub">Massa · Emagrecimento</div></div>
      <div className="hd-r">
        <button className="icon-btn" onClick={()=>{loadHist();setView("history");}}>📊 Histórico</button>
      </div>
    </div>
    <div className="sch-wrap">
      <div className="sch-lbl">Rotação semanal recomendada</div>
      <div className="sch-row">
        {SCHEDULE.map((id,i)=>{
          if(id==="DESCANSO")return(<div key={i} className="sch-i">
            <div className="sch-dot" style={{fontSize:8,color:"#333"}}>ZZZ</div>
            <div className="sch-day">Desc</div>
          </div>);
          const w=WORKOUTS.find(x=>x.id===id);
          return(<div key={i} className="sch-i">
            <div className="sch-dot" style={{borderColor:w.color+"66",color:w.color,fontSize:9}}>{id}</div>
            <div className="sch-day" style={{color:"#555"}}>{["Seg","Ter","Qua","","Qui","Sex","Sáb"][i]}</div>
          </div>);
        })}
      </div>
    </div>
    <div className="day-list">
      {WORKOUTS.map((w,i)=>(
        <div key={i} className="day-card" onClick={()=>startWorkout(i)}>
          <div className="di" style={{background:w.color+"22"}}>{w.icon}</div>
          <div className="d-info">
            <div className="d-lbl">{w.label}</div>
            <div className="d-sub">{w.sub}</div>
            <div className="d-meta">{w.exercises.length} exercícios · {w.exercises.reduce((a,e)=>a+e.sets,0)} séries · +20min cardio</div>
          </div>
          <div className="d-arr">›</div>
        </div>
      ))}
    </div>
  </div>);
}