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

    this._updater = null;

    this.initUI = function () {
        this._ui.gameFields      = document.getElementsByClassName('flex-game-field');
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
        var app = this;

        if((app._game.state == 'first-player-turn') && (app._player1.id == 1)) {
            this.autoupdate('off');
        } else if ((app._game.state == 'second-player-turn') && (app._player1.id == 2)) {
            this.autoupdate('off');
        } else if((app._game.state == 'first-player-wins')||(app._game.state == 'second-player-wins')||(app._game.state == 'tie')) {
            this.autoupdate('off');
        } else {
            this.autoupdate('on');
        }

        switch (game.state) {
            case 'first-player-turn':
                this._ui.scoreBoard1.className = "flex-score-field text-primary";
                this._ui.scoreBoard2.className = "flex-score-field text-muted";
                break;
            case 'second-player-turn':
                this._ui.scoreBoard2.className = "flex-score-field text-primary";
                this._ui.scoreBoard1.className = "flex-score-field text-muted";
                break;
            case 'first-player-wins':
                this.autoupdate('off');
                player1.incrementScore(2);
                game.fieldPlayer1 = [0,0,0,0,0,0,0,0,0];
                game.fieldPlayer2 = [0,0,0,0,0,0,0,0,0];
                this.showWinAlert("Player 1 win!", 1);
                break;
            case 'second-player-wins':
                this.autoupdate('off');
                player2.incrementScore(2);
                game.fieldPlayer1 = [0,0,0,0,0,0,0,0,0];
                game.fieldPlayer2 = [0,0,0,0,0,0,0,0,0];
                this.showWinAlert("Player 2 win!", 2);
                break;
            case 'tie':
                this.autoupdate('off');
                player1.incrementScore(1);
                player2.incrementScore(1);
                game.fieldPlayer1 = [0,0,0,0,0,0,0,0,0];
                game.fieldPlayer2 = [0,0,0,0,0,0,0,0,0];
                this.showWinAlert("Tie!", 0);
                break;
        }

        Array.prototype.forEach.call(this._ui.gameFields, function(element, id) {
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

    this.autoupdate = function (state) {
        var app = this;
        if(state == 'on') {
            console.log("autoupdate");
            app._updater = setTimeout(function () {
                app._game.checkState()
                    .then(function (response) {
                        return JSON.parse(response);
                    })
                    .then(function (response) {
                        app._game.token = response.token;
                        app._game.state = response.state;
                        app._game.fieldPlayer1 = response.field1;
                        app._game.fieldPlayer2 = response.field2;
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        $('#pleaseWaitDialog').modal('hide');
                        app.updateUI();
                    });
            }, 2000);
        } else if(state == 'off') {
            clearInterval(app._updater);
        }
    }
}

document.body.onload = function () {
    var app = new App();

    app._player1 = new Player(1);
    app._player2 = new Player(2);

    var newSinglGame = document.getElementById('btn-singl-game'),
        newHotseatGame = document.getElementById('btn-hotseat-game'),
        newNetGame = document.getElementById('btn-new-net-game'),
        joinNetGame = document.getElementById('btn-join-net-game'),
        gameBoard = document.getElementById("game_board");

    app.initUI();

    addEvent(newSinglGame, 'click', function (event) {

    });

    addEvent(newHotseatGame, 'click', function (event) {

    });

    addEvent(newNetGame, 'click', function (event) {
        $('#pleaseWaitDialog').modal('show');
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
                $('#creatingNewGame').modal('show');
                return 'ok';
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                $('#pleaseWaitDialog').modal('hide');
                app.updateUI();
            });
    });

    addEvent(joinNetGame, 'click', function (event) {
        $('#pleaseWaitDialog').modal('show');
        app._player2 = new Player(1);
        app._player1 = new Player(2);
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
                return 'ok';
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                $('#pleaseWaitDialog').modal('hide');
                app.updateUI();
                app.autoupdate('on');
            });
    });

    addEvent(gameBoard, "click", function(event) {
        if(event.target && event.target.className == 'flex-game-field') {
            if (event.target.innerHTML == "") {
                var cell = event.target.id.charAt(11);
                $('#pleaseWaitDialog').modal('show');

                if((app._game.state == 'first-player-turn') && (app._player1.id == 1)) {
                    console.log("player 1 turn on " + cell);
                    app._game.onTurn(app._player1, cell)
                        .then(function (response) {
                            return JSON.parse(response);
                        })
                        .then(function (response) {
                            app._game.token = response.token;
                            app._game.state = response.state;
                            app._game.fieldPlayer1 = response.field1;
                            app._game.fieldPlayer2 = response.field2;
                            return 'ok';
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                        .then(function () {
                            $('#pleaseWaitDialog').modal('hide');
                            app.updateUI();
                        });
                } else if ((app._game.state == 'second-player-turn') && (app._player1.id == 2)) {
                    console.log("player 2 turn on " + cell);
                    app._game.onTurn(app._player1, cell)
                        .then(function (response) {
                            return JSON.parse(response);
                        })
                        .then(function (response) {
                            app._game.token = response.token;
                            app._game.state = response.state;
                            app._game.fieldPlayer1 = response.field1;
                            app._game.fieldPlayer2 = response.field2;
                            return 'ok';
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                        .then(function () {
                            $('#pleaseWaitDialog').modal('hide');
                            app.updateUI();
                        });
                } else {
                    app.updateUI();
                }
            }
        }
    });
};
