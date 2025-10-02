import { Piece } from './piece.js';

const btnRotateP90 = document.getElementById("rotate+90");
const btnRotateM90 = document.getElementById("rotate-90");
let buttonX = document.getElementById("goRight");
let buttonY = document.getElementById("goLeft");

const ROWS = 20;
const COLS = 10;
const CELL_SIZE = 35;
const canvas = document.querySelector('canvas');
canvas.width = COLS * CELL_SIZE;
canvas.height = ROWS * CELL_SIZE;

let ctx = canvas.getContext('2d');

// Formes Tetris
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

// Couleurs
function getColor() {
  const couleur = ['#234FE0', '#B32C2C', '#53D5DF', '#D8E24A', '#722CB3', '#43DB2F', '#D841D0'];
  let idx = Math.floor(Math.random() * couleur.length);
  return couleur[idx];
}

// Grille vide
let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// Dessiner la grille
function drawGrid() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;
      ctx.fillStyle = grid[row][col] === 0 ? '#000' : grid[row][col];
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

      ctx.strokeStyle = '#555';
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

// Réinitialiser la grille (redraw)
function reinitialiserGrille(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
}

// Choisir une forme aléatoire
function choisirForm() {
    const keys = Object.keys(TETRISFORM);
    const rndForm = keys[Math.floor(Math.random() * keys.length)];
    return TETRISFORM[rndForm];
}

// Vérifie et supprime les lignes pleines
function clearLines() {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (grid[row].every(cell => cell !== 0)) {
            // Supprimer la ligne
            grid.splice(row, 1);
            // Ajouter une nouvelle ligne vide en haut
            grid.unshift(Array(COLS).fill(0));
            row++; // revérifier la même ligne
        }
    }
}

// Première pièce
let p = new Piece(choisirForm(), getColor(), { x: 3, y: 0 });
p.draw(ctx, CELL_SIZE);

// Boucle de descente automatique
setInterval(() => {
   reinitialiserGrille();
   if (!p.Descendre(ctx, CELL_SIZE, grid)) {
       // La pièce est fixée → vérifier lignes pleines
       clearLines();
       // Nouvelle pièce
       p = new Piece(choisirForm(), getColor(), { x: 3, y: 0 });
   }
   p.draw(ctx, CELL_SIZE);
}, 1000);

// --- Contrôles ---
buttonX.addEventListener("click", function() {
    p.right(grid);
    reinitialiserGrille();
    p.draw(ctx,CELL_SIZE);
});
buttonY.addEventListener("click", function() {
    p.left(grid);
    reinitialiserGrille();
    p.draw(ctx,CELL_SIZE);
});
btnRotateP90.addEventListener("click", function() {
    p.Rotate(true, grid);
    reinitialiserGrille();
    p.draw(ctx,CELL_SIZE);
});
btnRotateM90.addEventListener("click", function() {
    p.Rotate(false, grid);
    reinitialiserGrille();
    p.draw(ctx,CELL_SIZE);
});

// Lancer le dessin initial
drawGrid();
