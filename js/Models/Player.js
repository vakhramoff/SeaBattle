/* 
  Represents a simple abstraction of a player of the Sea Battle Game
*/
class Player {
  constructor(playerName) {
    this.name = playerName;
    this.field = new Field();
    this.shareField = new Field();

    // var count = 1;
    // for (var size = 4; size >= 1; --size) {
    //   for (var index = 1; index <= count; ++index) {
    //     var ship = new Ship(size);
    //       this.shareField.ships.push(ship);
    //   }
    //   ++count;
    // }
  }


  shareFieldWithoutAlives() {
    this.shareField.fillEmpty();

    for (var i = 0; i <= 9; ++i) {
      for (var j = 0; j <= 9; ++j) {
        var valueToBeShared = this.field.field[i][j];
        if (valueToBeShared !== FieldCellTypes.alive)
          this.shareField.field[i][j] = valueToBeShared;
      }
    }

    return this.shareField.field;
  }

  isAlive() {
    for (var i = 0; i < this.field.ships.length; i++) {
      if (this.field.ships[i].state !== ShipStates.killed) {
        return true;
      }
    }
    return false;
  }

  cleanData() {
    this.field = new Field();
  }

  arrangeShips() {
    this.field.generateShips();
  }

  refreshField() {
    cleanData();
    arrangeShips();
  }

  /*
    Marks unshot places on the field
  */
  looseField() {
    for (var i = 0; i <= 9; ++i) {
      for (var j = 0; j <= 9; ++j) {
        var cell = this.field.field[i][j];

        if (cell === FieldCellTypes.empty) {
          this.field.field[i][j] = FieldCellTypes.missedAuto;
        }

        if (cell === FieldCellTypes.alive) {
          this.field.field[i][j] = FieldCellTypes.killedAuto;
        }
      }
    }
  }

  /*
    Allows to attack a specific cell at the "point"
  */
  attackCell(point) {
    if (this.field.field[point.i][point.j] !== 0) {
      for (var i = 0; i < this.field.ships.length; i++) {
        if (this.field.ships[i].containsCoordinate(point)) {
          this.field.ships[i].gotShot();

          switch (this.field.ships[i].getState()) {
            case ShipStates.injured:
              var unnecessary = unnecessaryToShotCoordinatesForPoint(point);
              unnecessary.forEach(coordinate => {
                if (this.field.field[coordinate.i][coordinate.j] === 0)
                  this.field.field[coordinate.i][coordinate.j] = FieldCellTypes.missedAuto;
              });
              this.field.field[point.i][point.j] = FieldCellTypes.injured;
              // return true;
              break;
            case ShipStates.killed:
              var missed = unavailableCoordinatesForShip(this.field.ships[i].coordinates);
              missed.forEach(coordinate => {
                this.field.field[coordinate.i][coordinate.j] = FieldCellTypes.missed;
              });

              this.field.ships[i].coordinates.forEach(coordinate => {
                this.field.field[coordinate.i][coordinate.j] = FieldCellTypes.killed;
              });
              // return ShipStates.killed;
              break;
          }
        }
      }
    } else {
      this.field.field[point.i][point.j] = FieldCellTypes.missed;
      // return false;
    }

    return this.field.field[point.i][point.j];
  }
}