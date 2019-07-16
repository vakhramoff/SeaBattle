const ShipStates = {
  alive: 0,
  injured: 1,
  killed: 2
};

/* 
  Represents Ship's abstraction
*/
class Ship {
  constructor(size) {
    this.hits = 0;
    this.state = ShipStates.alive;
    this.size = size;
    this.coordinates = [];
  }


  // Returns ship's state
  getState() {
    switch (true) {
        case (this.hits === 0):
            this.state = ShipStates.alive
            break;
        case (this.hits > 0 && this.hits < this.size):
            this.state = ShipStates.injured;
            break;
        case (this.hits === this.size):
            this.state = ShipStates.killed;
            break;
    }

    return this.state;
  }

  containsCoordinate(point) {
    return arrayContainsCoordinate(this.coordinates, point);
  }

  // Shot fired
  gotShot() {
    this.hits++;
    this.getState();
  }
  
  // Tries attack at thespicific "point"
  tryAttack(point) {
    if (this.containsCoordinate(point)) {
        this.gotShot();
        return true;
    }
    return false;
  }
}