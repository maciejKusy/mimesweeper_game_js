export class Tile {
    constructor(avatar, orderNumber, content=null, clicked=false, flagged=false) {
        this.avatar = avatar;
        this.orderNumber = orderNumber;
        this.content = content;
        this.clicked = clicked;
        this.flagged = flagged;
    }

    /**
     * Reveals the contents of the tile and based on them performs further functions on neighboring tiles;
     * @param {Node} parent - the logical representation of the playing field - an instance of the PlayingField
     * class' 
     */
    revealTile = parent => {
        this.clicked = true;
        parent.tilesClicked++;

        if (this.flagged === true) {
            this.avatar.classList.remove("tile-flagged");
            parent.flags++;
            parent.refreshFlagDisplay();
        }

        if (this.content === "M") {
            parent.gameOver();
        } else if (this.content != 0) {
            parent.checkGameWon();              
            parent.setColor(this);
            this.avatar.classList.add("tile-clicked");
            this.avatar.innerHTML = this.content;                
        } else if (this.content === 0) {
            parent.checkGameWon();
            this.avatar.classList.add("tile-clicked");

            let tileNum = parseInt(this.orderNumber, 10);

            let left = tileNum - 1;                
            if (left > 0 && left % parent.width != 0) {
                if (parent.tiles.get(left).clicked === false) {
                    parent.tiles.get(left).revealTile(parent);
                }                        
            }
            let right = tileNum + 1;
            if (right <= parent.numberOfTiles && right % parent.width != 1) {
                if (parent.tiles.get(right).clicked === false) {
                    parent.tiles.get(right).revealTile(parent);
                }  
            }
            let up = tileNum - parent.width;
            if (up > 0) {
                if (parent.tiles.get(up).clicked === false) {
                    parent.tiles.get(up).revealTile(parent);
                }  
            }
            let down = tileNum + parent.width;
            if (down <= parent.numberOfTiles) {
                if (parent.tiles.get(down).clicked === false) {
                    parent.tiles.get(down).revealTile(parent);
                }  
            }
        } 
    }
}