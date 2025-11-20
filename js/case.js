import { Piece } from './piece.js';

// Initialisation
const btnRotateP90 = document.getElementById("rotate+90");
const btnRotateM90 = document.getElementById("rotate-90");
let buttonX = document.getElementById("goRight");
let buttonY = document.getElementById("goLeft");
const nextCanvas = document.getElementById('nextPiece');
const nextCtx = nextCanvas.getContext('2d');

let score = 0;
let bestScore = 0;
document.getElementById("score").innerText = score;
document.getElementById("Bestscore").innerText = bestScore;
const LIGNES = 20;
let ligneSupprimees = 0;
let nbrLigneSupprimer = 0;
document.getElementById("nbrLigne").innerText = nbrLigneSupprimer;
const COLS = 10;
const CELL_SIZE = 35;
const canvas = document.querySelector('canvas');
canvas.width = COLS * CELL_SIZE;
canvas.height = LIGNES * CELL_SIZE;
let p;
let p2;
let ctx = canvas.getContext('2d');
let speedInterval = 500;
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

            if (grille[ligne][col] instanceof Image) {
                if (grille[ligne][col].complete) {
                    ctx.drawImage(grille[ligne][col], x, y, CELL_SIZE, CELL_SIZE);
                } else {
                    ctx.fillStyle = "#6d3434ff";
                    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                }
            } else {
                ctx.fillStyle = "#000";
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            }

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
    switch (ligneSupprimees) {
        case 1:
            nbrLigneSupprimer += 1;
            score += 40;
            break;
        case 2:
            nbrLigneSupprimer += 2;
            score += 100;
            break;
        case 3:
            nbrLigneSupprimer += 3;
            score += 300;
            break;
        case 4:
            nbrLigneSupprimer += 4;
            score += 1000;
            break;
    }

    if (nbrLigneSupprimer >= 40) {
        speedInterval = 100;
    } else if (nbrLigneSupprimer >= 30) {
        speedInterval = 200;
    } else if (nbrLigneSupprimer >= 20) {
        speedInterval = 300;
    } else if (nbrLigneSupprimer >= 10) {
        speedInterval = 400;
    } else {
        speedInterval = 500;
    }

    if (score > bestScore) {
        bestScore = score;
    }
    ligneSupprimees = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("Bestscore").innerText = bestScore;
    document.getElementById("nbrLigne").innerText = nbrLigneSupprimer;
}

function drawNext() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    const offsetX = Math.floor((nextCanvas.width / CELL_SIZE - p2.form[0].length) / 2);
    const offsetY = Math.floor((nextCanvas.height / CELL_SIZE - p2.form.length) / 2);

    for (let y = 0; y < p2.form.length; y++) {
        for (let x = 0; x < p2.form[y].length; x++) {
            if (p2.form[y][x] === 1) {
                nextCtx.drawImage(p2.image,
                    (x + offsetX) * CELL_SIZE,
                    (y + offsetY) * CELL_SIZE,
                    CELL_SIZE, CELL_SIZE);
                nextCtx.strokeStyle = '#555';
                nextCtx.strokeRect(
                    (x + offsetX) * CELL_SIZE,
                    (y + offsetY) * CELL_SIZE,
                    CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

let intervalId;
let fastDrop = false;

function startGameLoop() {
    if (intervalId) clearInterval(intervalId);

    let speed = fastDrop ? 50 : speedInterval;

    intervalId = setInterval(() => {
        drawGrille();

        if (!p.Descendre(ctx, CELL_SIZE, grille)) {
            if (p.position.y === 0) {
                gameOver();
                clearInterval(intervalId);
                return;
            }
            p.draw(ctx, CELL_SIZE);
            NettoyerLigne();
            choisirNextPiece();
        }

        p.draw(ctx, CELL_SIZE);

    }, speed);
}

function start() {
    p2 = new Piece(choisirForm(), getImage(), { x: 3, y: 0 });
    choisirNextPiece();
    drawNext();

    p.draw(ctx, CELL_SIZE);
    startGameLoop();
}

// Réinitialiser le jeu
function resetGame() {
    score = 0;
    ligneSupprimees = 0;
    nbrLigneSupprimer = 0;
    speedInterval = 500;
    grille = Array.from({ length: LIGNES }, () => Array(COLS).fill(0));

    document.getElementById("score").innerText = score;
    document.getElementById("nbrLigne").innerText = nbrLigneSupprimer;
    document.getElementById("gameOver").style.display = "none";

    start();
    drawGrille();
}

// Bouton Rejouer
document.getElementById("replayBtn").addEventListener("click", resetGame);

// Fonction de fin
function gameOver() {
    document.getElementById("finalScore").innerText = score;
    document.getElementById("finalBestScore").innerText = bestScore;
    document.getElementById("gameOver").style.display = "flex";
}

// --- Boutons existants ---
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

// --- Contrôles clavier ---
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
            p.left(grille);
            drawGrille();
            p.draw(ctx, CELL_SIZE);
            break;
        case "ArrowRight":
        case "d":
        case "D":
            p.right(grille);
            drawGrille();
            p.draw(ctx, CELL_SIZE);
            break;
        case "ArrowDown":
        case "s":
        case "S":
            if (!fastDrop) {
                fastDrop = true;
                clearInterval(intervalId);
                startGameLoop();
            }
            break;
        case " ":
            e.preventDefault();
            while (p.Descendre(ctx, CELL_SIZE, grille)) { }
            drawGrille();
            p.draw(ctx, CELL_SIZE);
            break;
        case "ArrowUp":
        case "w":
        case "W":
            p.Rotate(false, grille);
            drawGrille();
            p.draw(ctx, CELL_SIZE);
            break;
        case "e":
        case "E":
            p.Rotate(true, grille);
            drawGrille();
            p.draw(ctx, CELL_SIZE);
            break;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "S" || e.key === "s" || e.key === "ArrowDown") {
        fastDrop = false;
        clearInterval(intervalId);
        startGameLoop();
    }
});

drawGrille();
Promise.all(imageblock.map(img =>
    new Promise(resolve => { img.onload = resolve; })
)).then(() => {
    start(); 
});

