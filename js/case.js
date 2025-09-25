import { Piece } from './piece.js'
const ROWS = 20
const COLS = 10;
const CELL_SIZE = 35;
const canvas = document.querySelector('canvas');
canvas.width = COLS * CELL_SIZE; // 10 colonnes × 30px = 300px
canvas.height = ROWS * CELL_SIZE; // 20 lignes × 30px = 600px

//liste forme des pieces
const TETROMINOES = {
    I: [1,1,1,1],
    O:[[1,1],
        [1,1]],
    T: [[1,1,1],
       [0,1,0]],
    S: [[0,1,1],
        [1,1,0]],
    Z: [[1,1,0],
        [0,1,1]],
    J: [[1,0,0],
        [1,1,1]],
    L: [[0,0,1],
        [1,1,1]]

}


let grid = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
let ctx;
ctx = canvas.getContext('2d');

function drawGrid() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;


      ctx.fillStyle = grid[row][col] === 0 ? '#000' : getColor(grid[row][col]); 
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);


      ctx.strokeStyle = '#555';
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

function getColor(value) {
  const colors = ['#000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00']; // Exemple de couleurs
  return colors[value] || '#000';
}
 drawGrid();
let p = new Piece(TETROMINOES.T, "#4fc3f7", { x: 3, y: 0 });
p.GenererForme();
p.draw(ctx,CELL_SIZE);
// Appelez drawGrid() après avoir initialisé le canvas et le contexte
