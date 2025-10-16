import { Piece } from './piece.js';

const btnRotateP90 = document.getElementById("rotate+90");
const btnRotateM90 = document.getElementById("rotate-90");
let buttonX = document.getElementById("goRight");
let buttonY = document.getElementById("goLeft");
const nextCanvas = document.getElementById('nextPiece');
const nextCtx = nextCanvas.getContext('2d');

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
let p;
let p2;
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
    return img;
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



// Choisir une forme aléatoire
function choisirForm() {
    const keys = Object.keys(TETRISFORM);
    const rndForm = keys[Math.floor(Math.random() * keys.length)];
    return TETRISFORM[rndForm];
}

// Choisir la prochaine pièce 
function choisirNextPiece() {
    p = p2;
    p2 = new Piece(choisirForm(), getImage(), { x: 3, y: 0 });
    drawNext();
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


function drawNext() {
    //efface le canvas Next
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    // centre la pièce dans la box
    const offsetX = Math.floor((nextCanvas.width / CELL_SIZE - p2.form[0].length) / 2);
    const offsetY = Math.floor((nextCanvas.height / CELL_SIZE - p2.form.length) / 2);
        console.log(p2.image);
    // Dessine la pièce p2
    for (let y = 0; y < p2.form.length; y++) {
        for (let x = 0; x < p2.form[y].length; x++) {
        
            if (p2.form[y][x] === 1) {
                nextCtx.drawImage(p2.image,(x + offsetX) * CELL_SIZE * 1,(y + offsetY) * CELL_SIZE * 1,CELL_SIZE * 1,CELL_SIZE * 1);
                nextCtx.strokeStyle = '#555';
                nextCtx.strokeRect((x + offsetX) * CELL_SIZE * 1,(y + offsetY) * CELL_SIZE * 1,CELL_SIZE * 1,CELL_SIZE * 1);
            }
        }
    }
}
function start() {
    p2 = new Piece(choisirForm(), getImage(), { x: 3, y: 0 });
    choisirNextPiece();
    drawNext();
    p.draw(ctx, CELL_SIZE);
}

// Boucle de descente automatique
setInterval(() => {
    drawGrille();
    if (!p.Descendre(ctx, CELL_SIZE, grille)) {
        p.draw(ctx, CELL_SIZE);
        NettoyerLigne();
        choisirNextPiece();
    }
    p.draw(ctx, CELL_SIZE);
}, 500);

// --- Touches ---
buttonX.addEventListener("click", function () {
    p.right(grille);
    drawGrille();
    p.draw(ctx, CELL_SIZE);
});
buttonY.addEventListener("click", function () {
    p.left(grille);
    drawGrille();
    p.draw(ctx, CELL_SIZE);
});
btnRotateP90.addEventListener("click", function () {
    p.Rotate(true, grille);
    drawGrille();
    p.draw(ctx, CELL_SIZE);
});
btnRotateM90.addEventListener("click", function () {
    p.Rotate(false, grille);
    drawGrille();
    p.draw(ctx, CELL_SIZE);
});
drawGrille();
start();
