/* 
  Represents a simple abstraction of a player of the Sea Battle Game
*/
class Player {
  constructor(playerName) {
    this.name = playerName;
    this.field = new Field();
    this.shareField = new Field();
  }


  shareFieldWithoutAlives() {
    this.shareField.fillEmpty();

    for (let i = 0; i <= 9; ++i) {
      for (let j = 0; j <= 9; ++j) {
        const  valueToBeShared = this.field.field[i][j];

        if (valueToBeShared !== FieldCellTypes.alive)
          this.shareField.field[i][j] = valueToBeShared;
      }
    }

    return this.shareField.field;
  }

  isAlive() {
    for (let i = 0; i < this.field.ships.length; i++) {
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
    for (let i = 0; i <= 9; ++i) {
      for (let j = 0; j <= 9; ++j) {
        const cell = this.field.field[i][j];

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
    if (point === undefined) {
      return ;
    }

    if (this.field.field[point.i][point.j] !== 0) {
      for (let i = 0; i < this.field.ships.length; i++) {
        if (this.field.ships[i].containsCoordinate(point)) {
          this.field.ships[i].gotShot();

          switch (this.field.ships[i].getState()) {
            case ShipStates.injured:
              const unnecessaryCoordinates = unnecessaryToShotCoordinatesForPoint(point);

              unnecessaryCoordinates.forEach(coordinate => {
                if (this.field.field[coordinate.i][coordinate.j] === 0)
                  this.field.field[coordinate.i][coordinate.j] = FieldCellTypes.missedAuto;
              });

              this.field.field[point.i][point.j] = FieldCellTypes.injured;

              break;

            case ShipStates.killed:
              const missed = unavailableCoordinatesForShip(this.field.ships[i].coordinates);

              missed.forEach(coordinate => {
                this.field.field[coordinate.i][coordinate.j] = FieldCellTypes.missed;
              });

              this.field.ships[i].coordinates.forEach(coordinate => {
                this.field.field[coordinate.i][coordinate.j] = FieldCellTypes.killed;
              });

              break;
          }
        }
      }
    } else {
      this.field.field[point.i][point.j] = FieldCellTypes.missed;
    }

    return this.field.field[point.i][point.j];
  }
}
