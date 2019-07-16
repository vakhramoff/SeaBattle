/* 
  Represents a simple abstraction of Sea Battle Game
*/
 class Game {
  constructor(playerName) {
    this.player = new Player(playerName);
    this.computer = new Player("Elon Musk");
    this.gameIsOver = false;
    this.winner = undefined;
    this.whoTurns = getRandomInt(0, 1); // 0 - player, 1 - computer
  }


  changeTurn() {
    this.checkEnd();
    this.whoTurns = (this.whoTurns === 0) ? 1 : 0;
  }

  checkEnd() {
    if (!this.player.isAlive()) {
      this.winner = this.computer.name;
      this.gameOver = true;
      return true;
    } else if (!this.computer.isAlive()) {
      this.winner = this.player.name;
      this.gameOver = true;
      return true;
    }
    return false;
  }
}
