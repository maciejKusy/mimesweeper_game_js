(function () {    

    class PlayingField {
        constructor(height=9, width=9, numberOfMimes=10) {
            this.height = height;
            this.width = width;
            this.mimes = numberOfMimes;
        }        
    
        /**
         * Creates rows of tiles and runs a function that fills them with tiles for each row
         */
        createTileRows = () => {
            if (this.height < 9) {this.height = 9;}
            if (this.width < 9) {this.width = 9;}
            if (this.height > 16) {this.height = 16;}
            if (this.width > 30) {this.width = 30;}
    
            const tileContainer = document.getElementById("tile-container");
            tileContainer.innerHTML = '';
    
            for (let height = 0; height < this.height; height++) {
                let newRow = document.createElement("div");
                
                tileContainer.appendChild(newRow);
    
                newRow.classList.add("tile-row"); 
                this.createTiles(newRow, this.width);           
            }
        }
    
        /**
         * Fills every row with tile elements
         * @param {Node} tileRow - the row object which will house tiles
         * @param {number} fieldWidth  - the number of tiles to be put into the selected row
         */
        createTiles = (tileRow, fieldWidth) => {
            for (let width = 0; width < fieldWidth; width++) {
                let newTile = document.createElement("div");
                newTile.classList.add("tile-unclicked");
                newTile.dataset.content = null;
                newTile.dataset.clicked = "false";
    
                tileRow.appendChild(newTile);
            }
        }
    
        /**
         * Randomly chooses tiles and if relevant, turns them into mime tiles. While loop until the number
         * of mime tiles corresponds to the number provided to the function
         */
        createMimes = () => {
            let mimesLeft;
            const tileList = document.getElementsByClassName("tile-unclicked");
    
            if (this.mimes > tileList.length) {this.mimes = tileList.length;}
            else if (this.mimes < 10) {this.mimes = 10;};
    
            mimesLeft = this.mimes;
            
            while (mimesLeft > 0) {
                let randomIndex = Math.floor(Math.random() * tileList.length);
                let selectedTile = tileList.item(randomIndex)          
    
                if (selectedTile.dataset.content === "M") {continue;}
                else {
                    selectedTile.dataset.content = "M";
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
        checkIfMime = (matrix, rowIndex, tileIndex) => {
            if (matrix[rowIndex].children[tileIndex].dataset.content === "M") {return true;}
            return false;
        }
        
        /**
         * Fills non-mime tiles with a number indicating how many mimes lurk in the neighborhood;
         * @param {Node} tile - the tile that is being processed;
         * @param {number} numberOfMimeNeighbors - the number neighboring mime tiles;
         */
        fillNonMimeTile = (tile, numberOfMimeNeighbors) => {
            switch(true) {
                case (numberOfMimeNeighbors === 1): tile.classList.add("one"); break;
                case (numberOfMimeNeighbors === 2): tile.classList.add("two"); break; 
                case (numberOfMimeNeighbors === 3): tile.classList.add("three"); break; 
                case (numberOfMimeNeighbors === 4): tile.classList.add("four"); break; 
                case (numberOfMimeNeighbors >= 5): tile.classList.add("five-plus"); break;                            
            }
            tile.dataset.content = numberOfMimeNeighbors;
        }

        /**
         * Create the indication, for every non-mime tile, of how many neighboring tiles are mimes;
         */
        createMimeNeighbors = () => {
            const rowList = document.getElementsByClassName("tile-row");
            const verticalLimit = this.height;
            const horizontalLimit = this.width;   
    
            for (let rowInd = 0; rowInd < verticalLimit; rowInd++) {            
                for (let tileInd = 0; tileInd < horizontalLimit; tileInd++) {
                    if (!this.checkIfMime(rowList, rowInd, tileInd)) {
                        let mimeNeighbors = 0;
                        if (tileInd - 1 >= 0) {
                            if (this.checkIfMime(rowList, rowInd, tileInd - 1)) {mimeNeighbors++;}
                        }
                        if (tileInd + 1 < horizontalLimit) {
                            if (this.checkIfMime(rowList, rowInd, tileInd + 1)) {mimeNeighbors++;}
                        }
                        if (rowInd - 1 >= 0) {
                            if (this.checkIfMime(rowList, rowInd - 1, tileInd)) {mimeNeighbors++;}
                        }
                        if (rowInd + 1 < verticalLimit) {
                            if (this.checkIfMime(rowList, rowInd + 1, tileInd)) {mimeNeighbors++;}
                        }
                        if (rowInd - 1 >= 0 && (tileInd - 1) >= 0) {
                            if (this.checkIfMime(rowList, rowInd - 1, tileInd - 1)) {mimeNeighbors++;}
                        }
                        if (rowInd + 1 < verticalLimit && (tileInd - 1) >= 0) {
                            if (this.checkIfMime(rowList, rowInd + 1, tileInd - 1)) {mimeNeighbors++;}
                        }
                        if (rowInd - 1 >= 0 && (tileInd + 1) < horizontalLimit) {
                            if (this.checkIfMime(rowList, rowInd - 1, tileInd + 1)) {mimeNeighbors++;}
                        }
                        if (rowInd + 1 < verticalLimit && (tileInd + 1) < horizontalLimit) {
                            if (this.checkIfMime(rowList, rowInd + 1, tileInd + 1)) {mimeNeighbors++;}
                        }
                        
                        let targetedTile = rowList[rowInd].children[tileInd];

                        this.fillNonMimeTile(targetedTile, mimeNeighbors);
                    }
                }
            }
        }        
    
        revealNonMimeTile = tile => {
            
            tile.classList.add("tile-clicked");
            tile.dataset.clicked = true;

            if (tile.dataset.content != "0") {tile.innerHTML = "<span>" + tile.dataset.content + "</span>";}         

            let rowList = document.getElementsByClassName("tile-row");
            let row = tile.parentNode;
            let rowInd = Array.prototype.indexOf.call(document.getElementsByClassName("tile-row"), row);            
            let tileInd = Array.prototype.indexOf.call(row.children, tile);
                
            if (tile.dataset.content === "0") {                

                if (tileInd - 1 >= 0) {
                    if (!this.checkIfMime(rowList, rowInd, tileInd - 1) && rowList[rowInd].children[tileInd - 1].dataset.clicked === "false") {
                        this.revealNonMimeTile(row.children[tileInd - 1]);                                               
                    }
                }
                
                if (tileInd + 1 < this.width) {
                    if (!this.checkIfMime(rowList, rowInd, tileInd + 1) && rowList[rowInd].children[tileInd + 1].dataset.clicked === "false") {
                        this.revealNonMimeTile(row.children[tileInd + 1]);                        
                    }
                }
                
                if (rowInd - 1 >= 0) {
                    if (!this.checkIfMime(rowList, rowInd - 1, tileInd) && rowList[rowInd - 1].children[tileInd].dataset.clicked === "false") {
                        this.revealNonMimeTile(rowList[rowInd - 1].children[tileInd]);
                    }
                }
                if (rowInd + 1 < this.height) {
                    if (!this.checkIfMime(rowList, rowInd + 1, tileInd) && rowList[rowInd + 1].children[tileInd].dataset.clicked === "false") {
                        this.revealNonMimeTile(rowList[rowInd + 1].children[tileInd]);
                    }
                }                 
            }           
        }

        handleNonMimeTileClicked = clickedEvent => {
            let clickedTile = clickedEvent.target;
            if (clickedTile.dataset.content != "M" && !clickedTile.innerHTML) {
                this.revealNonMimeTile(clickedTile);
            }
        }
    } 

    let game = new PlayingField(100, 100, 10);
    game.createTileRows();
    game.createMimes();
    game.createMimeNeighbors();

    document.addEventListener("click", game.handleNonMimeTileClicked);
    
})();