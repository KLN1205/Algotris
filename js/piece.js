class Piece {
    form;
    color;
    position;
    image;

    constructor(form, color, position) {
        this.form = form;
        this.color = color;
        this.position = position;

        
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

    Descendre() {
        this.position.y += 1;
    }
}