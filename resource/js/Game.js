function createBinaryString (nMask) {
    for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
         nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
    return sMask.substring(sMask.length-9); //length 9 symbols
}

function Game(type, token) {
    this._type = type;
    this._token = token || 0;
    this._url = 'http://aqueous-ocean-2864.herokuapp.com/games';

    this._state = 'first-player-turn';
    this._fieldPlayer1 = [0,0,0,0,0,0,0,0,0];
    this._fieldPlayer2 = [0,0,0,0,0,0,0,0,0];
}

Game.prototype = {
    get url() {
        return this._url
    },

    get token() {
        return this._token;
    },
    set token(string) {
        this._token = string || 0;
    },

    get state() {
        return this._state;
    },
    set state(gameState) {
        this._state = gameState;
    },

    get fieldPlayer1() {
        return this._fieldPlayer1;
    },
    set fieldPlayer1(string) {
        this._fieldPlayer1 = createBinaryString(string).split("");
    },
    get fieldPlayer2() {
        return this._fieldPlayer2;
    },
    set fieldPlayer2(string) {
        this._fieldPlayer2 = createBinaryString(string).split("");
    }
};

Game.prototype.newGame = null;

Game.prototype.constructor = Game;

Game.netGame = function () {
    var gameObj = new Game();

    gameObj.newGame = function () {
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.open("POST", gameObj.url, true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 201) {
                        resolve(xmlhttp.responseText);
                    } else {
                        var error = new Error(xmlhttp.statusText);
                        error.code = xmlhttp.status;
                        reject(error);
                    }
                }
            };

            xmlhttp.send(JSON.stringify({type:0}))
        });
    };

    gameObj.joinGame = function (token) {
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            var url = gameObj._url + '/' + token;

            xmlhttp.open("GET", url, true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        resolve(xmlhttp.responseText);
                    } else {
                        var error = new Error(xmlhttp.statusText);
                        error.code = xmlhttp.status;
                        reject(error);
                    }
                }
            };

            xmlhttp.send();
        });
    };

    gameObj.checkState = function () {
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            var url = gameObj._url + '/' + gameObj.token;

            xmlhttp.open("GET", url, true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        resolve(xmlhttp.responseText);
                    } else {
                        var error = new Error(xmlhttp.statusText);
                        error.code = xmlhttp.status;
                        reject(error);
                    }
                }
            };

            xmlhttp.send();
        });
    };

    gameObj.onTurn = function (player, position) {
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            var url = gameObj._url + '/' + gameObj.token;

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        resolve(xmlhttp.responseText);
                    } else {
                        var error = new Error(xmlhttp.statusText);
                        error.code = xmlhttp.status;
                        reject(error);
                    }
                }
            };

            xmlhttp.open("PUT", url, true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');
            xmlhttp.send(JSON.stringify({player:player.id, position:Number(position)}));
        });
    };

    return gameObj;
};
