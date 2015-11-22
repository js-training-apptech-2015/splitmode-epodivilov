function Game(gameType, token) {
    this._gameType = gameType;
    this._token = token || "1";
    this._curentPlayer = null;
    this.state = "new-game";
}

Game.prototype.checkState = function() {

};

Game.prototype.constructor = Game;
