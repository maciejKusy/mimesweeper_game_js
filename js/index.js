(function () {    

    /**
     * Creates rows of tiles and runs a function that fills them with tiles for wach row
     * @param {number} fieldHeight - the number of rows so the height of the playing field 
     * @param {number} fieldWidth - the number of tiles in each row so the width of the playing field
     */
    const createTileRows = (fieldHeight, fieldWidth) => {
        if (fieldHeight < 4) {fieldHeight = 4;}
        if (fieldWidth < 8) {fieldWidth = 8;}
        if (fieldHeight > 16) {fieldHeight = 16;}
        if (fieldWidth > 30) {fieldWidth = 30;}

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
            newTile.dataset.mime = false;

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
                selectedTile.dataset.mime = true;
                mimesLeft--;
            }
        }        
    }

    createTileRows(40, 40);
    createMimes(99)
    
})();