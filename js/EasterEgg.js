easterEgg = function () {
    if (document.getElementById("playerField") === null || document.getElementById("computerField") === null) {
      console.log("\n\n*\nTry to open another game screen :)\n*\n\n\n");
      return false;
    }
  
    for (var i = 0; i < 10; ++i) {
      for (var j = 0; j < 10; ++j) {
        drawCellByCoordinates("player", i, j, FieldCellTypes.empty);
        drawCellByCoordinates("computer", i, j, FieldCellTypes.empty);
      }
    }
  
    var beautifulPaintings = [
      {
        fieldName: "player",
        draws: [
          {
            paintType: FieldCellTypes.killedAuto,
            coordinates: [
              {i: 2, j: 0}, {i: 2, j: 1}, {i: 2, j: 2},
              {i: 3, j: 1},
              {i: 4, j: 1},
              {i: 5, j: 1},
              {i: 6, j: 1},
              {i: 7, j: 0}, {i: 7, j: 1}, {i: 7, j: 2},
            ]
          },
          {
            paintType: FieldCellTypes.killed,
            coordinates: [
              {i: 2, j: 4}, {i: 2, j: 5}, {i: 2, j: 7}, {i: 2, j: 8},
              {i: 3, j: 3}, {i: 3, j: 6}, {i: 3, j: 9},
              {i: 4, j: 3}, {i: 4, j: 9},
              {i: 5, j: 3}, {i: 5, j: 9},
              {i: 6, j: 4}, {i: 6, j: 8},
              {i: 7, j: 5}, {i: 7, j: 6}, {i: 7, j: 7},
            ]
          },
        ]
      },
      {
        fieldName: "computer",
        draws: [
          {
            paintType: FieldCellTypes.alive,
            coordinates: [
              {i: 0, j: 0}, {i: 0, j: 1}, {i: 0, j: 2}, {i: 0, j: 6},  {i: 0, j: 9},
              {i: 1, j: 1}, {i: 1, j: 6}, {i: 1, j: 9},
              {i: 2, j: 1}, {i: 2, j: 6}, {i: 2, j: 7},  {i: 2, j: 9},
              {i: 3, j: 1}, {i: 3, j: 6}, {i: 3, j: 8}, {i: 3, j: 9},
              {i: 4, j: 1}, {i: 4, j: 6}, {i: 4, j: 9},
              {i: 5, j: 3}, {i: 5, j: 4}, {i: 5, j: 5},
              {i: 6, j: 3}, {i: 6, j: 5}, {i: 6, j: 5},
              {i: 7, j: 3}, {i: 7, j: 5},
              {i: 8, j: 3}, {i: 8, j: 5},
              {i: 9, j: 3}, {i: 9, j: 4}, {i: 9, j: 5},
            ]
          },
          {
            paintType: FieldCellTypes.missedAuto,
            coordinates: [
              {i: 0, j: 3}, {i: 0, j: 4}, {i: 0, j: 5},
              {i: 1, j: 3},
              {i: 2, j: 3}, {i: 2, j: 4}, {i: 2, j: 5},
              {i: 3, j: 3},
              {i: 4, j: 3}, {i: 4, j: 4}, {i: 4, j: 5},
              {i: 5, j: 0}, {i: 5, j: 1}, {i: 5, j: 2}, {i: 5, j: 6},  {i: 5, j: 7}, {i: 5, j: 8},  {i: 5, j: 9},
              {i: 6, j: 0}, {i: 6, j: 6}, {i: 6, j: 9},
              {i: 7, j: 0}, {i: 7, j: 1}, {i: 7, j: 2}, {i: 7, j: 6}, {i: 7, j: 7}, {i: 7, j: 8}, {i: 7, j: 9},
              {i: 8, j: 2}, {i: 8, j: 6}, {i: 8, j: 8},
              {i: 9, j: 0}, {i: 9, j: 1}, {i: 9, j: 2}, {i: 9, j: 6}, {i: 9, j: 9},
            ]
          },
        ]
      },
    ]
  
    beautifulPaintings.forEach(beautifulSymbol => {
      beautifulSymbol.draws.forEach(draw => {
        draw.coordinates.forEach(coordinate => {
          drawCellByCoordinates(beautifulSymbol.fieldName, coordinate.i, coordinate.j, draw.paintType);
        });
      });
    });
  
    document.getElementById("gameTitle").innerHTML = 'Hello, a Tensor JS Developer!';
    document.getElementById("gameStatus").innerHTML = 'Developed by Sergey Vakhramov :-)';
    document.getElementById("playerNameLabel").innerHTML = '&#128175;';
    document.getElementById("computerNameLabel").innerHTML = '&#128175;';
    
  
    console.log("\n\n*\nTHE EASTER EGG WAS SUCCESSFULLY OPENED!\n*\n\n\n");

    return true;
  }