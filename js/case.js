import { Piece } from './piece.js';

const btnRotateP90 = document.getElementById("rotate+90");
const btnRotateM90 = document.getElementById("rotate-90");
let buttonX = document.getElementById("goRight");
let buttonY = document.getElementById("goLeft");
let score = 0;
document.getElementById("score").innerText = score;
const LIGNES = 20;
let ligneSupprimees = 0;
let nbrLigneSupprimer = 0;
const COLS = 10;
const CELL_SIZE = 35;
const canvas = document.querySelector('canvas');
canvas.width = COLS * CELL_SIZE;
canvas.height = LIGNES * CELL_SIZE;

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
const imageSources = [
    "blue_block.png",
    "red_block.png",
    "cyan_block.png",
    "yellow_block.png",
    "purple_block.png",
    "green_block.png",
    "pink_block.png"
];

const imageblock = imageSources.map(src => {
    const img = new Image();
    img.src = "/img/asset/" + src;
    return img; // retourne l'image pour remplir le tableau
});


function getImage() {
    let idx = Math.floor(Math.random() * imageblock.length);
    return imageblock[idx];
}

// Grille vide
let grille = Array.from({ length: LIGNES }, () => Array(COLS).fill(0));

// Dessine la grille
function drawGrille() {
    for (let ligne = 0; ligne < LIGNES; ligne++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * CELL_SIZE;
            const y = ligne * CELL_SIZE;

            // Vérifie si la case contient une image
            if (grille[ligne][col] instanceof Image) {
                // Si l'image est chargée, on la dessine
                if (grille[ligne][col].complete) {
                    ctx.drawImage(grille[ligne][col], x, y, CELL_SIZE, CELL_SIZE);
                } else {
                    // Sinon, on dessine une couleur
                    ctx.fillStyle = "#6d3434ff";
                    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                }
            } else {
                //case vide
                ctx.fillStyle = "#000";
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            }

            // Contour case
            ctx.strokeStyle = '#555';
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        }
    }
}


// Réinitialiser la grille
function reinitialiserGrille() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrille();
}

// Choisir une forme aléatoire
function choisirForm() {
    const keys = Object.keys(TETRISFORM);
    const rndForm = keys[Math.floor(Math.random() * keys.length)];
    return TETRISFORM[rndForm];
}

// Vérifie et supprime les LIGNES pleines
function NettoyerLigne() {
    for (let ligne = LIGNES - 1; ligne >= 0; ligne--) {
        if (grille[ligne].every(cell => cell !== 0)) {
            grille.splice(ligne, 1);
            ligneSupprimees++;
            grille.unshift(Array(COLS).fill(0));
            ligne++;
        }
    }
    if (ligneSupprimees == 1) 
    {
        nbrLigneSupprimer += 1;
        
        score += 40;
        document.getElementById("score").innerText = score;
    }
    else if (ligneSupprimees == 2)
    {
        nbrLigneSupprimer += 2;
        score += 100;
        document.getElementById("score").innerText = score;

    }
    else if (ligneSupprimees == 3)
    {
        nbrLigneSupprimer += 3;
        score += 300;
        document.getElementById("score").innerText = score;
    }else if (ligneSupprimees == 4)
    {
        nbrLigneSupprimer += 4;
        score += 1000;
        document.getElementById("score").innerText = score;
    }
    ligneSupprimees = 0;
    document.getElementById("nbrLigne").innerText = nbrLigneSupprimer;
}

// Première pièce
let p = new Piece(TETRISFORM.I, getImage(), { x: 3, y: 0 });

console.log(CELL_SIZE);
console.log(p.image);
p.draw(ctx, CELL_SIZE);
// Boucle de descente automatique
setInterval(() => {
    reinitialiserGrille();
    if (!p.Descendre(ctx, CELL_SIZE, grille)) {
        
        NettoyerLigne();
        // Nouvelle pièce
        p = new Piece(TETRISFORM.I, getImage(), { x: 3, y: 0 });

    }
    p.draw(ctx, CELL_SIZE);
}, 10000);

// --- Touches ---
buttonX.addEventListener("click", function () {
    p.right(grille);
    reinitialiserGrille();
    p.draw(ctx, CELL_SIZE);
});
buttonY.addEventListener("click", function () {
    p.left(grille);
    reinitialiserGrille();
    p.draw(ctx, CELL_SIZE);
});
btnRotateP90.addEventListener("click", function () {
    p.Rotate(true, grille);
    reinitialiserGrille();
    p.draw(ctx, CELL_SIZE);
});
btnRotateM90.addEventListener("click", function () {
    p.Rotate(false, grille);
    reinitialiserGrille();
    p.draw(ctx, CELL_SIZE);
});

drawGrille();
