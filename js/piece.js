class Piece {
    constructor(form, color, position) {
        this.form = form;
        this.color = color;
        this.position = position;
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

    // Vérifie si la pièce peut bouger
    canMove(dx, dy, grid, largeurGrille = 10, hauteurGrille = 20) {
        for (let y = 0; y < this.form.length; y++) {
            for (let x = 0; x < this.form[y].length; x++) {
                if (this.form[y][x] === 1) {
                    let newX = this.position.x + x + dx;
                    let newY = this.position.y + y + dy;

                    if (newX < 0 || newX >= largeurGrille || newY < 0 || newY >= hauteurGrille) {
                        return false;
                    }
                    if (grid[newY][newX] !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // Descendre
    Descendre(ctx, CELL_SIZE, grid) {
        if (this.canMove(0, 1, grid)) {
            this.position.y += 1;
        } else {
            // Fusionne la pièce dans la grille
            for (let y = 0; y < this.form.length; y++) {
                for (let x = 0; x < this.form[y].length; x++) {
                    if (this.form[y][x] === 1) {
                        grid[this.position.y + y][this.position.x + x] = this.color;
                    }
                }
            }
            return false; // La pièce est fixée
        }
        this.draw(ctx, CELL_SIZE);
        return true;
    }

    // Déplacement latéral
    right(grid) {
        if (this.canMove(1, 0, grid)) {
            this.position.x += 1;
        }
    }
    left(grid) {
        if (this.canMove(-1, 0, grid)) {
            this.position.x -= 1;
        }
    }

    // Rotation
    Rotate(sens = true, grid, largeurGrille = 10, hauteurGrille = 20) {
        const rows = this.form.length;
        const cols = this.form[0].length;
        let rotated = [];

        if (sens) {
            // Droite
            for (let x = 0; x < cols; x++) {
                rotated[x] = [];
                for (let y = rows - 1; y >= 0; y--) {
                    rotated[x][rows - 1 - y] = this.form[y][x];
                }
            }
        } else {
            // Gauche
            for (let x = cols - 1; x >= 0; x--) {
                let newRow = [];
                for (let y = 0; y < rows; y++) {
                    newRow.push(this.form[y][x]);
                }
                rotated[cols - 1 - x] = newRow;
            }
        }

        // Vérifie si la rotation est possible
        let temp = this.form;
        this.form = rotated;
        if (!this.canMove(0, 0, grid, largeurGrille, hauteurGrille)) {
            this.form = temp; // annuler si impossible
        }
    }
}

export { Piece };
