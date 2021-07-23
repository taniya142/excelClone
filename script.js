let rowNumberSection = document.querySelector(".row-number-section");

let lastCell;
let dataObj = {};

let selectedCellAddressDiv = document.querySelector(".selected-cell");

let columnNumberSection = document.querySelector(".column-tag-section");

let cellSection = document.querySelector(".cell-section");

let formulaInput = document.querySelector(".formula-input-section");


formulaInput.addEventListener("keydown",function(e){
    if(e.key=="Enter"){
        // console.log("fbhbfj");

        let typedFormula = e.currentTarget.value;
        console.log(typedFormula);

        if(!lastCell){              //cell selected nhi hai to return
            return;
        }

        let selectedCellAdd = lastCell.getAttribute("data-address");
        let cellObj = dataObj[selectedCellAdd];

        cellObj.formula = typedFormula;

        let upstream = cellObj.upstream;

        for(k=0;k<upstream.length;k++){
            removeFromDownstream(upstream[k],selectedCellAdd);
        }

        cellObj.upstream=[];

        let formulaArr = typedFormula.split(" ");
        let cellsInFormula=[];

        for (let i = 0; i < formulaArr.length; i++) {
            if (
              formulaArr[i] != "+" &&
              formulaArr[i] != "-" &&
              formulaArr[i] != "*" &&
              formulaArr[i] != "/" &&
              isNaN(formulaArr[i])
            ) {
              cellsInFormula.push(formulaArr[i]);
            }
        }

        for(let i=0;i<cellsInFormula.length;i++){
            addToDownstream(cellsInFormula[i],selectedCellAdd);
        }

        cellObj.upstream=cellsInFormula;

        let valObj = {};

        for (let i = 0; i < cellsInFormula.length; i++) {
        let cellValue = dataObj[cellsInFormula[i]].value;

        valObj[cellsInFormula[i]] = cellValue;
        }

        for (let key in valObj) {
        typedFormula = typedFormula.replace(key, valObj[key]);
        }

        let newValue = eval(typedFormula);

        lastCell.innerText = newValue;

        cellObj.value = newValue;

        let downstream = cellObj.downstream;

        for (let i = 0; i < downstream.length; i++) {
            updateCell(downstream[i]);
        }

        dataObj[selectedCellAdd] = cellObj;

        formulaInput.value = "";
    }
})

cellSection.addEventListener("scroll", function (e) {

    rowNumberSection.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;

    columnNumberSection.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;


})



for (let i = 1; i <= 100; i++) {
    let div = document.createElement("div");

    div.innerText = i;

    div.classList.add("row-number")

    rowNumberSection.append(div);
}


for (let i = 0; i < 26; i++) {

    let asciiCode = 65 + i;
    let reqAlphabet = String.fromCharCode(asciiCode);

    let div = document.createElement("div");

    div.innerText = reqAlphabet;

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

        dataObj[cellAddress] = {
            value: undefined,
            formula: undefined,
            upstream: [],
            downstream: [],
            align: "left",
            color: "black",
            bgColor: "white",
            style:"",
        };


        let cellDiv = document.createElement("div");

        cellDiv.addEventListener("input", function (e) {
            let currCellAddress = e.currentTarget.getAttribute("data-address");

            let currCellObj = dataObj[currCellAddress];

            currCellObj.value = e.currentTarget.innerText;
            currCellObj.formula = undefined;
            // console.log(currCellObj);


            //1 loop on upstream
            //2 for each go to its downstream and remove
            //3 empty upstream

            let currUpstream = currCellObj.upstream;
            // console.log(currUpstream);

            for (let k = 0; k < currUpstream.length; k++) {
                removeFromDownstream(currUpstream[k], currCellAddress);
            }
            currCellObj.upstream = [];


            //c1 => [E1]        E1= 2*C1;
            let currDownstream = currCellObj.downstream;
            // console.log(currDownstream);

            for (let k = 0; k < currDownstream.length; k++) {
                updateCell(currDownstream[k]);          //yaha se hum c1 ki downsteam me gye or e1 nikal lia
            }


            dataObj[currCellAddress] = currCellObj;

            console.log(dataObj);
        })

        cellDiv.contentEditable = true;
        cellDiv.classList.add("cell");
        cellDiv.setAttribute("data-address", cellAddress);

        cellDiv.addEventListener("click", function (e) {
            if (lastCell) {
                lastCell.classList.remove("cell-selected");
            }

            e.currentTarget.classList.add("cell-selected");

            lastCell = e.currentTarget;

            let currAdress = e.currentTarget.getAttribute("data-address");
            selectedCellAddressDiv.innerText = currAdress;

        });

        rowDiv.append(cellDiv);
    }
    cellSection.append(rowDiv);
}


if (localStorage.getItem("sheet")) {
    console.log(1);
    dataObj = JSON.parse(localStorage.getItem("sheet"));
  
    for (let x in dataObj) {
      let cell = document.querySelector(`[data-address='${x}']`);
      if (dataObj[x].value) cell.innerText = dataObj[x].value;
    }
}

function removeFromDownstream(parentCell, childCell) {
    //fetch parents downstream

    let parentDownstream = dataObj[parentCell].downstream;


    //filter kro chil do parent ki downstream se
    let filteredDownstream = [];

    for (let i = 0; i < parentDownstream.length; i++) {
        if (parentDownstream[i] != childCell) {              //if parent me [b1,c1] pade h to filteredDownstream array me b1 chala jayega c1 nhi
            filteredDownstream = [].push(parentDownstream[i]);
        }
    }
    // filteres downstream ko wapis save kro dataoj ke req cell me
    dataObj[parentCell].downstream = filteredDownstream;
}


function updateCell(cell) {
    let cellObj = dataObj[cell];
    // console.log(cell);
    let upstream = cellObj.upstream;
    let formula = cellObj.formula;

    
    // {
    //     A1:20
    //     B1:10
    // }

    let valObj = {};
    for (let i = 0; i < upstream.length; i++) {
        let cellValue = dataObj[upstream[i]].value;

        valObj[upstream[i]] = cellValue;
    }
    for (let key in valObj) {
        formula = formula.replace(key, valObj[key])
    }

    let newValue = eval(formula);
    let cellOnUi = document.querySelector(`[data-address='${cell}']`);
    cellOnUi.innerText = newValue;

    dataObj[cell].value = newValue;

    let downstream = cellObj.downstream;

    for (let i = 0; i < downstream.length; i++) {
        // console.log(downstream[i]);
        updateCell(downstream[i]);
        
    }
}

function addToDownstream(parent, child) {
    // child ko parent ki downstream me add krna hai
  
    dataObj[parent].downstream.push(child);
}