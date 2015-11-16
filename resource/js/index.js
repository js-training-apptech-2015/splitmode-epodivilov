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

Player.prototype.clearMoveSet = function() {
    this._winset = [];
}

var player_1 = new Player('X', '×');
var player_2 = new Player('O', '○');
var players = [player_1, player_2];

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

        player_1.name = document.getElementById("playername1").value;
        player_1.resetScore();
        player_1.clearMoveSet();

        player_2.name = document.getElementById("playername2").value;
        player_2.resetScore();
        player_2.clearMoveSet();

        updateUI();
    });

    addEvent(document.getElementById("game_board"), "click", function(event) {
        if(event.target && event.target.className == 'flex-game-field') {
            if(event.target.innerHTML == "") {
                game.board[event.target.id.charAt(11)] = players[0].team;
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
                    default:
                        players.unshift(players.pop());
                }

                updateUI();
            }
        }
    });

    $('#newGameModal').modal('show');
};

