var steps = ["×", "○"];
var gameField = document.getElementsByClassName("flex-game-field");
var cell = [];
var score1 = 0;
var score2 = 0;
var player1 = document.getElementById("player1");
var player2 = document.getElementById("player2");
var winner = document.getElementById("winner");

function clearGameBoard(clearScore) {

    if(clearScore) {
        score1 = 0;
        score2 = 0;
    }

    Array.prototype.forEach.call(gameField, function (field, id) {
        cell[id] = field;
        field.innerHTML = "";
    });
    //Debug information who curent move
    //document.getElementById("curentMove").innerHTML = steps[1];
    document.getElementById("score1").innerHTML = score1;
    document.getElementById("score2").innerHTML = score2;
}

function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    }
}

function checkVictory() {
    if((cell[0].innerHTML == cell[1].innerHTML) && (cell[1].innerHTML == cell[2].innerHTML)) { return cell[0].innerHTML; }
    if((cell[3].innerHTML == cell[4].innerHTML) && (cell[4].innerHTML == cell[5].innerHTML)) { return cell[3].innerHTML; }
    if((cell[6].innerHTML == cell[7].innerHTML) && (cell[7].innerHTML == cell[8].innerHTML)) { return cell[6].innerHTML; }
    if((cell[0].innerHTML == cell[3].innerHTML) && (cell[3].innerHTML == cell[6].innerHTML)) { return cell[0].innerHTML; }
    if((cell[1].innerHTML == cell[4].innerHTML) && (cell[4].innerHTML == cell[7].innerHTML)) { return cell[1].innerHTML; }
    if((cell[2].innerHTML == cell[5].innerHTML) && (cell[5].innerHTML == cell[8].innerHTML)) { return cell[2].innerHTML; }
    if((cell[6].innerHTML == cell[4].innerHTML) && (cell[4].innerHTML == cell[2].innerHTML)) { return cell[6].innerHTML; }
    if((cell[0].innerHTML == cell[4].innerHTML) && (cell[4].innerHTML == cell[8].innerHTML)) { return cell[0].innerHTML; }
    if(cell.every(function(element, id, array) { return (array[id].innerHTML != ""); })) { return "Draw"; }
    return false;
}

document.body.onload = function() {

    addEvent(document.getElementById("newGame"), "click", function() {
        clearGameBoard(true);
        var playername1 = document.getElementById("playername1").value;
        var playername2 = document.getElementById("playername2").value;
        if( (playername1 != '') && (playername2 != '') && (playername1 != playername2) ) {
            player1.innerHTML = document.getElementById("playername1").value;
            player2.innerHTML = document.getElementById("playername2").value;
        }
    });

    addEvent(document.getElementById("game_board"), "click", function(event) {
        if(event.target && event.target.className == 'flex-game-field') {
            if(!document.getElementById(event.target.id).innerHTML) {
                var curentMove = steps.pop();
                steps.unshift(curentMove);
                //Debug information who curent move
                //document.getElementById("curentMove").innerHTML = steps[1];
                document.getElementById(event.target.id).innerHTML = curentMove;
                var isVictory = checkVictory();
                if(isVictory != "") {
                    switch (isVictory) {
                        case '×':
                            score1 += 2;
                            winner.innerHTML = player1.innerHTML + " wins!";
                            winner.className = winner.className + " alert-success";
                            break;
                        case '○':
                            score2 += 2;
                            winner.innerHTML = player2.innerHTML + " wins!";
                            winner.className = winner.className + " alert-success";
                            break;
                        default:
                            score1 += 1;
                            score2 += 1;
                            winner.innerHTML = "Draw";
                            winner.className = winner.className + " alert-warning";
                    }
                    document.getElementById("score1").innerHTML = score1;
                    document.getElementById("score2").innerHTML = score2;
                    $('#resultModal').modal('show');
                    clearGameBoard(false);
                }
            }
        }
    });

    $('#newGameModal').modal('show');
}

