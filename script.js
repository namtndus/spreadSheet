const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COLS = 10;
const spreadsheat = [];
const alphabat = [
    "A","B","C","D","E","F","G","H","I","G","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
];

class Cell {
    constructor(isHeader,disabled,data,row,column,rowName, columName,active = false){
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columName = columName;
        this.active = active;
    }
}

exportBtn.onclick = function(e) {
    let csv = "";
    for(let i = 1; i < spreadsheat.length; i++){
        csv += spreadsheat[i]
        .filter((item) => !item.isHeader)
        .map((item) => item.data)
        .join(",") + "\r\n";
    }
    console.log(csv);

    const csvObj = new Blob(csv);
    const csvUrl = URL.createObjectURL(csvObj);
    console.log('csvUrl',csvUrl);
    const a = document.createAttribute('a');
    a.href = csvUrl;
    a.download = 'spreadsheet name.csv';
    a.click();
}

initSpreadSheet();

function initSpreadSheet() {
    for(let i = 0; i< ROWS; i++){
        let spreadsheatRow = [];
        for(let j = 0; j < COLS; j++){
            let cellData = "";
            let isHeader = false;
            let disabled = false;

            // 모든 row 첫 번째 컬럼에 숫자 넣기
            if(j === 0){
                cellData = i;
                isHeader = true
                disabled = true;
            }

            if( i === 0){
                cellData = alphabat[j-1];
                isHeader =true;
                disabled = true;
            }

            // 첫 번째 row의 컬럼은 ""
            if(!cellData){
                cellData= "";
            }

            const rowName = i;
            const columnName = alphabat[j-1];

            const cell = new Cell(isHeader,disabled,cellData,i,j,rowName,columnName);
            spreadsheatRow.push(cell);
            // spreadSheetContainer.append(createCellEl(cell));
        }
        spreadsheat.push(spreadsheatRow);
    }
    drawSheet();
}

function createCellEl(cell){
    const celEl = document.createElement("input");
    celEl.className = "cell";
    celEl.id = "cell_" + cell.row +cell.column;
    celEl.value = cell.data;
    celEl.disabled = cell.disabled;
    if(cell.isHeader){
        celEl.classList.add("header");
    }

    celEl.onclick =() =>{
        handleCellClick(cell);
    }
    celEl.onchange = (e) =>{
        handleCellChange(e.target.value,cell);
    }

    return celEl;
}

function handleCellChange(data, cell){
    cell.data = data;
}

function handleCellClick(cell){
    clearHeaderActiveStates();
    const columnHeader = spreadsheat[0][cell.column]
    const rowHeader = spreadsheat[cell.row][0];
    const columeHeaderEl = getElfromRowCol(columnHeader.row,columnHeader.column);
    const rowHeaderEl = getElfromRowCol(rowHeader.row,rowHeader.column);
    columeHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active')
    document.querySelector("#cell-status").innerHTML = cell.columName + cell.rowName;
}

function clearHeaderActiveStates(){
    const headers = document.querySelectorAll('.header');
    headers.forEach((header) =>{
        header.classList.remove('active')
    })
}

function getElfromRowCol(row,col){
    return document.querySelector("#cell_" + row +col);
}

function drawSheet(){
    for(let i = 0; i < spreadsheat.length; i++){
        const rowContainer = document.createElement('div');
        rowContainer.className = "cell-row";
        for(let j = 0; j < spreadsheat[i].length; j++){
            const cell = spreadsheat[i][j];
            rowContainer.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainer);
    }
}