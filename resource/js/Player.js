function Player(id) {
    this._id = id;
    this._score = 0;
    this._field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
}

Player.prototype = {
    get id(){
        return this._id;
    },
    get score(){
        return this._score;
    },
    get field(){
        return this._field.join("");
    }
};

Player.prototype.playerTurn = function () {

};

Player.prototype.constructor = Player;
