const FieldCellTypes = {
  empty: 0,
  missed: 1,
  missedAuto: 2,
  injured: 3,
  killed: 4,
  killedAuto: 5,
  alive: 6,
};


/* 
  Represents Field's abstraction (a sea batlle field)
*/
class Field {
  constructor() {
    this.field = [];
    this.ships = [];

    this.fillEmpty(this.field);
  }

  fillEmpty() {
    this.field = Array(10).fill(FieldCellTypes.empty).map(x => Array(10).fill(FieldCellTypes.empty));
  }

  /* 
    Arranges ships from longest to shortest
    It's mathematically proved that arrangement exists
    when the field size is 10*10 and there are
    4*1, 3*2, 2*3, 1*4 ships on it!
  */
  generateShipsArrangement() {
    this.field = Array(10).fill(FieldCellTypes.empty).map(x => Array(10).fill(FieldCellTypes.empty));
    var temporaryField = Array(10).fill(FieldCellTypes.empty).map(x => Array(10).fill(FieldCellTypes.empty));
    this.ships = [];
  
    var count = 1;
    for (var size = 4; size >= 1; --size) {
      for (var index = 1; index <= count; ++index) {
        var ship = new Ship(size);
  
        var loop = true;
        while (loop) {
          var emptyPoints = emptyCoordinates(temporaryField);
          var randomPointIndex = getRandomInt(0, emptyPoints.length - 1);
          var randomPoint = emptyPoints[randomPointIndex];
  
          var x = randomPoint.i, y = randomPoint.j;
  
          var direction = getRandomInt(1, 4);
          var temporaryCoordinates = [];
  
          switch (direction) {
            case 1:
              for (var i = x; i < x + ship.size; ++i) {
                let point = { i: i, j: y };
                if (arrayContainsCoordinate(emptyPoints, point))
                  temporaryCoordinates.push(point);
              }
              break;
            case 2:
              for (var i = x; i > x - ship.size; --i) {
                let point = { i: i, j: y };
                if (arrayContainsCoordinate(emptyPoints, point))
                  temporaryCoordinates.push(point);
              }
              break;
            case 3:
              for (var j = y; j < y + ship.size; ++j) {
                let point = { i: x, j: j };
                if (arrayContainsCoordinate(emptyPoints, point))
                  temporaryCoordinates.push(point);
              }
              break;
            case 4:
              for (var j = y; j > y - ship.size; --j) {
                let point = { i: x, j: j };
                if (arrayContainsCoordinate(emptyPoints, point))
                  temporaryCoordinates.push(point);
              }
              break;
          }
  
          temporaryCoordinates = filterCoordinates(temporaryCoordinates);
  
          if (temporaryCoordinates.length === ship.size) {
            ship.coordinates = temporaryCoordinates;
            loop = false;
          }
        }
  
        ship.coordinates.forEach(coordinate => {
          this.field[coordinate.i][coordinate.j] = 6;
          var takenCoordinates = unavailableCoordinatesForShip(ship.coordinates);
          takenCoordinates.forEach(takenCoordinate => {
            temporaryField[takenCoordinate.i][takenCoordinate.j] = 1;
          });
        });
  
        this.ships.push(ship);
      }
      ++count;
    }

    return this.field;
  }
}

function emptyCoordinates(field) {
  return specifiedCoordinates(field, FieldCellTypes.empty);
}

function injuredCoordinates(field) {
  return specifiedCoordinates(field, FieldCellTypes.injured);
}

function emptyEvenCoordinates(field) {
  var result = [];
  for (var i = 0; i < 10; i+=2) {
    for (var j = 0; j < 10; j+=2) {
      if (field[i][j] === FieldCellTypes.empty)
        result.push( { i: i, j: j } );
    }
  }

  return result;
}

function specifiedCoordinates(field, cellType) {
  var result = [];
  for (var i = 0; i < 10; ++i) {
    for (var j = 0; j < 10; ++j) {
      if (field[i][j] === cellType)
        result.push( { i: i, j: j } );
    }
  }

  return result;
}

function filterCoordinates(coordinates) {
  return coordinates.filter(coordinate =>
    Number(coordinate.i) >= 0 && Number(coordinate.i) <= 9
    && Number(coordinate.j) >= 0 && Number(coordinate.j) <= 9);
}

function arrayContainsCoordinate(array, coordinate) {
  return array.filter(element => element.i === coordinate.i && element.j === coordinate.j).length > 0;
}

function isEvenPoint(point) {
  return point.i % 2 === 0 && point.j % 2 === 0;
}

function unavailableCoordinatesForShip(coordinates) {
  var result = [];

  if (coordinates === [])
    return result;

  coordinates.forEach(coordinate => {
    result.push(
      { i: coordinate.i-1, j: coordinate.j-1 }, { i: coordinate.i-1, j: coordinate.j }, { i: coordinate.i-1, j: coordinate.j+1 }, 
      { i: coordinate.i, j: coordinate.j-1 }, { i: coordinate.i, j: coordinate.j }, { i: coordinate.i, j: coordinate.j+1 }, 
      { i: coordinate.i+1, j: coordinate.j-1 }, { i: coordinate.i+1, j: coordinate.j }, { i: coordinate.i+1, j: coordinate.j+1 }, 
    );
  });

  result = filterCoordinates(result);

  return result;
}

function unnecessaryToShotCoordinatesForPoint(point) {
  var result = [];

  result.push(
    { i: point.i-1, j: point.j-1 }, { i: point.i-1, j: point.j+1 },
    { i: point.i+1, j: point.j-1 }, { i: point.i+1, j: point.j+1 }, 
  );

  result = filterCoordinates(result);

  return result;
}

function toBeShotCoordinatesForPoint(point) {
  var result = [];

  result.push(
    { i: point.i-1, j: point.j }, { i: point.i+1, j: point.j },
    { i: point.i, j: point.j-1 }, { i: point.i, j: point.j+1 }, 
  );

  result = filterCoordinates(result);

  return result;
}

function coordinatesToShot(playerField, injuredPoints) {
  var result = [];

  var possibleCoordinates = [];
  for (var i = 0; i < injuredPoints.length; ++i) {
    var toBeShot = toBeShotCoordinatesForPoint(injuredPoints[i]);
    for (var j = 0; j < toBeShot.length; ++j) {
      possibleCoordinates.push( toBeShot[j] );
    }
  }

  possibleCoordinates = filterCoordinates(possibleCoordinates);

  for (var i = 0; i < possibleCoordinates.length; ++i) {
    if (playerField[possibleCoordinates[i].i][possibleCoordinates[i].j] === FieldCellTypes.empty)
      result.push(possibleCoordinates[i]);
  }

  return result;
}

