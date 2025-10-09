class Piece {
    form;
    position;
    image;
    constructor(form, image, position) {
        this.form = form;
        this.image = image;
        this.position = position;
    }

   draw(ctx, CELL_SIZE) {
    for (let y = 0; y < this.form.length; y++) {
        for (let x = 0; x < this.form[y].length; x++) {
            if (this.form[y][x] === 1) {
                ctx.drawImage(this.image,(this.position.x + x) * CELL_SIZE,(this.position.y + y) * CELL_SIZE,CELL_SIZE,CELL_SIZE);

                ctx.strokeStyle = '#555';
                ctx.strokeRect((this.position.x + x) * CELL_SIZE,(this.position.y + y) * CELL_SIZE,CELL_SIZE,CELL_SIZE);
            }
        }
    }
}


    
    canMove(dx, dy, grille, largeurGrille = 10, hauteurGrille = 20) {
        for (let y = 0; y < this.form.length; y++) {
            for (let x = 0; x < this.form[y].length; x++) {
                if (this.form[y][x] === 1) {
                    let newX = this.position.x + x + dx;
                    let newY = this.position.y + y + dy;

                    if (newX < 0 || newX >= largeurGrille || newY < 0 || newY >= hauteurGrille) {
                        return false;
                    }
                    if (grille[newY][newX] !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

   
    Descendre(ctx, CELL_SIZE, grille) {
        if (this.canMove(0, 1, grille)) {
            this.position.y += 1;
        } else {
           
            for (let y = 0; y < this.form.length; y++) {
                for (let x = 0; x < this.form[y].length; x++) {
                    if (this.form[y][x] === 1) {
                        grille[this.position.y + y][this.position.x + x] = this.image;
                    }
                }
            }
            return false; 
        }
        this.draw(ctx, CELL_SIZE);
        return true;
    }


    right(grille) {
        if (this.canMove(1, 0, grille)) {
            this.position.x += 1;
        }
    }
    left(grille) {
        if (this.canMove(-1, 0, grille)) {
            this.position.x -= 1;
        }
    }

    // Rotation
    Rotate(sens = true, grille, largeurGrille = 10, hauteurGrille = 20) {
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

        
        let temp = this.form;
        this.form = rotated;
        if (!this.canMove(0, 0, grille, largeurGrille, hauteurGrille)) {
            this.form = temp; 
        }
    }
}

export { Piece };
