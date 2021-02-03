/**
 * The class encompassing all the logic behind tiles, buttons and displays visible on the screen;
 */
export class PlayingField {
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
        this.tileClickSound = new Audio("wav/tile_click.wav");
        this.flagPlopSound = new Audio("wav/flag_plop.wav");
        this.victoryJingle = new Audio("wav/victory.wav");
        this.defeatJingle = new Audio("wav/defeat.wav");
        this.newGameButton = document.querySelector("#new-game"); 
        this.easyButton = document.querySelector("#easy");
        this.mediumButton = document.querySelector("#medium");
        this.hardButton = document.querySelector("#hard");  
        this.overlayButton = document.querySelector("#overlay-button");
        this.gameOverOverlay = document.querySelector("#game-won");
        this.timer = setInterval(this.refreshTimeDisplay, 1000);
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
     * Reveals all mime tiles, stops the timer and blocks further revealing of tiles;
     */
    gameOver = () => {
        this.defeatJingle.play();

        document.removeEventListener("mousedown", this.handleMouseDown);
        document.removeEventListener("mouseup", this.handleMouseUp);
        document.removeEventListener("click", this.handleTileClick);
        document.removeEventListener("contextmenu", this.handleRightClick);
        clearInterval(this.timer);
        this.newGameButton.classList.add("new-game-button-lost");

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
        this.victoryJingle.play();

        this.gameOverOverlay.classList.toggle("game-won-overlay-closed");
        
        let minutes = parseInt(this.timeElapsed / 60, 10);
        let seconds = this.timeElapsed % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById("final-time").textContent = minutes + ":" + seconds;
        document.removeEventListener("mousedown", this.handleMouseDown);
        document.removeEventListener("mouseup", this.handleMouseUp);
        document.removeEventListener("click", this.handleTileClick);
        document.removeEventListener("contextmenu", this.handleRightClick);
        clearInterval(this.timer);
        this.newGameButton.classList.add("new-game-button-won");            
    }

    /**
     * Resets the playing field, the timer and creates the necessary event listeners anew;
     */
    newGame = (height, width, numberOfMimes) => {
        this.minutes.textContent = "0";
        this.seconds.textContent = "00";

        this.height = height;
        this.width = width;
        this.mimes = numberOfMimes;
        this.flags = numberOfMimes;
        this.tiles = new Map();
        this.tilesClicked = 0;
        this.timeElapsed = 0;
        this.timer = setInterval(this.refreshTimeDisplay, 1000);
        this.createTileRows();
        this.createTileMap();
        this.createMimes();            
        this.createMimeNeighbors();
        this.refreshFlagDisplay();
        
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("click", this.handleTileClick);
        document.addEventListener("contextmenu", this.handleRightClick);

        if (this.newGameButton.classList.contains("new-game-button-lost")) {
            this.newGameButton.classList.remove("new-game-button-lost");
        }
        if (this.newGameButton.classList.contains("new-game-button-won")) {
            this.newGameButton.classList.remove("new-game-button-won");
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
     * Handles mouseup event on the condition that it fires over a tile;
     * @param {Event} mouseupEvent - the mouseup event captured by document;
     */
    handleTileClick = mouseupEvent => {
        let clickedTile = mouseupEvent.target;

        if (clickedTile.dataset.clicked === "false") {
            this.tileClickSound.play();
            this.revealTile(clickedTile);
        }
    }

    /**
     * Handles setting up flags fired by a right click;
     * @param {Event} rClickEvent - the event fired when right mouse button clicked;
     */
    handleRightClick = rClickEvent => {
        let clickedTile = rClickEvent.target;

        if (clickedTile.dataset.flagged === "false" && clickedTile.dataset.clicked === "false") {
            this.flagPlopSound.play();
            if (this.flags > 0) {    
                rClickEvent.preventDefault();
                clickedTile.dataset.flagged = true;
                clickedTile.classList.add("tile-flagged");
                this.flags--;
                this.refreshFlagDisplay();
            }
        } else if (clickedTile.dataset.flagged === "true") {
            this.flagPlopSound.play();
            rClickEvent.preventDefault();
            clickedTile.dataset.flagged = false;
            clickedTile.classList.remove("tile-flagged");
            this.flags++;
            this.refreshFlagDisplay();
        }
    }

    /**
     * Handles the adjustment of newGameButton image when mouse down on an unclicked tile;
     * @param {Event} mousedownEvent 
     */
    handleMouseDown = mousedownEvent => {
        let clickedTile = mousedownEvent.target;

        if (mousedownEvent.button === 0) {
            if (clickedTile.dataset.clicked === "false") {
                this.newGameButton.classList.toggle("new-game-button-tense");
            }
        }
    }

    /**
     * Handles the adjustment of newGameButton image on mouseup;
     * @param {Event} mouseupEvent 
     */
    handleMouseUp = mouseupEvent => {
        if (mouseupEvent.button === 0) {
            if (this.newGameButton.classList.contains("new-game-button-tense")) {
                this.newGameButton.classList.remove("new-game-button-tense");
            }
        }
    }
} 
