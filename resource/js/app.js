function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    }
}

function App() {
    this._game = null;
    this._ui = {};

    this._player1 = null;
    this._player2 = null;

    this.initUI = function () {
        this._ui.gameBoard      = document.getElementsByClassName('flex-game-field');
        this._ui.namePlayer1    = document.getElementById('name_player_1');
        this._ui.namePlayer2    = document.getElementById('name_player_2');
        this._ui.scorePlayer1   = document.getElementById('score_player_1');
        this._ui.scorePlayer2   = document.getElementById('score_player_2');
        this._ui.playerWin      = document.getElementById('player_win');
        this._ui.scoreBoard1    = this._ui.namePlayer1.parentNode;
        this._ui.scoreBoard2    = this._ui.namePlayer2.parentNode;
    };

    this.updateUI = function () {
        var player1 = this._player1;
        var player2 = this._player2;
        var game = this._game;

        Array.prototype.forEach.call(this._ui.gameBoard, function(element, id) {
            if(game.fieldPlayer1[8-id] != 0) {
                element.innerHTML = '×';
            } else if(game.fieldPlayer2[8-id] != 0) {
                element.innerHTML = '○';
            } else {
                element.innerHTML = '';
            }
        });

        this._ui.scorePlayer1.innerHTML = player1.score;
        this._ui.scorePlayer2.innerHTML = player2.score;

        switch (this._game.state) {
            case 'first-player-turn':
                this._ui.scoreBoard1.className = "flex-score-field text-primary";
                this._ui.scoreBoard2.className = "flex-score-field text-muted";
                break;
            case 'second-player-turn':
                this._ui.scoreBoard2.className = "flex-score-field text-primary";
                this._ui.scoreBoard1.className = "flex-score-field text-muted";
                break;
            case 'first-player-wins':
                this.showWinAlert("Player 1 win!", 1);
                break;
            case 'second-player-wins':
                this.showWinAlert("Player 2 win!", 2);
                break;
            case 'tie':
                this.showWinAlert("Tie!", 0);
                break;
        }
    };

    this.showWinAlert = function (message, state) {
        if(state === 0) {
            this._ui.playerWin.className = "modal-title text-center alert-warning"
        } else {
            this._ui.playerWin.className = "modal-title text-center alert-success"
        }
        this._ui.playerWin.innerHTML = message;
        $('#resultModal').modal('show');
    };
}

document.body.onload = function () {
    var app = new App();

    var newSinglGame = document.getElementById('btn-singl-game'),
        newHotseatGame = document.getElementById('btn-hotseat-game'),
        newNetGame = document.getElementById('btn-new-net-game'),
        joinNetGame = document.getElementById('btn-join-net-game');

    app.initUI();
    app._player1 = new Player(1);

    addEvent(newSinglGame, 'click', function (event) {

    });

    addEvent(newHotseatGame, 'click', function (event) {

    });

    addEvent(newNetGame, 'click', function (event) {
        $('#pleaseWaitDialog').modal('show');
        app._player2 = new Player(2);
        app._game = Game.netGame();
        app._game.newGame()
            .then(function (response) {
                return JSON.parse(response);
            })
            .then(function (response) {
                app._game.token = response.token;
                app._game.state = response.state;
                app._game.fieldPlayer1 = response.field1;
                app._game.fieldPlayer2 = response.field2;
                document.getElementById("tokenLabel").value = response.token;
                $('#pleaseWaitDialog').modal('hide');
                $('#creatingNewGame').modal('show');
                return 'ok';
            })
            .catch(function (error) {
                $('#pleaseWaitDialog').modal('hide');
                console.log(error);
            })
            .then(app.updateUI());
    });

    addEvent(joinNetGame, 'click', function (event) {
        $('#pleaseWaitDialog').modal('show');
        app._player2 = new Player(2);
        app._game = Game.netGame();
        var token = document.getElementById('input-token-game').value;
        app._game.joinGame(token)
            .then(function (response) {
                return JSON.parse(response);
            })
            .then(function (response) {
                app._game.token = response.token;
                app._game.state = response.state;
                app._game.fieldPlayer1 = response.field1;
                app._game.fieldPlayer2 = response.field2;
                $('#pleaseWaitDialog').modal('hide');
                return 'ok';
            })
            .catch(function (error) {
                $('#pleaseWaitDialog').modal('hide');
                console.log(error);
            })
            .then(app.updateUI());
    });

    addEvent(document.getElementById("game_board"), "click", function(event) {
        if(event.target && event.target.className == 'flex-game-field') {
            if (event.target.innerHTML == "") {
            }
        }
    });
};
