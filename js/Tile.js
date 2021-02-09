export class Tile {
    constructor(avatar, orderNumber, content=null, clicked=false, flagged=false) {
        this.avatar = avatar;
        this.orderNumber = orderNumber;
        this.content = content;
        this.clicked = clicked;
        this.flagged = flagged;
    }
}