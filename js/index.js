import {PlayingField} from './PlayingField.js';

(function () { 
    /**
     * Creating an instance of the main class to create a graphical representation of the playing field and 
     * the logic behind it;
     */     
    let currentGame = new PlayingField(10, 10, 10);    

    /**
     * Removes the event listeners in order for them not to overlap with the existing listeners, resets
     * the timer for it not to overlap with the existing interval as well. Runs the game objects newGame 
     * method;
     */
    const resetCurrentGame = (height, width, mimes) => {
        document.removeEventListener("mousedown", currentGame.handleMouseDown);
        document.removeEventListener("mouseup", currentGame.handleMouseUp);
        document.removeEventListener("click", currentGame.handleTileClick);
        document.removeEventListener("contextmenu", currentGame.handleRightClick);
        clearInterval(currentGame.timer);
        currentGame.newGame(height, width, mimes);
    }

    /**
     * Creating event listeners for the first time;
     */
    currentGame.newGameButton.addEventListener("click", function () {resetCurrentGame(currentGame.height, currentGame.width, currentGame.mimes);});
    currentGame.easyButton.addEventListener("click", function () {resetCurrentGame(10, 10, 10)});
    currentGame.mediumButton.addEventListener("click", function () {resetCurrentGame(16, 16, 40)});
    currentGame.hardButton.addEventListener("click", function () {resetCurrentGame(16, 30, 99)});
    currentGame.overlayButton.addEventListener("click", function() {currentGame.gameOverOverlay.classList.toggle("game-won-overlay-closed");});    
    document.addEventListener("mousedown", currentGame.handleMouseDown);
    document.addEventListener("mouseup", currentGame.handleMouseUp);
    document.addEventListener("click", currentGame.handleTileClick);
    document.addEventListener("contextmenu", currentGame.handleRightClick);
    
})();
