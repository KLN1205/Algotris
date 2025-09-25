class Piece {
    form;
    color;
    position;
    image;
    rotate;

    constructor(form, color, position) {
        this.form = form;
        this.color = color;
        this.position = position;
        this.rotate = 0;

        this.image = this.GenererForme();
    }

    GenererForme() {
        const rows = this.form.length;
        const cols = this.form[0].length;
        const tileSize = 30;

        const canvas = document.createElement('canvas');
        canvas.width = cols * tileSize;
        canvas.height = rows * tileSize;
        const ctx = canvas.getContext('2d');

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (this.form[y][x] === 1) {
                    ctx.fillStyle = this.color;
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                    ctx.strokeStyle = "black";
                    ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }

        const img = new Image();
        img.src = canvas.toDataURL();

        return img;
    }

    draw(ctx, CELL_SIZE) {
        for (let y = 0; y < this.form.length; y++) {
            for (let x = 0; x < this.form[y].length; x++) {
                if (this.form[y][x] === 1) {
                    ctx.fillStyle = this.color;
                    ctx.fillRect(
                        (this.position.x + x) * CELL_SIZE,
                        (this.position.y + y) * CELL_SIZE,
                        CELL_SIZE,
                        CELL_SIZE
                    );
                    ctx.strokeStyle = '#555';
                    ctx.strokeRect(
                        (this.position.x + x) * CELL_SIZE,
                        (this.position.y + y) * CELL_SIZE,
                        CELL_SIZE,
                        CELL_SIZE
                    );
                }
            }
        }
    }

    Descendre(ctx, CELL_SIZE) {
        if (JSON.stringify(this.form) === JSON.stringify([[1, 1], [1, 1]])) {
            if (this.form[1].length + this.position.y < 20) {
                this.position.y += 1;
            }
        } else if (this.form[1].length + this.position.y < 21) {
            this.position.y += 1;
        }

        this.draw(ctx, CELL_SIZE);
    }

    right() {
        if (JSON.stringify(this.form) === JSON.stringify([[1, 1], [1, 1]])) {
            if (this.form[1].length + this.position.x <= 9) {
                this.position.x += 1;
            }
        } else if (this.position.x <= 6) {
            this.position.x += 1;
        }
    }

    left() {
        if (JSON.stringify(this.form) === JSON.stringify([[1, 1], [1, 1]])) {
            if (this.form[0].length + this.position.x >= 3) {
                this.position.x -= 1;
            }
        } else if (this.form[0].length + this.position.x >= 4) {
            this.position.x -= 1;
        }
    }

    Rotate(sens = true, largeurGrille = 10, hauteurGrille = 20) {
        const rows = this.form.length;
        const cols = this.form[0].length;
        let rotated = [];

        if (sens) {
            // Rotation à droite
            for (let x = 0; x < cols; x++) {
                rotated[x] = [];
                for (let y = rows - 1; y >= 0; y--) {
                    rotated[x][rows - 1 - y] = this.form[y][x];
                }
            }
        } else {
            // Rotation à gauche
            for (let x = cols - 1; x >= 0; x--) {
                let newRow = [];
                for (let y = 0; y < rows; y++) {
                    newRow.push(this.form[y][x]);
                }
                rotated[cols - 1 - x] = newRow;
            }
        }

        // Vérifier si la rotation reste dans la grille
        if (this.peutTourner(rotated, largeurGrille, hauteurGrille)) {
            this.form = rotated;
        }
    }

    // Vérifie si une forme donnée peut rentrer dans la grille
    peutTourner(rotated, largeurGrille, hauteurGrille) {
        for (let y = 0; y < rotated.length; y++) {
            for (let x = 0; x < rotated[y].length; x++) {
                if (rotated[y][x] === 1) {
                    let newX = this.position.x + x;
                    let newY = this.position.y + y;
                    if (newX < 0 || newX >= largeurGrille || newY < 0 || newY >= hauteurGrille) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}

export { Piece };
