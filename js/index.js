(function () {    

    /**
     * The class encompassing all the logic behind tiles, buttons and displays visible on the screen;
     */
    class PlayingField {
        constructor(height=9, width=9, numberOfMimes=10) {
            this.height = height;
            this.width = width;
            this.mimes = numberOfMimes;
            this.flags = numberOfMimes;
            this.tiles = new Map();
            this.tilesClicked = 0;
            this.timeElapsed = 0;
            this.minutes = document.getElementById("minutes");
            this.seconds = document.getElementById("seconds");
            this.createTileRows();
            this.createTileMap();
            this.createMimes();            
            this.createMimeNeighbors();
            this.refreshFlagDisplay();
        }        
    
        /**
         * Creates rows of tiles and runs a function that fills each row with tiles;
         */
        createTileRows = () => {
            let numberOfTiles = 0; 

            if (this.height < 10) {this.height = 10;}
            if (this.width < 10) {this.width = 10;}
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
         * Fills every row with tile elements;
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
         * Creates a 'map' of tiles - an object containing pairs of number:tileElement for navigating the
         * matrix effectively and without traversing indexes;
         */
        createTileMap = () => {
            const tileElements = document.getElementsByClassName("tile-unclicked");            
            
            for (let tileNum = 1; tileNum <= this.numberOfTiles; tileNum++) {
                this.tiles.set(tileNum, tileElements[tileNum - 1]);
                tileElements[tileNum - 1].dataset.ordernum = tileNum;           
            }
        }

        /**
         * Randomly chooses tiles and if relevant, turns them into mime tiles. While loop until the number
         * of mime tiles corresponds to the number provided to the function;
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
        gameOver = () => {
            document.removeEventListener("mousedown", currentGame.handleMouseDown);
            document.removeEventListener("mouseup", currentGame.handleMouseUp);
            document.removeEventListener("click", this.handleTileClick);
            document.removeEventListener("contextmenu", this.handleRightClick);
            clearInterval(timer);
            newGameButton.classList.add("new-game-button-lost");

            let mimeTiles = document.querySelectorAll('[data-content=M]');
            mimeTiles.forEach(function(tile) {
                tile.classList.add("tile-clicked");
                tile.classList.add("tile-clicked-mime");
            });
        }

        /**
         * Verifies whether all non-mime tiles have been clicked;
         */
        checkGameWon = () => {
            if (this.tilesClicked === this.numberOfTiles - this.mimes) {
                this.gameWon();
            }
        }

        /**
         * Shows the overlay and the popup window when all non-mime tiles are oncovered. Removes relevant
         * event listeners and resets the timer;
         */
        gameWon = () => {            
            gameOverOverlay.classList.toggle("game-won-overlay-closed");
            
            let minutes = parseInt(this.timeElapsed / 60, 10);
            let seconds = this.timeElapsed % 60;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            document.getElementById("final-time").textContent = minutes + ":" + seconds;
            document.removeEventListener("mousedown", currentGame.handleMouseDown);
            document.removeEventListener("mouseup", currentGame.handleMouseUp);
            document.removeEventListener("click", this.handleTileClick);
            document.removeEventListener("contextmenu", this.handleRightClick);
            clearInterval(timer);
            newGameButton.classList.add("new-game-button-won");            
        }

        /**
         * Resets the playing field, the timer and creates the necessary event listeners anew;
         */
        newGame = () => {
            this.minutes.textContent = "0";
            this.seconds.textContent = "00";

            currentGame = new PlayingField(height, width, mimes);
            
            document.addEventListener("mousedown", currentGame.handleMouseDown);
            document.addEventListener("mouseup", currentGame.handleMouseUp);
            document.addEventListener("click", currentGame.handleTileClick);
            document.addEventListener("contextmenu", currentGame.handleRightClick);
            timer = setInterval(currentGame.refreshTimeDisplay, 1000);

            if (newGameButton.classList.contains("new-game-button-lost")) {
                newGameButton.classList.remove("new-game-button-lost");
            }
            if (newGameButton.classList.contains("new-game-button-won")) {
                newGameButton.classList.remove("new-game-button-won");
            }
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
            this.tilesClicked++;

            if (tile.dataset.flagged === "true") {
                tile.classList.remove("tile-flagged");
                this.flags++;
                this.refreshFlagDisplay();
            }

            if (tile.dataset.content === "M") {
                this.gameOver();
            } else if (tile.dataset.content != "0") {
                this.checkGameWon();              
                this.setColor(tile);
                tile.classList.add("tile-clicked");
                tile.innerHTML = "<span>" + tile.dataset.content + "</span>";                
            } else if (tile.dataset.content === "0") {
                this.checkGameWon();
                tile.classList.add("tile-clicked");

                let tileNum = parseInt(tile.dataset.ordernum, 10);

                let left = tileNum - 1;                
                if (left > 0 && left % this.width != 0) {
                    if (this.tiles.get(left).dataset.clicked === "false") {
                        this.revealTile(this.tiles.get(left));
                    }                        
                }
                let right = tileNum + 1;
                if (right <= this.numberOfTiles && right % this.width != 1) {
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

        /**
         * Handles setting up flags fired by a right click;
         * @param {Event} rClickEvent - the event fired when right mouse button clicked;
         */
        handleRightClick = rClickEvent => {
            let clickedTile = rClickEvent.target;

            if (clickedTile.dataset.flagged === "false" && clickedTile.dataset.clicked === "false") {
                if (this.flags > 0) {    
                    rClickEvent.preventDefault();
                    clickedTile.dataset.flagged = true;
                    clickedTile.classList.add("tile-flagged");
                    this.flags--;
                    this.refreshFlagDisplay();
                }
            } else if (clickedTile.dataset.flagged === "true") {
                rClickEvent.preventDefault();
                clickedTile.dataset.flagged = false;
                clickedTile.classList.remove("tile-flagged");
                this.flags++;
                this.refreshFlagDisplay();
            }
        }

        /**
         * Refreshes the dislplay of flags left to keep the user informed on how many they got left;
         */
        refreshFlagDisplay = () => {
            const flagDisplay = document.getElementById("display-left");
            flagDisplay.innerHTML = this.flags;
        }

        /**
         * Refreshes the display of time passed
         */
        refreshTimeDisplay = () => {
            this.timeElapsed++;

            let minutes = parseInt(this.timeElapsed / 60, 10);
            let seconds = this.timeElapsed % 60;

            seconds = seconds < 10 ? "0" + seconds : seconds;

            this.minutes.textContent = minutes;
            this.seconds.textContent = seconds;
        }

        /**
         * Handles the adjustment of newGameButton image when mouse down on an unclicked tile;
         * @param {Event} mousedownEvent 
         */
        handleMouseDown = mousedownEvent => {
            let clickedTile = mousedownEvent.target;

            if (mousedownEvent.button === 0) {
                if (clickedTile.dataset.clicked === "false") {
                    newGameButton.classList.toggle("new-game-button-tense");
                }
            }
        }

        /**
         * Handles the adjustment of newGameButton image on mouseup;
         * @param {Event} mouseupEvent 
         */
        handleMouseUp = mouseupEvent => {
            if (mouseupEvent.button === 0) {
                if (newGameButton.classList.contains("new-game-button-tense")) {
                    newGameButton.classList.remove("new-game-button-tense");
                }
            }
        }
    }     
    
    /**
     * Setting global variables;
     */
    let height = 100;
    let width = 100;
    let mimes = 10;
    let currentGame = new PlayingField(height, width, mimes);
    let timer = setInterval(currentGame.refreshTimeDisplay, 1000);
    const newGameButton = document.querySelector("#new-game"); 
    const easyButton = document.querySelector("#easy");
    const mediumButton = document.querySelector("#medium");
    const hardButton = document.querySelector("#hard");  
    const overlayButton = document.querySelector("#overlay-button");
    const gameOverOverlay = document.querySelector("#game-won");

    /**
     * Removes the event listeners in order for them not to overlap with the existing listeners, resets
     * the timer for it not to overlap with the existing interval as well. Runs the game objects newGame 
     * method;
     */
    const resetCurrentGame = () => {
        document.removeEventListener("mousedown", currentGame.handleMouseDown);
        document.removeEventListener("mouseup", currentGame.handleMouseUp);
        document.removeEventListener("click", currentGame.handleTileClick);
        document.removeEventListener("contextmenu", currentGame.handleRightClick);
        clearInterval(timer);
        currentGame.newGame();
    }

    /**
     * Creating event listeners for the first time;
     */
    newGameButton.addEventListener("click", resetCurrentGame);
    easyButton.addEventListener("click", function() {height = 10; width = 10; mimes = 10; resetCurrentGame();});
    mediumButton.addEventListener("click", function() {height = 16; width = 16; mimes = 40; resetCurrentGame();});
    hardButton.addEventListener("click", function() {height = 16; width = 30; mimes = 99; resetCurrentGame();});
    overlayButton.addEventListener("click", function() {gameOverOverlay.classList.toggle("game-won-overlay-closed");});    
    document.addEventListener("mousedown", currentGame.handleMouseDown);
    document.addEventListener("mouseup", currentGame.handleMouseUp);
    document.addEventListener("click", currentGame.handleTileClick);
    document.addEventListener("contextmenu", currentGame.handleRightClick);
    
})();
