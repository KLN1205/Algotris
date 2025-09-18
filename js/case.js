 const plateau = document.getElementById('plateau');
 console.log(plateau);
function generer(){
    for (let i = 0; i < 200; i++) {
        const cell = document.createElement('div');
        cell.classList.add('case');
        plateau.appendChild(cell);
    }
}
    generer();