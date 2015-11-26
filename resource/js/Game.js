function createBinaryString (nMask) {
    for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
         nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
    return sMask.substring(sMask.length-9); //length 9 symbols
}

function checkTie(array1, array2) {
    return array1.every(function (element, id) {
        return (array1[id] | array2[id]);
    });
}

function checkWinCombinations(string) {
    var winCombs = ['000000111', '000111000', '111000000', '100010001', '001010100', '001001001', '010010010', '100100100'];
    for(var i = 0; i < winCombs.length; i++) {
        if(string == winCombs[i]) {
            return true;
        }
    }
    return false;
}

function findPosition(fieldArray1, fieldArray2) {
    if((fieldArray2[8] == 0 && fieldArray1[8] == 0) && ((fieldArray1[7] == 1 && fieldArray1[6] == 1) || (fieldArray1[5] == 1 && fieldArray1[2] == 1) || (fieldArray1[4] == 1 && fieldArray1[0] == 1))){        return 8;
    } else if((fieldArray2[7] == 0 && fieldArray1[7] == 0) && ((fieldArray1[8] == 1 && fieldArray1[6] == 1) || (fieldArray1[4] == 1 && fieldArray1[1] == 1))) {        return 7;
    } else if((fieldArray2[6] == 0 && fieldArray1[6] == 0) && ((fieldArray1[8] == 1 && fieldArray1[7] == 1) || (fieldArray1[2] == 1 && fieldArray1[4] == 1) || (fieldArray1[3] == 1 && fieldArray1[0] == 1))) {        return 6;
    } else if((fieldArray2[5] == 0 && fieldArray1[5] == 0) && ((fieldArray1[4] == 1 && fieldArray1[3] == 1) || (fieldArray1[8] == 1 && fieldArray1[2] == 1))){        return 5;
    } else if((fieldArray2[4] == 0 && fieldArray1[4] == 0) && ((fieldArray1[8] == 1 && fieldArray1[0] == 1) || (fieldArray1[7] == 1 && fieldArray1[1] == 1) || (fieldArray1[6] == 1 && fieldArray1[2] == 1) || (fieldArray1[5] == 1 && fieldArray1[3] == 1))) {        return 4;
    } else if((fieldArray2[3] == 0 && fieldArray1[3] == 0) && ((fieldArray1[6] == 1 && fieldArray1[0] == 1) || (fieldArray1[5] == 1 && fieldArray1[4] == 1))) {        return 3;
    } else if((fieldArray2[2] == 0 && fieldArray1[2] == 0) && ((fieldArray1[1] == 1 && fieldArray1[0] == 1) || (fieldArray1[8] == 1 && fieldArray1[5] == 1) || (fieldArray1[6] == 1 && fieldArray1[4] == 1))){        return 2;
    } else if((fieldArray2[1] == 0 && fieldArray1[1] == 0) && ((fieldArray1[7] == 1 && fieldArray1[4] == 1) || (fieldArray1[2] == 1 && fieldArray1[1] == 1))) {        return 1;
    } else if((fieldArray2[0] == 0 && fieldArray1[0] == 0) && ((fieldArray1[2] == 1 && fieldArray1[1] == 1) || (fieldArray1[6] == 1 && fieldArray1[3] == 1) || (fieldArray1[8] == 1 && fieldArray1[4] == 1))) {        return 0;
    } else {
        if(fieldArray2[4] == 0 && fieldArray1[4] == 0) { return 4;}
        if(fieldArray2[8] == 0 && fieldArray1[8] == 0) { return 8;}
        if(fieldArray2[0] == 0 && fieldArray1[0] == 0) { return 0;}
        if(fieldArray2[1] == 0 && fieldArray1[1] == 0) { return 1;}
        if(fieldArray2[5] == 0 && fieldArray1[5] == 0) { return 5;}
        if(fieldArray2[6] == 0 && fieldArray1[6] == 0) { return 6;}
        if(fieldArray2[7] == 0 && fieldArray1[7] == 0) { return 7;}
        if(fieldArray2[3] == 0 && fieldArray1[3] == 0) { return 3;}
        if(fieldArray2[2] == 0 && fieldArray1[2] == 0) { return 2;}
    }
}

function Game(token) {
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
                        var response = JSON.parse(xmlhttp.responseText);
                        resolve(response);
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
                        var response = JSON.parse(xmlhttp.responseText);
                        resolve(response);
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
                        var response = JSON.parse(xmlhttp.responseText);
                        resolve(response);
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
                        var response = JSON.parse(xmlhttp.responseText);
                        resolve(response);
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

Game.hotseatGame = function () {
    var gameObj = new Game();

    gameObj.newGame = function () {
        gameObj.token = 1;
        gameObj.state = 'first-player-turn';
        return Promise.resolve();
    };

    gameObj.checkState = function () {
        return new Promise(function (resolve, reject) {
            var response = {};
            response.field1 = gameObj.fieldPlayer1;
            response.field2 = gameObj.fieldPlayer2;
            if(checkWinCombinations(gameObj.fieldPlayer1.join(""))) {
                response.state = 'first-player-wins';
            } else if(checkWinCombinations(gameObj.fieldPlayer2.join(""))) {
                response.state = 'second-player-wins';
            } else if(checkTie(gameObj.fieldPlayer1,gameObj.fieldPlayer2)) {
                response.state = 'tie';
            } else {
                response.state = gameObj.state;
            }

            resolve(response);
        });
    };

    gameObj.onTurn = function (player, position) {
        var game = this;
        return new Promise(function (resolve, reject) {
            var response = {};
            response.field1 = game.fieldPlayer1;
            response.field2 = game.fieldPlayer2;
            switch (player.id) {
                case 1:
                    response.field1[8-position] = 1;
                    response.state = 'second-player-turn';
                    break;
                case 2:
                    response.field2[8-position] = 1;
                    response.state = 'first-player-turn';
                    break;
            }

            if(checkWinCombinations(gameObj.fieldPlayer1.join(""))) {
                response.state = 'first-player-wins';
            } else if(checkWinCombinations(gameObj.fieldPlayer2.join(""))) {
                response.state = 'second-player-wins';
            } else if(checkTie(gameObj.fieldPlayer1,gameObj.fieldPlayer2)) {
                response.state = 'tie';
            }

            resolve(response);
        });
    };

    return gameObj;
};

Game.singleGame = function () {
    var gameObj = new Game();

    gameObj.newGame = function () {
        gameObj.token = 0;
        gameObj.state = 'first-player-turn';
        return Promise.resolve();
    };

    gameObj.checkState = function () {
        return new Promise(function (resolve, reject) {
            var response = {};
            response.field1 = gameObj.fieldPlayer1;
            response.field2 = gameObj.fieldPlayer2;
            if(checkWinCombinations(gameObj.fieldPlayer1.join(""))) {
                response.state = 'first-player-wins';
            } else if(checkWinCombinations(gameObj.fieldPlayer2.join(""))) {
                response.state = 'second-player-wins';
            } else if(checkTie(gameObj.fieldPlayer1,gameObj.fieldPlayer2)) {
                response.state = 'tie';
            } else {
                response.state = gameObj.state;
            }

            resolve(response);
        });
    };

    gameObj.onTurn = function (player, position) {
        var game = this;
        return new Promise(function (resolve, reject) {
            var response = {};
            response.field1 = game.fieldPlayer1;
            response.field2 = game.fieldPlayer2;
            switch (player.id) {
                case 1:
                    response.field1[8-position] = 1;
                    response.state = 'second-player-turn';
                    break;
                case 2:
                    var pos = findPosition(game.fieldPlayer1, game.fieldPlayer2);
                    console.log(pos);
                    response.field2[pos] = 1;
                    response.state = 'first-player-turn';
                    break;
            }

            if(checkWinCombinations(gameObj.fieldPlayer1.join(""))) {
                response.state = 'first-player-wins';
            } else if(checkWinCombinations(gameObj.fieldPlayer2.join(""))) {
                response.state = 'second-player-wins';
            } else if(checkTie(gameObj.fieldPlayer1,gameObj.fieldPlayer2)) {
                response.state = 'tie';
            }

            resolve(response);
        });
    }

    return gameObj;
};
