let rowNumberSection = document.querySelector(".row-number-section");


let lastCell;

let selectedCellAddressDiv = document.querySelector(".selected-cell");


let columnNumberSection = document.querySelector(".column-tag-section");



let cellSection  = document.querySelector(".cell-section");

cellSection.addEventListener("scroll",function(e){
    
    rowNumberSection.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;

    columnNumberSection.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
    

})

for(let i=1;i<=100;i++){
    let div = document.createElement("div");

    div.innerText=i;

    div.classList.add("row-number")

    rowNumberSection.append(div);
}


for(let i=0;i<26;i++){

    let asciiCode = 65 + i;
    let reqAlphabet = String.fromCharCode(asciiCode);

    let div = document.createElement("div");

    div.innerText=reqAlphabet;

    div.classList.add("column-number")

    columnNumberSection.append(div);
}



for (let i = 1; i <= 100; i++) {
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    
    for (let j = 0; j < 26; j++) {
        let asciiCode = 65 + j;
    
        let reqAlphabet = String.fromCharCode(asciiCode);
    
        let cellAddress = reqAlphabet + i;
        let cellDiv = document.createElement("div");
        
        cellDiv.contentEditable=true;
        cellDiv.classList.add("cell");

        cellDiv.setAttribute("data-address",cellAddress);

        cellDiv.addEventListener("click",function(e){
            if(lastCell){
                lastCell.classList.remove("cell-selected");
            }

            e.currentTarget.classList.add("cell-selected");

            lastCell=e.currentTarget;

            let currAdress = e.currentTarget.getAttribute("data-address");
            selectedCellAddressDiv.innerText = currAdress;

        })

        rowDiv .append(cellDiv);
  }
  cellSection.append(rowDiv);
}