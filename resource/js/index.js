var steps = ["×", "○"];

function clearGameBoard() {

    var gameField = document.getElementsByClassName("flex-game-field");
    Array.prototype.forEach.call(gameField, function (field) {
        field.innerHTML = "";
    })

    document.getElementById("score1").innerHTML = 0;
    document.getElementById("score2").innerHTML = 0;
    document.getElementById("curentMove").innerHTML = steps[1];
}

function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    }
}

document.body.onload = function() {
    addEvent(document.getElementById("newGame"), "click", function() {
        clearGameBoard();
    });

    addEvent(document.getElementById("game_board"), "click", function(event) {
        if(event.target && !document.getElementById(event.target.id).innerHTML) {
            var curentMove = steps.pop();
            steps.unshift(curentMove);
            document.getElementById("curentMove").innerHTML = steps[1];
            document.getElementById(event.target.id).innerHTML = curentMove;
        }
    })

    clearGameBoard();
}

