let phases = [
  {
    name: "Fase 1: Básico",
    words: [
      "CIDADE", "URBANO", "PREDIO", "RUA", "TRANSITO",
      "CAMPO", "RURAL", "PLANTA", "ANIMAL", "NATUREZA"
    ],
    gridSize: 10,
    directions: ["horizontal", "vertical"]
  },
  {
    name: "Fase 2: Superior",
    words: [
      "LAVOURA", "FAZENDA", "INDUSTRIA", "COMERCIO", "LIXO",
      "RIO", "FLORESTA", "PARQUE", "HOSPITAL", "ESCOLA",
      "JARDIM", "VIZINHO"
    ],
    gridSize: 12,
    directions: ["horizontal", "vertical"]
  }
];

let currentPhaseIndex = 0;
let currentPhase;

let foundWords = [];
let currentSelection = [];
let cellSize;
let gridXOffset;
let gridYOffset;
let grid;

let gameState = 'start'; // Estados: 'start', 'instructions', 'playing', 'phase_complete', 'game_over', 'intro_animation', 'conexao_info'

// Variáveis para a animação de introdução
let animationStartTime;
const animationDuration = 3000; // Duração total da animação em milissegundos (3 segundos)
let animationProgress = 0; // Progresso de 0 a 1

function setup() {
  createCanvas(600, 780);
  initializePhase(currentPhaseIndex);
}

// Inicializa ou reinicia uma fase específica do jogo
function initializePhase(phaseIndex) {
  currentPhaseIndex = phaseIndex;
  currentPhase = phases[currentPhaseIndex];

  cellSize = width / currentPhase.gridSize;
  gridXOffset = (width - (currentPhase.gridSize * cellSize)) / 2;

  let wordListHeight = 30 + (Math.ceil(currentPhase.words.length / 5) * 25);
  gridYOffset = wordListHeight + 80;

  foundWords = [];
  grid = generateGrid();
}

function draw() {
  background(255);
  noStroke();
  textAlign(LEFT, BASELINE);
  textStyle(NORMAL); // Ensure default text style is normal

  if (gameState === 'start') {
    drawStartScreen();
  } else if (gameState === 'instructions') {
    drawInstructionsScreen();
  } else if (gameState === 'conexao_info') { // New state for "Conexão Campo e Cidade" info
    drawConexaoInfoScreen();
  } else if (gameState === 'intro_animation') {
    drawIntroAnimation();
  } else if (gameState === 'playing') {
    drawPhaseInfo();
    drawWordList();
    drawGrid();
    checkPhaseCompletion();
  } else if (gameState === 'phase_complete') {
    drawPhaseCompleteScreen();
  } else if (gameState === 'game_over') {
    drawGameOverScreen();
  }
}

// --- Funções da Tela de Início ---
function drawStartScreen() {
  // Background com gradiente vibrante de tons de verde
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c1 = color(0, 100, 0); // Verde escuro
    let c2 = color(100, 200, 100); // Verde claro
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, i, width, i);
  }
  noStroke();

  fill(255); // Texto branco para contraste
  textSize(48);
  textAlign(CENTER, CENTER);
  textStyle(BOLD); // Título em negrito
  text("CAÇA-PALAVRAS", width / 2, height / 3);

  // Subtítulo "sobre conexão campo e cidade"
  fill(255); // Texto branco para contraste
  textSize(24);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL); // Texto normal
  text("sobre conexão campo e cidade", width / 2, height / 3 + 40);


  let playButtonWidth = 180; // Aumentei o tamanho
  let playButtonHeight = 70;
  let playButtonX = width / 2 - playButtonWidth / 2;
  let playButtonY = height / 2;

  // Botão JOGAR com cor vibrante e sombra sutil
  fill(50, 220, 50); // Verde mais vibrante
  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = 5;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
  rect(playButtonX, playButtonY, playButtonWidth, playButtonHeight, 15); // Cantos mais arredondados
  drawingContext.shadowOffsetX = 0; // Resetar sombra
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = 'transparent';

  fill(255);
  textSize(36); // Texto maior
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("JOGAR", width / 2, playButtonY + playButtonHeight / 2);

  let instructionsButtonWidth = 220; // Aumentei o tamanho
  let instructionsButtonHeight = 70;
  let instructionsButtonX = width / 2 - instructionsButtonWidth / 2;
  let instructionsButtonY = playButtonY + playButtonHeight + 30;

  // Botão INSTRUÇÕES com cor vibrante e sombra sutil
  fill(50, 180, 250); // Azul mais vibrante (mantido para contraste com os verdes do tema)
  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = 5;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
  rect(instructionsButtonX, instructionsButtonY, instructionsButtonWidth, instructionsButtonHeight, 15); // Cantos mais arredondados
  drawingContext.shadowOffsetX = 0; // Resetar sombra
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = 'transparent';

  fill(255);
  textSize(32); // Texto maior
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("INSTRUÇÕES", width / 2, instructionsButtonY + instructionsButtonHeight / 2);

  // New "Conexão Campo e Cidade" button - text changed to "CAMPO E CIDADE"
  let conexaoButtonWidth = 300;
  let conexaoButtonHeight = 70;
  let conexaoButtonX = width / 2 - conexaoButtonWidth / 2;
  let conexaoButtonY = instructionsButtonY + instructionsButtonHeight + 30;

  fill(255, 150, 0); // Orange vibrant color (mantido para contraste)
  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = 5;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
  rect(conexaoButtonX, conexaoButtonY, conexaoButtonWidth, conexaoButtonHeight, 15);
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = 'transparent';

  fill(255);
  textSize(32); // Increased font size for better fit with shorter text
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("CAMPO E CIDADE", width / 2, conexaoButtonY + conexaoButtonHeight / 2); // Shorter text
}


// --- Funções da Tela de Instruções ---
function drawInstructionsScreen() {
  background(255, 255, 200); // Fundo amarelo claro

  fill(50, 150, 50); // Verde escuro para o texto
  textSize(36);
  textAlign(CENTER, TOP);
  textStyle(BOLD); // Título em negrito
  text("COMO JOGAR", width / 2, 50);

  textSize(20);
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  fill(0); // Texto preto para instruções
  let instructionsText = `
1. O objetivo é encontrar as palavras escondidas na grade.

2. O jogo tem 2 fases:
    - Fase 1: Palavras apenas na horizontal e vertical.
    - Fase 2: Palavras apenas na horizontal e vertical.

3. As palavras podem estar em ordem normal ou reversa.

4. Para selecionar uma palavra, clique na primeira letra e arraste o mouse até a última letra.

5. Solte o mouse para verificar a seleção.

6. Palavras encontradas serão destacadas em verde e riscadas na lista.

7. Encontre todas as palavras da fase para avançar!
  `;
  text(instructionsText, 50, 120, width - 100, height - 100);

  let backButtonWidth = 150;
  let backButtonHeight = 60;
  let backButtonX = width / 2 - backButtonWidth / 2;
  let backButtonY = height - 100;

  fill(200, 100, 0); // Laranja queimado para o botão de voltar
  rect(backButtonX, backButtonY, backButtonWidth, backButtonHeight, 10);
  fill(255);
  textSize(28);
  textAlign(CENTER, CENTER);
  textStyle(BOLD); // Texto do botão em negrito
  text("VOLTAR", width / 2, backButtonY + backButtonHeight / 2);
}

// --- Funções da Tela de Informações sobre Conexão Campo e Cidade ---
function drawConexaoInfoScreen() {
  background(255, 255, 200); // Fundo amarelo claro

  fill(50, 150, 50); // Verde escuro para o texto
  textSize(36);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text("CONEXÃO CAMPO E CIDADE", width / 2, 50); // Full phrase here

  textSize(20);
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  fill(0); // Texto preto para informações
  let infoText = `
Este jogo explora a interligação entre o campo e a cidade, dois ambientes
que, embora distintos, são profundamente conectados e dependentes um do outro.

O CAMPO fornece:
- Alimentos (grãos, frutas, vegetais, carne)
- Matérias-primas (algodão, madeira, minérios)
- Recursos naturais (água, ar puro)

A CIDADE oferece:
- Tecnologia e inovação (máquinas agrícolas, biotecnologia)
- Serviços (saúde, educação, bancos)
- Mercados para os produtos do campo
- Oportunidades de emprego e desenvolvimento

Essa relação é essencial para o desenvolvimento sustentável de ambos os
ambientes, garantindo o abastecimento, a economia e a qualidade de vida.
  `;
  text(infoText, 50, 120, width - 100, height - 100);

  let backButtonWidth = 150;
  let backButtonHeight = 60;
  let backButtonX = width / 2 - backButtonWidth / 2;
  let backButtonY = height - 100;

  fill(200, 100, 0); // Laranja queimado para o botão de voltar
  rect(backButtonX, backButtonY, backButtonWidth, backButtonHeight, 10);
  fill(255);
  textSize(28);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("VOLTAR", width / 2, backButtonY + backButtonHeight / 2);
}


// --- Funções da Animação de Introdução ---
function drawIntroAnimation() {
  let elapsedTime = millis() - animationStartTime;
  animationProgress = min(1, elapsedTime / animationDuration);

  // Fundo que muda de cor do campo para a cidade
  // Cores do campo: Verde (floresta) e Amarelo (sol/colheita)
  // Cores da cidade: Tons de cinza e azul (prédios, céu noturno)
  let r = lerp(50, 100, animationProgress); // Verde para cinza escuro
  let g = lerp(150, 100, animationProgress); // Verde para cinza escuro
  let b = lerp(50, 100, animationProgress); // Verde para cinza escuro
  background(r, g, b);

  // Cenário de Campo (primeira metade da animação)
  if (animationProgress <= 0.6) { // Aumentar a duração do campo
    // Céu amarelo claro
    fill(255, 255, 150, map(animationProgress, 0, 0.5, 255, 0)); // Céu desvanecendo
    rect(0, 0, width, height * 0.6);

    // Montanhas/Colinas verdes
    fill(0, 100, 0, map(animationProgress, 0, 0.5, 255, 0)); // Grama desvanecendo
    triangle(0, height * 0.8, width / 2, height * 0.4, width, height * 0.8);
    triangle(0, height * 0.9, width * 0.3, height * 0.6, width * 0.6, height * 0.9);

    // Sol brilhante
    fill(255, 200, 0, map(animationProgress, 0, 0.5, 255, 0)); // Sol desvanecendo
    ellipse(width * 0.8, height * 0.2, 80, 80); // Sol

    // Linha do horizonte do campo
    stroke(0, 50, 0, map(animationProgress, 0, 0.5, 255, 0));
    strokeWeight(5);
    line(0, height * 0.8, width, height * 0.8);
    noStroke();
  }

  // Transição (meio da animação)
  // Prédios subindo
  let buildingHeightProgress = map(animationProgress, 0.2, 0.8, 0, 1);
  let buildingCount = 5;
  for (let i = 0; i < buildingCount; i++) {
    let buildingX = map(i, 0, buildingCount - 1, width * 0.1, width * 0.9);
    let buildingWidth = width / (buildingCount + 2);
    let maxBuildingHeight = height * 0.7;
    let currentBuildingHeight = maxBuildingHeight * easeInOutQuad(buildingHeightProgress);

    fill(lerp(150, 80, animationProgress)); // Escurecendo os prédios
    rect(buildingX, height - currentBuildingHeight, buildingWidth, currentBuildingHeight);

    // Luzes das janelas
    if (animationProgress > 0.5) {
      fill(255, 255, 0, map(animationProgress, 0.5, 1, 0, 255)); // Luzes aparecendo
      let windowSize = buildingWidth / 6;
      for (let j = 0; j < floor(currentBuildingHeight / (windowSize * 2)); j++) {
        for (let k = 0; k < 2; k++) {
          rect(buildingX + windowSize + k * windowSize * 2,
            height - currentBuildingHeight + windowSize + j * windowSize * 2,
            windowSize, windowSize);
        }
      }
    }
  }

  // O trecho abaixo foi removido para tirar a escrita da animação:
  /*
  fill(255);
  textSize(36);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  let textAlpha = map(animationProgress, 0, 1, 0, 255); // O texto aparece e desaparece
  tint(255, textAlpha); // Aplica a transparência
  text("CONEXÃO CAMPO E CIDADE", width / 2, height / 2);
  noTint();
  */

  // Quando a animação terminar, muda para o estado de jogo
  if (animationProgress >= 1) {
    gameState = 'playing';
  }
}

// Helper function for easing (smooth animation)
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// --- Funções de Transição de Fase / Fim de Jogo ---
function drawPhaseCompleteScreen() {
  background(200, 255, 200); // Fundo verde claro para fase completa

  fill(0, 150, 0); // Texto verde escuro
  textSize(40);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(`FASE ${currentPhaseIndex + 1} CONCLUÍDA!`, width / 2, height / 2 - 50);

  fill(0);
  textSize(24);
  textStyle(NORMAL);
  text("Prepare-se para a próxima fase...", width / 2, height / 2 + 20);

  let continueButtonWidth = 200;
  let continueButtonHeight = 60;
  let continueButtonX = width / 2 - continueButtonWidth / 2;
  let continueButtonY = height / 2 + 100;

  fill(255, 200, 0); // Amarelo para o botão
  rect(continueButtonX, continueButtonY, continueButtonWidth, continueButtonHeight, 10);
  fill(50, 150, 50); // Verde escuro para o texto
  textSize(32);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("CONTINUAR", width / 2, continueButtonY + continueButtonHeight / 2);
}

function drawGameOverScreen() {
  // Background com gradiente vibrante de celebração
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c1 = color(255, 200, 0); // Amarelo
    let c2 = color(50, 150, 50); // Verde
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, i, width, i);
  }
  noStroke();

  fill(255); // Texto branco para contraste
  textSize(40);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("PARABÉNS!", width / 2, height / 2 - 30);

  fill(255); // Texto branco para contraste
  textSize(28);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  text("Você passou todas as fases!", width / 2, height / 2 + 20);

  let playAgainButtonWidth = 280; // Aumentei o tamanho
  let playAgainButtonHeight = 70;
  let playAgainButtonX = width / 2 - playAgainButtonWidth / 2;
  let playAgainButtonY = height / 2 + 100;

  // Botão JOGAR NOVAMENTE com cor vibrante e sombra sutil
  fill(255, 200, 0); // Amarelo vibrante
  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = 5;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
  rect(playAgainButtonX, playAgainButtonY, playAgainButtonWidth, playAgainButtonHeight, 15); // Cantos mais arredondados
  drawingContext.shadowOffsetX = 0; // Resetar sombra
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = 'transparent';

  fill(50, 150, 50); // Verde escuro para o texto
  textSize(26); // Texto maior
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("JOGAR NOVAMENTE", width / 2, playAgainButtonY + playAgainButtonHeight / 2);
}

// --- Funções do Jogo ---
function drawPhaseInfo() {
  fill(50, 150, 50); // Verde escuro
  textSize(24);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text(currentPhase.name, 20, 20);
}

function drawGrid() {
  let currentGridSize = currentPhase.gridSize;
  for (let i = 0; i < currentGridSize; i++) {
    for (let j = 0; j < currentGridSize; j++) {
      fill(220, 240, 180); // Fundo do quadrado (amarelo esverdeado claro)
      stroke(50, 150, 50); // Borda verde escuro
      strokeWeight(2);
      rect(gridXOffset + i * cellSize, gridYOffset + j * cellSize, cellSize, cellSize);

      let letter = grid[i][j];
      if (letter !== ' ') {
        fill(0); // Letras pretas
        textSize(cellSize * 0.5);
        textAlign(CENTER, CENTER);
        textStyle(NORMAL); // Explicitly set to NORMAL for grid letters
        text(letter.toUpperCase(), gridXOffset + i * cellSize + cellSize / 2, gridYOffset + j * cellSize + cellSize / 2);
      }
    }
  }

  for (let cell of currentSelection) {
    noStroke();
    fill(255, 255, 0, 150); // Amarelo semitransparente para seleção atual
    rect(gridXOffset + cell[0] * cellSize, gridYOffset + cell[1] * cellSize, cellSize, cellSize);
  }

  for (let wordObj of foundWords) {
    for (let cell of wordObj.cells) {
      noStroke();
      fill(0, 200, 0, 150); // Verde mais vibrante para palavras encontradas
      rect(gridXOffset + cell[0] * cellSize, gridYOffset + cell[1] * cellSize, cellSize, cellSize);
    }
  }
}

function drawWordList() {
  fill(50, 150, 50); // Verde escuro
  textSize(20);
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  let x = width / 2;
  let y = 60;

  text("PROCURE AS PALAVRAS:", x, y);

  textSize(18);
  let wordsPerRow = 5;
  let wordY = y + 30;
  let wordXSpacing = width / (wordsPerRow + 1);

  for (let i = 0; i < currentPhase.words.length; i++) {
    let currentWord = currentPhase.words[i];
    let col = i % wordsPerRow;
    let row = floor(i / wordsPerRow);

    let displayWord = currentWord.toUpperCase();
    if (foundWords.some(wordObj => wordObj.word.toUpperCase() === currentWord.toUpperCase())) {
      fill(0, 150, 0); // Verde escuro para palavra encontrada
      textStyle(BOLD);
      textAlign(CENTER, TOP);
      text(displayWord, wordXSpacing * (col + 1), wordY + (row * 25));
      stroke(0, 150, 0);
      strokeWeight(2);
      line(wordXSpacing * (col + 1) - textWidth(displayWord) / 2, wordY + (row * 25) + 10,
        wordXSpacing * (col + 1) + textWidth(displayWord) / 2, wordY + (row * 25) + 10);
      noStroke();
    } else {
      fill(0); // Preto para palavras não encontradas
      textStyle(NORMAL);
      textAlign(CENTER, TOP);
      text(displayWord, wordXSpacing * (col + 1), wordY + (row * 25));
    }
  }
}

function generateGrid() {
  let currentGridSize = currentPhase.gridSize;
  let maxAttemptsPerGrid = 100;
  let gridGeneratedSuccessfully = false;
  let finalGrid = [];

  for (let gridAttempt = 0; gridAttempt < maxAttemptsPerGrid && !gridGeneratedSuccessfully; gridAttempt++) {
    let tempGrid = [];
    for (let i = 0; i < currentGridSize; i++) {
      tempGrid[i] = [];
      for (let j = 0; j < currentGridSize; j++) {
        tempGrid[i][j] = ' ';
      }
    }

    let shuffledWords = shuffleArray([...currentPhase.words]);
    let wordsPlacedCount = 0;

    for (let word of shuffledWords) {
      let placed = false;
      let attempts = 0;
      const maxWordAttempts = 2000;
      while (!placed && attempts < maxWordAttempts) {
        let direction = random(currentPhase.directions);

        let x = floor(random(0, currentGridSize));
        let y = floor(random(0, currentGridSize));

        let dx = 0;
        let dy = 0;
        if (direction === "horizontal") {
          dx = 1;
          dy = 0;
        } else if (direction === "vertical") {
          dx = 0;
          dy = 1;
        }

        let reverseWord = random() < 0.5;
        let wordToPlace = reverseWord ? word.split('').reverse().join('') : word;

        let cellsToPlace = [];
        let canPlace = true;

        for (let i = 0; i < wordToPlace.length; i++) {
          let currentX = x + i * dx;
          let currentY = y + i * dy;

          if (currentX < 0 || currentX >= currentGridSize || currentY < 0 || currentY >= currentGridSize) {
            canPlace = false;
            break;
          }
          if (tempGrid[currentX][currentY] !== ' ' && tempGrid[currentX][currentY] !== wordToPlace[i].toLowerCase()) { // Compare lowercase
            canPlace = false;
            break;
          }
          cellsToPlace.push([currentX, currentY]);
        }

        if (canPlace) {
          for (let i = 0; i < cellsToPlace.length; i++) {
            let [cx, cy] = cellsToPlace[i];
            tempGrid[cx][cy] = wordToPlace[i].toLowerCase(); // Store in lowercase
          }
          placed = true;
          wordsPlacedCount++;
        }
        attempts++;
      }
    }

    if (wordsPlacedCount === currentPhase.words.length) {
      gridGeneratedSuccessfully = true;
      finalGrid = tempGrid;
    }
  }

  if (!gridGeneratedSuccessfully) {
    console.warn("Não foi possível colocar todas as palavras no grid após múltiplas tentativas. Algumas palavras podem estar faltando.");
    finalGrid = finalGrid.length > 0 ? finalGrid : createEmptyGrid(currentGridSize);
  }

  let fillerLetters = ["k", "w", "y", "z", "x", "j", "q", "v", "b", "c", "d", "f", "g", "h", "l", "m", "n", "p", "r", "s", "t"];
  for (let i = 0; i < currentGridSize; i++) {
    for (let j = 0; j < currentGridSize; j++) {
      if (finalGrid[i][j] === ' ') {
        finalGrid[i][j] = random(fillerLetters);
      }
    }
  }

  return finalGrid;
}

function createEmptyGrid(size) {
  let emptyGrid = [];
  for (let i = 0; i < size; i++) {
    emptyGrid[i] = [];
    for (let j = 0; j < size; j++) {
      emptyGrid[i][j] = ' ';
    }
  }
  return emptyGrid;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function checkPhaseCompletion() {
  if (foundWords.length === currentPhase.words.length) {
    if (currentPhaseIndex < phases.length - 1) {
      gameState = 'phase_complete';
    } else {
      gameState = 'game_over';
    }
  }
}

function mousePressed() {
  if (gameState === 'start') {
    let playButtonWidth = 180;
    let playButtonHeight = 70;
    let playButtonX = width / 2 - playButtonWidth / 2;
    let playButtonY = height / 2;
    if (mouseX > playButtonX && mouseX < playButtonX + playButtonWidth &&
      mouseY > playButtonY && mouseY < playButtonY + playButtonHeight) {
      animationStartTime = millis(); // Inicia o contador para a animação
      gameState = 'intro_animation'; // Muda para o estado de animação
      // initializePhase(currentPhaseIndex); // No need to re-initialize here, animation handles it
    }

    let instructionsButtonWidth = 220;
    let instructionsButtonHeight = 70;
    let instructionsButtonX = width / 2 - instructionsButtonWidth / 2;
    let instructionsButtonY = playButtonY + playButtonHeight + 30;
    if (mouseX > instructionsButtonX && mouseX < instructionsButtonX + instructionsButtonWidth &&
      mouseY > instructionsButtonY && mouseY < instructionsButtonY + instructionsButtonHeight) {
      gameState = 'instructions';
    }

    // "Conexão Campo e Cidade" button logic
    let conexaoButtonWidth = 300;
    let conexaoButtonHeight = 70;
    let conexaoButtonX = width / 2 - conexaoButtonWidth / 2;
    let conexaoButtonY = instructionsButtonY + instructionsButtonHeight + 30;
    if (mouseX > conexaoButtonX && mouseX < conexaoButtonX + conexaoButtonWidth &&
      mouseY > conexaoButtonY && mouseY < conexaoButtonY + conexaoButtonHeight) {
      gameState = 'conexao_info';
    }

  } else if (gameState === 'playing') {
    let currentGridSize = currentPhase.gridSize;
    let x = floor((mouseX - gridXOffset) / cellSize);
    let y = floor((mouseY - gridYOffset) / cellSize);

    if (x >= 0 && x < currentGridSize && y >= 0 && y < currentGridSize) {
      currentSelection = [];
      currentSelection.push([x, y]);
    } else {
      currentSelection = [];
    }
  } else if (gameState === 'instructions') {
    let backButtonWidth = 150;
    let backButtonHeight = 60;
    let backButtonX = width / 2 - backButtonWidth / 2;
    let backButtonY = height - 100;
    if (mouseX > backButtonX && mouseX < backButtonX + backButtonWidth &&
      mouseY > backButtonY && mouseY < backButtonY + backButtonHeight) {
      gameState = 'start';
    }
  } else if (gameState === 'conexao_info') { // Back button for "Conexão Campo e Cidade" info
    let backButtonWidth = 150;
    let backButtonHeight = 60;
    let backButtonX = width / 2 - backButtonWidth / 2;
    let backButtonY = height - 100;
    if (mouseX > backButtonX && mouseX < backButtonX + backButtonWidth &&
      mouseY > backButtonY && mouseY < backButtonY + backButtonHeight) {
      gameState = 'start';
    }
  } else if (gameState === 'phase_complete') {
    let continueButtonWidth = 200;
    let continueButtonHeight = 60;
    let continueButtonX = width / 2 - continueButtonWidth / 2;
    let continueButtonY = height / 2 + 100;
    if (mouseX > continueButtonX && mouseX < continueButtonX + continueButtonWidth &&
      mouseY > continueButtonY && mouseY < continueButtonY + continueButtonHeight) {
      initializePhase(currentPhaseIndex + 1);
      gameState = 'playing';
    }
  } else if (gameState === 'game_over') {
    let playAgainButtonWidth = 280;
    let playAgainButtonHeight = 70;
    let playAgainButtonX = width / 2 - playAgainButtonWidth / 2;
    let playAgainButtonY = height / 2 + 100;
    if (mouseX > playAgainButtonX && mouseX < playAgainButtonX + playAgainButtonWidth &&
      mouseY > playAgainButtonY && mouseY < playAgainButtonY + playAgainButtonHeight) {
      currentPhaseIndex = 0;
      initializePhase(currentPhaseIndex);
      gameState = 'playing';
    }
  }
}

function mouseDragged() {
  if (gameState === 'playing') {
    let currentGridSize = currentPhase.gridSize;
    let x = floor((mouseX - gridXOffset) / cellSize);
    let y = floor((mouseY - gridYOffset) / cellSize);

    if (x >= 0 && x < currentGridSize && y >= 0 && y < currentGridSize) {
      let lastCell = currentSelection[currentSelection.length - 1];
      let currentCell = [x, y];

      if (lastCell && (lastCell[0] !== x || lastCell[1] !== y)) {
        if (isValidNextCell(currentSelection[0], currentCell, currentSelection)) {
          // Check if the current cell is already in the selection to prevent duplicates
          let alreadySelected = currentSelection.some(cell => cell[0] === x && cell[1] === y);
          if (!alreadySelected) {
            currentSelection.push(currentCell);
          }
        } else {
          // If the new cell doesn't follow the current selection's direction, start a new selection
          currentSelection = [currentCell];
        }
      }
    }
  }
}

function mouseReleased() {
  if (gameState === 'playing') {
    let selectedWord = getSelectedWord();
    let lowerCaseSelectedWord = selectedWord ? selectedWord.toLowerCase() : null;

    if (lowerCaseSelectedWord) {
      let originalWord = currentPhase.words.find(w =>
        w.toLowerCase() === lowerCaseSelectedWord ||
        w.toLowerCase() === lowerCaseSelectedWord.split('').reverse().join('')
      );

      if (originalWord && !foundWords.some(wordObj => wordObj.word.toLowerCase() === originalWord.toLowerCase())) {
        foundWords.push({
          word: originalWord,
          cells: [...currentSelection]
        });
      }
    }
    currentSelection = [];
  }
}

function getSelectedWord() {
  if (currentSelection.length < 1) return null;
  if (currentSelection.length === 1) return grid[currentSelection[0][0]][currentSelection[0][1]];

  let firstCell = currentSelection[0];
  let secondCell = currentSelection[1];

  let dx = 0;
  let dy = 0;

  // Determine the direction based on the first two selected cells
  if (currentSelection.length > 1) {
    dx = secondCell[0] - firstCell[0];
    dy = secondCell[1] - firstCell[1];

    // Normalize dx and dy to -1, 0, or 1
    dx = dx === 0 ? 0 : (dx > 0 ? 1 : -1);
    dy = dy === 0 ? 0 : (dy > 0 ? 1 : -1);
  }

  let word = "";
  let previousX = firstCell[0];
  let previousY = firstCell[1];
  word += grid[previousX][previousY];

  for (let i = 1; i < currentSelection.length; i++) {
    let [cx, cy] = currentSelection[i];
    // Check if the current cell is indeed the next cell in the determined direction
    if (cx === previousX + dx && cy === previousY + dy) {
      word += grid[cx][cy];
      previousX = cx;
      previousY = cy;
    } else {
      // If the selection deviates from a straight line, it's not a valid word
      return null;
    }
  }
  return word;
}

function getDirectionFromDelta(dx, dy) {
  if (dx === 1 && dy === 0) return "horizontal"; // Right
  if (dx === -1 && dy === 0) return "horizontal"; // Left
  if (dx === 0 && dy === 1) return "vertical"; // Down
  if (dx === 0 && dy === -1) return "vertical"; // Up
  return null;
}

function isValidNextCell(startCell, currentDraggedCell, allSelectedCells) {
  if (allSelectedCells.length === 0) return true; // First cell is always valid

  let [sX, sY] = startCell;
  let [cdX, cdY] = currentDraggedCell;

  // If only one cell is selected, check if the second cell creates a valid starting direction
  if (allSelectedCells.length === 1) {
    let deltaX = cdX - sX;
    let deltaY = cdY - sY;

    // Must be adjacent and not the same cell
    if (abs(deltaX) > 1 || abs(deltaY) > 1 || (deltaX === 0 && deltaY === 0)) {
      return false;
    }

    let canonicalDirection = getDirectionFromDelta(deltaX, deltaY);
    // Ensure the direction is allowed in the current phase
    return currentPhase.directions.includes(canonicalDirection);

  } else {
    // If more than one cell is selected, ensure the new cell continues the established direction
    let firstTwoDx = allSelectedCells[1][0] - allSelectedCells[0][0];
    let firstTwoDy = allSelectedCells[1][1] - allSelectedCells[0][1];

    // Normalize the established direction
    firstTwoDx = firstTwoDx === 0 ? 0 : (firstTwoDx > 0 ? 1 : -1);
    firstTwoDy = firstTwoDy === 0 ? 0 : (firstTwoDy > 0 ? 1 : -1);

    let lastSelectedCell = allSelectedCells[allSelectedCells.length - 1];
    let [lx, ly] = lastSelectedCell;

    // Check if the current dragged cell is the next cell in the established direction
    return (cdX === lx + firstTwoDx && cdY === ly + firstTwoDy);
  }
}