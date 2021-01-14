(function () {    

    /**
     * Creates rows of tiles and runs a function that fills them with tiles for wach row
     * @param {number} fieldHeight - the number of rows so the height of the playing field 
     * @param {number} fieldWidth - the number of tiles in each row so the width of the playing field
     */
    const createTileRows = (fieldHeight, fieldWidth) => {
        if (fieldHeight < 4) {fieldHeight = 4;}
        if (fieldWidth < 8) {fieldWidth = 8;}
        if (fieldHeight > 20) {fieldHeight = 20;}
        if (fieldWidth > 25) {fieldWidth = 25;}

        for (let height = 0; height < fieldHeight; height++) {
            let newRow = document.createElement("div");

            const tileContainer = document.getElementById("main-container");
            tileContainer.appendChild(newRow);

            newRow.classList.add("tile-row"); 
            createTiles(newRow, fieldWidth);           
        }
    }

    /**
     * Fills avery row with tile elements
     * @param {Object} tileRow - the row object which will house tiles
     * @param {number} fieldWidth  - the number of tiles to be put into the selected row
     */
    const createTiles = (tileRow, fieldWidth) => {
        for (let width = 0; width < fieldWidth; width++) {
            let newTile = document.createElement("div");
            newTile.classList.add("tile-unclicked");
            newTile.setAttribute("data-mime", false);

            tileRow.appendChild(newTile);
        }
    }

    createTileRows(50, 30);
})();