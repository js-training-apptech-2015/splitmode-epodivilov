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

Game.prototype.newGame = function () {
    switch (this._type) {
        case 0:
            console.log("Singlplayer game");
            break;
        case 1:
            console.log("Hotseat game");
            break;
        case 2:
            console.log("New network game");
            this.newNetGame();
            break;
        case 3:
            console.log("Join network game");
            break;
    }
};

Game.prototype.newNetGame = function () {
    var xmlhttp = new XMLHttpRequest();
    var gameObject = this;

    xmlhttp.open("POST", this.url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 201) {
            var myArr = JSON.parse(xmlhttp.responseText);
            gameObject.token = myArr.token;
            gameObject.state = myArr.state;
            gameObject.fieldPlayer1 = myArr.field1;
            gameObject.fieldPlayer2 = myArr.field2;
            document.getElementById("tokenLabel").value = myArr.token;
            $('#pleaseWaitDialog').modal('hide');
            $('#creatingNewGame').modal('show');
        } else {
            $('#pleaseWaitDialog').modal('hide');
            alert('Error');
        }
    };

    xmlhttp.send(JSON.stringify({type:0}));
};

Game.prototype.joinNetGame = function (token) {
    var xmlhttp = new XMLHttpRequest();
    var gameObject = this;
    var url = gameObject._url + '/' + token;

    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            gameObject.token = myArr.token;
            gameObject.state = myArr.state;
            gameObject.fieldPlayer1 = myArr.field1;
            gameObject.fieldPlayer2 = myArr.field2;
            $('#pleaseWaitDialog').modal('hide');
        } else {
            $('#pleaseWaitDialog').modal('hide');
            alert('Error');
        }
    };


    xmlhttp.send();
};




Game.prototype.constructor = Game;
