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

    draw(ctx,CELL_SIZE) {
        for (let y = 0; y < this.form.length; y++) {
            for (let x = 0; x < this.form[y].length; x++) {
                if (this.form[y][x] === 1) {
                    ctx.fillStyle = this.color;
                    ctx.fillRect((this.position.x + x) * CELL_SIZE,
                        (this.position.y + y) * CELL_SIZE,
                        CELL_SIZE, CELL_SIZE);
                    ctx.strokeStyle = '#555';
                    ctx.strokeRect((this.position.x + x) * CELL_SIZE,
                        (this.position.y + y) * CELL_SIZE,
                        CELL_SIZE, CELL_SIZE);
                }
            }
        }
        console.log(this.position);
    }
    
    Descendre(ctx,CELL_SIZE) {

        if(this.position.y < 21 - this.form[1].length){

            this.position.y += 1;
            this.draw(ctx,CELL_SIZE);
        }else{
            this.draw(ctx,CELL_SIZE);
        }
        
        
    }

    right() 
    {
        this.position.x += 1;
    }
     
    left() 
    {
        this.position.x -= 1;
    }

    rotate(degree90){
        if(degree90){
            this.rotate += 45;
                ctx.style.transform = "rotate("+this.rotate+"deg)";
        }else{
            this.rotate -= 45;
            ctx.style.transform = "rotate("+this.rotate+"deg)";
        }
    }

}

export { Piece };
