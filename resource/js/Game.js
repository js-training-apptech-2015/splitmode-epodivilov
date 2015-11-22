function Game(token) {
    this._token = token || '1';
    this._serverURL = 'http://aqueous-ocean-2864.herokuapp.com/games';

    this._state = 'first-player-turn';
    this._player1 = new Player();
    this._player2 = new Player();
    this.player = 0;

    Object.defineProperty(this, 'token', {
        get: function(){
            return this._token;
        },
        set: function(gameToken){
            this._token = gameToken;
        }

    });

    Object.defineProperty(this, 'state', {
        get: function(){
            return this._state;
        },
        set: function(gameState){
            this._state = gameState;
        }

    });

    Object.defineProperty(this, 'player1', {
        get: function(){
            return this._player1;
        }
    });

    Object.defineProperty(this, 'player2', {
        get: function(){
            return this._player2;
        }
    });
}

Game.prototype.newNetGame = function () {
    var xmlhttp = new XMLHttpRequest();
    var url = this._serverURL;
    var game = this;

    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 201) {
            var myArr = JSON.parse(xmlhttp.responseText);
            game.token = myArr.token;
            game.state = myArr.state;
            game.player1.field = createBinaryString(myArr.field1).split("");
            game.player2.field = createBinaryString(myArr.field2).split("");
            game.player = 1;
        }
    };

    xmlhttp.send(JSON.stringify({type:0}));
};

Game.prototype.joinNetGame = function (token) {
    var xmlhttp = new XMLHttpRequest();
    var url = this._serverURL + '/' + token;
    var game = this;

    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            game.token = myArr.token;
            game.state = myArr.state;
            game._player1.field = createBinaryString(myArr.field1).split("");
            game._player2.field = createBinaryString(myArr.field2).split("");
            game.player = 2;
        }
    };

    xmlhttp.send();
};

Game.prototype.checkNetState = function () {
    var xmlhttp = new XMLHttpRequest();
    var url = this._serverURL + '/' + this._token;
    var game = this;

    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            game.state = myArr.state;
            game._player1._field = createBinaryString(myArr.field1).split("");
            game._player2._field = createBinaryString(myArr.field2).split("");
        }
    };

    xmlhttp.send();
};

Game.prototype.playerTurn = function (position) {
    var xmlhttp = new XMLHttpRequest();
    var url = this._serverURL + '/' + this._token;
    var game = this;

    xmlhttp.open("PUT", url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            game.state = myArr.state;
            game._player1._field = createBinaryString(myArr.field1).split("");
            game._player2._field = createBinaryString(myArr.field2).split("");
        }
    };

    xmlhttp.send(JSON.stringify({player:game.player, position: Number(position)}));
};

Game.prototype.constructor = Game;
