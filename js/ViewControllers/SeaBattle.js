/*
  Contains basic properties of the game
  like player's data, computer's data,
  checks has anyone won the game either
  we have to continue the battle!
*/
var seaBattleGame = null;
var computerTurnTime = 500; // how much milliseconds does it take for computer to make a turn

/*
  Function which allows to include other JS files into the page
*/
function includeScript(where, path) {
  var script = document.createElement('script');
  script.onload = function() {
    console.log("Script \"" + path + "\" was loaded and is now ready!");
  };
  script.type = "text/javascript";
  script.src = path;
  where.appendChild(script);
}

/*
  Calls when the page is fully loaded
*/
window.onload = function () {
  helloWorld();
  
  configureApp();
  showStartScreen();
  // showInputNameScreen();
  // showShipsArrangementScreen();
  // showGameScreen();
};


/*
  Tells about me
*/
function helloWorld() {
  console.log("Hello! My name is Sergey Vakhramov.");
  console.log("This is a simple Sea Battle game.");
  console.log("\n\n");
  console.log("You can play it online at: https://seabattle.vakhramoff.ru/");
  console.log("\n");
  console.log("Source code is available at @vakhramoff's GitHub!");
  console.log("\n\n\n\n");
}


/*
  Making-up our page
*/
function configureApp() {
  // Configure "app" appearance
  var app = document.getElementById('app');
  app.className += "centered"; // Center the app on the screen

  // Inserting modules to the page
  var head = document.getElementsByTagName('head')[0];
  title = '\n\n<!-- Scripts -->\n';
  head.innerHTML += title;

  scriptsPaths = ['js/Models/Game.js', 'js/Models/Player.js', 'js/Models/Field.js', 'js/Models/Ship.js', 'js/EasterEgg.js'];
  scriptsPaths.forEach(path => {
    includeScript(head, path);
  });
}


/*
  Starts new game
*/
function startNewGame() {
  showShipsArrangementScreen();
}


/*
  Shows start screen:
  To continue you've to push the "Start New Game" button
*/
function showStartScreen() {
  var app = document.getElementById('app');
  app.innerHTML = '';

  var windowTitle = document.createElement("div");
  windowTitle.className = "gameNameLabel";
  windowTitle.className += " centeredText";
  windowTitle.innerHTML = 'Sea Battle &#9875;';
  app.appendChild(windowTitle);

  var startButton = document.createElement("button");
  startButton.textContent = "Start New Game";
  startButton.className += "bigButton";
  startButton.onclick = function () {
    showInputNameScreen();
  }
  app.appendChild(startButton);
}


/*
  Shows screen where player inputs his name:
  To continue you've to type your name and push the "That's my name!" button
*/
function showInputNameScreen() {
  var app = document.getElementById('app');
  app.innerHTML = '';

  var windowTitle = document.createElement("div");
  windowTitle.className = "windowTitleLabel";
  windowTitle.className += " centeredText";
  windowTitle.innerHTML = 'Who are you? Fill in your name. &#9881;';
  app.appendChild(windowTitle);

  var nameDiv = document.createElement('div');
  var nameField = document.createElement('input');
  nameField.id = "userName";
  nameField.className = "inputField";
  nameField.className += " centeredText";
  nameField.value = "Vladimir Putin";
  nameField.setAttribute("maxlength", 20);
  nameField.setAttribute("placeholder", "Your name");
  nameDiv.appendChild(nameField);
  app.appendChild(nameDiv);

  var confirmNameButton = document.createElement("button");
  confirmNameButton.textContent = "That's my name!";
  confirmNameButton.className = "bigButton";
  confirmNameButton.onclick = function () {
    if (validateNameField("userName", "Name")) {
      let name = document.getElementById("userName").value;
      let player = new Player(name);
      
      if (seaBattleGame === null) {
        seaBattleGame = new Game();
        seaBattleGame.player = player;
      }

      showShipsArrangementScreen();
    }
  }
  app.appendChild(confirmNameButton);
}


/*
  Checks whether input is empty or not
*/
function validateNameField(fieldName, nameForAlert) {
  var fieldText = document.getElementById(fieldName).value;
  if (fieldText !== "") {
    return true;
  } else {
    alert(nameForAlert + " shouldn't be empty!");
    return false;
  }
}


/*
  Shows screen where user generates ships' arrangement:
  To continue you've to push the "Let's go!" button
*/
function showShipsArrangementScreen() {
  var app = document.getElementById('app');
  app.innerHTML = '';

  var windowTitle = document.createElement("div");
  windowTitle.className = "windowTitleLabel";
  windowTitle.className += " centeredText";
  windowTitle.innerHTML = 'Arrange your ships &#128755;'; //&#9752;
  app.appendChild(windowTitle);

  var fields = document.createElement('div');
  fields.id = "fields";

  var leftField = document.createElement('div');
  leftField.id = "leftField";
  var playerName = document.createElement('div');
  playerName.id = "playerNameLabel";
  playerName.className = "userNameLabel";
  playerName.className += " centeredText";
  playerName.innerHTML = seaBattleGame.player.name;
  var playerField = document.createElement("table");
  playerField.id = "playerField";
  playerField.innerHTML = generateFieldTable("player");
  leftField.appendChild(playerName);
  leftField.appendChild(playerField);

  var rightField = document.createElement('div');
  rightField.id = "rightField";
  rightField.innerHTML = '';

  fields.appendChild(leftField);
  fields.appendChild(rightField);
  app.appendChild(fields);

  var rearrangeShipsButton = document.createElement("button");
  rearrangeShipsButton.textContent = "Rearrange Ships";
  rearrangeShipsButton.className = "smallButton";
  rearrangeShipsButton.onclick = function () {
    seaBattleGame.player.field.generateShipsArrangement();
    seaBattleGame.computer.field.generateShipsArrangement();
    drawCells(true);
  }
  leftField.appendChild(rearrangeShipsButton);

  var startGameButton = document.createElement("button");
  startGameButton.textContent = "Let's go!";
  startGameButton.className = "smallButton";
  startGameButton.onclick = function () {
    showGameScreen();
  }
  leftField.appendChild(startGameButton);

  rearrangeShipsButton.onclick();
}


/*
  Shows game screen itself:
  the left field is a field with player's ships
  the right field is a field with computer's ships
*/
function showGameScreen() {
  var app = document.getElementById('app');
  app.innerHTML = '';

  var windowTitle = document.createElement("div");
  windowTitle.id = "gameTitle";
  windowTitle.className = "windowTitleLabel";
  windowTitle.className += " centeredText";
  windowTitle.innerHTML = 'Have a good luck! &#9752;';
  app.appendChild(windowTitle);

  fields = document.createElement('div');
  fields.id = "fields";

  var leftField = document.createElement('div');
  leftField.id = "leftField";
  var playerName = document.createElement('div');
  playerName.id = "playerNameLabel";
  playerName.className = "userNameLabel";
  playerName.className += " centeredText";
  playerName.innerHTML = seaBattleGame.player.name;
  var playerField = document.createElement("table");
  playerField.id = "playerField";
  playerField.innerHTML = generateFieldTable("player");
  leftField.appendChild(playerName);
  leftField.appendChild(playerField);

  var rightField = document.createElement('div');
  rightField.id = "rightField";
  var computerName = document.createElement('div');
  computerName.id = "computerNameLabel";
  computerName.className = "userNameLabel";
  computerName.className += " centeredText";
  computerName.innerHTML = seaBattleGame.computer.name;
  var computerField = document.createElement("table");
  computerField.id = "computerField";
  computerField.innerHTML = generateFieldTable("computer", false);
  rightField.appendChild(computerName);
  rightField.appendChild(computerField);

  fields.appendChild(leftField);
  fields.appendChild(rightField);
  app.appendChild(fields);

  var gameStatusTitle = document.createElement("div");
  gameStatusTitle.id = "gameStatus";
  gameStatusTitle.className = "gameStatusLabel";
  gameStatusTitle.className += " centeredText";
  gameStatusTitle.innerHTML = 'Developer\'s turn! &#128069;';
  app.appendChild(gameStatusTitle);

  var startButton = document.createElement("button");
  startButton.textContent = "Start New Game";
  startButton.className += "smallButton";
  startButton.onclick = function () {
    startNewGame();
    showShipsArrangementScreen();
  }
  // startButton.style.visibility = 'hidden';
  // startButton.style.visibility = 'visible';
  app.appendChild(startButton);
  drawCells();
  renderGameStatus();

  if (seaBattleGame.whoTurns === 1)
    artificialIntelligenceTurn();
}

/*
  Fires the cell with ID like "playerID_I_J"
  fireCell("player_1_1") eans that shot is applied to player's field at (1, 1) coordinate
*/
function fireCell(cellId) {
  // console.log(cellId);
  if (seaBattleGame.gameIsOver || seaBattleGame.whoTurns === 1) {
    if (seaBattleGame.gameIsOver) {
      drawCells();
    }
    return ;
}

  var values = cellId.split("_");
  var playerId = values[0];
  var coordinateI = parseInt(values[1], 10);
  var coordinateJ = parseInt(values[2], 10);

  // console.log(values);

  var goodShot = FieldCellTypes.missed;
  if (playerId = "computer") {
    document.getElementById(cellId).setAttribute('onclick', '');
    goodShot = seaBattleGame.computer.attackCell( { i: coordinateI, j: coordinateJ } );
  }

  // console.log(goodShot);
  var end = seaBattleGame.checkEnd();

  if (!end) {
    if (goodShot !== FieldCellTypes.injured && goodShot !== FieldCellTypes.killed) {
      changeTurn();
      artificialIntelligenceTurn();
    }
  } else {
    seaBattleGame.player.looseField();
    seaBattleGame.computer.looseField();
    renderWinnerStatus();
  }

  drawCells();
}

/*
  Stupid AI turn
*/
async function artificialIntelligenceTurn() {
  if (seaBattleGame.gameIsOver) {
    drawCells();
    return;
  }

  var goodShot = FieldCellTypes.missed;
  while (true) {
    await sleep(computerTurnTime);

    var pointToShot = artificialIntelligenceCalculateBestPointToShot();

    goodShot = seaBattleGame.player.attackCell(pointToShot);

    var end = seaBattleGame.checkEnd();

    if (!end) {
      if (goodShot !== FieldCellTypes.injured && goodShot !== FieldCellTypes.killed) {
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
}


/*
  Anothet function which supplies our stupid AI
  with choosing a coordinate where to apply their rockets
*/
function artificialIntelligenceCalculateBestPointToShot() {
  var playerField = seaBattleGame.player.shareFieldWithoutAlives();
  var emptyPoints = emptyCoordinates(playerField);
  var injuredPoints = injuredCoordinates(playerField);
  var emptyEvenPoints = emptyEvenCoordinates(playerField);

  if (emptyEvenPoints.length > 0)
    emptyPoints = emptyEvenPoints;

  var pointsToShot = [];

  if (injuredPoints.length > 0) {
    pointsToShot = coordinatesToShot(playerField, injuredPoints);
  } else {

    pointsToShot = emptyPoints;
  }
  return pointsToShot[ getRandomInt(0, pointsToShot.length - 1) ];
}


/*
  Changes who turns now and renders the status label
*/
changeTurn = function () {
  seaBattleGame.changeTurn();
  renderGameStatus();
}

/*
  Renders the status label (shows who turns)
*/
renderGameStatus = function () {
  var gameStatusTitle = document.getElementById("gameStatus");
  var playerName = "";
  switch (seaBattleGame.whoTurns) {
    case 0:
        playerName = seaBattleGame.player.name;
      break;
    case 1:
        playerName = seaBattleGame.computer.name;
      break;
  }
  gameStatusTitle.innerHTML = playerName + '\'s turn! &#128163;';
}


/*
  Renders the status label (shows who has won)
*/
renderWinnerStatus = function () {
  var gameStatusTitle = document.getElementById("gameStatus");
  gameStatusTitle.innerHTML = seaBattleGame.winner + '\'s won the game! &#128165;';
}


/*
  Generates HTML to show the field
*/
function generateFieldTable(fieldId, isUserField = true) {
  var header = '<th class="hiddenBorder"></th>';
  var alphabets = 'ABCDEFGHIJ';
  for (var i = 0, n = alphabets.length; i < n; ++i) {
    header += '<th class="hiddenBorder">' + alphabets.charAt(i) + '</th>';
  }

  var result = '<tr>' + header + '</tr>';
  for (i = 0; i < 10; i++) {
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
}

/*
  Draws the cell at the field with ID like "playerID_I_J"
  drawCell("player_1_1", FieldCellTypes.injured) draw an injured cell at (1, 1) coordinate on the player's field
  
  "FieldCellTypes" is described at ../Models/Field.js
*/
function drawCell(fieldId, newCellState) {
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
}


/*
  Draws all cells at once (like updates all the fields)

  onlyPlayer: if true, updates only player's field
*/
function drawCells(onlyPlayer = false) {
  var playerCells = seaBattleGame.player.field.field;
  var computerCells = seaBattleGame.computer.field.field;

  for (var i = 0; i <= 9; ++i) {
    for (var j = 0; j <= 9; ++j) {
      let playerCellType = playerCells[i][j];
      drawCellByCoordinates("player", i, j, playerCellType);

      if (!onlyPlayer) {
        let computerCellType = computerCells[i][j];
        
        if (computerCellType !== FieldCellTypes.alive) {
          drawCellByCoordinates("computer", i, j, computerCellType);
        }
        
        if (computerCellType === FieldCellTypes.missedAuto || computerCellType === FieldCellTypes.missed) {
          let cellId = "computer_" + i + "_" + j;
          document.getElementById(cellId).setAttribute('onclick', '');
        }
      }
    }
  }
}


/*
  Draws a cell at specific (i, j) coordinates on the "fieldName" field with "newCellState"
*/
function drawCellByCoordinates(fieldName, i, j, newCellState) {
  let fieldId = fieldName + '_' + i + '_' + j;
  drawCell(fieldId, newCellState);
}


/*
  Returns ABS random integer (crutch-fix to avoid values like "-0")
*/
function getRandomInt(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  rand = Math.abs(rand);
  return rand;
}


/*
  Let's sleep a little-bit
*/
function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}