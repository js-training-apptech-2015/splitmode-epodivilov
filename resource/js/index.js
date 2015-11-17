function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    }
}

function Player(name, team) {
    this._name = name;
    this._team = team;
    this._score = 0;
}

Player.prototype = {
    get name(){
        return this._name;
    },
    set name(newName){
        if(newName != "") {
            this._name = newName.normalize();
        } else {
            this._name = (this._team == '×') ? 'X' : 'O';
        }
    },
    get score(){
        return this._score;
    },
    get team(){
        return this._team;
    }
};
Player.prototype.incrementScore = function(increment) {
    this._score += increment;
};
Player.prototype.resetScore = function() {
    this._score = 0;
};
Player.prototype.constructor = Player;

function PlayerAI() {
    Player.call(this, 'Computer', '○');
    Object.defineProperty(this, 'name', {
        get: function(){
            return this._name;
        },
        set: function(newName){
            console.log("Error!");
        }

    });
}
PlayerAI.prototype = new Player;
PlayerAI.prototype.move = function(gameField) {
    if(gameField[0] == 0 && ((gameField[1] == '×' && gameField[2] == '×') || (gameField[3] == '×' && gameField[6] == '×') || (gameField[4] == '×' && gameField[8] == '×'))){
        gameField[0] = '○';
    } else if(gameField[1] == 0 && ((gameField[0] == '×' && gameField[2] == '×') || (gameField[4] == '×' && gameField[7] == '×'))) {
        gameField[1] = '○';
    } else if(gameField[2] == 0 && ((gameField[0] == '×' && gameField[1] == '×') || (gameField[6] == '×' && gameField[4] == '×') || (gameField[5] == '×' && gameField[8] == '×'))) {
        gameField[2] = '○';
    } else if(gameField[3] == 0 && ((gameField[4] == '×' && gameField[5] == '×') || (gameField[0] == '×' && gameField[6] == '×'))){
        gameField[3] = '○';
    } else if(gameField[4] == 0 && ((gameField[0] == '×' && gameField[8] == '×') || (gameField[1] == '×' && gameField[7] == '×') || (gameField[2] == '×' && gameField[6] == '×') || (gameField[3] == '×' && gameField[5] == '×'))) {
        gameField[4] = '○';
    } else if(gameField[5] == 0 && ((gameField[2] == '×' && gameField[8] == '×') || (gameField[3] == '×' && gameField[4] == '×'))) {
        gameField[5] = '○';
    } else if(gameField[6] == 0 && ((gameField[7] == '×' && gameField[8] == '×') || (gameField[0] == '×' && gameField[3] == '×') || (gameField[2] == '×' && gameField[4] == '×'))){
        gameField[6] = '○';
    } else if(gameField[7] == 0 && ((gameField[1] == '×' && gameField[4] == '×') || (gameField[6] == '×' && gameField[7] == '×'))) {
        gameField[7] = '○';
    } else if(gameField[8] == 0 && ((gameField[6] == '×' && gameField[7] == '×') || (gameField[2] == '×' && gameField[5] == '×') || (gameField[0] == '×' && gameField[4] == '×'))) {
        gameField[8] = '○';
    } else {
        switch (0) {
            case gameField[4]:
                gameField[4] = '○';
                break;
            case gameField[0]:
                gameField[0] = '○';
                break;
            case gameField[8]:
                gameField[8] = '○';
                break;
            case gameField[7]:
                gameField[7] = '○';
                break;
            case gameField[3]:
                gameField[3] = '○';
                break;
        }
    }
};
PlayerAI.prototype.constructor = PlayerAI;

function Game() {
    this.board = new Array(9);
}
Game.prototype.clearBoard = function () {
    this.board = new Array(9).fill(0);
};
Game.prototype.checkGameOver = function() {
    if((this.board[0] == this.board[1]) && (this.board[1] == this.board[2])) { return this.board[0]; }
    if((this.board[3] == this.board[4]) && (this.board[4] == this.board[5])) { return this.board[3]; }
    if((this.board[6] == this.board[7]) && (this.board[7] == this.board[8])) { return this.board[6]; }
    if((this.board[0] == this.board[3]) && (this.board[3] == this.board[6])) { return this.board[0]; }
    if((this.board[1] == this.board[4]) && (this.board[4] == this.board[7])) { return this.board[1]; }
    if((this.board[2] == this.board[5]) && (this.board[5] == this.board[8])) { return this.board[2]; }
    if((this.board[6] == this.board[4]) && (this.board[4] == this.board[2])) { return this.board[6]; }
    if((this.board[0] == this.board[4]) && (this.board[4] == this.board[8])) { return this.board[0]; }
    if( this.board.every(function(element) { return (element != 0); })) { return "draw"; }

    return "continue";
};

var game = new Game();
var player_1, player_2;
var players = [];

function updateUI() {
    document.getElementById("player1").innerHTML = player_1.name;
    document.getElementById("player2").innerHTML = player_2.name;
    document.getElementById("score1").innerHTML = player_1.score;
    document.getElementById("score2").innerHTML = player_2.score;


    Array.prototype.forEach.call(document.getElementsByClassName("flex-game-field"), function(element, id) {
        element.innerHTML = (game.board[id] == 0) ? "" : game.board[id];
    });

    if(players[0].team == '×') {
        document.getElementById("player1").parentNode.className = "flex-score-field text-primary";
        document.getElementById("player2").parentNode.className = "flex-score-field text-muted";
    } else {
        document.getElementById("player2").parentNode.className = "flex-score-field text-primary";
        document.getElementById("player1").parentNode.className = "flex-score-field text-muted";
    }
}

function alertGameOver(player) {
    var winner = document.getElementById("winner");
    if (player) {
        winner.innerHTML = player.name + " wins!";
        winner.className = "modal-title text-center alert-success";
    } else {
        winner.innerHTML = "Draw";
        winner.className = "modal-title text-center alert-warning";
    }

    $('#resultModal').modal('show');
    game.clearBoard();
}

document.body.onload = function() {

    addEvent(document.getElementById("newGame"), "click", function() {
        game.clearBoard();

        player_1 = new Player('X', '×');
        player_1.name = document.getElementById("playername").value;
        player_1.resetScore();

        switch ($('.nav-tabs .active').text()) {
            case 'Singleplayer':
                player_2 = new PlayerAI();
                break;
            case 'Multiplayer':
                player_2 = new Player('O', '○');
                player_1.name = document.getElementById("playername1").value;
                player_2.name = document.getElementById("playername2").value;
                break;
        }
        player_2.resetScore();

        players = [player_1, player_2];

        updateUI();
    });

    addEvent(document.getElementById("game_board"), "click", function(event) {
        if(event.target && event.target.className == 'flex-game-field') {
            if(event.target.innerHTML == "") {
                game.board[event.target.id.charAt(11)] = players[0].team;

                if(player_2 instanceof PlayerAI) {
                    player_2.move(game.board);
                } else {
                    players.unshift(players.pop());
                }

                switch (game.checkGameOver()) {
                    case '×':
                        player_1.incrementScore(2);
                        alertGameOver(player_1);
                        break;
                    case '○':
                        player_2.incrementScore(2);
                        alertGameOver(player_2);
                        break;
                    case 'draw':
                        player_1.incrementScore(1);
                        player_2.incrementScore(1);
                        alertGameOver();
                        break;
                }
                updateUI();
            }
        }
    });

    $('#newGameModal').modal('show');
};

