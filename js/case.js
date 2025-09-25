import { Piece } from './piece.js';
const btnRotateP90 = document.getElementById("rotate+90");
const btnRotateM90 = document.getElementById("rotate-90");

const ROWS = 20;
const COLS = 10;
const CELL_SIZE = 35;
const canvas = document.querySelector('canvas');
canvas.width = COLS * CELL_SIZE; // 10 colonnes × 30px = 300px
canvas.height = ROWS * CELL_SIZE; // 20 lignes × 30px = 600px

let buttonX = document.getElementById("goRight");
let buttonY = document.getElementById("goLeft");

buttonX.addEventListener("click", function() {
    p.left();
  reinitialiserGrille();
    p.draw(ctx,CELL_SIZE);
});
buttonY.addEventListener("click", function() {
    p.right();
reinitialiserGrille();
    p.draw(ctx,CELL_SIZE);
});
btnRotateP90.addEventListener("click", function() {
    p.Rotate(ctx,true);
reinitialiserGrille();
    p.draw(ctx,CELL_SIZE);
});
btnRotateM90.addEventListener("click", function() {
    p.Rotate(ctx,false);
    reinitialiserGrille();
    p.draw(ctx,CELL_SIZE);
});
//liste forme des pieces
const TETRISFORM = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1],
        [1, 1]],
    T: [[1, 1, 1],
        [0, 1, 0]],
    S: [[0, 1, 1],
        [1, 1, 0]],
    Z: [[1, 1, 0],
        [0, 1, 1]],
    J: [[1, 0, 0],
        [1, 1, 1]],
    L: [[0, 0, 1],
        [1, 1, 1]]
};
const imageblock = ['blue_block', 'red_block', 'cyan_block', 'yellow_block', 'purple_block', 'green_block', 'pink_block'];
function choisirForm() {
    const keys = Object.keys(TETRISFORM); // ["I","O","T","S","Z","J","L"]
    const rndForm = keys[Math.floor(Math.random() * keys.length)];
    return TETRISFORM[rndForm];
}

let grid = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
let ctx;
ctx = canvas.getContext('2d');

function drawGrid() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;
      const img = new Image();
      img.src = "";

      ctx.fillStyle = grid[row][col] === 0 ? '#000' : getColor(); 
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);


      ctx.strokeStyle = '#555';
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

function getColor() {
  const couleur = ['rgba(35, 47, 224, 1)', '#b32c2cff', '#53d5dfff', '#d8e24aff', '#722cb3ff', '#43db2fff', '#d841d0ff']
  let nbrAleatoire = Math.floor(Math.random()*couleur.length)
  return couleur[nbrAleatoire];
  /*let nbrAleatoire = Math.floor(Math.random()*imageblock.length)
  return imageblock[nbrAleatoire];*/
}
function reinitialiserGrille(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
}

 drawGrid();


let p = new Piece(choisirForm(), getColor(), { x: 3, y: 0 });
p.GenererForme();
setInterval(() => {
    
   reinitialiserGrille();
    p.Descendre(ctx,CELL_SIZE,20);
}, 1000);
p.draw(ctx,CELL_SIZE);
