define('Player', function () {
    function Player(id) {
        this._id = id;
        this._score = 0;
        this._name = 'player_' + id;
    }

    Player.prototype = {
        get id() {
            return this._id;
        },
        get score() {
            return this._score;
        },
        get name() {
            return this._name;
        },
        set name(string) {
            this._name = string || ('player_' + this._id);
        }
    };

    Player.prototype.incrementScore = function (increment) {
        this._score += increment;
    };

    Player.prototype.constructor = Player;

    return Player;
});