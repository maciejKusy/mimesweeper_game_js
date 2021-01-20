(function () {    

    class PlayingField {
        constructor(height=9, width=9, numberOfMimes=10) {
            this.height = height;
            this.width = width;
            this.mimes = numberOfMimes;
            this.createTileRows();
            this.createMimes();
            this.createMimeNeighbors();
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
                newTile.dataset.clicked = false;
    
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
        checkIfMimeByCoordinates = (matrix, rowIndex, tileIndex) => {
            if (matrix[rowIndex].children[tileIndex].dataset.content === "M") {return true;}
            return false;
        }

        /**
         * Check if the node(tile) is a mime tile;
         * @param {Node} tile 
         */
        checkIfMimeByNode = tile => {
            if (tile.dataset.content === "M") {return true;}
            return false;
        }

        /**
         * Check if the node(tile) at a given position withing the matrix is clicked;
         * @param {NodeList} matrix - the list of all tile row divs;
         * @param {number} rowIndex - the index of the row / vertical coordinate of the tile;
         * @param {number} tileIndex - the index of the tile within the row / horizontal coordinate;
         */
        checkIfClickedByCoordinates = (matrix, rowIndex, tileIndex) => {
            if (matrix[rowIndex].children[tileIndex].dataset.clicked === "true") {return true;}
            return false;
        }

        /**
         * Check if the node(tile) is a mime tile;
         * @param {Node} tile 
         */
        checkIfClickedByNode = tile => {
            if (tile.dataset.clicked === "true") {return true;}
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
                    if (!this.checkIfMimeByCoordinates(rowList, rowInd, tileInd)) {
                        let mimeNeighbors = 0;
                        if (tileInd - 1 >= 0) {
                            if (this.checkIfMimeByCoordinates(rowList, rowInd, tileInd - 1)) {mimeNeighbors++;}
                        }
                        if (tileInd + 1 < horizontalLimit) {
                            if (this.checkIfMimeByCoordinates(rowList, rowInd, tileInd + 1)) {mimeNeighbors++;}
                        }
                        if (rowInd - 1 >= 0) {
                            if (this.checkIfMimeByCoordinates(rowList, rowInd - 1, tileInd)) {mimeNeighbors++;}
                        }
                        if (rowInd + 1 < verticalLimit) {
                            if (this.checkIfMimeByCoordinates(rowList, rowInd + 1, tileInd)) {mimeNeighbors++;}
                        }
                        if (rowInd - 1 >= 0 && (tileInd - 1) >= 0) {
                            if (this.checkIfMimeByCoordinates(rowList, rowInd - 1, tileInd - 1)) {mimeNeighbors++;}
                        }
                        if (rowInd + 1 < verticalLimit && (tileInd - 1) >= 0) {
                            if (this.checkIfMimeByCoordinates(rowList, rowInd + 1, tileInd - 1)) {mimeNeighbors++;}
                        }
                        if (rowInd - 1 >= 0 && (tileInd + 1) < horizontalLimit) {
                            if (this.checkIfMimeByCoordinates(rowList, rowInd - 1, tileInd + 1)) {mimeNeighbors++;}
                        }
                        if (rowInd + 1 < verticalLimit && (tileInd + 1) < horizontalLimit) {
                            if (this.checkIfMimeByCoordinates(rowList, rowInd + 1, tileInd + 1)) {mimeNeighbors++;}
                        }
                        
                        let targetedTile = rowList[rowInd].children[tileInd];

                        this.fillNonMimeTile(targetedTile, mimeNeighbors);
                    }
                }
            }
        }        
        
        /**
         * Reveals the contents of the clicked tile if said is not a Mime tile and propagates to other neighboring
         * non-mime tiles
         * @param {Node} tile - the tile that was the target of the mouseup event
         */
        revealNonMimeTile = tile => {
            
            tile.classList.add("tile-clicked");
            tile.dataset.clicked = true;            

            if (tile.dataset.content != "0") {tile.innerHTML = "<span>" + tile.dataset.content + "</span>";}

            else if (tile.dataset.content === "0") {    
                const rowList = document.getElementsByClassName("tile-row");
                const row = tile.parentNode;
                const rowInd = Array.prototype.indexOf.call(document.getElementsByClassName("tile-row"), row);            
                const tileInd = Array.prototype.indexOf.call(row.children, tile);            

                if (tileInd - 1 >= 0) {
                    if (!this.checkIfMimeByCoordinates(rowList, rowInd, tileInd - 1) && !this.checkIfClickedByCoordinates(rowList, rowInd, tileInd - 1)) {
                        this.revealNonMimeTile(row.children[tileInd - 1]);                                               
                    }
                }                
                if (tileInd + 1 < this.width) {
                    if (!this.checkIfMimeByCoordinates(rowList, rowInd, tileInd + 1) && !this.checkIfClickedByCoordinates(rowList, rowInd, tileInd + 1)) {
                        this.revealNonMimeTile(row.children[tileInd + 1]);                        
                    }
                }                
                if (rowInd - 1 >= 0) {
                    if (!this.checkIfMimeByCoordinates(rowList, rowInd - 1, tileInd) && !this.checkIfClickedByCoordinates(rowList, rowInd - 1, tileInd)) {
                        this.revealNonMimeTile(rowList[rowInd - 1].children[tileInd]);
                    }
                }
                if (rowInd + 1 < this.height) {
                    if (!this.checkIfMimeByCoordinates(rowList, rowInd + 1, tileInd) && !this.checkIfClickedByCoordinates(rowList, rowInd + 1, tileInd)) {
                        this.revealNonMimeTile(rowList[rowInd + 1].children[tileInd]);
                    }
                }                 
            }           
        }

        handleTileMouseup = mouseupEvent => {
            let clickedTile = mouseupEvent.target;

            if (clickedTile.classList.contains("tile-unclicked")) {

                if (!this.checkIfMimeByNode(clickedTile) && !this.checkIfClickedByNode(clickedTile)) {
                    this.revealNonMimeTile(clickedTile);
                }
                else if (this.checkIfMimeByNode(clickedTile)) {console.log("MIME!")}
            }
        }
    } 

    let game = new PlayingField(10, 10, 10);
    document.addEventListener("mouseup", game.handleTileMouseup);
    
})();