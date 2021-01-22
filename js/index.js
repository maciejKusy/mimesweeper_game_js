(function () {    

    class PlayingField {
        constructor(height=9, width=9, numberOfMimes=10) {
            this.height = height;
            this.width = width;
            this.mimes = numberOfMimes;
            this.flags = numberOfMimes;
            this.tiles = new Map();
            this.createTileRows();
            this.createTileMap();
            this.createMimes();            
            this.createMimeNeighbors();
        }        
    
        /**
         * Creates rows of tiles and runs a function that fills them with tiles for each row
         */
        createTileRows = () => {
            let numberOfTiles = 0; 

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
                numberOfTiles += this.width;          
            }
            this.numberOfTiles = numberOfTiles;
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
                newTile.dataset.flagged = false;
    
                tileRow.appendChild(newTile);                
            }
        }
        
        /**
         * Creates a 'map' of tiles - an object containing pairs of number:tile_element for navigating the
         * matrix effectively and without traversing indexes;
         */
        createTileMap = () => {
            const tileElements = document.getElementsByClassName("tile-unclicked");            
            
            for (let tileNum = 1; tileNum <= this.numberOfTiles; tileNum++) {
                this.tiles.set(tileNum, tileElements[tileNum - 1]);            
            }
        }

        /**
         * Randomly chooses tiles and if relevant, turns them into mime tiles. While loop until the number
         * of mime tiles corresponds to the number provided to the function
         */
        createMimes = () => {
            let mimesLeft;
    
            if (this.mimes > this.numberOfTiles) {this.mimes = this.numberOfTiles;}
            else if (this.mimes < 10) {this.mimes = 10;};
    
            mimesLeft = this.mimes;
            
            while (mimesLeft > 0) {
                let randomIndex = Math.floor(Math.random() * this.numberOfTiles);
                let selectedTile = this.tiles.get(randomIndex);                 
                
                if (selectedTile != undefined) {
                    if (selectedTile.dataset.content === "M") {continue;}
                    else {
                        selectedTile.dataset.content = "M";
                        mimesLeft--;
                    }
                }
            }        
        }
        
        /**
         * Checks if a given tile in the tile map is a mime tile or not;
         * @param {number} tileNum - order number of a tile within the tile map;
         */
        checkIfMimeByTileNum = tileNum => {
            if (this.tiles.get(tileNum).dataset.content === "M") {return true;}
            return false;
        }

        /**
         * Checks if a given tile in the tile map is revealed already or not;
         * @param {number} tileNum - order number of a tile within the tile map;
         */
        checkIfClickedByTileNum = tileNum => {
            if (this.tiles.get(tileNum).dataset.clicked === "true") {return true;}
            return false;
        }

        /**
         * Based on the tile, acquires the order number assigned to this tile in the objects tile map;
         * @param {Node} tile - the tile the number of which we want to acquire;
         */
        getTileOrderNumber = tile => {
            return [...this.tiles].find(([orderNumber, tileMatch]) => tile == tileMatch)[0];
        }

        /**
         * Create the indication, for every non-mime tile, of how many neighboring tiles are mime-tiles;
         */
        createMimeNeighbors = () => {            
            for (let tileNum = 1; tileNum <= this.numberOfTiles; tileNum++) {
                if (!this.checkIfMimeByTileNum(tileNum)) {
                    let mimeNeighbors = 0;
                    
                    let left = tileNum - 1;
                    if (left > 0 && left % this.width != 0) {
                        if (this.checkIfMimeByTileNum(left)) {mimeNeighbors++;}
                    }
                    let right = tileNum + 1;
                    if (right < this.numberOfTiles && right % this.width != 1) {
                        if (this.checkIfMimeByTileNum(right)) {mimeNeighbors++;}
                    }
                    let up = tileNum - this.width;
                    if (up > 0) {
                        if (this.checkIfMimeByTileNum(up)) {mimeNeighbors++;}
                    }
                    let down = tileNum + this.width;
                    if (down <= this.numberOfTiles) {
                        if (this.checkIfMimeByTileNum(down)) {mimeNeighbors++;}
                    }
                    let leftUp = tileNum - 1 - this.width;
                    if (leftUp > 0 && leftUp % this.width != 0) {
                        if (this.checkIfMimeByTileNum(leftUp)) {mimeNeighbors++;}
                    }
                    let rightUp = tileNum + 1 - this.width;
                    if (rightUp > 0 && rightUp % this.width != 1) {
                        if (this.checkIfMimeByTileNum(rightUp)) {mimeNeighbors++;}
                    }
                    let leftDown = tileNum - 1 + this.width;
                    if (leftDown < this.numberOfTiles && leftDown % this.width != 0) {
                        if (this.checkIfMimeByTileNum(leftDown)) {mimeNeighbors++;}
                    }
                    let rightDown = tileNum + 1 + this.width;
                    if (rightDown < this.numberOfTiles && rightDown % this.width != 1) {
                        if (this.checkIfMimeByTileNum(rightDown)) {mimeNeighbors++;}
                    }
                    this.tiles.get(tileNum).dataset.content = mimeNeighbors;
                }
            }
        }
        
        /**
         * Handles mouseup event on the condition that it fires over a tile;
         * @param {Event} mouseupEvent - the mouseup event captured by document;
         */
        handleTileClick = mouseupEvent => {
            let clickedTile = mouseupEvent.target;

            if (clickedTile.classList.contains("tile-unclicked")) {
                this.revealTile(clickedTile);
            }
        }

        /**
         * Reveals all mime tiles, stops the timer and blocks further revealing of tiles;
         */
        gameOver  = () => {
            document.removeEventListener("click", currentGame.handleTileClick);
            document.removeEventListener("contextmenu", currentGame.handleRightClick);

            let mimeTiles = document.querySelectorAll('[data-content=M]');
            mimeTiles.forEach(function(tile) {
                tile.classList.add("tile-clicked");
                tile.classList.add("tile-clicked-mime");
            });
        }
        
        /**
         * Sets the color of the number within a tile based on the number value;
         * @param {Node} tile - the tile the contents of which we want colored;
         */
        setColor = tile => {
            let mimeNumber = parseInt(tile.dataset.content);
            switch(true) {
                case (mimeNumber === 1): tile.classList.add("one"); break;
                case (mimeNumber === 2): tile.classList.add("two"); break;
                case (mimeNumber === 3): tile.classList.add("three"); break;
                case (mimeNumber === 4): tile.classList.add("four"); break;
                case (mimeNumber >= 5): tile.classList.add("five-plus"); break;
            }
        }

        /**
         * Reveals the contents of the tile and based on them performs further functions on neighboring tiles;
         * @param {Node} tile 
         */
        revealTile = tile => {
            tile.dataset.clicked = true;

            if (tile.dataset.flagged === "true") {
                tile.classList.remove("tile-flagged");
                this.flags++;
            }

            if (tile.dataset.content === "M") {
                this.gameOver();
                //to be expanded
            } else if (tile.dataset.content != "0") {                
                this.setColor(tile);
                tile.classList.add("tile-clicked");
                tile.innerHTML = "<span>" + tile.dataset.content + "</span>";                
            } else if (tile.dataset.content === "0") {
                tile.classList.add("tile-clicked");

                let tileNum = this.getTileOrderNumber(tile) 

                let left = tileNum - 1;                
                if (left > 0 && left % this.width != 0) {
                    if (this.tiles.get(left).dataset.clicked === "false") {
                        this.revealTile(this.tiles.get(left));
                    }                        
                }
                let right = tileNum + 1;
                if (right < this.numberOfTiles && right % this.width != 1) {
                    if (this.tiles.get(right).dataset.clicked === "false") {
                        this.revealTile(this.tiles.get(right));
                    }  
                }
                let up = tileNum - this.width;
                if (up > 0) {
                    if (this.tiles.get(up).dataset.clicked === "false") {
                        this.revealTile(this.tiles.get(up));
                    }  
                }
                let down = tileNum + this.width;
                if (down <= this.numberOfTiles) {
                    if (this.tiles.get(down).dataset.clicked === "false") {
                        this.revealTile(this.tiles.get(down));
                    }  
                }
            }
        }

        handleRightClick = rClickEvent => {
            let clickedTile = rClickEvent.target;

            if (clickedTile.dataset.flagged === "false" && clickedTile.dataset.clicked === "false") {
                rClickEvent.preventDefault();
                clickedTile.dataset.flagged = true;
                clickedTile.classList.add("tile-flagged");
                this.flags--;
            } else if (clickedTile.dataset.flagged === "true") {
                rClickEvent.preventDefault();
                clickedTile.dataset.flagged = false;
                clickedTile.classList.remove("tile-flagged");
                this.flags++;
            }
        }        
    } 
    
    let width = 0;
    let height = 0;
    let mimes = 0;
    let currentGame = new PlayingField();

    /**
     * Sets up new game by assigning a new instance of the class to the currentGame variable;
     */
    const newGame = () => {
        currentGame = new PlayingField(width, height, mimes);
        document.addEventListener("click", currentGame.handleTileClick);
        document.addEventListener("contextmenu", currentGame.handleRightClick)
    }

    const newGameButton = document.querySelector(".new-game-button");    
    newGameButton.addEventListener("click", newGame)

    document.addEventListener("click", currentGame.handleTileClick);
    document.addEventListener("contextmenu", currentGame.handleRightClick)
    
})();