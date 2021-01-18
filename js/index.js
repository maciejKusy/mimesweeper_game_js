(function () {    

    let width = 16;
    let height = 9;

    /**
     * Creates rows of tiles and runs a function that fills them with tiles for each row
     * @param {number} fieldHeight - the number of rows so the height of the playing field 
     * @param {number} fieldWidth - the number of tiles in each row so the width of the playing field
     */
    const createTileRows = (fieldHeight, fieldWidth) => {
        if (fieldHeight < 4) {fieldHeight = 4;}
        if (fieldWidth < 8) {fieldWidth = 8;}
        if (fieldHeight > 16) {fieldHeight = 16;}
        if (fieldWidth > 30) {fieldWidth = 30;}

        const tileContainer = document.getElementById("tile-container");
        tileContainer.innerHTML = '';

        for (let height = 0; height < fieldHeight; height++) {
            let newRow = document.createElement("div");
            
            tileContainer.appendChild(newRow);

            newRow.classList.add("tile-row"); 
            createTiles(newRow, fieldWidth);           
        }
    }

    /**
     * Fills every row with tile elements
     * @param {Object} tileRow - the row object which will house tiles
     * @param {number} fieldWidth  - the number of tiles to be put into the selected row
     */
    const createTiles = (tileRow, fieldWidth) => {
        for (let width = 0; width < fieldWidth; width++) {
            let newTile = document.createElement("div");
            newTile.classList.add("tile-unclicked");
            newTile.dataset.mime = "false";

            tileRow.appendChild(newTile);
        }
    }

    /**
     * Randomly chooses tiles and if relevant, turns them into mime tiles. While loop until the number
     * of mime tiles corresponds to the number provided to the function
     * @param {number} numberOfMimes - how many mime tiles there should be on the playing field
     */
    const createMimes = numberOfMimes => {
        let mimesleft;
        const tileList = document.getElementsByClassName("tile-unclicked");

        if (numberOfMimes > tileList.length) {mimesLeft = tileList.length;}
        else {mimesLeft = numberOfMimes};
        
        while (mimesLeft > 0) {
            let randomIndex = Math.floor(Math.random() * tileList.length);
            let selectedTile = tileList.item(randomIndex)          

            if (selectedTile.dataset.mime === "true") {continue;}
            else {
                selectedTile.dataset.mime = "true";
                mimesLeft--;
            }
        }        
    }

    /**
     * Check if the node(tile) at a given position withing the matrix is a mime tile;
     * @param {NodeList} matrix - the list of all tile row divs;
     * @param {number} rowIndex - the index of the row / vertical coordinate of the tile;
     * @param {number} tileIndex - the index of the tile within the row / horizontal coordinate;
     */
    const checkIfMime = (matrix, rowIndex, tileIndex) => {
        if (matrix[rowIndex].children[tileIndex].dataset.mime === "true") {return true;}
        return false;
    }

    /**
     * Create the indication, for every non-mime tile, of how many neighboring tiles are mimes;
     */
    const createMimeNeighbors = () => {
        const rowList = document.getElementsByClassName("tile-row");
        const verticalLimit = height;
        const horizontalLimit = width;   

        for (let rowInd = 0; rowInd < verticalLimit; rowInd++) {            
            for (let tileInd = 0; tileInd < horizontalLimit; tileInd++) {
                if (!checkIfMime(rowList, rowInd, tileInd)) {
                    let mimeNeighbors = 0;
                    if ((tileInd - 1) >= 0) {
                        if (checkIfMime(rowList, rowInd, tileInd - 1)) {mimeNeighbors++;}
                    }
                    if ((tileInd + 1) < horizontalLimit) {
                        if (checkIfMime(rowList, rowInd, tileInd + 1)) {mimeNeighbors++;}
                    }
                    if ((rowInd - 1) >= 0) {
                        if (checkIfMime(rowList, rowInd - 1, tileInd)) {mimeNeighbors++;}
                    }
                    if ((rowInd + 1) < verticalLimit) {
                        if (checkIfMime(rowList, rowInd + 1, tileInd)) {mimeNeighbors++;}
                    }
                    if ((rowInd - 1) >= 0 && (tileInd - 1) >= 0) {
                        if (checkIfMime(rowList, rowInd - 1, tileInd - 1)) {mimeNeighbors++;}
                    }
                    if ((rowInd + 1) < verticalLimit && (tileInd - 1) >= 0) {
                        if (checkIfMime(rowList, rowInd + 1, tileInd - 1)) {mimeNeighbors++;}
                    }
                    if ((rowInd - 1) >= 0 && (tileInd + 1) < horizontalLimit) {
                        if (checkIfMime(rowList, rowInd - 1, tileInd + 1)) {mimeNeighbors++;}
                    }
                    if ((rowInd + 1) < verticalLimit && (tileInd + 1) < horizontalLimit) {
                        if (checkIfMime(rowList, rowInd + 1, tileInd + 1)) {mimeNeighbors++;}
                    }
                    rowList[rowInd].children[tileInd].innerHTML = mimeNeighbors;
                }
            }
        }

    }

    createTileRows(height, width);        
    createMimes(10);
    createMimeNeighbors();
    
})();