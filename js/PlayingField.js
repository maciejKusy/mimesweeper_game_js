import {Tile} from './Tile.js';
import {Timer} from './Timer.js';
/**
 * The class encompassing all the logic behind tiles, buttons and displays visible on the screen;
 */
export class PlayingField {
    constructor(height=10, width=10, numberOfMimes=10) {
        this.height = height;
        this.width = width;

        if (height < 10) {this.height = 10;}
        if (width < 10) {this.width = 10;}
        if (height > 16) {this.height = 16;}
        if (width > 30) {this.width = 30;}

        this.mimes = numberOfMimes;
        this.flags = numberOfMimes;
        this.tiles = new Map();
        this.tilesClicked = 0;
        this.numberOfTiles = 0;
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
        this.timer = new Timer();
        this.createTileRows();
        this.createTileMap();
        this.createMimes();            
        this.createMimeNeighbors();
        this.refreshFlagDisplay();

        /**
         * Adding event listeners for the first time - the five listeners below will not be removed
         * at any point during the game;
         */
        this.newGameButton.addEventListener("click", this.handleNewGameButton);
        this.easyButton.addEventListener("click", this.handleEasyButton);
        this.mediumButton.addEventListener("click", this.handleMediumButton);
        this.hardButton.addEventListener("click", this.handleHardButton);
        this.overlayButton.addEventListener("click", this.handleOverlayButton);  

        /**
         * Adding the event listeners that will be removed every time the game ends (whether by victory or
         * defeat);
         */
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("click", this.handleTileClick);
        document.addEventListener("contextmenu", this.handleRightClick);
    }        

    /**
     * Creating handler functions for main buttons;
     */
    handleNewGameButton = () => {
        this.resetCurrentGame(this.height, this.width, this.mimes);
    }
    handleEasyButton = () => {
        this.resetCurrentGame(10, 10, 10);
    }
    handleMediumButton = () => {
        this.resetCurrentGame(16, 16, 40);
    }
    handleHardButton = () => {
        this.resetCurrentGame(16, 30, 99);
    }
    handleOverlayButton = () => {
        this.gameOverOverlay.classList.toggle("game-won-overlay-closed");    
    }

    /**
     * Handles mouseup event on the condition that it fires over a tile;
     * @param {Event} clickEvent - the mouseup event captured by document;
     */
    handleTileClick = clickEvent => {
        let clickedTile = clickEvent.target;

        if (clickedTile.classList.contains("main-container__tile-container__tile-row__tile--unclicked")) {
            let tileObject = this.tiles.get(parseInt(clickedTile.id, 10));

            if (tileObject.clicked === false) {
                this.tileClickSound.play();
                tileObject.revealTile(this);
            }
        }
    }    

    /**
     * Handles setting up flags fired by a right click;
     * @param {Event} rClickEvent - the event fired when right mouse button clicked;
     */
    handleRightClick = rClickEvent => {
        let clickedTile = rClickEvent.target; 
        
        let tileObject = this.tiles.get(parseInt(clickedTile.id, 10));

        if (tileObject.flagged === false && tileObject.clicked === false) {
            this.flagPlopSound.play();
            if (this.flags > 0) {    
                rClickEvent.preventDefault();
                tileObject.flagged = true;
                tileObject.avatar.classList.add("main-container__tile-container__tile-row__tile--flagged");
                this.flags--;
                this.refreshFlagDisplay();
            }
        } else if (tileObject.flagged === true) {
            this.flagPlopSound.play();
            rClickEvent.preventDefault();
            tileObject.flagged = false;
            tileObject.avatar.classList.remove("main-container__tile-container__tile-row__tile--flagged");
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

        if (clickedTile.classList.contains("main-container__tile-container__tile-row__tile--unclicked")) {
            let tileObject = this.tiles.get(parseInt(clickedTile.id, 10));
            
            if (mousedownEvent.button === 0) {
                if (tileObject.clicked === false) {
                    this.newGameButton.classList.toggle("main-container__top__new-game-button-tense");
                }
            }
        }
    }

    /**
     * Handles the adjustment of newGameButton image on mouseup;
     * @param {Event} mouseupEvent 
     */
    handleMouseUp = mouseupEvent => {
        if (mouseupEvent.button === 0) {
            if (this.newGameButton.classList.contains("main-container__top__new-game-button-tense")) {
                this.newGameButton.classList.remove("main-container__top__new-game-button-tense");
            }
        }
    }

    /**
     * Creates rows of tiles and runs a function that fills each row with tiles;
     */
    createTileRows = () => { 
        const tileContainer = document.getElementById("tile-container");
        tileContainer.innerHTML = '';

        for (let height = 0; height < this.height; height++) {
            let newRow = document.createElement("div");
            
            tileContainer.appendChild(newRow);

            newRow.classList.add("main-container__tile-container__tile-row"); 
            this.createTiles(newRow, this.width);                   
        }        
    }

    /**
     * Fills every row with tile elements;
     * @param {Node} tileRow - the row object which will house tiles
     * @param {number} fieldWidth  - the number of tiles to be put into the selected row
     */
    createTiles = (tileRow, fieldWidth) => {
        for (let width = 0; width < fieldWidth; width++) {
            let newTile = document.createElement("div");
            newTile.classList.add("main-container__tile-container__tile-row__tile--unclicked");

            this.numberOfTiles++;
            
            let currentOrderNum = this.numberOfTiles;
            newTile.id = currentOrderNum;

            tileRow.appendChild(newTile);                
        }
    }
    
    /**
     * Creates a 'map' of tiles - an object containing pairs of number:tileElement for navigating the
     * matrix effectively and without traversing indexes;
     */
    createTileMap = () => {
        const tileElements = document.getElementsByClassName("main-container__tile-container__tile-row__tile--unclicked");            
        
        for (let tileNum = 1; tileNum <= this.numberOfTiles; tileNum++) {
            this.tiles.set(tileNum, new Tile(tileElements[tileNum - 1], tileNum));                     
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
                if (selectedTile.content === "M") {continue;}
                else {
                    selectedTile.content = "M";
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
        if (this.tiles.get(tileNum).content === "M") {return true;}
        return false;
    }

    /**
     * Checks if a given tile in the tile map is revealed already or not;
     * @param {number} tileNum - order number of a tile within the tile map;
     */
    checkIfClickedByTileNum = tileNum => {
        if (this.tiles.get(tileNum).clicked === true) {return true;}
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
                this.tiles.get(tileNum).content = mimeNeighbors;
            }
        }
    }

    /**
     * Resets the game by removing relevant event listeners, clearing the timer and running the newGame
     * method to re-structure the playing field ald re-set key data;
     * @param {number} height 
     * @param {number} width 
     * @param {number} mimes 
     */
    resetCurrentGame = (height, width, mimes) => {
        document.removeEventListener("mousedown", this.handleMouseDown);
        document.removeEventListener("mouseup", this.handleMouseUp);
        document.removeEventListener("click", this.handleTileClick);
        document.removeEventListener("contextmenu", this.handleRightClick);
        clearInterval(this.timer.interval);
        this.newGame(height, width, mimes);
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
        clearInterval(this.timer.interval);
        this.newGameButton.classList.add("main-container__top__new-game-button-lost");

        for (const [odrernum, tile] of this.tiles.entries()) {            
            if (tile.content === "M") {
                tile.avatar.classList.add("main-container__tile-container__tile-row__tile--clicked");
                tile.avatar.classList.add("main-container__tile-container__tile-row__tile--clicked--mime");
            }
        }
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

        document.getElementById("final-time").textContent = this.timer.provideFinalTime();
        document.removeEventListener("mousedown", this.handleMouseDown);
        document.removeEventListener("mouseup", this.handleMouseUp);
        document.removeEventListener("click", this.handleTileClick);
        document.removeEventListener("contextmenu", this.handleRightClick);
        clearInterval(this.timer.interval);
        this.newGameButton.classList.add("main-container__top__new-game-button-won");            
    }

    /**
     * Resets the playing field, the timer and creates the necessary event listeners anew;
     */
    newGame = (height, width, numberOfMimes) => {
        this.timer.minutes.textContent = "0";
        this.timer.seconds.textContent = "00";

        this.height = height;
        this.width = width;
        this.mimes = numberOfMimes;
        this.flags = numberOfMimes;
        this.tiles = new Map();
        this.tilesClicked = 0;
        this.numberOfTiles = 0;
        this.timer = new Timer();
        this.createTileRows();
        this.createTileMap();
        this.createMimes();            
        this.createMimeNeighbors();
        this.refreshFlagDisplay();
        
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("click", this.handleTileClick);
        document.addEventListener("contextmenu", this.handleRightClick);

        if (this.newGameButton.classList.contains("main-container__top__new-game-button-lost")) {
            this.newGameButton.classList.remove("main-container__top__new-game-button-lost");
        }
        if (this.newGameButton.classList.contains("main-container__top__new-game-button-won")) {
            this.newGameButton.classList.remove("main-container__top__new-game-button-won");
        }
    }
    
    /**
     * Sets the color of the number within a tile based on the number value;
     * @param {Node} tile - the tile the contents of which we want colored;
     */
    setColor = tile => {
        let mimeNumber = parseInt(tile.content);
        switch(true) {
            case (mimeNumber === 1): tile.avatar.classList.add("main-container__tile-container__tile-row__tile--one"); break;
            case (mimeNumber === 2): tile.avatar.classList.add("main-container__tile-container__tile-row__tile--two"); break;
            case (mimeNumber === 3): tile.avatar.classList.add("main-container__tile-container__tile-row__tile--three"); break;
            case (mimeNumber === 4): tile.avatar.classList.add("main-container__tile-container__tile-row__tile--four"); break;
            case (mimeNumber >= 5): tile.avatar.classList.add("main-container__tile-container__tile-row__tile--five-plus"); break;
        }
    }

    /**
     * Refreshes the dislplay of flags left to keep the user informed on how many they got left;
     */
    refreshFlagDisplay = () => {
        const flagDisplay = document.getElementById("display-left");
        flagDisplay.innerHTML = this.flags;
    }
}