/*
  Contains basic properties of the game
  like player's data, computer's data,
  checks has anyone won the game either
  we have to continue the battle!
*/
let seaBattleGame = null;
let computerTurnTime = 500; // how much milliseconds does it take for computer to make a turn

/*
  Function which allows to include other JS files into the page
*/
const includeScript = (where, path) => {
  const script = document.createElement('script');

  script.onload = () => console.log(`Script "${path}" was added to the DOM, loaded and is ready now.`);
  script.type = "text/javascript";
  script.src = path;
  script.defer = true;
  script.async = false;

  where.appendChild(script);
};

/*
  Calls when the page is fully loaded
*/
window.onload = function () {
  helloWorld();
  configureApp();
  showStartScreen();
};


/*
  Tells about me
*/
const helloWorld = () => {
  console.warn(
    `
    Hello! My name is Sergey Vakhramov.
    This is a simple Sea Battle game.

    You can play it online at: https://seabattle.vakhramoff.ru/

    The source code is available at GitHub: https://github.com/vakhramoff/SeaBattle
    `
  );
};


/*
  Making-up our page
*/
const configureApp = () => {
  const app = document.getElementById('app');
  const head = document.getElementsByTagName('head')[0];
  const title = '\n\n<!-- Scripts -->\n';
  const scriptsPaths = ['js/Models/Game.js', 'js/Models/Player.js', 'js/Models/Field.js', 'js/Models/Ship.js'];

  // Configure "app" appearance
  app.className += "centered"; // Center the app on the screen

  // Inserting modules to the page
  head.innerHTML += title;

  // The order matters. See includeScript() method's description.
  scriptsPaths.forEach(path => includeScript(head, path));
};


/*
  Starts new game
*/
const startNewGame = () => {
  showShipsArrangementScreen();
};


/*
  Shows start screen:
  To continue you've to push the "Start New Game" button
*/
const showStartScreen = () => {
  const app = document.getElementById('app');
  const windowTitle = document.createElement("div");
  const startButton = document.createElement("button");

  app.innerHTML = '';

  windowTitle.className = "gameNameLabel";
  windowTitle.className += " centeredText";
  windowTitle.innerHTML = 'Sea Battle &#9875;';

  startButton.textContent = "Start New Game";
  startButton.className += "bigButton";
  startButton.onclick = () => showInputNameScreen();

  app.appendChild(windowTitle);
  app.appendChild(startButton);
};


/*
  Shows screen where player inputs his name:
  To continue you've to type your name and push the "That's my name!" button
*/
const showInputNameScreen = () => {
  const app = document.getElementById('app');
  const nameDiv = document.createElement('div');
  const nameField = document.createElement('input');
  const windowTitle = document.createElement("div");
  const confirmNameButton = document.createElement("button");

  app.innerHTML = '';

  windowTitle.className = "windowTitleLabel";
  windowTitle.className += " centeredText";
  windowTitle.innerHTML = 'Who are you? Fill in your name. &#9881;';

  nameField.id = "userName";
  nameField.className = "inputField";
  nameField.className += " centeredText";
  nameField.value = "Vladimir Putin";
  nameField.setAttribute("maxlength", 20);
  nameField.setAttribute("placeholder", "Your name");

  confirmNameButton.textContent = "That's my name!";
  confirmNameButton.className = "bigButton";
  confirmNameButton.onclick = () => {
    if (validateNameField("userName", "Name")) {
      const name = document.getElementById("userName").value;
      const player = new Player(name);
      
      // if (seaBattleGame === null)
      {
        seaBattleGame = new Game();
        seaBattleGame.player = player;
      }

      showShipsArrangementScreen();
    }
  };
  
  app.appendChild(windowTitle);
  nameDiv.appendChild(nameField);
  app.appendChild(nameDiv);
  app.appendChild(confirmNameButton);
};


/*
  Checks whether input is empty or not
*/
const validateNameField = (fieldName, nameForAlert) => {
  const fieldText = document.getElementById(fieldName).value;

  if (fieldText !== "") {
    return true;
  } else {
    alert(nameForAlert + " shouldn't be empty!");
    return false;
  }
};


/*
  Shows screen where user generates ships' arrangement:
  To continue you've to push the "Let's go!" button
*/
function showShipsArrangementScreen() {
  const app = document.getElementById('app');
  const windowTitle = document.createElement("div");
  const fields = document.createElement('div');
  const leftField = document.createElement('div');
  const playerName = document.createElement('div');
  const playerField = document.createElement("table");
  const rightField = document.createElement('div');
  const rearrangeShipsButton = document.createElement("button");

  app.innerHTML = '';

  windowTitle.className = "windowTitleLabel";
  windowTitle.className += " centeredText";
  windowTitle.innerHTML = 'Arrange your ships &#128755;'; //&#9752;

  fields.id = "fields";

  leftField.id = "leftField";
  playerName.id = "playerNameLabel";
  playerName.className = "userNameLabel";
  playerName.className += " centeredText";
  playerName.innerHTML = seaBattleGame.player.name;
  playerField.id = "playerField";
  playerField.innerHTML = generateFieldTable("player");

  rightField.id = "rightField";
  rightField.innerHTML = '';

  rearrangeShipsButton.textContent = "Rearrange Ships";
  rearrangeShipsButton.className = "smallButton";
  rearrangeShipsButton.onclick = () => {
    seaBattleGame.player.field.generateShipsArrangement();
    seaBattleGame.computer.field.generateShipsArrangement();
    drawCells(true);
  };

  const startGameButton = document.createElement("button");
  startGameButton.textContent = "Let's go!";
  startGameButton.className = "smallButton";
  startGameButton.onclick = () => {
    showGameScreen();
  };

  app.appendChild(windowTitle);
  leftField.appendChild(playerName);
  leftField.appendChild(playerField);
  fields.appendChild(leftField);
  fields.appendChild(rightField);
  app.appendChild(fields);
  leftField.appendChild(rearrangeShipsButton);
  leftField.appendChild(startGameButton);

  // Generating first arrangement of the ships
  rearrangeShipsButton.onclick();
}


/*
  Shows game screen itself:
  the left field is a field with player's ships
  the right field is a field with computer's ships
*/
function showGameScreen() {
  const app = document.getElementById('app');
  const windowTitle = document.createElement("div");
  const fields = document.createElement('div');
  const leftField = document.createElement('div');
  const playerName = document.createElement('div');
  const playerField = document.createElement("table");
  const rightField = document.createElement('div');
  const computerName = document.createElement('div');
  const computerField = document.createElement("table");
  const gameStatusTitle = document.createElement("div");
  const startButton = document.createElement("button");

  app.innerHTML = '';

  windowTitle.id = "gameTitle";
  windowTitle.className = "windowTitleLabel";
  windowTitle.className += " centeredText";
  windowTitle.innerHTML = 'Have a good luck! &#9752;';

  fields.id = "fields";

  leftField.id = "leftField";
  playerName.id = "playerNameLabel";
  playerName.className = "userNameLabel";
  playerName.className += " centeredText";
  playerName.innerHTML = seaBattleGame.player.name;
  playerField.id = "playerField";
  playerField.innerHTML = generateFieldTable("player");

  rightField.id = "rightField";
  computerName.id = "computerNameLabel";
  computerName.className = "userNameLabel";
  computerName.className += " centeredText";
  computerName.innerHTML = seaBattleGame.computer.name;
  computerField.id = "computerField";
  computerField.innerHTML = generateFieldTable("computer", false);

  gameStatusTitle.id = "gameStatus";
  gameStatusTitle.className = "gameStatusLabel";
  gameStatusTitle.className += " centeredText";
  gameStatusTitle.innerHTML = 'Developer\'s turn! &#128069;';

  startButton.textContent = "Start New Game";
  startButton.className += "smallButton";
  startButton.onclick = () => {
    startNewGame();
    showShipsArrangementScreen();
  };
  
  app.appendChild(windowTitle);
  leftField.appendChild(playerName);
  leftField.appendChild(playerField);
  rightField.appendChild(computerName);
  rightField.appendChild(computerField);
  fields.appendChild(leftField);
  fields.appendChild(rightField);
  app.appendChild(fields);
  app.appendChild(gameStatusTitle);
  app.appendChild(startButton);

  drawCells();
  renderGameStatus();

  if (seaBattleGame.whoTurns === 1) {
    makeArtificialIntelligenceTurn();
  }
}

/*
  Fires the cell with ID like "playerID_I_J"
  fireCell("player_1_1") eans that shot is applied to player's field at (1, 1) coordinate
*/
const fireCell = (cellId) => {
  if (seaBattleGame.gameIsOver || seaBattleGame.whoTurns === 1) {
    if (seaBattleGame.gameIsOver) {
      drawCells();
    }

    return ;
  }

  const values = cellId.split("_");
  const coordinateI = parseInt(values[1], 10);
  const coordinateJ = parseInt(values[2], 10);

  let isEnd;

  let playerId = values[0];
  let isGoodShot = FieldCellTypes.missed;

  if (playerId === "computer") {
    isGoodShot = seaBattleGame.computer.attackCell( { i: coordinateI, j: coordinateJ } );

    document.getElementById(cellId).setAttribute('onclick', '');
  }

  isEnd = seaBattleGame.checkEnd();

  if (!isEnd) {
    if (isGoodShot !== FieldCellTypes.injured && isGoodShot !== FieldCellTypes.killed) {
      changeTurn();
      makeArtificialIntelligenceTurn();
    }
  } else {
    seaBattleGame.player.looseField();
    seaBattleGame.computer.looseField();
    renderWinnerStatus();
  }

  drawCells();
};

/*
  Stupid AI turn
*/
const makeArtificialIntelligenceTurn = async () => {
  if (seaBattleGame.gameIsOver) {
    drawCells();

    return ;
  }

  let isGoodShot = FieldCellTypes.missed;

  while (true) {
    await sleep(computerTurnTime);

    const pointToShot = artificialIntelligenceCalculateBestPointToShot();
    isGoodShot = seaBattleGame.player.attackCell(pointToShot);

    let isEnd = seaBattleGame.checkEnd();

    if (!isEnd) {
      if (isGoodShot !== FieldCellTypes.injured && isGoodShot !== FieldCellTypes.killed) {
        drawCells();
        changeTurn();
        break;
      }
    } else {
      seaBattleGame.player.looseField();
      seaBattleGame.computer.looseField();
      renderWinnerStatus();
    }

    drawCells();
  }
};


/*
  Another function which supplies our stupid AI
  with choosing a coordinate where to apply their rockets
*/
const artificialIntelligenceCalculateBestPointToShot = () => {
  const playerField = seaBattleGame.player.shareFieldWithoutAlives();
  const injuredPoints = injuredCoordinates(playerField);
  const emptyEvenPoints = emptyEvenCoordinates(playerField);

  let emptyPoints = emptyCoordinates(playerField);
  let pointsToShot = [];

  if (emptyEvenPoints.length > 0)
    emptyPoints = emptyEvenPoints;

  if (injuredPoints.length > 0) {
    pointsToShot = coordinatesToShot(playerField, injuredPoints);
  } else {
    pointsToShot = emptyPoints;
  }

  return pointsToShot[ getRandomInt(0, pointsToShot.length - 1) ];
};


/*
  Changes who turns now and renders the status label
*/
const changeTurn = () => {
  seaBattleGame.changeTurn();
  renderGameStatus();
};

/*
  Renders the status label (shows who turns)
*/
const renderGameStatus = () => {
  const gameStatusTitle = document.getElementById("gameStatus");

  let playerName = "";

  switch (seaBattleGame.whoTurns) {
    case 0:
        playerName = seaBattleGame.player.name;
      break;
    case 1:
        playerName = seaBattleGame.computer.name;
      break;
  }

  gameStatusTitle.innerHTML = playerName + '\'s turn! &#128163;';
};


/*
  Renders the status label (shows who has won)
*/
const renderWinnerStatus = () => {
  const gameStatusTitle = document.getElementById("gameStatus");

  gameStatusTitle.innerHTML = seaBattleGame.winner + '\'s won the game! &#128165;';
};


/*
  Generates HTML to show the field
*/
const generateFieldTable = (fieldId, isUserField = true) => {
  const alphabets = 'ABCDEFGHIJ';
  let header = '<th class="hiddenBorder"></th>';
  
  for (let i = 0, n = alphabets.length; i < n; ++i) {
    header += '<th class="hiddenBorder">' + alphabets.charAt(i) + '</th>';
  }

  let result = '<tr>' + header + '</tr>';
  for (let i = 0; i < 10; i++) {
    result += '<tr><th class="hiddenBorder">' + (i + 1) + '</th>';
    for (j = 0; j < 10; j++) {
      if (isUserField) {
        result += '<th class="cell ' + fieldId + '" id="' + fieldId + '_' + i + '_' + j + '"></th>';
      } else {
        result += '<th class="cell ' + fieldId + '" id="' + fieldId + '_' + i + '_' + j + '" onclick="fireCell(\'' + fieldId + '_' + i + '_' + j + '\')"></th>';
      }
    }
    result += '</tr>';
  }
  return result;
};

/*
  Draws the cell at the field with ID like "playerID_I_J"
  drawCell("player_1_1", FieldCellTypes.injured) draw an injured cell at (1, 1) coordinate on the player's field
  
  "FieldCellTypes" is described at ../Models/Field.js
*/
const drawCell = (fieldId, newCellState) => {
  switch (newCellState) {
    case FieldCellTypes.empty:
      document.getElementById(fieldId).innerHTML = '';
      document.getElementById(fieldId).className = 'empty';
      break;

    case FieldCellTypes.missed:
      document.getElementById(fieldId).innerHTML = '&#9679;';
      document.getElementById(fieldId).className = 'missed';
      break;
      
    case FieldCellTypes.missedAuto:
      document.getElementById(fieldId).innerHTML = '&#9728;';
      document.getElementById(fieldId).className = 'missedAuto';
      break;
      
    case FieldCellTypes.injured:
        document.getElementById(fieldId).innerHTML = '&#9587;';
        document.getElementById(fieldId).className = 'ship';
        document.getElementById(fieldId).className += ' injured';
      break;
      
    case FieldCellTypes.killed:
        document.getElementById(fieldId).innerHTML = '&#9587;';
        document.getElementById(fieldId).className = 'ship';
        document.getElementById(fieldId).className += ' killed';
      break;
  
    case FieldCellTypes.killedAuto:
      document.getElementById(fieldId).innerHTML = '&#9587;';
      document.getElementById(fieldId).className = 'ship';
      document.getElementById(fieldId).className += ' killedAuto';
      break;

    case FieldCellTypes.alive:
      document.getElementById(fieldId).innerHTML = '';
      document.getElementById(fieldId).className = 'ship';
      document.getElementById(fieldId).className += ' alive';
      break;
              
  }
};


/*
  Draws all cells at once (like updates all the fields)

  onlyPlayer: if true, updates only player's field
*/
const drawCells = (onlyPlayer = false) => {
  const playerCells = seaBattleGame.player.field.field;
  const computerCells = seaBattleGame.computer.field.field;

  for (let i = 0; i <= 9; ++i) {
    for (let j = 0; j <= 9; ++j) {
      const playerCellType = playerCells[i][j];
      drawCellByCoordinates("player", i, j, playerCellType);

      if (!onlyPlayer) {
        const computerCellType = computerCells[i][j];
        
        if (computerCellType !== FieldCellTypes.alive) {
          drawCellByCoordinates("computer", i, j, computerCellType);
        }
        
        if (computerCellType === FieldCellTypes.missedAuto || computerCellType === FieldCellTypes.missed) {
          const cellId = "computer_" + i + "_" + j;

          document.getElementById(cellId).setAttribute('onclick', '');
        }
      }
    }
  }
};


/*
  Draws a cell at specific (i, j) coordinates on the "fieldName" field with "newCellState"
*/
const drawCellByCoordinates = (fieldName, i, j, newCellState) => {
  let fieldId = fieldName + '_' + i + '_' + j;

  drawCell(fieldId, newCellState);
};


/*
  Returns ABS random integer (crutch-fix to avoid values like "-0")
*/
const getRandomInt = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);

  rand = Math.round(rand);

  return rand;
};


/*
  Let's sleep a little-bit
*/
const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
