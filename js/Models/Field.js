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
    this.field = Array(10)
      .fill(FieldCellTypes.empty)
      .map(x => Array(10).fill(FieldCellTypes.empty));
  }

  /* 
    Arranges ships from longest to shortest
    It's mathematically proved that arrangement exists
    when the field size is 10*10 and there are
    4*1, 3*2, 2*3, 1*4 ships on it!
  */
  generateShipsArrangement() {

    const temporaryField = Array(10)
      .fill(FieldCellTypes.empty)
      .map(x => Array(10).fill(FieldCellTypes.empty));

    let count = 1;

    this.field = Array(10)
        .fill(FieldCellTypes.empty)
        .map(x => Array(10)
            .fill(FieldCellTypes.empty));

    this.ships = [];

    for (let size = 4; size >= 1; --size) {
      for (let index = 1; index <= count; ++index) {
        const ship = new Ship(size);
  
        let loop = true;

        while (loop) {
          const emptyPoints = emptyCoordinates(temporaryField);
          const randomPointIndex = getRandomInt(0, emptyPoints.length - 1);
          const randomPoint = emptyPoints[randomPointIndex];
  
          const x = randomPoint.i;
          const y = randomPoint.j;
  
          const direction = getRandomInt(1, 4);

          let temporaryCoordinates = [];
  
          switch (direction) {
            case 1:
              for (let i = x; i < x + ship.size; ++i) {
                let point = { i: i, j: y };
                if (arrayContainsCoordinate(emptyPoints, point))
                  temporaryCoordinates.push(point);
              }
              break;
            case 2:
              for (let i = x; i > x - ship.size; --i) {
                let point = { i: i, j: y };
                if (arrayContainsCoordinate(emptyPoints, point))
                  temporaryCoordinates.push(point);
              }
              break;
            case 3:
              for (let j = y; j < y + ship.size; ++j) {
                let point = { i: x, j: j };
                if (arrayContainsCoordinate(emptyPoints, point))
                  temporaryCoordinates.push(point);
              }
              break;
            case 4:
              for (let j = y; j > y - ship.size; --j) {
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
          const takenCoordinates = unavailableCoordinatesForShip(ship.coordinates);

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

const emptyCoordinates = (field) => {
  return specifiedCoordinates(field, FieldCellTypes.empty);
};

const injuredCoordinates = (field) => {
  return specifiedCoordinates(field, FieldCellTypes.injured);
};

 const emptyEvenCoordinates = (field) => {
   const result = [];

  for (let i = 0; i < 10; i+=2) {
    for (let j = 0; j < 10; j+=2) {
      if (field[i][j] === FieldCellTypes.empty)
        result.push( { i: i, j: j } );
    }
  }

  return result;
};

const specifiedCoordinates = (field, cellType) => {
  const result = [];

  for (let i = 0; i < 10; ++i) {
    for (let j = 0; j < 10; ++j) {
      if (field[i][j] === cellType)
        result.push( { i: i, j: j } );
    }
  }

  return result;
};

const filterCoordinates = (coordinates) => {
  return coordinates.filter(coordinate =>
    Number(coordinate.i) >= 0 && Number(coordinate.i) <= 9
    && Number(coordinate.j) >= 0 && Number(coordinate.j) <= 9);
};

const arrayContainsCoordinate = (array, coordinate) => {
  return array.filter(element => element.i === coordinate.i && element.j === coordinate.j).length > 0;
};

const isEvenPoint = (point) => {
  return point.i % 2 === 0 && point.j % 2 === 0;
};

const unavailableCoordinatesForShip = (coordinates) => {
  let result = [];

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
};

const unnecessaryToShotCoordinatesForPoint = (point) => {
  let result = [];

  result.push(
    { i: point.i-1, j: point.j-1 }, { i: point.i-1, j: point.j+1 },
    { i: point.i+1, j: point.j-1 }, { i: point.i+1, j: point.j+1 }, 
  );

  result = filterCoordinates(result);

  return result;
};

const toBeShotCoordinatesForPoint = (point) => {
  let result = [];

  result.push(
    { i: point.i-1, j: point.j }, { i: point.i+1, j: point.j },
    { i: point.i, j: point.j-1 }, { i: point.i, j: point.j+1 }, 
  );

  result = filterCoordinates(result);

  return result;
};

const coordinatesToShot = (playerField, injuredPoints) => {
  const result = [];

  let possibleCoordinates = [];

  for (let i = 0; i < injuredPoints.length; ++i) {
    const toBeShot = toBeShotCoordinatesForPoint(injuredPoints[i]);

    for (let j = 0; j < toBeShot.length; ++j) {
      possibleCoordinates.push( toBeShot[j] );
    }
  }

  possibleCoordinates = filterCoordinates(possibleCoordinates);

  for (let i = 0; i < possibleCoordinates.length; ++i) {
    if (playerField[possibleCoordinates[i].i][possibleCoordinates[i].j] === FieldCellTypes.empty)
      result.push(possibleCoordinates[i]);
  }

  return result;
};
