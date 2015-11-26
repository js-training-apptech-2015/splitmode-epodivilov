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

        switch (game.state) {
            case 'first-player-turn': {
                app._ui.scoreBoard1.className = "flex-score-field text-primary";
                app._ui.scoreBoard2.className = "flex-score-field text-muted";
                if (app._game.token > 2) {
                    if (app._player1.id == 1) {
                        app.autoupdate('off');
                    } else {
                        app.autoupdate('on');
                    }
                }
                break;
            }
            case 'second-player-turn': {
                app._ui.scoreBoard2.className = "flex-score-field text-primary";
                app._ui.scoreBoard1.className = "flex-score-field text-muted";
                if (app._game.token > 2) {
                    if(app._player1.id == 2) {
                        app.autoupdate('off');
                    } else {
                        app.autoupdate('on');
                    }
                }
                break;
            }
            case 'first-player-wins': {
                app.autoupdate('off');
                player1.incrementScore(2);
                game.fieldPlayer1 = [0,0,0,0,0,0,0,0,0];
                game.fieldPlayer2 = [0,0,0,0,0,0,0,0,0];
                app.showWinAlert("Player 1 win!", 1);
                break;
            }
            case 'second-player-wins': {
                app.autoupdate('off');
                player2.incrementScore(2);
                game.fieldPlayer1 = [0,0,0,0,0,0,0,0,0];
                game.fieldPlayer2 = [0,0,0,0,0,0,0,0,0];
                app.showWinAlert("Player 2 win!", 2);
                break;
            }
            case 'tie': {
                app.autoupdate('off');
                player1.incrementScore(1);
                player2.incrementScore(1);
                game.fieldPlayer1 = [0,0,0,0,0,0,0,0,0];
                game.fieldPlayer2 = [0,0,0,0,0,0,0,0,0];
                app.showWinAlert("Tie!", 0);
                break;
            }
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
        if(state == 'on') {
            this._updater = setTimeout(function (app) {
                app._game.checkState()
                    .then(function (response) {
                        app._game.state = response.state;
                        app._game.fieldPlayer1 = response.field1;
                        app._game.fieldPlayer2 = response.field2;
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        app.updateUI();
                    });
            }, 1000, this);
        } else if(state == 'off') {
            clearInterval(this._updater);
        }
    }
}

document.body.onload = function () {
    var app = new App();
    app.initUI();

    $('.navbar-collapse').click('li', function() {
        $('li[role="presentation"]').removeClass('active');
        $('div[role="tabpanel"]').removeClass('active');
        $('.navbar-collapse').collapse('hide');
        app._player1 = new Player(1);
        app._player2 = new Player(2);
    });

    $('.js-clear-game-btn').click('li', function() {
        $('li[role="presentation"]').removeClass('active');
        $('div[role="tabpanel"]').removeClass('active');
        $('.navbar-collapse').collapse('hide');
        app._player1 = new Player(1);
        app._player2 = new Player(2);
    });

    $('#btn-singl-game').click(function (event) {
        app._game = Game.singleGame();
        app._game.newGame()
            .then(function () {
                //$('#pleaseWaitDialog').modal('hide');
                app.updateUI();
            });

        $('#game_board').unbind('click').click(function(event) {
            if (event.target && event.target.className == 'flex-game-field') {
                if (event.target.innerHTML == "") {
                    var cell = event.target.id.charAt(11);
                    //$('#pleaseWaitDialog').modal('show');
                    app._game.onTurn(app._player1, cell)
                        .then(function (response) {
                            app._game.state = response.state;
                            app._game._fieldPlayer1 = response.field1;
                            app._game._fieldPlayer2 = response.field2;
                            //$('#pleaseWaitDialog').modal('hide');
                            app._game.onTurn(app._player2, cell)
                                .then(function (response) {
                                    app._game.state = response.state;
                                    app._game._fieldPlayer1 = response.field1;
                                    app._game._fieldPlayer2 = response.field2;
                                    //$('#pleaseWaitDialog').modal('hide');
                                    app.updateUI();
                                });
                        });
                }
            }
        })
    });

    $('#btn-hotseat-game').click(function (event) {
        //$('#pleaseWaitDialog').modal('show');
        app._game = Game.hotseatGame();
        app._game.newGame()
            .then(function () {
                //$('#pleaseWaitDialog').modal('hide');
                app.updateUI();
            });

        $('#game_board').unbind('click').click(function(event) {
            if (event.target && event.target.className == 'flex-game-field') {
                if (event.target.innerHTML == "") {
                    var cell = event.target.id.charAt(11);
                    if (app._game.state == 'first-player-turn') {
                        //$('#pleaseWaitDialog').modal('show');
                        app._game.onTurn(app._player1, cell)
                            .then(function (response) {
                                app._game.state = response.state;
                                app._game._fieldPlayer1 = response.field1;
                                app._game._fieldPlayer2 = response.field2;
                                //$('#pleaseWaitDialog').modal('hide');
                                app.updateUI();
                            })
                    } else if (app._game.state == 'second-player-turn') {
                        //$('#pleaseWaitDialog').modal('show');
                        app._game.onTurn(app._player2, cell)
                            .then(function (response) {
                                app._game.state = response.state;
                                app._game._fieldPlayer1 = response.field1;
                                app._game._fieldPlayer2 = response.field2;
                                //$('#pleaseWaitDialog').modal('hide');
                                app.updateUI();
                            })
                    }
                }
            }
        })
    });

    $('#btn-new-net-game').click(function (event) {
        $('#pleaseWaitDialog').modal('show');
        app._game = Game.netGame();
        app._game.newGame()
            .then(function (response) {
                app._game.token = response.token;
                app._game.state = response.state;
                app._game.fieldPlayer1 = response.field1;
                app._game.fieldPlayer2 = response.field2;
                $("#tokenLabel").val(response.token);
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

        $('#game_board').unbind('click').click(function(event) {
            if(event.target && event.target.className == 'flex-game-field') {
                if (event.target.innerHTML == "") {
                    var cell = event.target.id.charAt(11);
                    if((app._game.state == 'first-player-turn') && (app._player1.id == 1)) {
                        $('#pleaseWaitDialog').modal('show');
                        app._game.onTurn(app._player1, cell)
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
                        $('#pleaseWaitDialog').modal('show');
                        app._game.onTurn(app._player1, cell)
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
                    }
                }
            }
        });
    });

    $('#btn-join-net-game').click(function (event) {
        $('#pleaseWaitDialog').modal('show');
        app._player1._id = 2;
        app._player2._id = 1;
        app._game = Game.netGame();
        var token = $('#input-token-game').val();
        app._game.joinGame(token)
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

        $('#game_board').unbind('click').click(function(event) {
            if(event.target && event.target.className == 'flex-game-field') {
                if (event.target.innerHTML == "") {
                    var cell = event.target.id.charAt(11);
                    if((app._game.state == 'first-player-turn') && (app._player1.id == 1)) {
                        $('#pleaseWaitDialog').modal('show');
                        app._game.onTurn(app._player1, cell)
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
                        $('#pleaseWaitDialog').modal('show');
                        app._game.onTurn(app._player1, cell)
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
                    }
                }
            }
        });
    });

    $('#btn-continue-game').click(function (event) {
        switch (app._game.token) {
            case 0:
                $('#btn-singl-game').click();
                break;
            case 1:
                $('#btn-hotseat-game').click();
                break;
            default:
                $('#btn-new-game').click();
        }
    })

    $('#btn-new-game').click(); //autostart
};
