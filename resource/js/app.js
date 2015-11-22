function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    }
}

function createBinaryString (nMask) {
    // nMask must be between -2147483648 and 2147483647
    for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
         nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
    return sMask.substring(sMask.length-9);
}

function App() {
    this._game = new Game();
    this._ui = {};

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
        var player1 = this._game._player1;
        var player2 = this._game._player2;

        Array.prototype.forEach.call(this._ui.gameBoard, function(element, id) {
            if(player1.field[8-id] != 0) {
                element.innerHTML = '×';
            } else if(player2.field[8-id] != 0) {
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

    var newSinglGame = document.getElementById('newSinglGame'),
        newHotseatGame = document.getElementById('newHotseatGame'),
        newNetGame = document.getElementById('newNetGame'),
        joinNetGame = document.getElementById('joinNetGame');

    app.initUI();
    app.updateUI();

    addEvent(newNetGame, 'click', function () {
        app._game.newNetGame();
    });

    addEvent(joinNetGame, 'click', function () {
        var token = document.getElementById('gameToken').value;
        app._game.joinNetGame(token);
    });

    addEvent(document.getElementById("game_board"), 'click', function () {
        if(event.target && event.target.innerHTML == '') {
            switch (app._game.state) {
                case 'first-player-turn':
                    if(app._game.player == 1) {
                        app._game.playerTurn(event.target.id.charAt(11));
                    } else {
                        app._game.checkNetState();
                    }
                    break;
                case 'second-player-turn':
                    if(app._game.player == 2) {
                        app._game.playerTurn(event.target.id.charAt(11));
                    } else {
                        app._game.checkNetState();
                    }
                    break;
            }

            app.updateUI();
        }
    });


};
