function Player() {
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
        return this._field;
    }
};

Player.prototype.resetScore = function () {
    this._score = 0;
};

Player.prototype.clearField = function () {
    this._field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
};

Player.prototype.constructor = Player;
