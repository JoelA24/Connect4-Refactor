/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor (p1, p2, height = 6, width = 7){
    this.players = [p1,p2];
    this.height = height;
    this.width = width;
    this.currPlayer= p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }


// Above code allows me to remove the previous variables in the former file to clean it up and make it simple.

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

// Refactored Board
// remove function label as its unnecesary due to parenthesis
makeBoard() {
  // create a new board as an array referencing this, then adjust following elements to refernce this as well instead so we can reuse this blueprint again and again
  this.board = [];
  for (let y = 0; y < this.height; y++) {
    this.board.push(Array.from({ length: this.width }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

makeHtmlBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  // The purpose of referencing board.innerHTML is to clear the contents of the HTML element with the id of board. 

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  
  // bind this to handleGameClick for ease and repeatability
  this.handleGameClick = this.handleGameClick.bind(this);

  // add a this.handleGameClick to the initial variable
  top.addEventListener('click', this.handleGameClick);

  // Again, change width to this.width to reference constructor
  for (let x = 0; x < this.width; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  board.append(top);

  // make main part of board
  // minimal changes to reference this
  for (let y = 0; y < this.height; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < this.width; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
// Reference this again and removew function tag
findSpotForCol(x) {
  for (let y = this.height - 1; y >= 0; y--) {
    if (!this.board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
// place inline css styles to eliminate need for css code
placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.style.backgroundColor = this.currPlayer.color;
  piece.style.top = -50*(y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */
// again remove function tag, then reove the click event listener to prevent more pieces from being placed on the board
endGame(msg) {
  alert(msg);
  const top = document.querySelector('#column-top');
  top.removeEventListener('click', this.handleGameClick);
}

/** handleClick: handle click of column top to play piece */

handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) {
    return;
  }

  //  reference this in each of the below lines
  // place piece in board and add to HTML table
  this.board[y][x] = this.currPlayer;
  this.placeInTable(y, x);
  
  // check for win
  if (this.checkForWin()) {
    this.gameOver = true;
    return this.endGame('${this.currPlayer.color} won!');
  }
  
  // check for tie
  if (this.board.every(row => row.every(cell => cell))) {
    return this.endGame('Tie!');
  }
    
  // switch players
  // set the value of currPlayer to [0] following each turn to allow both to play and switch
  this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0]
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const _win = cells =>
    // return is implemented by arrow function

    cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );

    // setup for loop referencing height of this and width of this
  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
}
class player {
  constructor(color) {
    this.color = color;
  }
}

document.getElementById('start-game').addEventListener('click', () => {
  let p1 = new Player(document.getElementById('p1-color').value);
  let p2 = new Player(document.getElementById('p2-color').value);
  new Game(p1, p2);
});

