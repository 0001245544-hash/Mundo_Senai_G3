// // Aguarda o carregamento completo do DOM para garantir que os elementos A-Frame existam
document.addEventListener('DOMContentLoaded', () => {
  // 💜 Perguntas profundas e acolhedoras (sem acentos)
  const perguntas = [
    "Voce tem sido gentil consigo mesmo hoje?",
    "Sente orgulho de algo que fez ultimamente?",
    "Ha algo que voce perdoou em si mesmo recentemente?",
    "Sente que esta no caminho que faz seu coracao feliz?",
    "Permite-se descansar quando precisa?",
    "Reconhece o quanto ja cresceu?",
    "Sente-se cercado de carinho e apoio?",
    "Da a si mesmo o mesmo amor que da aos outros?",
    "Acredita que seus sonhos merecem acontecer?",
    "Sente gratidao por quem voce esta se tornando?"
  ];

  let indiceAtual = 0;
  let podeResponder = true;
  let finalizou = false; // Controle para saber se o jogo acabou
  let ultimaInclinacao = 0;
  let ultimaRotacao = 0;
  let contadorMovimento = 0;
  let tipoMovimento = null;

  const perguntaEl = document.querySelector('#pergunta');
  const respostaEl = document.querySelector('#resposta');
  const instrucaoEl = document.querySelector('#instrucao');
  const ceuEl = document.querySelector('#ceu');
  const cameraEl = document.querySelector('#camera');

  // Mostra pergunta inicial
  function mostrarPergunta() {
    perguntaEl.setAttribute('value', perguntas[indiceAtual]);
    respostaEl.setAttribute('value', '');
    podeResponder = true;
    ceuEl.setAttribute('color', '#1e293b');
    contadorMovimento = 0;
    tipoMovimento = null;
  }

  // Processa resposta
  function registrarResposta(tipo) {
    if (!podeResponder || finalizou) return;
    podeResponder = false;

    if (tipo === 'sim') {
      respostaEl.setAttribute('value', '💛 Voce disse SIM 💛\nFico feliz que voce pense assim!');
      ceuEl.setAttribute('color', '#14532d');
    } else {
      respostaEl.setAttribute('value', '🤍 Voce disse NAO 🤍\nEsta tudo bem sentir assim');
      ceuEl.setAttribute('color', '#312e81');
    }

    // Aguarda 5 segundos para a proxima acao
    setTimeout(() => {
      if (indiceAtual < perguntas.length - 1) {
        indiceAtual++;
        mostrarPergunta();
      } else {
        encerrarExperiencia();
      }
    }, 5000);
  }

  // Encerra com mensagens positivas e de agradecimento
  function encerrarExperiencia() {
    finalizou = true;
    podeResponder = false;
    ceuEl.setAttribute('color', '#0f172a'); // Fundo noturno e calmo

    // Frase positiva e frase de agradecimento
    perguntaEl.setAttribute('value', 'Lembre-se: voce e incrivel e\nsua jornada e unica e especial! ✨');
    perguntaEl.setAttribute('color', '#34d399'); // Cor verde suave

    respostaEl.setAttribute('value', 'Muito obrigado por jogar e\ndedicar esse momento a voce! 💙');
    respostaEl.setAttribute('color', '#93c5fd'); // Cor azul suave

    // Esconde as instruções de movimento
    instrucaoEl.setAttribute('visible', 'false');
  }

  // 🔄 Detecta movimento da cabeca
  setInterval(() => {
    if (finalizou) return; // Para de detectar se o jogo acabou

    // Garante que a câmera já foi carregada
    if (!cameraEl || !cameraEl.object3D) return;

    const rotacao = cameraEl.object3D.rotation;
    const inclinacao = rotacao.x; // Cabeca para cima/baixo
    const virar = rotacao.y;     // Cabeca para esquerda/direita

    const variacaoInclinacao = Math.abs(inclinacao - ultimaInclinacao);
    const variacaoVirar = Math.abs(virar - ultimaRotacao);

    // Movimento VERTICAL = SIM
    if (variacaoInclinacao > 0.08 && variacaoVirar < 0.05) {
      if (tipoMovimento === null) tipoMovimento = 'sim';
      if (tipoMovimento === 'sim') {
        contadorMovimento++;
        if (contadorMovimento >= 2) {
          registrarResposta('sim');
          contadorMovimento = 0;
          tipoMovimento = null;
        }
      }
    }

    // Movimento HORIZONTAL = NAO
    if (variacaoVirar > 0.08 && variacaoInclinacao < 0.05) {
      if (tipoMovimento === null) tipoMovimento = 'nao';
      if (tipoMovimento === 'nao') {
        contadorMovimento++;
        if (contadorMovimento >= 2) {
          registrarResposta('nao');
          contadorMovimento = 0;
          tipoMovimento = null;
        }
      }
    }

    ultimaInclinacao = inclinacao;
    ultimaRotacao = virar;
  }, 80);

  // Inicia a cena após garantir que o A-Frame renderizou tudo
  setTimeout(mostrarPergunta, 500);
});